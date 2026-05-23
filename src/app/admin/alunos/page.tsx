'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFitFlow } from '@/context/FitFlowContext';
import { 
  Users, Search, Plus, Filter, CheckCircle2, AlertTriangle, 
  Trash2, Eye, UserPlus, Scale, ChevronRight, X, Calendar, Printer 
} from 'lucide-react';
import { AreaChartCustom } from '@/components/ui/chart';

export default function StudentsAdmin() {
  const { 
    students, addStudent, updateStudentStatus, deleteStudent, 
    evaluations, addEvaluation, payments, addPayment, workouts, tenant 
  } = useFitFlow();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'DELINQUENT'>('ALL');
  
  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [evalModalOpen, setEvalModalOpen] = useState(false);

  // New Student form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newContract, setNewContract] = useState<'MENSAL' | 'TRIMESTRAL' | 'ANUAL'>('MENSAL');

  // New Evaluation form state
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [fat, setFat] = useState('');
  const [muscle, setMuscle] = useState('');
  const [notes, setNotes] = useState('');

  // Selected Student computed details
  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const selectedStudentEvals = evaluations.filter(e => e.studentId === selectedStudentId);
  const selectedStudentPayments = payments.filter(p => p.studentId === selectedStudentId);
  const activeWorkout = workouts.find(w => w.studentId === selectedStudentId && w.active);

  // Generate weight history chart points
  const weightChartData = selectedStudentEvals.length > 0 
    ? [...selectedStudentEvals].reverse().map(e => ({
        label: new Date(e.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
        value: e.weightKg
      }))
    : [{ label: 'Vazio', value: 0 }];

  // 1. Submit Handlers
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    // Calcula data final baseada no contrato
    const durationDays = newContract === 'MENSAL' ? 30 : newContract === 'TRIMESTRAL' ? 90 : 365;
    const endDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    addStudent({
      name: newName,
      email: newEmail,
      phone: newPhone || undefined,
      status: 'ACTIVE',
      contractType: newContract,
      startDate: new Date().toISOString(),
      endDate
    });

    // Reset form
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewContract('MENSAL');
    setAddModalOpen(false);
  };

  const handleCreateEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !weight || !height) return;

    addEvaluation(selectedStudentId, {
      weightKg: parseFloat(weight),
      heightCm: parseFloat(height),
      bodyFatPct: fat ? parseFloat(fat) : undefined,
      musclePct: muscle ? parseFloat(muscle) : undefined,
      notes: notes || undefined
    });

    // Reset form
    setWeight('');
    setHeight('');
    setFat('');
    setMuscle('');
    setNotes('');
    setEvalModalOpen(false);
  };

  // Filter students based on state
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 relative min-h-[calc(100vh-120px)] pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-lime-400" />
            <span>Gestão de Alunos</span>
          </h2>
          <p className="text-xs text-slate-400">Gerencie matrículas, acompanhe adimplências e prescreva avaliações físicas.</p>
        </div>
        <button 
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-lime-400 px-4 py-2.5 text-xs font-bold text-black hover:bg-lime-300 transition shadow glow-lime-sm shrink-0 self-start sm:self-center"
        >
          <UserPlus className="h-4 w-4" />
          <span>Matricular Novo</span>
        </button>
      </div>

      {/* Directory Controls Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Buscar aluno por nome, CPF ou email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-white/5 bg-slate-900/40 py-2.5 pl-10 pr-4 text-xs text-slate-300 outline-none focus:border-lime-400/50"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-1.5 rounded-lg border border-white/5 bg-slate-900/20 p-1">
          {['ALL', 'ACTIVE', 'DELINQUENT', 'INACTIVE'].map((tab) => {
            const label = tab === 'ALL' ? 'Todos' : tab === 'ACTIVE' ? 'Ativos' : tab === 'DELINQUENT' ? 'Atrasados' : 'Inativos';
            const count = tab === 'ALL' ? students.length : students.filter(s => s.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab as any)}
                className={`rounded px-3 py-1.5 text-[10px] font-semibold border transition duration-200 ${
                  statusFilter === tab 
                    ? 'bg-lime-400/10 text-lime-400 border-lime-400/25 shadow-sm' 
                    : 'text-slate-400 hover:text-white border-transparent'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Students Directory Grid/Table */}
      <div className="rounded-xl border border-white/5 bg-slate-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-slate-900/50 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                <th className="p-4 pl-6">Aluno</th>
                <th className="p-4">Contrato / Ciclo</th>
                <th className="p-4">Vencimento</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-500">Nenhum aluno encontrado correspondente aos filtros.</td>
                </tr>
              ) : (
                filteredStudents.map((stu) => {
                  const statusColors = 
                    stu.status === 'ACTIVE' 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : stu.status === 'DELINQUENT'
                      ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse'
                      : 'bg-slate-500/10 text-slate-400 border-white/5';
                  
                  const statusText = 
                    stu.status === 'ACTIVE' ? 'Ativo' : stu.status === 'DELINQUENT' ? 'Atrasado' : 'Inativo';

                  return (
                    <tr key={stu.id} className="hover:bg-white/5 transition">
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center font-bold text-slate-200 uppercase overflow-hidden shrink-0">
                          {stu.photoUrl ? (
                            <img src={stu.photoUrl} alt={stu.name} className="h-full w-full object-cover" />
                          ) : stu.name[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-white leading-snug">{stu.name}</h4>
                          <span className="text-[10px] text-slate-400 font-medium">{stu.email}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-300">
                        {stu.contractType === 'ANUAL' ? 'Plano Anual Elite' : stu.contractType === 'TRIMESTRAL' ? 'Plano Trimestral' : 'Mensal Flex'}
                      </td>
                      <td className="p-4 text-slate-400 font-medium">
                        {new Date(stu.endDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-4">
                        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${statusColors}`}>
                          {statusText}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6 space-x-1 shrink-0">
                        <button 
                          onClick={() => {
                            setSelectedStudentId(stu.id);
                            setDetailsDrawerOpen(true);
                          }}
                          className="inline-flex h-7 w-7 items-center justify-center rounded border border-white/5 bg-white/5 text-slate-300 hover:text-lime-400 transition"
                          title="Visualizar Perfil"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        {stu.status !== 'INACTIVE' && (
                          <button 
                            onClick={() => updateStudentStatus(stu.id, stu.status === 'ACTIVE' ? 'DELINQUENT' : 'ACTIVE')}
                            className="inline-flex h-7 w-7 items-center justify-center rounded border border-white/5 bg-white/5 text-slate-300 hover:text-yellow-400 transition"
                            title="Alternar Status"
                          >
                            <AlertTriangle className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteStudent(stu.id)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded border border-white/5 bg-white/5 text-slate-300 hover:text-red-400 transition"
                          title="Remover Aluno"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. MODAL: Matricular Aluno */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-950 p-6 shadow-2xl relative">
            <button 
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
              <UserPlus className="h-5 w-5 text-lime-400" />
              <h3 className="text-base font-bold text-white">Nova Matrícula</h3>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1.5">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Nome do aluno..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg border border-white/5 bg-slate-900/60 p-2.5 outline-none focus:border-lime-400/50 text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1.5">E-mail de Contato</label>
                <input 
                  type="email" 
                  required
                  placeholder="exemplo@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/5 bg-slate-900/60 p-2.5 outline-none focus:border-lime-400/50 text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1.5">Telefone / WhatsApp</label>
                <input 
                  type="text" 
                  placeholder="(11) 99999-9999"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full rounded-lg border border-white/5 bg-slate-900/60 p-2.5 outline-none focus:border-lime-400/50 text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1.5">Ciclo de Plano</label>
                <select 
                  value={newContract}
                  onChange={(e) => setNewContract(e.target.value as any)}
                  className="w-full rounded-lg border border-white/5 bg-slate-900/60 p-2.5 outline-none focus:border-lime-400/50 text-white font-medium"
                >
                  <option value="MENSAL">Mensal Flex (R$ 99,90/mês)</option>
                  <option value="TRIMESTRAL">Trimestral (R$ 90,00/mês)</option>
                  <option value="ANUAL">Anual Elite (R$ 80,00/mês)</option>
                </select>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full rounded-lg bg-lime-400 py-3 text-xs font-bold text-black hover:bg-lime-300 transition shadow glow-lime-sm"
                >
                  Confirmar Matrícula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. SIDE DRAWER: Student Details Perfil */}
      {detailsDrawerOpen && selectedStudent && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm">
          {/* Backdrop closer click */}
          <div className="flex-1" onClick={() => setDetailsDrawerOpen(false)} />
          
          <div className="w-full max-w-md bg-slate-950 border-l border-white/10 p-6 flex flex-col justify-between h-full overflow-y-auto no-scrollbar shadow-2xl animate-fade-in-up">
            
            <div className="space-y-6">
              {/* Header profile details */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center font-bold text-base text-lime-400 uppercase overflow-hidden shrink-0">
                    {selectedStudent.photoUrl ? (
                      <img src={selectedStudent.photoUrl} alt={selectedStudent.name} className="h-full w-full object-cover" />
                    ) : selectedStudent.name[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white leading-tight">{selectedStudent.name}</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Cadastrado em {new Date(selectedStudent.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <button onClick={() => setDetailsDrawerOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* General details lists */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="rounded bg-white/5 p-2.5">
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Plano Contratado</p>
                  <p className="font-semibold text-white mt-1">{selectedStudent.contractType}</p>
                </div>
                <div className="rounded bg-white/5 p-2.5">
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Status do Acesso</p>
                  <p className="font-semibold text-lime-400 mt-1">{selectedStudent.status === 'ACTIVE' ? 'Liberado (Catraca)' : 'Bloqueado'}</p>
                </div>
              </div>

              {/* Bioimpedance Weight curve chart */}
              <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Scale className="h-4 w-4 text-lime-400" />
                    <span className="text-xs font-bold text-white">Evolução Antropométrica</span>
                  </div>
                  <button 
                    onClick={() => setEvalModalOpen(true)}
                    className="rounded bg-lime-400 px-2.5 py-1 text-[9px] font-bold text-black hover:bg-lime-300 transition shadow"
                  >
                    Lançar Peso
                  </button>
                </div>

                {selectedStudentEvals.length === 0 ? (
                  <p className="text-center py-6 text-[10px] text-slate-500">Nenhuma avaliação física registrada para este aluno.</p>
                ) : (
                  <div className="space-y-4">
                    <div className="h-28 flex items-center justify-center overflow-visible">
                      <AreaChartCustom data={weightChartData} height={110} color="#10b981" />
                    </div>
                    {/* Measurement list */}
                    <div className="text-[10px] text-slate-300 space-y-1 bg-white/5 rounded p-2.5">
                      <p>📏 <span className="font-semibold">Últimas Medidas:</span></p>
                      <p className="pl-3.5">Peso: <span className="text-white font-bold">{selectedStudentEvals[0].weightKg} kg</span> • Altura: <span className="text-white font-bold">{selectedStudentEvals[0].heightCm} cm</span></p>
                      {selectedStudentEvals[0].bodyFatPct && <p className="pl-3.5">Gordura Corporal: <span className="text-lime-400 font-bold">{selectedStudentEvals[0].bodyFatPct}%</span> • Massa Muscular: <span className="text-white font-bold">{selectedStudentEvals[0].musclePct}%</span></p>}
                      {selectedStudentEvals[0].notes && <p className="pl-3.5 italic text-slate-400 mt-1">Obs: "{selectedStudentEvals[0].notes}"</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment transactions log lists */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-lime-400" />
                  <span>Histórico de Cobranças</span>
                </h4>
                <div className="space-y-2 text-[10px]">
                  {selectedStudentPayments.length === 0 ? (
                    <p className="text-slate-500 italic">Nenhum pagamento registrado.</p>
                  ) : (
                    selectedStudentPayments.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center rounded bg-white/5 p-2.5 border border-white/5">
                        <div>
                          <p className="font-bold text-white">R$ {p.amount.toFixed(2)} ({p.method})</p>
                          <p className="text-slate-500">Vencimento: {new Date(p.dueDate).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[8px] font-black ${
                          p.status === 'PAID' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {p.status === 'PAID' ? 'PAGO' : 'PENDENTE'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-white/5 flex flex-col gap-2">
              {activeWorkout && (
                <button 
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 py-3 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>Imprimir Ficha Ativa</span>
                </button>
              )}
              <Link 
                href="/admin/treinos"
                onClick={() => setDetailsDrawerOpen(false)}
                className="w-full text-center rounded-lg bg-lime-400 py-3 text-xs font-bold text-black hover:bg-lime-300 transition shadow glow-lime-sm"
              >
                Prescrever Treino
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* 4. MODAL: Nova Avaliação Antropométrica */}
      {evalModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-slate-950 p-6 shadow-2xl relative">
            <button 
              onClick={() => setEvalModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
              <Scale className="h-5 w-5 text-lime-400" />
              <h3 className="text-sm font-bold text-white">Lançar Medidas - {selectedStudent.name.split(' ')[0]}</h3>
            </div>

            <form onSubmit={handleCreateEvaluation} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Peso (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    required
                    placeholder="75.2"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 p-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Altura (cm)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 p-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Gordura Corporal (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="15.4"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 p-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Massa Muscular (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    placeholder="38.2"
                    value={muscle}
                    onChange={(e) => setMuscle(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 p-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Anotações / Feedback</label>
                <textarea 
                  placeholder="Excelente postura no agachamento, evoluindo rápido..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full rounded bg-slate-900 border border-white/5 p-2 text-white outline-none"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full rounded-lg bg-lime-400 py-2.5 text-xs font-bold text-black hover:bg-lime-300 transition shadow glow-lime-sm"
                >
                  Salvar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. HIDDEN PRINT VIEW: Professional printable A4 workout card */}
      {activeWorkout && selectedStudent && (
        <div className="hidden print:block bg-white text-black p-8 font-sans w-full max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b-2 border-black pb-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight">{tenant?.name || 'MundoFit PRO'}</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Ficha de Treinamento Individual</p>
            </div>
            <div className="text-right text-[10px] text-gray-500 space-y-0.5">
              <p>Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
              <p>Sistema: MundoFit PRO</p>
            </div>
          </div>

          {/* Student metadata info row */}
          <div className="grid grid-cols-3 gap-4 border-b border-gray-300 pb-4 text-xs">
            <div>
              <span className="text-[10px] text-gray-500 block uppercase font-bold">Aluno(a)</span>
              <span className="font-extrabold text-black">{selectedStudent.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block uppercase font-bold">Plano de Contrato</span>
              <span className="font-bold text-gray-800">{selectedStudent.contractType}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block uppercase font-bold">Ficha de Treino</span>
              <span className="font-bold text-gray-800">{activeWorkout.name}</span>
            </div>
          </div>

          {/* Workout description if any */}
          {activeWorkout.description && (
            <div className="bg-gray-50 rounded border border-gray-200 p-3 text-[10px] text-gray-700 italic">
              <strong>Observações do Instrutor:</strong> "{activeWorkout.description}"
            </div>
          )}

          {/* Exercises list table */}
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-gray-400 bg-gray-100 text-[10px] uppercase font-bold text-gray-700">
                <th className="p-2 w-12 text-center">#</th>
                <th className="p-2">Exercício / Grupo Muscular</th>
                <th className="p-2 text-center w-20">Séries</th>
                <th className="p-2 text-center w-24">Repetições</th>
                <th className="p-2 text-center w-20">Carga</th>
                <th className="p-2 text-center w-24">Descanso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activeWorkout.routines.map((rt, idx) => (
                <tr key={idx} className="hover:bg-gray-50 print-break-inside-avoid">
                  <td className="p-3 text-center font-bold text-gray-500">{idx + 1}</td>
                  <td className="p-3">
                    <span className="font-bold text-black block">{rt.exercise?.name || 'Exercício'}</span>
                    <span className="text-[9px] text-gray-500 uppercase font-semibold">{rt.exercise?.muscleGroup}</span>
                    {rt.notes && <span className="text-[9px] text-gray-500 block italic mt-0.5">Nota: {rt.notes}</span>}
                  </td>
                  <td className="p-3 text-center font-bold">{rt.series}</td>
                  <td className="p-3 text-center font-semibold">{rt.repetitions}</td>
                  <td className="p-3 text-center font-bold text-gray-900">{rt.weightKg ? `${rt.weightKg} kg` : 'Corpóreo'}</td>
                  <td className="p-3 text-center text-gray-600">{rt.restSeconds}s</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Signature and manual note space */}
          <div className="grid grid-cols-2 gap-8 pt-12 text-xs">
            <div className="border border-dashed border-gray-300 p-4 rounded min-h-24">
              <span className="text-[10px] text-gray-400 block uppercase font-bold mb-1">Anotações de Evolução (À Caneta)</span>
              <div className="h-full" />
            </div>
            <div className="flex flex-col justify-end items-center text-center space-y-1">
              <div className="w-48 border-t border-gray-400" />
              <span className="text-[9px] text-gray-500 uppercase font-bold">Assinatura do Instrutor</span>
            </div>
          </div>

          {/* Footer page identifier */}
          <div className="border-t border-gray-200 pt-4 text-center text-[9px] text-gray-400 flex justify-between">
            <span>MundoFit PRO SaaS - Gestão Fitness Premium</span>
            <span>Folha A4 Ficha Oficial</span>
          </div>
        </div>
      )}
    </div>
  );
}
