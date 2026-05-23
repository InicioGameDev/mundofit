'use client';

import React, { useState } from 'react';
import { useFitFlow } from '@/context/FitFlowContext';
import { 
  Dumbbell, Sparkles, Plus, Search, Trash2, CheckCircle2, 
  HelpCircle, Bot, BookOpen, AlertCircle, Play, ChevronRight, X, Printer 
} from 'lucide-react';

export default function WorkoutsAdmin() {
  const { students, workouts, exercises, addWorkout, generateAIWorkout, tenant } = useFitFlow();

  // Selected state
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  
  // AI Generator state
  const [aiGoal, setAiGoal] = useState('hipertrofia');
  const [aiFocus, setAiFocus] = useState('fullbody');
  const [aiLevel, setAiLevel] = useState('intermediario');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);

  // Manual Builder state
  const [builderOpen, setBuilderOpen] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDesc, setWorkoutDesc] = useState('');
  const [addedRoutines, setAddedRoutines] = useState<any[]>([]);

  // Selected Student computed active workout
  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const activeWorkout = workouts.find(w => w.studentId === selectedStudentId && w.active);

  // Filter exercises search
  const [exerciseSearch, setExerciseSearch] = useState('');
  const filteredExercises = exercises.filter(ex => 
    ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
    ex.muscleGroup.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  // 1. AI Generation trigger
  const handleAIGeneration = () => {
    if (!selectedStudentId) return;
    setAiLoading(true);
    setAiSuccess(false);

    // Simulate AI loading process
    setTimeout(() => {
      generateAIWorkout(selectedStudentId, aiGoal, aiFocus, aiLevel);
      setAiLoading(false);
      setAiSuccess(true);
      // Dismiss success state
      setTimeout(() => setAiSuccess(false), 4000);
    }, 1800);
  };

  // 2. Manual Prescriber Builder Handlers
  const handleAddExerciseToBuilder = (ex: typeof exercises[0]) => {
    // Evita duplicatas no builder
    if (addedRoutines.some(r => r.exerciseId === ex.id)) return;
    
    setAddedRoutines([...addedRoutines, {
      exerciseId: ex.id,
      exercise: ex,
      series: 3,
      repetitions: '12',
      weightKg: 20,
      restSeconds: 60,
      notes: ''
    }]);
  };

  const handleRemoveExerciseFromBuilder = (idx: number) => {
    setAddedRoutines(addedRoutines.filter((_, i) => i !== idx));
  };

  const handleUpdateBuilderRoutine = (idx: number, field: string, value: any) => {
    const updated = addedRoutines.map((r, i) => 
      i === idx ? { ...r, [field]: value } : r
    );
    setAddedRoutines(updated);
  };

  const handleSaveManualWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !workoutName || addedRoutines.length === 0) return;

    addWorkout(selectedStudentId, workoutName, workoutDesc, addedRoutines);
    
    // Reset manual builder
    setWorkoutName('');
    setWorkoutDesc('');
    setAddedRoutines([]);
    setBuilderOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header banner */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-lime-400" />
            <span>Prescrição de Treinos</span>
          </h2>
          <p className="text-xs text-slate-400">Monte fichas personalizadas manualmente ou utilize nosso assistente inteligente.</p>
        </div>
        
        {/* Student select filter */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 font-bold">Aluno Selecionado:</span>
          <select 
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs font-bold text-white outline-none focus:border-lime-400"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.status === 'ACTIVE' ? 'Ativo' : 'Atrasado'})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main prescribing interface layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. CURRENT WORKOUT PANEL (Left & Middle Cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="rounded-xl border border-white/5 bg-slate-900/30 p-6 backdrop-blur-sm space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <span className="text-[10px] text-lime-400 font-black tracking-wider uppercase">Ficha Ativa</span>
                <h3 className="text-base font-extrabold text-white">
                  {activeWorkout ? activeWorkout.name : 'Nenhum Treino Cadastrado'}
                </h3>
              </div>
              
              <div className="flex gap-2">
                {activeWorkout && (
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 transition px-3 py-1.5 rounded text-xs font-bold text-slate-300 cursor-pointer animate-fade-in"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Imprimir</span>
                  </button>
                )}
                <button 
                  onClick={() => setBuilderOpen(true)}
                  className="flex items-center gap-1 bg-lime-400 hover:bg-lime-300 transition px-3 py-1.5 rounded text-xs font-bold text-black shadow glow-lime-sm cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Criar Manual</span>
                </button>
              </div>
            </div>

            {/* List of routine items */}
            {!activeWorkout ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-3">
                <AlertCircle className="h-8 w-8 mx-auto text-slate-600" />
                <p>Este aluno está sem nenhuma ficha de musculação ativa no momento.</p>
                <p className="text-[10px]">Utilize o painel ao lado para gerar uma ficha inteligente via IA!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeWorkout.description && (
                  <p className="text-xs text-slate-400 italic bg-white/5 rounded p-3">
                    📝 Obs Geral: "{activeWorkout.description}"
                  </p>
                )}
                
                <div className="space-y-3">
                  {activeWorkout.routines.map((rt, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-lg bg-white/5 border border-white/5 p-4 gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-slate-800 flex items-center justify-center font-bold text-xs text-lime-400 shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white flex items-center gap-2">
                            {rt.exercise?.name || 'Exercício'}
                            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[8px] font-semibold text-slate-400">
                              {rt.exercise?.muscleGroup}
                            </span>
                          </h4>
                          {rt.notes && <p className="text-[9px] text-slate-400 mt-0.5">ℹ️ {rt.notes}</p>}
                        </div>
                      </div>
                      
                      <div className="flex gap-4 text-xs font-semibold text-slate-300 self-end sm:self-center">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Séries</span>
                          <span className="text-white">{rt.series}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Repetições</span>
                          <span className="text-white">{rt.repetitions}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Carga</span>
                          <span className="text-lime-400">{rt.weightKg ? `${rt.weightKg} kg` : 'Corpóreo'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Descanso</span>
                          <span className="text-slate-400">{rt.restSeconds}s</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* 2. COPILOT AI ENGINE PANEL (Right Col) */}
        <div className="space-y-6">
          
          <div className="rounded-xl border border-lime-400/20 bg-lime-400/5 p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-32 w-32 rounded-full bg-lime-400/10 blur-2xl" />
            
            <div className="flex items-center gap-2 border-b border-lime-400/20 pb-3 mb-4">
              <Bot className="h-5 w-5 text-lime-400" />
              <h3 className="text-sm font-extrabold text-white">Copiloto IA Gerador</h3>
              <Sparkles className="h-3.5 w-3.5 text-lime-400 animate-pulse fill-lime-400" />
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
              Selecione o biotipo e os alvos do aluno. Nossa IA gerará instantaneamente cargas progressivas, tempo de descanso e a ficha ideal.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Objetivo Primário</label>
                <select 
                  value={aiGoal}
                  onChange={(e) => setAiGoal(e.target.value)}
                  className="w-full rounded bg-slate-900 border border-white/10 p-2 text-white font-bold outline-none"
                >
                  <option value="hipertrofia">Ganho de Massa (Hipertrofia)</option>
                  <option value="emagrecimento">Definição & Queima Lipídica</option>
                  <option value="resistencia">Resistência Condicionamento</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Foco Muscular</label>
                <select 
                  value={aiFocus}
                  onChange={(e) => setAiFocus(e.target.value)}
                  className="w-full rounded bg-slate-900 border border-white/10 p-2 text-white font-bold outline-none"
                >
                  <option value="fullbody">Full Body Funcional</option>
                  <option value="inferiores">Membros Inferiores (Pernas/Glúteos)</option>
                  <option value="superiores">Membros Superiores (Push/Pull)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Nível de Treino</label>
                <select 
                  value={aiLevel}
                  onChange={(e) => setAiLevel(e.target.value)}
                  className="w-full rounded bg-slate-900 border border-white/10 p-2 text-white font-bold outline-none"
                >
                  <option value="iniciante">Starter (Iniciante)</option>
                  <option value="intermediario">Pro (Intermediário)</option>
                  <option value="avancado">Elite (Avançado)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleAIGeneration}
                  disabled={aiLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-lime-400 py-3 text-xs font-black text-black hover:bg-lime-300 transition shadow glow-lime-sm disabled:opacity-50"
                >
                  {aiLoading ? (
                    <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : aiSuccess ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Ficha Gerada & Salva!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 fill-black" />
                      <span>Gerar Inteligente com IA</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Core Exercise Library Directory */}
          <div className="rounded-xl border border-white/5 bg-slate-900/30 p-5 backdrop-blur-sm space-y-4">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-lime-400" />
              <span>Biblioteca de Exercícios</span>
            </h4>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Pesquisar exercício..."
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                className="w-full rounded bg-slate-900 border border-white/5 py-2 pl-8 pr-3 text-[10px] text-slate-300 outline-none focus:border-lime-400/50"
              />
            </div>
            <div className="h-48 overflow-y-auto space-y-1.5 no-scrollbar text-[10px]">
              {filteredExercises.map((ex, idx) => (
                <div key={idx} className="flex justify-between items-center rounded bg-white/5 p-2 hover:bg-white/10 transition">
                  <span className="font-semibold text-white">{ex.name}</span>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[8px] text-slate-400">{ex.muscleGroup}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 3. FULL MODAL DRAWER: Manual Workout Prescriber Builder */}
      {builderOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl h-[85vh] bg-slate-950 border border-white/10 rounded-xl shadow-2xl p-6 relative flex flex-col justify-between">
            <button 
              onClick={() => setBuilderOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
              <Plus className="h-5 w-5 text-lime-400" />
              <h3 className="text-sm font-bold text-white">Prescrever Treino Manual - {selectedStudent.name}</h3>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden min-h-0 py-2">
              {/* Left Column: Selector Exercise list */}
              <div className="flex flex-col space-y-3 h-full overflow-hidden">
                <h4 className="text-xs font-bold text-slate-400">1. Selecionar Exercícios</h4>
                <div className="relative shrink-0">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Buscar supino, leg press..." 
                    value={exerciseSearch}
                    onChange={(e) => setExerciseSearch(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 py-2 pl-8 pr-3 text-[10px] text-slate-300 outline-none"
                  />
                </div>
                <div className="flex-1 overflow-y-auto space-y-1.5 no-scrollbar text-xs">
                  {filteredExercises.map((ex) => (
                    <div 
                      key={ex.id} 
                      onClick={() => handleAddExerciseToBuilder(ex)}
                      className="flex justify-between items-center rounded bg-white/5 p-3 hover:bg-lime-400 hover:text-black transition cursor-pointer"
                    >
                      <span className="font-bold">{ex.name}</span>
                      <span className="rounded bg-white/5 px-2 py-0.5 text-[9px] font-semibold">{ex.muscleGroup}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Prescription editor builder */}
              <div className="flex flex-col space-y-3 h-full overflow-hidden">
                <h4 className="text-xs font-bold text-slate-400">2. Configurar Ficha</h4>
                
                <div className="space-y-2 shrink-0 text-xs">
                  <input 
                    type="text" 
                    placeholder="Nome da ficha (ex: Pernas - Divisão A)" 
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 p-2 text-white font-bold outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="Instruções gerais..." 
                    value={workoutDesc}
                    onChange={(e) => setWorkoutDesc(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 p-2 text-slate-300 outline-none"
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar py-1">
                  {addedRoutines.length === 0 ? (
                    <p className="text-center py-12 text-xs text-slate-500">Adicione exercícios clicando na lista ao lado.</p>
                  ) : (
                    addedRoutines.map((rt, idx) => (
                      <div key={idx} className="rounded bg-white/5 p-3 border border-white/5 text-xs relative space-y-2">
                        <button 
                          onClick={() => handleRemoveExerciseFromBuilder(idx)}
                          className="absolute top-2 right-2 text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        
                        <h5 className="font-bold text-lime-400">{rt.exercise.name}</h5>
                        
                        <div className="grid grid-cols-4 gap-2 text-[10px]">
                          <div>
                            <label className="block text-slate-500 mb-0.5">Séries</label>
                            <input 
                              type="number" 
                              value={rt.series}
                              onChange={(e) => handleUpdateBuilderRoutine(idx, 'series', parseInt(e.target.value))}
                              className="w-full rounded bg-slate-900 border border-white/5 p-1 text-center font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 mb-0.5">Repetições</label>
                            <input 
                              type="text" 
                              value={rt.repetitions}
                              onChange={(e) => handleUpdateBuilderRoutine(idx, 'repetitions', e.target.value)}
                              className="w-full rounded bg-slate-900 border border-white/5 p-1 text-center font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 mb-0.5">Carga (kg)</label>
                            <input 
                              type="number" 
                              value={rt.weightKg || ''}
                              onChange={(e) => handleUpdateBuilderRoutine(idx, 'weightKg', parseFloat(e.target.value))}
                              className="w-full rounded bg-slate-900 border border-white/5 p-1 text-center font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 mb-0.5">Descanso (s)</label>
                            <input 
                              type="number" 
                              value={rt.restSeconds}
                              onChange={(e) => handleUpdateBuilderRoutine(idx, 'restSeconds', parseInt(e.target.value))}
                              className="w-full rounded bg-slate-900 border border-white/5 p-1 text-center font-bold"
                            />
                          </div>
                        </div>
                        <input 
                          type="text" 
                          placeholder="Notas de execução..." 
                          value={rt.notes}
                          onChange={(e) => handleUpdateBuilderRoutine(idx, 'notes', e.target.value)}
                          className="w-full rounded bg-slate-900 border border-white/5 p-1.5 text-[10px] text-slate-300 outline-none"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
              <button 
                onClick={() => setBuilderOpen(false)}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveManualWorkout}
                disabled={addedRoutines.length === 0 || !workoutName}
                className="rounded-lg bg-lime-400 px-6 py-2.5 text-xs font-black text-black hover:bg-lime-300 shadow glow-lime-sm disabled:opacity-50"
              >
                Salvar Ficha de Treino
              </button>
            </div>

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
