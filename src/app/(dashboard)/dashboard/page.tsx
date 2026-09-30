import { getDashboardStatsAction } from "@/app/actions/customers";
import { Users, DollarSign, ShoppingBag, Award, ArrowUpRight, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const stats = await getDashboardStatsAction();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Header com Boas-vindas e CTA */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            VisÃ£o Geral do E-commerce ðŸ“Š
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            MÃ©tricas em tempo real diretamente do banco Neon PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/customers"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Plus size={16} />
            Gerenciar Clientes
          </Link>
        </div>
      </div>

      {/* Grid de Cards de EstatÃ­sticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Receita Total */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Receita Total
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-white tracking-tight">
              {formatCurrency(stats.totalRevenue)}
            </p>
            <p className="text-xs text-emerald-400/90 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp size={13} /> Vendas acumuladas
            </p>
          </div>
        </div>

        {/* Total de Pedidos */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total de Pedidos
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-white tracking-tight">
              {stats.totalOrders}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Ticket MÃ©dio: <span className="text-slate-200 font-semibold">{formatCurrency(stats.averageTicket)}</span>
            </p>
          </div>
        </div>

        {/* Base de Clientes */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total de Clientes
            </span>
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-white tracking-tight">
              {stats.totalCustomers}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Clientes cadastrados na base
            </p>
          </div>
        </div>

        {/* Clientes VIP */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Clientes VIP
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award size={18} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-amber-400 tracking-tight">
              {stats.vipCustomers}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Segmento de alto valor (LTV)
            </p>
          </div>
        </div>
      </div>

      {/* Grid Inferior: Ãšltimos Pedidos & Novos Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabela de Ãšltimos Pedidos (2 colunas) */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 md:p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Ãšltimos Pedidos
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                TransaÃ§Ãµes processadas recentemente
              </p>
            </div>
            <Link
              href="/dashboard/orders"
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
            >
              Ver todos <ArrowUpRight size={13} />
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
              <ShoppingBag className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              <p className="text-sm text-slate-400 font-medium">Nenhum pedido lanÃ§ado ainda</p>
              <p className="text-xs text-slate-400 mt-1">VÃ¡ em Clientes para adicionar uma nova venda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                    <th className="pb-3 font-semibold">CÃ³digo</th>
                    <th className="pb-3 font-semibold">Cliente</th>
                    <th className="pb-3 font-semibold">Valor</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {stats.recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 font-mono font-medium text-slate-200">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 text-slate-300">
                        {ord.customer?.name || "Desconhecido"}
                      </td>
                      <td className="py-3 font-semibold text-emerald-400">
                        {formatCurrency(ord.amount)}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                          ord.status === "PAID" || ord.status === "DELIVERED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : ord.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Card de Clientes Recentes (1 coluna) */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 md:p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Clientes Recentes
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Ãšltimos contatos adicionados
              </p>
            </div>
            <Link
              href="/dashboard/customers"
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
            >
              Ver todos <ArrowUpRight size={13} />
            </Link>
          </div>

          {stats.recentCustomers.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
              <Users className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              <p className="text-sm text-slate-400 font-medium">Nenhum cliente cadastrado</p>
              <Link
                href="/dashboard/customers"
                className="inline-block mt-3 text-xs text-emerald-400 hover:underline"
              >
                Cadastrar primeiro cliente â†’
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentCustomers.map((cust) => (
                <div
                  key={cust.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20">
                      {cust.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-200 truncate">
                        {cust.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {cust.email}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    cust.status === "VIP"
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      : "bg-slate-700/50 text-slate-300"
                  }`}>
                    {cust.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

