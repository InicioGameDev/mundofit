'use client';

import React, { useState } from 'react';
import { useFitFlow } from '@/context/FitFlowContext';
import { 
  Calendar, Clock, User, Users, CheckCircle, AlertTriangle, 
  Plus, X, HelpCircle, Sparkles, MapPin, ChevronRight 
} from 'lucide-react';

export default function AgendaAdmin() {
  const { schedules, students, attendances, registerAttendance } = useFitFlow();

  // Selected state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  
  // Form states
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const selectedSchedule = schedules.find(sc => sc.id === selectedScheduleId);

  // Filter checkins for each class
  const getAttendancesForClass = (scheduleId: string) => {
    return attendances.filter(att => att.scheduleId === scheduleId);
  };

  const handleOpenBooking = (scheduleId: string) => {
    setSelectedScheduleId(scheduleId);
    setBookingModalOpen(true);
    setBookingError(null);
    setBookingSuccess(false);
  };

  const handleRegisterCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScheduleId || !selectedStudentId) return;

    // Check if delinquent or inactive
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    if (student.status === 'DELINQUENT') {
      setBookingError('Não é permitido fazer check-in de alunos com mensalidades vencidas!');
      return;
    }
    if (student.status === 'INACTIVE') {
      setBookingError('Aluno está com cadastro inativo no sistema.');
      return;
    }

    // Attempt booking checkin
    const success = registerAttendance(selectedStudentId, selectedScheduleId);
    if (success) {
      setBookingSuccess(true);
      setBookingError(null);
      setTimeout(() => {
        setBookingModalOpen(false);
        setSelectedScheduleId(null);
      }, 1500);
    } else {
      setBookingError('Erro ao registrar presença. Certifique-se de que a turma não está cheia.');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Calendar className="h-6 w-6 text-lime-400" />
            <span>Grade de Aulas & Check-ins</span>
          </h2>
          <p className="text-xs text-slate-400">Monitore a ocupação de turmas, agende aulas presenciais e gerencie presenças.</p>
        </div>
      </div>

      {/* Timetable timeline display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules.map((sc) => {
          const classCheckins = getAttendancesForClass(sc.id);
          const occupancyRate = (sc.attendancesCount / sc.maxCapacity) * 100;
          
          return (
            <div 
              key={sc.id} 
              className="rounded-xl border border-white/5 bg-slate-900/30 p-5 backdrop-blur-sm space-y-4 hover:border-lime-400/20 transition group relative overflow-hidden"
            >
              {/* Header slot metadata */}
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div>
                  <span className="rounded bg-lime-400/10 px-2 py-0.5 text-[8px] font-black text-lime-400 uppercase">
                    {sc.weekday}s
                  </span>
                  <h3 className="text-sm font-extrabold text-white mt-1 group-hover:text-lime-400 transition">
                    {sc.className}
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{sc.time}</span>
                </div>
              </div>

              {/* Coach details */}
              <div className="text-xs text-slate-300 space-y-1">
                <p className="flex items-center gap-1.5 font-medium">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  <span>Instrutor: <span className="text-white font-bold">{sc.instructorName}</span></span>
                </p>
                <p className="flex items-center gap-1.5 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  <span>Espaço: <span className="text-white">Arena Central</span></span>
                </p>
              </div>

              {/* Capacity meter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-bold text-slate-400">
                  <span>Ocupação da Turma</span>
                  <span>{sc.attendancesCount} / {sc.maxCapacity} Vagas</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-lime-400 rounded-full transition-all duration-300" style={{ width: `${occupancyRate}%` }} />
                </div>
              </div>

              {/* Occupants list */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Alunos Reservados ({classCheckins.length})</span>
                <div className="h-20 overflow-y-auto no-scrollbar space-y-1 text-[10px]">
                  {classCheckins.length === 0 ? (
                    <p className="text-slate-500 italic text-[9px]">Nenhuma reserva feita para esta turma.</p>
                  ) : (
                    classCheckins.map((att, index) => (
                      <div key={index} className="flex justify-between items-center rounded bg-white/5 px-2 py-1">
                        <span className="font-semibold text-white">{att.studentName}</span>
                        <span className="text-[8px] text-slate-500">
                          {new Date(att.checkInTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* CTA Booking */}
              <button 
                onClick={() => handleOpenBooking(sc.id)}
                disabled={sc.attendancesCount >= sc.maxCapacity}
                className="w-full rounded bg-white/5 hover:bg-lime-400 hover:text-black py-2.5 text-xs font-bold text-slate-300 transition duration-300 flex items-center justify-center gap-1 border border-white/5 disabled:opacity-40 shadow"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Agendar Check-in</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* MODAL: Booking reservation check-in form */}
      {bookingModalOpen && selectedSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-slate-950 p-6 shadow-2xl relative space-y-4">
            <button 
              onClick={() => { setBookingModalOpen(false); setSelectedScheduleId(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Calendar className="h-5 w-5 text-lime-400" />
              <h3 className="text-sm font-bold text-white">Registrar Check-in Presencial</h3>
            </div>

            <div className="text-xs text-slate-400 space-y-1 bg-white/5 rounded p-2.5">
              <p>📌 Aula: <span className="text-white font-bold">{selectedSchedule.className}</span></p>
              <p>⏰ Horário: <span className="text-white font-bold">{selectedSchedule.time}</span> • Coach: <span className="text-slate-200">{selectedSchedule.instructorName}</span></p>
            </div>

            {bookingSuccess ? (
              <div className="rounded border border-green-500/20 bg-green-500/10 p-3 text-center text-xs text-green-400 font-bold space-y-2">
                <CheckCircle className="h-8 w-8 mx-auto text-green-400 animate-bounce" />
                <p>Check-in registrado com sucesso!</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterCheckInSubmit} className="space-y-4 text-xs">
                {bookingError && (
                  <div className="rounded border border-red-500/20 bg-red-500/10 p-2.5 text-red-400 font-bold flex items-center gap-2">
                    <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}
                
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">Escolher Aluno</label>
                  <select 
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full rounded bg-slate-900 border border-white/5 p-2.5 text-white outline-none"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.status === 'ACTIVE' ? 'Livre' : 'Atrasado'})</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full rounded-lg bg-lime-400 py-3 text-xs font-bold text-black hover:bg-lime-300 transition shadow glow-lime-sm"
                  >
                    Confirmar Presença
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
