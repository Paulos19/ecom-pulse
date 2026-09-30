"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { CustomerStatus, OrderStatus } from "@prisma/client";

export type CustomerFormState = {
  success?: boolean;
  error?: string;
  message?: string;
};

// ==========================================
// 1. GET ALL CUSTOMERS (com busca e filtro)
// ==========================================
export async function getCustomersAction(query?: string, status?: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Não autorizado");
  }

  const whereClause: any = {};

  if (query && query.trim() !== "") {
    whereClause.OR = [
      { name: { contains: query.trim(), mode: "insensitive" } },
      { email: { contains: query.trim(), mode: "insensitive" } },
      { company: { contains: query.trim(), mode: "insensitive" } },
    ];
  }

  if (status && status !== "ALL") {
    whereClause.status = status as CustomerStatus;
  }

  const customers = await prisma.customer.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      orders: {
        orderBy: { placedAt: "desc" },
        take: 3,
      },
    },
  });

  return customers;
}

// ==========================================
// 2. CREATE CUSTOMER
// ==========================================
export async function createCustomerAction(formData: FormData): Promise<CustomerFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Acesso negado. Por favor efetue login." };
  }

  try {
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").toLowerCase().trim();
    const phone = String(formData.get("phone") || "").trim() || null;
    const company = String(formData.get("company") || "").trim() || null;
    const notes = String(formData.get("notes") || "").trim() || null;
    const status = (String(formData.get("status") || "REGULAR") as CustomerStatus);
    const tagsRaw = String(formData.get("tags") || "");
    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    if (!name || name.length < 2) {
      return { error: "O nome do cliente é obrigatório." };
    }

    if (!email || !email.includes("@")) {
      return { error: "Informe um e-mail válido." };
    }

    const existing = await prisma.customer.findUnique({
      where: { email },
    });

    if (existing) {
      return { error: "Já existe um cliente cadastrado com este e-mail." };
    }

    await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        company,
        status,
        tags,
        notes,
        createdById: session.user.id || undefined,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/customers");
    return { success: true, message: "Cliente cadastrado com sucesso!" };
  } catch (error: any) {
    console.error("Erro ao criar cliente:", error);
    return { error: error.message || "Falha ao cadastrar cliente no banco." };
  }
}

// ==========================================
// 3. UPDATE CUSTOMER
// ==========================================
export async function updateCustomerAction(customerId: string, formData: FormData): Promise<CustomerFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Não autorizado." };
  }

  try {
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").toLowerCase().trim();
    const phone = String(formData.get("phone") || "").trim() || null;
    const company = String(formData.get("company") || "").trim() || null;
    const notes = String(formData.get("notes") || "").trim() || null;
    const status = (String(formData.get("status") || "REGULAR") as CustomerStatus);
    const tagsRaw = String(formData.get("tags") || "");
    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    if (!name) return { error: "O nome não pode ficar vazio." };
    if (!email) return { error: "O e-mail não pode ficar vazio." };

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        name,
        email,
        phone,
        company,
        status,
        tags,
        notes,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/customers");
    return { success: true, message: "Dados do cliente atualizados com sucesso!" };
  } catch (error: any) {
    console.error("Erro ao atualizar cliente:", error);
    return { error: error.message || "Falha ao atualizar dados do cliente." };
  }
}

// ==========================================
// 4. DELETE CUSTOMER
// ==========================================
export async function deleteCustomerAction(customerId: string): Promise<CustomerFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Não autorizado." };
  }

  try {
    await prisma.customer.delete({
      where: { id: customerId },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/customers");
    return { success: true, message: "Cliente removido com sucesso." };
  } catch (error: any) {
    console.error("Erro ao excluir cliente:", error);
    return { error: "Não foi possível excluir o cliente." };
  }
}

// ==========================================
// 5. CREATE ORDER FOR CUSTOMER
// ==========================================
export async function createOrderAction(customerId: string, formData: FormData): Promise<CustomerFormState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Não autorizado." };
  }

  try {
    const amount = parseFloat(String(formData.get("amount") || "0"));
    const itemsCount = parseInt(String(formData.get("itemsCount") || "1"), 10);
    const status = (String(formData.get("status") || "PAID") as OrderStatus);
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    if (isNaN(amount) || amount <= 0) {
      return { error: "O valor do pedido deve ser maior que zero." };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Cria o pedido
      await tx.order.create({
        data: {
          orderNumber,
          amount,
          itemsCount,
          status,
          customerId,
        },
      });

      // 2. Se o status for PAID ou DELIVERED, incrementa métricas do cliente
      if (status === "PAID" || status === "DELIVERED") {
        await tx.customer.update({
          where: { id: customerId },
          data: {
            totalOrders: { increment: 1 },
            totalSpent: { increment: amount },
            lastOrderDate: new Date(),
          },
        });
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard/orders");
    return { success: true, message: `Pedido ${orderNumber} lançado com sucesso!` };
  } catch (error: any) {
    console.error("Erro ao criar pedido:", error);
    return { error: "Falha ao cadastrar pedido." };
  }
}

// ==========================================
// 6. DASHBOARD SUMMARY STATS (METRICS)
// ==========================================
export async function getDashboardStatsAction() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Não autorizado");
  }

  const [
    totalCustomers,
    vipCustomers,
    ordersAggregation,
    recentOrders,
    recentCustomers,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.customer.count({ where: { status: "VIP" } }),
    prisma.order.aggregate({
      _sum: { amount: true },
      _count: { id: true },
    }),
    prisma.order.findMany({
      orderBy: { placedAt: "desc" },
      take: 6,
      include: {
        customer: {
          select: { name: true, email: true },
        },
      },
    }),
    prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const totalRevenue = ordersAggregation._sum.amount || 0;
  const totalOrders = ordersAggregation._count.id || 0;
  const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    totalCustomers,
    vipCustomers,
    totalRevenue,
    totalOrders,
    averageTicket,
    recentOrders,
    recentCustomers,
  };
}
