'use client';

import React, { useState } from 'react';
import { useFitFlow } from '@/context/FitFlowContext';
import { 
  Contact, Plus, Search, Trash2, Calendar, Clock, 
  Sparkles, X, User, Briefcase, Info 
} from 'lucide-react';

export default function TrainersAdmin() {
  const { trainers, addTrainer, deleteTrainer } = useFitFlow();

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Modal form states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [cref, setCref] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [dayOff, setDayOff] = useState('Domingo');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:00');
  const [bio, setBio] = useState('');

  // Filtered list
  const filteredTrainers = trainers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.cpf.includes(searchTerm) ||
    t.cref.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !specialty || !cpf || !cref) return;

    addTrainer({
      name,
      cpf,
      cref,
      specialty,
      dayOff,
      startTime,
      endTime,
      bio: bio || undefined
    });

    // Reset fields
    setName('');
    setCpf('');
    setCref('');
    setSpecialty('');
    setDayOff('Domingo');
    setStartTime('08:00');
    setEndTime('17:00');
    setBio('');
    setAddModalOpen(false);
  };

  const weekdays = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo'
  ];

  return (
    <div className="space-y-6 pb-12 print:hidden">
      
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Contact className="h-6 w-6 text-lime-400" />
            <span>Corpo Docente & Instrutores</span>
          </h2>
          <p className="text-xs text-slate-400">
            Cadastre professores, defina modalidades de atuação, escalas de trabalho e dias de folga semanais.
          </p>
        </div>
        
        <button 
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-lime-400 to-emerald-500 px-4 py-2.5 text-xs font-bold text-black hover:opacity-90 transition shadow glow-lime-sm shrink-0 self-start sm:self-center"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar Instrutor</span>
        </button>
      </div>

      {/* 1. Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 space-y-1 backdrop-blur-sm relative overflow-hidden group">
          <p className="text-[10px] uppercase font-bold text-slate-400">Total de Instrutores</p>
          <h3 className="text-xl font-extrabold text-white">{trainers.length}</h3>
          <p className="text-[9px] text-slate-500 font-medium">Profissionais ativos no quadro da academia.</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 space-y-1 backdrop-blur-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400">Modalidades Atendidas</p>
          <h3 className="text-xl font-extrabold text-lime-400">
            {new Set(trainers.map(t => t.specialty)).size}
          </h3>
          <p className="text-[9px] text-slate-500 font-medium">Pilates, Spinning, Funcional e Cardio integrados.</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 space-y-1 backdrop-blur-sm">
          <p className="text-[10px] uppercase font-bold text-slate-400">Carga Horária Média</p>
          <h3 className="text-xl font-extrabold text-white">8h / dia</h3>
          <p className="text-[9px] text-slate-500 font-medium">Escalas de turnos organizadas de forma contínua.</p>
        </div>
      </div>

      {/* 2. Controls & Search Bar */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Buscar por nome de professor ou modalidade..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-white/5 bg-slate-900/30 py-2 pl-9 pr-4 text-xs text-slate-300 outline-none focus:border-lime-400/50"
          />
        </div>
      </div>

      {/* 3. Trainers Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainers.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-slate-900/10 border border-white/5 rounded-xl text-slate-500 text-xs space-y-2">
            <User className="h-8 w-8 mx-auto text-slate-700" />
            <p>Nenhum professor encontrado com as buscas atuais.</p>
          </div>
        ) : (
          filteredTrainers.map((t) => (
            <div key={t.id} className="rounded-xl border border-white/5 bg-slate-900/30 p-5 space-y-4 backdrop-blur-sm hover:border-white/10 transition relative group">
              
              {/* Delete trigger */}
              <button 
                onClick={() => deleteTrainer(t.id)}
                className="absolute top-4 right-4 h-6 w-6 rounded-md bg-white/5 text-slate-400 hover:text-red-400 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                title="Remover Professor"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              {/* Profile Card Header */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-lime-400/10 to-emerald-500/20 border border-lime-400/25 flex items-center justify-center font-extrabold text-sm text-lime-400 uppercase">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white leading-none">{t.name}</h4>
                  <span className="text-[10px] text-lime-400 font-semibold tracking-wide block mt-1 uppercase">
                    {t.specialty}
                  </span>
                </div>
              </div>

              {/* Scaled hours & Day off */}
              <div className="rounded bg-white/5 p-3 space-y-2 text-[10px] text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-400"><Clock className="h-3 w-3" /> Turno de Trabalho:</span>
                  <span className="font-bold text-white">{t.startTime} ↔ {t.endTime}</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-1.5">
                  <span className="flex items-center gap-1 text-slate-400"><Calendar className="h-3 w-3" /> Dia de Folga:</span>
                  <span className="rounded bg-red-500/10 border border-red-500/20 px-2 py-0.5 font-bold text-red-400">
                    {t.dayOff}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-1.5">
                  <span className="text-slate-400">CPF:</span>
                  <span className="font-mono text-white/95">{t.cpf}</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-1.5">
                  <span className="text-slate-400">CREF:</span>
                  <span className="rounded bg-lime-400/10 border border-lime-400/20 px-2 py-0.5 font-bold text-lime-400">
                    {t.cref}
                  </span>
                </div>
              </div>

              {/* Bio description */}
              {t.bio && (
                <div className="text-[10px] text-slate-400 leading-normal italic flex items-start gap-1">
                  <Info className="h-3 w-3 text-slate-500 shrink-0 mt-0.5" />
                  <span>"{t.bio}"</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 4. MODAL: Adicionar Professor Form */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-950 p-6 shadow-2xl relative space-y-4">
            <button 
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Sparkles className="h-5 w-5 text-lime-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Adicionar Novo Professor</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Juliana Costa"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 py-2.5 pl-8 pr-3 text-white outline-none focus:border-lime-400/50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Modalidade / Especialidade</label>
                <div className="relative">
                  <Briefcase className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Pilates Clinico, Musculação"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 py-2.5 pl-8 pr-3 text-white outline-none focus:border-lime-400/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">CPF (Obrigatório)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: 123.456.789-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 p-2.5 text-white outline-none focus:border-lime-400/50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Registro CREF (Obrigatório)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: 012345-G/SP"
                    value={cref}
                    onChange={(e) => setCref(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 p-2.5 text-white outline-none focus:border-lime-400/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Horário Entrada</label>
                  <input 
                    type="time" 
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 p-2.5 text-white outline-none focus:border-lime-400/50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Horário Saída</label>
                  <input 
                    type="time" 
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 p-2.5 text-white outline-none focus:border-lime-400/50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Dia de Folga</label>
                <select 
                  value={dayOff}
                  onChange={(e) => setDayOff(e.target.value)}
                  className="w-full rounded bg-slate-900 border border-white/5 p-2.5 text-white outline-none focus:border-lime-400/50"
                >
                  {weekdays.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Informações Gerais / Biografia (Opcional)</label>
                <textarea 
                  placeholder="Bio resumo do profissional, certificações ou foco clínico..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded bg-slate-900 border border-white/5 p-2.5 text-white outline-none focus:border-lime-400/50 h-16 resize-none"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-lime-400 to-emerald-500 py-3 text-xs font-bold text-black hover:opacity-90 transition shadow glow-lime-sm"
                >
                  Cadastrar Instrutor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
