"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      label: "Visão Geral",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Clientes & CRM",
      href: "/dashboard/customers",
      icon: Users,
      active: pathname.startsWith("/dashboard/customers"),
    },
    {
      label: "Vendas & Pedidos",
      href: "/dashboard/orders",
      icon: ShoppingBag,
      active: pathname.startsWith("/dashboard/orders"),
    },
  ];

  return (
    <aside
      className={`relative z-20 flex flex-col border-r border-slate-800 bg-slate-900/90 backdrop-blur-xl transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Botão de Toggle Retrátil */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-8 flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 shadow-lg hover:border-slate-500 hover:bg-slate-700 hover:text-white transition"
        title={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header com Logo */}
      <div className="flex h-18 items-center px-4 py-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 shadow-md shadow-emerald-500/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                Ecom<span className="text-emerald-400">Pulse</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                Ecommerce CRM
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Links de Navegação */}
      <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navegação
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                item.active
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition-colors ${
                  item.active ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Perfil & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-semibold text-sm">
            {user.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
          </div>

          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-medium text-slate-200 truncate">
                {user.name || "Administrador"}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                {user.email || ""}
              </span>
            </div>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
            title="Sair do painel"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
