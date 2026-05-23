/**
 * @author Carlos Henrique Ferreira
 * @description MundoFit PRO - Plataforma SaaS de Gestão Fitness Inteligente
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFitFlow } from '@/context/FitFlowContext';
import { AreaChartCustom, BarChartCustom } from '@/components/ui/chart';
import { 
  Users, DollarSign, Activity, AlertCircle, ArrowUpRight, 
  ArrowDownRight, Check, Send, Sparkles, Plus, Calendar 
} from 'lucide-react';

export default function AdminDashboard() {
  const { students, payments, attendances, registerAttendance, simulatePixPayment } = useFitFlow();
  const [copiedInvoiceId, setCopiedInvoiceId] = useState<string | null>(null);

  // 1. Dynamic Metric Computations
  const activeStudentsCount = students.filter(s => s.status === 'ACTIVE').length;
  const delinquentStudentsCount = students.filter(s => s.status === 'DELINQUENT').length;
  const totalStudents = students.length;
  
  const delinquencyRate = totalStudents > 0 
    ? ((delinquentStudentsCount / totalStudents) * 100).toFixed(1)
    : '0';

  // Compute MRR dynamically based on student plans
  // ANUAL: 80/mo, TRIMESTRAL: 90/mo, MENSAL: 99.90/mo
  const mrr = students
    .filter(s => s.status === 'ACTIVE')
    .reduce((acc, student) => {
      if (student.contractType === 'ANUAL') return acc + 80;
      if (student.contractType === 'TRIMESTRAL') return acc + 90;
      return acc + 99.90;
    }, 0);

  // Compute recent attendances (today)
  const todayAttendances = attendances.slice(0, 5);

  // Filter pending payments
  const pendingInvoices = payments.filter(p => p.status === 'PENDING').slice(0, 3);

  // Chart high-fidelity mock data (6 months)
  const revenueHistory = [
    { label: 'Dez', value: 16200 },
    { label: 'Jan', value: 18500 },
    { label: 'Fev', value: 19100 },
    { label: 'Mar', value: 21300 },
    { label: 'Abr', value: 23800 },
    { label: 'Mai', value: mrr > 0 ? Math.round(mrr * 1.1) : 24890 }
  ];

  const enrollmentHistory = [
    { label: 'Dez', value: 8 },
    { label: 'Jan', value: 15 },
    { label: 'Fev', value: 12 },
    { label: 'Mar', value: 20 },
    { label: 'Abr', value: 25 },
    { label: 'Mai', value: students.length * 3 }
  ];

  // Quick Action Mock
  const triggerQuickCheckIn = () => {
    // Registra check-in do lucas ou mariana aleatorio
    const eligible = students.filter(s => s.status === 'ACTIVE');
    if (eligible.length === 0) return;
    const randomStudent = eligible[Math.floor(Math.random() * eligible.length)];
    registerAttendance(randomStudent.id, 'sch-1');
  };

  const handleCopyPix = (paymentId: string) => {
    simulatePixPayment(paymentId);
    setCopiedInvoiceId(paymentId);
    setTimeout(() => setCopiedInvoiceId(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Sparkles welcome badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Dashboard Executivo</h2>
          <p className="text-xs text-slate-400">Visão geral do desempenho e saúde financeira da Iron Fit Club.</p>
        </div>
        
        {/* Quick action triggers */}
        <div className="flex flex-wrap gap-2.5">
          <button 
            onClick={triggerQuickCheckIn}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs font-bold text-white transition"
          >
            <Activity className="h-3.5 w-3.5 text-lime-400" />
            <span>Check-in Rápido</span>
          </button>
          
          <Link 
            href="/admin/alunos" 
            className="flex items-center gap-1.5 rounded-lg bg-lime-400 px-3.5 py-2 text-xs font-bold text-black transition hover:bg-lime-300 shadow glow-lime-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Matricular Aluno</span>
          </Link>
        </div>
      </div>

      {/* 1. KPIs Animated Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: MRR */}
        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 space-y-2 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition duration-300">
            <DollarSign className="h-16 w-16 text-lime-400" />
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>MRR (Receita Recorrente)</span>
            <span className="flex items-center text-green-400 font-bold"><ArrowUpRight className="h-3 w-3" /> 14%</span>
          </div>
          <h3 className="text-2xl font-black text-white">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mrr)}
          </h3>
          <p className="text-[10px] text-slate-500 font-medium">Faturamento estimado baseado em {activeStudentsCount} contratos ativos.</p>
        </div>

        {/* KPI 2: Active Students */}
        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 space-y-2 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition duration-300">
            <Users className="h-16 w-16 text-lime-400" />
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Alunos Ativos</span>
            <span className="flex items-center text-green-400 font-bold"><ArrowUpRight className="h-3 w-3" /> 8%</span>
          </div>
          <h3 className="text-2xl font-black text-white">{activeStudentsCount} <span className="text-xs text-slate-500 font-normal">/ {totalStudents}</span></h3>
          <p className="text-[10px] text-slate-500 font-medium">Total de alunos matriculados com acesso físico liberado.</p>
        </div>

        {/* KPI 3: Checkins */}
        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 space-y-2 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition duration-300">
            <Activity className="h-16 w-16 text-lime-400" />
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Presenças Recentes</span>
            <span className="text-lime-400 text-[10px] font-bold">Hoje</span>
          </div>
          <h3 className="text-2xl font-black text-white">{attendances.length}</h3>
          <p className="text-[10px] text-slate-500 font-medium">Total de check-ins presenciais registrados na recepção.</p>
        </div>

        {/* KPI 4: Delinquency Rate */}
        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 space-y-2 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition duration-300">
            <AlertCircle className="h-16 w-16 text-red-400" />
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Taxa de Inadimplência</span>
            <span className="flex items-center text-red-400 font-bold"><ArrowDownRight className="h-3 w-3" /> -3%</span>
          </div>
          <h3 className="text-2xl font-black text-white">{delinquencyRate}%</h3>
          <p className="text-[10px] text-slate-500 font-medium">{delinquentStudentsCount} alunos com pagamentos atrasados.</p>
        </div>
      </div>

      {/* 2. Charts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="rounded-xl border border-white/5 bg-slate-900/30 p-5 backdrop-blur-sm lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-white">Evolução do Faturamento Recorrente</h4>
              <p className="text-[10px] text-slate-400">Ganhos em reais agregados mensalmente.</p>
            </div>
            <span className="rounded bg-lime-400/10 px-2 py-0.5 text-[9px] font-bold text-lime-400 glow-lime-sm">Receita Recorrente</span>
          </div>
          <div className="h-44 flex items-center justify-center">
            <AreaChartCustom data={revenueHistory} height={170} currency={true} />
          </div>
        </div>

        {/* Enrollments Bar Chart */}
        <div className="rounded-xl border border-white/5 bg-slate-900/30 p-5 backdrop-blur-sm space-y-4">
          <div>
            <h4 className="text-sm font-bold text-white">Captação de Clientes</h4>
            <p className="text-[10px] text-slate-400">Total de novas matrículas por mês.</p>
          </div>
          <div className="h-44 flex items-center justify-center">
            <BarChartCustom data={enrollmentHistory} height={170} />
          </div>
        </div>
      </div>

      {/* 3. Detailed Bottom Tables (Recent Attendances & Pending Payments) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Real-time checkins */}
        <div className="rounded-xl border border-white/5 bg-slate-900/30 p-5 backdrop-blur-sm space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white">Check-ins em Tempo Real</h4>
              <p className="text-[10px] text-slate-400">Últimos acessos liberados na catraca hoje.</p>
            </div>
            <Link href="/admin/agenda" className="text-[10px] font-bold text-lime-400 hover:underline">Ver Grade Horária</Link>
          </div>

          <div className="space-y-4">
            {todayAttendances.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-500">Nenhum check-in registrado hoje ainda.</p>
            ) : (
              todayAttendances.map((att, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10 transition">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-lime-400">
                      {att.studentName ? att.studentName[0] : 'A'}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">{att.studentName}</h5>
                      <span className="rounded bg-lime-400/10 px-2 py-0.5 text-[8px] font-bold text-lime-400">
                        {att.className || 'Musculação Livre'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {new Date(att.checkInTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alerts & Pending Invoices */}
        <div className="rounded-xl border border-white/5 bg-slate-900/30 p-5 backdrop-blur-sm space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white">Alertas de Faturamento</h4>
              <p className="text-[10px] text-slate-400">Mensalidades aguardando confirmação ou vencidas.</p>
            </div>
            <Link href="/admin/financeiro" className="text-[10px] font-bold text-lime-400 hover:underline">Ver Financeiro</Link>
          </div>

          <div className="space-y-4">
            {pendingInvoices.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-500">Todas as contas estão em dia! Maravilhoso.</p>
            ) : (
              pendingInvoices.map((inv, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-white/5 p-3 border border-red-500/10 hover:bg-white/10 transition">
                  <div>
                    <h5 className="text-xs font-bold text-white">{inv.studentName}</h5>
                    <p className="text-[10px] text-red-400 font-semibold">
                      Atrasado • {new Date(inv.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white mr-1">R$ {inv.amount.toFixed(2)}</span>
                    <button 
                      onClick={() => handleCopyPix(inv.id)}
                      className="flex h-7 px-3 items-center gap-1 rounded bg-lime-400 text-[10px] font-bold text-black hover:bg-lime-300 transition shadow"
                    >
                      {copiedInvoiceId === inv.id ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Confirmado!</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3 w-3" />
                          <span>Simular Pago</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
