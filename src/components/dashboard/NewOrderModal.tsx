"use client";

import { useState } from "react";
import { Plus, X, Loader2, DollarSign } from "lucide-react";
import { createOrderAction } from "@/app/actions/customers";

interface NewOrderModalProps {
  customerId: string;
  customerName: string;
}

export function NewOrderModal({ customerId, customerName }: NewOrderModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await createOrderAction(customerId, formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setLoading(false);
      setOpen(false);
      form.reset();
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold transition"
      >
        <Plus size={13} />
        Nova Venda
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">Lançar Novo Pedido</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cliente: <span className="text-emerald-400 font-medium">{customerName}</span>
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Valor do Pedido (R$) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <DollarSign size={15} />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    required
                    placeholder="250.00"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Quantidade de Itens
                </label>
                <input
                  type="number"
                  name="itemsCount"
                  defaultValue="1"
                  min="1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Status do Pagamento
                </label>
                <select
                  name="status"
                  defaultValue="PAID"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="PAID">PAGO (Aprovado)</option>
                  <option value="PENDING">PENDENTE (Aguardando)</option>
                  <option value="SHIPPED">ENVIADO (Em Trânsito)</option>
                  <option value="DELIVERED">ENTREGUE</option>
                  <option value="CANCELED">CANCELADO</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  {loading && <Loader2 size={15} className="animate-spin" />}
                  Confirmar Venda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
