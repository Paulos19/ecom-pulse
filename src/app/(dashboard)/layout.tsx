import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Proteção da rota do dashboard via Server Component
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Sidebar Retrátil com estado e toggle */}
      <Sidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          role: (session.user as any).role || "ADMIN",
        }}
      />

      {/* Conteúdo Principal Dinâmico */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Glow de ambientação no topo */}
        <div className="pointer-events-none fixed top-0 right-1/4 w-[500px] h-[350px] bg-gradient-to-b from-emerald-500/10 via-indigo-500/5 to-transparent blur-[120px] -z-10" />

        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
