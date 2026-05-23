/**
 * @author Carlos Henrique Ferreira
 * @description MundoFit PRO - Plataforma SaaS de Gestão Fitness Inteligente
 */

'use client';

import React, { useState } from 'react';
import { useFitFlow } from '@/context/FitFlowContext';
import { PhoneFrame } from '@/components/ui/phone-frame';
import { AreaChartCustom } from '@/components/ui/chart';
import { 
  Dumbbell, Calendar, CreditCard, Scale, QrCode, 
  CheckCircle, Play, Sparkles, ChevronRight, AlertTriangle, ArrowRight 
} from 'lucide-react';

export default function StudentAppView() {
  const { students, workouts, schedules, payments, attendances, evaluations, registerAttendance, simulatePixPayment } = useFitFlow();

  // For demonstration, we default to logging in as Fernanda Vasconcelos (st-1)
  const [activeStudentId, setActiveStudentId] = useState<string>('st-1');
  const [currentTab, setCurrentTab] = useState<'workouts' | 'schedule' | 'evaluation' | 'payments' | 'qrcode'>('workouts');

  // Form checkins state
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Confetti/congratulations workout complete state
  const [workoutComplete, setWorkoutComplete] = useState(false);

  // Video popup exercise
  const [selectedExerciseVideo, setSelectedExerciseVideo] = useState<any | null>(null);

  // Student specific data
  const student = students.find(s => s.id === activeStudentId) || students[0];

  // Salvaguarda de Hidratação para compilação estática do Next.js (SSR)
  if (!student) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-6 px-4">
        <div className="animate-pulse flex flex-col items-center gap-3 text-xs text-slate-500 font-bold">
          <div className="h-10 w-10 bg-slate-800 rounded-full animate-bounce" />
          <span>Sincronizando Banco de Dados...</span>
        </div>
      </div>
    );
  }

  const studentWorkout = workouts.find(w => w.studentId === student.id && w.active);
  const studentPayments = payments.filter(p => p.studentId === student.id);
  const studentEvals = evaluations.filter(e => e.studentId === student.id);

  // Weight chart metrics
  const weightChartData = studentEvals.length > 0 
    ? [...studentEvals].reverse().map(e => ({
        label: new Date(e.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
        value: e.weightKg
      }))
    : [{ label: 'Sem registros', value: 0 }];

  // 1. Submit Booking check-in
  const handleStudentBook = (scheduleId: string) => {
    if (student.status === 'DELINQUENT') {
      setBookingError('Check-in bloqueado. Efetue o pagamento da mensalidade pendente!');
      return;
    }

    const success = registerAttendance(student.id, scheduleId);
    if (success) {
      setBookingSuccess(true);
      setBookingError(null);
      setTimeout(() => setBookingSuccess(false), 2000);
    } else {
      setBookingError('Turma cheia ou erro de agendamento.');
    }
  };

  // 2. Pix checkout confirmation simulator
  const handlePixPaySim = (paymentId: string) => {
    simulatePixPayment(paymentId);
  };

  // Inner core application display rendering
  const renderAppContent = () => {
    switch (currentTab) {
      
      // Tab 1: Workouts sheet
      case 'workouts':
        return (
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-slate-400">Hoje é dia de treinar! 💪</h3>
                <h2 className="text-base font-extrabold text-white">Ficha de Musculação</h2>
              </div>
              <span className="rounded bg-lime-400/10 px-2 py-0.5 text-[8px] font-black text-lime-400">ATIVO</span>
            </div>

            {workoutComplete ? (
              <div className="rounded-xl border border-lime-400/20 bg-lime-400/5 p-6 text-center space-y-3">
                <Sparkles className="h-10 w-10 text-lime-400 mx-auto animate-bounce fill-lime-400" />
                <h4 className="text-sm font-extrabold text-white">Treino Concluído! 🦾</h4>
                <p className="text-[10px] text-slate-400">Cargas salvas com sucesso. Ótimo trabalho hoje, foco na constância!</p>
                <button 
                  onClick={() => setWorkoutComplete(false)}
                  className="rounded bg-lime-400 px-4 py-1.5 text-[10px] font-bold text-black hover:bg-lime-300"
                >
                  Ver Ficha Novamente
                </button>
              </div>
            ) : !studentWorkout ? (
              <div className="text-center py-12 text-slate-500 text-xs space-y-2">
                <Dumbbell className="h-8 w-8 mx-auto text-slate-700" />
                <p>Nenhuma ficha de treino ativa no momento.</p>
                <p className="text-[10px]">Fale com seu professor na recepção.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/5 rounded-lg p-3 text-[10px] text-slate-300">
                  <span className="font-bold text-white block mb-0.5">{studentWorkout.name}</span>
                  <span>{studentWorkout.description}</span>
                </div>

                <div className="space-y-2.5">
                  {studentWorkout.routines.map((rt, idx) => (
                    <div key={idx} className="rounded-lg bg-white/5 border border-white/5 p-3 flex justify-between items-center text-xs hover:bg-white/[0.08] transition">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-white">{rt.exercise.name}</h4>
                          <button
                            onClick={() => setSelectedExerciseVideo(rt)}
                            className="inline-flex h-5 w-5 items-center justify-center rounded bg-lime-400/10 text-lime-400 hover:bg-lime-400/20 transition cursor-pointer"
                            title="Ver vídeo explicativo"
                          >
                            <Play className="h-2.5 w-2.5 fill-lime-400" />
                          </button>
                        </div>
                        <p className="text-[9px] text-slate-400 mt-0.5">
                          {rt.series} séries • {rt.repetitions} reps • {rt.weightKg ? `${rt.weightKg}kg` : 'Peso Corporal'}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-lime-400">{rt.restSeconds}s desc</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setWorkoutComplete(true)}
                  className="w-full py-3 rounded-lg bg-lime-400 text-xs font-black text-black hover:bg-lime-300 transition shadow"
                >
                  Concluir Treino de Hoje
                </button>
              </div>
            )}
          </div>
        );

      // Tab 2: Schedules & booking
      case 'schedule':
        return (
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400">Aulas Presenciais</h3>
              <h2 className="text-base font-extrabold text-white">Reservar Vaga</h2>
            </div>

            {bookingSuccess && (
              <div className="rounded border border-green-500/20 bg-green-500/10 p-3 text-center text-[10px] text-green-400 font-bold">
                ✓ Agendado com sucesso! Presença confirmada.
              </div>
            )}

            {bookingError && (
              <div className="rounded border border-red-500/20 bg-red-500/10 p-3 text-center text-[10px] text-red-400 font-bold flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            <div className="space-y-3">
              {schedules.map((sc) => {
                const count = sc.attendancesCount;
                const isFull = count >= sc.maxCapacity;

                return (
                  <div key={sc.id} className="rounded-lg bg-white/5 p-4 border border-white/5 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-white">{sc.className}</h4>
                      <p className="text-[9px] text-slate-400">{sc.instructorName} • {sc.time}</p>
                      <p className="text-[8px] text-slate-500 font-bold mt-1">Ocupação: {count}/{sc.maxCapacity} vagas</p>
                    </div>
                    <button
                      onClick={() => handleStudentBook(sc.id)}
                      disabled={isFull}
                      className="rounded bg-lime-400 px-3 py-1.5 text-[10px] font-bold text-black hover:bg-lime-300 disabled:opacity-40"
                    >
                      Reservar
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );

      // Tab 3: evaluations anthropometric
      case 'evaluation':
        return (
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400">Acompanhamento Corporal</h3>
              <h2 className="text-base font-extrabold text-white">Evolução Física</h2>
            </div>

            {studentEvals.length === 0 ? (
              <p className="text-center py-10 text-xs text-slate-500">Nenhum registro de avaliação física encontrado.</p>
            ) : (
              <div className="space-y-4">
                <div className="h-28 flex items-center justify-center overflow-visible">
                  <AreaChartCustom data={weightChartData} height={100} color="#10b981" />
                </div>

                <div className="space-y-2 text-[10px]">
                  <span className="font-bold text-white block">Histórico de Pesagens</span>
                  {studentEvals.map((e, idx) => (
                    <div key={idx} className="flex justify-between items-center rounded bg-white/5 p-2.5">
                      <div>
                        <p className="font-bold text-white">{e.weightKg} kg</p>
                        <p className="text-slate-500">{new Date(e.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="text-right">
                        {e.bodyFatPct && <p className="text-lime-400 font-bold">{e.bodyFatPct}% BF</p>}
                        {e.musclePct && <p className="text-slate-400">{e.musclePct}% MM</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      // Tab 4: Payments
      case 'payments':
        return (
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400">Contratos & Mensalidade</h3>
              <h2 className="text-base font-extrabold text-white">Financeiro</h2>
            </div>

            <div className="space-y-4">
              {studentPayments.map((p) => (
                <div key={p.id} className="rounded-lg bg-white/5 border border-white/5 p-4 space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white">Mensalidade Recorrente</h4>
                      <p className="text-[9px] text-slate-500">Vencimento: {new Date(p.dueDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[8px] font-black ${
                      p.status === 'PAID' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400 animate-pulse'
                    }`}>
                      {p.status === 'PAID' ? 'PAGO' : 'PENDENTE'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/5 pt-2">
                    <span className="font-extrabold text-white">R$ {p.amount.toFixed(2)}</span>
                    {p.status === 'PENDING' && (
                      <button
                        onClick={() => handlePixPaySim(p.id)}
                        className="rounded bg-lime-400 hover:bg-lime-300 py-1.5 px-3 text-[9px] font-black text-black transition"
                      >
                        Pagar com PIX
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // Tab 5: QR Code Entrance
      case 'qrcode':
        return (
          <div className="p-4 flex flex-col items-center justify-center space-y-6 text-center flex-1 my-auto">
            <div>
              <h2 className="text-sm font-extrabold text-white">Check-in na Recepção</h2>
              <p className="text-[10px] text-slate-400 mt-1">Aproxime o código do scanner da catraca física.</p>
            </div>

            {student.status === 'DELINQUENT' ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 space-y-3 max-w-[260px]">
                <AlertTriangle className="h-8 w-8 text-red-400 mx-auto" />
                <h4 className="text-xs font-bold text-white">Entrada Bloqueada</h4>
                <p className="text-[9px] text-slate-400">Regularize sua mensalidade pendente na aba 'Financeiro' para liberar seu acesso.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto rounded-2xl bg-white p-4 border border-slate-700 shadow-inner flex items-center justify-center max-w-[180px]">
                  {/* QR Code SVG */}
                  <svg width="130" height="130" viewBox="0 0 100 100" fill="none" className="text-slate-950">
                    <path d="M10 10h30v30H10zm0 50h30v30H10zm50-50h30v30H60z" fill="currentColor" />
                    <path d="M20 20h10v10H20zm0 50h10v10H20zm50-50h10v10H70z" fill="white" />
                    <path d="M50 50h10v10H50zm10 10h10v10H60zm10-10h20v10H70zm20 20h10v10H90zm-30 10h10v10H60zm10 10h20v10H70z" fill="currentColor" />
                  </svg>
                </div>
                
                <div className="flex gap-2 justify-center items-center text-[10px] text-slate-400 font-bold">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Código expira em 52s</span>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-6 px-4">
      
      {/* Selector overlay for demonstration */}
      <div className="mb-6 rounded-xl border border-white/5 bg-slate-900/50 p-4 max-w-sm w-full text-center space-y-3 select-none">
        <span className="text-[10px] uppercase text-lime-400 font-black tracking-wider flex justify-center items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 fill-lime-400" /> Area de Testes Demo
        </span>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Alternar perfis de demonstração abaixo para ver como o aplicativo móvel do aluno se comporta em diferentes status.
        </p>
        <div className="flex justify-center gap-2">
          {students.slice(0, 3).map((stu) => (
            <button
              key={stu.id}
              onClick={() => {
                setActiveStudentId(stu.id);
                setWorkoutComplete(false);
              }}
              className={`rounded px-2.5 py-1 text-[9px] font-semibold border transition duration-200 ${
                activeStudentId === stu.id 
                  ? 'bg-lime-400/10 text-lime-400 border-lime-400/25 shadow-sm' 
                  : 'border-white/5 bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {stu.name.split(' ')[0]} ({stu.status === 'ACTIVE' ? 'Liberado' : 'Atrasado'})
            </button>
          ))}
        </div>
      </div>

      {/* Embedded smartphone chassis simulator layout */}
      <div className="w-full flex justify-center select-none">
        <PhoneFrame>
          {/* App Header Branding inside phone */}
          <div className="px-4 py-3 shrink-0 border-b border-white/5 bg-slate-950/70 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="h-6 w-6 rounded bg-lime-400 flex items-center justify-center font-bold text-[10px] text-black">
                💪
              </div>
              <span className="text-[11px] font-black text-white">MundoFit Student</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className={`h-1.5 w-1.5 rounded-full ${student.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className="text-[9px] text-slate-400 font-bold uppercase">{student.status === 'ACTIVE' ? 'Liberado' : 'Bloqueado'}</span>
            </div>
          </div>

          {/* Core App Display Scroll content */}
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
            {renderAppContent()}
          </div>

          {/* Navigation Bar in the footer inside phone */}
          <div className="h-12 border-t border-white/5 bg-slate-950/95 flex justify-around items-center shrink-0 text-slate-400 font-bold px-1.5">
            {[
              { id: 'workouts', label: 'Treinos', icon: Dumbbell },
              { id: 'schedule', label: 'Aulas', icon: Calendar },
              { id: 'qrcode', label: 'Check-in', icon: QrCode },
              { id: 'evaluation', label: 'Evolução', icon: Scale },
              { id: 'payments', label: 'Faturas', icon: CreditCard }
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = currentTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setCurrentTab(nav.id as any)}
                  className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
                    isActive ? 'text-lime-400' : 'hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span className="text-[8px] mt-0.5 tracking-tight">{nav.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active sheet modal inside phone frame */}
          {selectedExerciseVideo && (
            <div className="absolute inset-0 z-50 bg-black/75 backdrop-blur-xs flex flex-col justify-end">
              <div className="bg-slate-900 border-t border-white/10 rounded-t-2xl p-4 space-y-4 max-h-[85%] overflow-y-auto no-scrollbar animate-fade-in-up text-left">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-lime-400 font-bold">Instruções de Exercício</span>
                    <h3 className="text-xs font-bold text-white leading-tight">{selectedExerciseVideo.exercise.name}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedExerciseVideo(null)}
                    className="h-5 w-5 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition"
                  >
                    <span className="text-xs font-bold font-sans">✕</span>
                  </button>
                </div>

                {/* Simulated MP4 Loop Player Container */}
                <div className="relative rounded-lg overflow-hidden border border-white/5 bg-slate-950 aspect-video flex flex-col justify-center items-center group cursor-pointer shadow-inner">
                  {/* Subtle mesh looping visual inside simulated video */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-lime-500/10 to-emerald-500/20 opacity-60 animate-pulse-glow" />
                  
                  {/* Real visual loop representing video player */}
                  <div className="relative flex flex-col items-center text-center p-3 space-y-1.5 z-10">
                    <div className="h-10 w-10 rounded-full bg-lime-400/20 border border-lime-400/30 flex items-center justify-center glow-lime-sm animate-bounce">
                      <Play className="h-4.5 w-4.5 text-lime-400 fill-lime-400 translate-x-0.5" />
                    </div>
                    <span className="text-[9px] text-white font-extrabold tracking-tight">Execução Correta (Demonstração)</span>
                    <span className="text-[7px] text-slate-500 font-medium">Clique para ver execução em câmera lenta</span>
                  </div>
                  
                  {/* Video Timeline bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-900 border-t border-white/5 flex items-center">
                    <div className="h-full bg-gradient-to-r from-lime-400 to-emerald-500 w-[65%] animate-pulse" />
                    <span className="h-2 w-2 rounded-full bg-white shadow -ml-1 border border-slate-900" />
                  </div>
                </div>

                {/* Execution step directions */}
                <div className="space-y-3 text-[10px] text-slate-300">
                  <div className="space-y-1">
                    <span className="font-bold text-white block">📋 Modo de Execução:</span>
                    <ul className="list-disc pl-3.5 space-y-1 text-slate-400">
                      <li>Mantenha a coluna neutra e core ativo.</li>
                      <li>Desça de forma controlada (fase excêntrica de 3s).</li>
                      <li>Empurre com força, concentrando nos músculos alvo.</li>
                    </ul>
                  </div>
                  
                  <div className="rounded bg-lime-400/5 border border-lime-400/20 p-2 text-slate-400 leading-normal">
                    <span className="font-black text-lime-400 block mb-0.5 flex items-center gap-1">🤖 Dica do AI Copilot:</span>
                    Nunca estenda completamente as articulações no topo. Mantenha a tensão contínua e controle a respiração (solte o ar na subida).
                  </div>
                </div>
              </div>
            </div>
          )}
        </PhoneFrame>
      </div>

    </div>
  );
}
