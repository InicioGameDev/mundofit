'use client';

import React, { useState } from 'react';
import { useFitFlow } from '@/context/FitFlowContext';
import { 
  DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, 
  Search, ShieldAlert, Sparkles, Filter, Check, Eye, X, Send, AlertCircle
} from 'lucide-react';
import { AreaChartCustom } from '@/components/ui/chart';

export default function FinancialAdmin() {
  const { payments, simulatePixPayment, addPayment, students } = useFitFlow();

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');

  // Modals state
  const [pixModalOpen, setPixModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [addPaymentModalOpen, setAddPaymentModalOpen] = useState(false);

  // New Invoice Form state
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'PIX' | 'CARD' | 'CASH'>('PIX');
  const [dueDate, setDueDate] = useState('');

  // Selected payment details
  const selectedPayment = payments.find(p => p.id === selectedPaymentId);
  const selectedStudentForPayment = students.find(s => s.id === selectedPayment?.studentId);

  // 1. Dynamic Sum Computations
  const totalPaidSum = payments
    .filter(p => p.status === 'PAID')
    .reduce((acc, p) => acc + p.amount, 0);

  const totalPendingSum = payments
    .filter(p => p.status === 'PENDING')
    .reduce((acc, p) => acc + p.amount, 0);

  // Simulated Operational Outflows
  const fixedExpenses = 8500.00;
  const netCashFlow = totalPaidSum - fixedExpenses;

  // Filter payments ledger
  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 2. Action Submits
  const handleSimulatePaymentConfirm = () => {
    if (!selectedPaymentId) return;
    simulatePixPayment(selectedPaymentId);
    setPixModalOpen(false);
    setSelectedPaymentId(null);
  };

  const handleCreateManualInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !amount || !dueDate) return;

    addPayment(studentId, parseFloat(amount), method, newDateString(dueDate));
    
    // Reset form
    setAmount('');
    setDueDate('');
    setAddPaymentModalOpen(false);
  };

  const newDateString = (dateInput: string) => {
    const date = new Date(dateInput);
    return date.toISOString();
  };

  // Cash flow chart point metrics (6 months)
  const cashFlowHistory = [
    { label: 'Dez', value: 12500 },
    { label: 'Jan', value: 15400 },
    { label: 'Fev', value: 14800 },
    { label: 'Mar', value: 18600 },
    { label: 'Abr', value: 21900 },
    { label: 'Mai', value: totalPaidSum > 0 ? Math.round(totalPaidSum) : 24890 }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-lime-400" />
            <span>Painel Financeiro & PIX</span>
          </h2>
          <p className="text-xs text-slate-400">Controle o faturamento recorrente em tempo real e emita cobranças automatizadas.</p>
        </div>
        <button 
          onClick={() => setAddPaymentModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-lime-400 px-4 py-2.5 text-xs font-bold text-black hover:bg-lime-300 transition shadow glow-lime-sm shrink-0 self-start sm:self-center"
        >
          <CreditCard className="h-4 w-4" />
          <span>Lançar Cobrança</span>
        </button>
      </div>

      {/* 1. Cash flow KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 space-y-1.5 backdrop-blur-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400">Entradas Liquidadas</p>
          <h3 className="text-xl font-extrabold text-white">R$ {totalPaidSum.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          <span className="flex items-center text-[10px] text-green-400 font-bold">
            <ArrowUpRight className="h-3.5 w-3.5" /> +15.2% (Este Mês)
          </span>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 space-y-1.5 backdrop-blur-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400">Despesas Operacionais (Fixas)</p>
          <h3 className="text-xl font-extrabold text-white">R$ {fixedExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          <span className="flex items-center text-[10px] text-slate-500 font-medium">Contas e salários consolidados</span>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 space-y-1.5 backdrop-blur-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400">Fluxo de Caixa Líquido</p>
          <h3 className={`text-xl font-extrabold ${netCashFlow >= 0 ? 'text-lime-400' : 'text-red-400'}`}>
            R$ {netCashFlow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h3>
          <span className="flex items-center text-[10px] text-green-400 font-bold">
            <ArrowUpRight className="h-3.5 w-3.5" /> Saudável (Saldo Positivo)
          </span>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 space-y-1.5 backdrop-blur-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400">Pendentes (Contas a Receber)</p>
          <h3 className="text-xl font-extrabold text-red-400">R$ {totalPendingSum.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          <span className="flex items-center text-[10px] text-red-400/80 font-bold">
            <ShieldAlert className="h-3.5 w-3.5" /> Cobranças aguardando PIX
          </span>
        </div>
      </div>

      {/* 2. Cash flow SVG Area graph */}
      <div className="rounded-xl border border-white/5 bg-slate-900/30 p-5 backdrop-blur-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-white">Fluxo de Caixa Mensal Consolidado</h4>
          <p className="text-[10px] text-slate-400">Histórico de liquidação de mensalidades.</p>
        </div>
        <div className="h-40 flex items-center justify-center">
          <AreaChartCustom data={cashFlowHistory} height={150} color="#10b981" currency={true} />
        </div>
      </div>

      {/* 3. Directory Ledger Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <h4 className="text-sm font-bold text-white">Livro Diário de Cobranças</h4>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Pesquisar aluno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded bg-slate-900 border border-white/5 py-1.5 pl-8 pr-3 text-[10px] text-slate-300 outline-none w-48"
              />
            </div>

            <div className="flex gap-1 rounded border border-white/5 bg-slate-900/20 p-0.5">
              {['ALL', 'PAID', 'PENDING'].map(t => (
                <button
                  key={t}
                  onClick={() => setStatusFilter(t as any)}
                  className={`rounded px-2.5 py-1 text-[9px] font-semibold border transition duration-200 ${
                    statusFilter === t 
                      ? 'bg-lime-400/10 text-lime-400 border-lime-400/25 shadow-sm' 
                      : 'text-slate-400 hover:text-white border-transparent'
                  }`}
                >
                  {t === 'ALL' ? 'Todos' : t === 'PAID' ? 'Pagos' : 'Pendentes'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-900/30 overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-slate-900/50 text-[10px] uppercase font-bold text-slate-500">
                  <th className="p-3 pl-6">ID Cobrança</th>
                  <th className="p-3">Aluno</th>
                  <th className="p-3">Valor</th>
                  <th className="p-3">Vencimento</th>
                  <th className="p-3">Forma</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right pr-6">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-500">Nenhuma fatura encontrada.</td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition">
                      <td className="p-3 pl-6 font-mono text-[9px] text-slate-500">#{p.id.split('-')[1] || p.id}</td>
                      <td className="p-3 font-bold text-white">{p.studentName}</td>
                      <td className="p-3 font-extrabold text-slate-200">R$ {p.amount.toFixed(2)}</td>
                      <td className="p-3 text-slate-400">{new Date(p.dueDate).toLocaleDateString('pt-BR')}</td>
                      <td className="p-3">
                        <span className="rounded bg-white/5 px-2 py-0.5 text-[9px] font-bold text-slate-300">{p.method}</span>
                      </td>
                      <td className="p-3">
                        <span className={`rounded-full px-2 py-0.5 text-[8px] font-black ${
                          p.status === 'PAID' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400 animate-pulse'
                        }`}>
                          {p.status === 'PAID' ? 'LIVRE / PAGO' : 'AGUARDANDO'}
                        </span>
                      </td>
                      <td className="p-3 text-right pr-6">
                        {p.status === 'PENDING' ? (
                          <button
                            onClick={() => {
                              setSelectedPaymentId(p.id);
                              setPixModalOpen(true);
                            }}
                            className="inline-flex h-7 px-3 items-center gap-1 rounded border border-lime-400/25 bg-lime-400/10 text-[10px] font-semibold text-lime-400 hover:bg-lime-400/20 transition shadow-sm"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Simular PIX</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-bold">Liquidada</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. MODAL: Pix Gateway Simulator Screen */}
      {pixModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-slate-950 p-6 shadow-2xl relative space-y-6">
            <button 
              onClick={() => { setPixModalOpen(false); setSelectedPaymentId(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Sparkles className="h-5 w-5 text-lime-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Simulador Gateway PIX</h3>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto h-36 w-36 rounded-xl bg-white p-2 border flex items-center justify-center">
                {/* SVG QR CODE */}
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none" className="text-slate-950">
                  <path d="M10 10h30v30H10zm0 50h30v30H10zm50-50h30v30H60z" fill="currentColor" />
                  <path d="M20 20h10v10H20zm0 50h10v10H20zm50-50h10v10H70z" fill="white" />
                  <path d="M50 50h10v10H50zm10 10h10v10H60zm10-10h20v10H70zm20 20h10v10H90zm-30 10h10v10H60zm10 10h20v10H70z" fill="currentColor" />
                </svg>
              </div>
              
              <div className="space-y-1 text-xs">
                <p className="text-base font-extrabold text-white">R$ {selectedPayment.amount.toFixed(2)}</p>
                <p className="text-[10px] text-slate-400">Aluno: {selectedPayment.studentName}</p>
                <p className="text-[9px] text-slate-500">Sacado: {selectedStudentForPayment?.email}</p>
              </div>
            </div>

            <div className="text-[10px] bg-white/5 border border-white/5 rounded p-2.5 space-y-1">
              <p className="font-bold text-white flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5 text-lime-400" /> Copia e Cola:</p>
              <textarea 
                readOnly
                value={selectedPayment.pixCopyPaste || ''}
                className="w-full h-8 bg-transparent text-[8px] border-none outline-none font-mono text-slate-400 resize-none select-all"
              />
            </div>

            <button 
              onClick={handleSimulatePaymentConfirm}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 py-3 text-xs font-bold text-white hover:bg-emerald-400 transition shadow glow-lime-sm"
            >
              <Check className="h-4 w-4" />
              <span>Simular Confirmação Bancária</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. MODAL: Nova Cobrança Manual */}
      {addPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-950 p-6 shadow-2xl relative">
            <button 
              onClick={() => setAddPaymentModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
              <DollarSign className="h-5 w-5 text-lime-400" />
              <h3 className="text-sm font-bold text-white">Lançar Fatura Manual</h3>
            </div>

            <form onSubmit={handleCreateManualInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Selecionar Aluno</label>
                <select 
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full rounded bg-slate-900 border border-white/5 p-2.5 text-white outline-none"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Valor Cobrado (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    placeholder="99.90"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 p-2.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Forma de Cobrança</label>
                  <select 
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    className="w-full rounded bg-slate-900 border border-white/5 p-2.5 text-white outline-none"
                  >
                    <option value="PIX">PIX Dinâmico</option>
                    <option value="CARD">Cartão de Crédito</option>
                    <option value="CASH">Dinheiro / À Vista</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Data de Vencimento</label>
                <input 
                  type="date" 
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded bg-slate-900 border border-white/5 p-2.5 text-white outline-none"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-lime-400 to-emerald-500 py-3 text-xs font-extrabold text-black hover:opacity-90 transition shadow glow-lime-sm"
                >
                  Emitir Cobrança
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
