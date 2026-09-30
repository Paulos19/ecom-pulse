"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export type AuthActionResult = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function registerUserAction(formData: FormData): Promise<AuthActionResult> {
  try {
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").toLowerCase().trim();
    const password = String(formData.get("password") || "");

    if (!name || name.length < 2) {
      return { success: false, error: "Nome deve conter ao menos 2 caracteres." };
    }

    if (!email || !email.includes("@")) {
      return { success: false, error: "Por favor insira um endereço de e-mail válido." };
    }

    if (!password || password.length < 6) {
      return { success: false, error: "A senha deve ter no mínimo 6 caracteres." };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "Este e-mail já está cadastrado no sistema." };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "ADMIN",
      },
    });

    return {
      success: true,
      message: "Conta criada com sucesso! Faça login para acessar o painel.",
    };
  } catch (err: unknown) {
    console.error("Erro ao registrar usuário:", err);
    return {
      success: false,
      error: "Ocorreu um erro interno ao processar o cadastro. Tente novamente.",
    };
  }
}
