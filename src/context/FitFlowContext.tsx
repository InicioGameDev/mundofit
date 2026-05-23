/**
 * @author Carlos Henrique Ferreira
 * @description MundoFit PRO - Plataforma SaaS de Gestão Fitness Inteligente
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Student, Workout, Exercise, Payment, Schedule, 
  Attendance, PhysicalEvaluation, Lead, Notification,
  Tenant, User, Trainer
} from '../types';

interface FitFlowContextType {
  tenant: Tenant;
  currentUser: User | null;
  students: Student[];
  workouts: Workout[];
  exercises: Exercise[];
  payments: Payment[];
  schedules: Schedule[];
  attendances: Attendance[];
  evaluations: PhysicalEvaluation[];
  leads: Lead[];
  notifications: Notification[];
  trainers: Trainer[];
  theme: 'light' | 'dark';
  
  // Actions
  toggleTheme: () => void;
  addStudent: (student: Omit<Student, 'id' | 'tenantId' | 'createdAt'>) => Student;
  updateStudentStatus: (id: string, status: Student['status']) => void;
  deleteStudent: (id: string) => void;
  addWorkout: (studentId: string, name: string, description: string, routines: any[]) => Workout;
  generateAIWorkout: (studentId: string, goal: string, focus: string, level: string) => Workout;
  addPayment: (studentId: string, amount: number, method: Payment['method'], dueDate: string) => Payment;
  simulatePixPayment: (paymentId: string) => void;
  updateLeadStatus: (leadId: string, status: Lead['status']) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => Lead;
  registerAttendance: (studentId: string, scheduleId: string) => boolean;
  addEvaluation: (studentId: string, evaluation: Omit<PhysicalEvaluation, 'id' | 'date' | 'studentId'>) => PhysicalEvaluation;
  clearNotifications: (studentId?: string) => void;
  addTrainer: (trainer: Omit<Trainer, 'id' | 'tenantId' | 'createdAt'>) => Trainer;
  deleteTrainer: (id: string) => void;
}

const FitFlowContext = createContext<FitFlowContextType | undefined>(undefined);

// Initial high-fidelity exercise library
const DEFAULT_EXERCISES: Exercise[] = [
  { id: 'ex-1', name: 'Supino Reto com Barra', category: 'Força', muscleGroup: 'Peito', videoUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=200' },
  { id: 'ex-2', name: 'Agachamento Livre', category: 'Força', muscleGroup: 'Pernas', videoUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=200' },
  { id: 'ex-3', name: 'Puxada Alta (Lat Pulldown)', category: 'Força', muscleGroup: 'Costas' },
  { id: 'ex-4', name: 'Desenvolvimento de Ombros', category: 'Força', muscleGroup: 'Ombros' },
  { id: 'ex-5', name: 'Rosca Direta Clássica', category: 'Força', muscleGroup: 'Braços' },
  { id: 'ex-6', name: 'Tríceps Corda na Polia', category: 'Força', muscleGroup: 'Braços' },
  { id: 'ex-7', name: 'Leg Press 45 Graus', category: 'Força', muscleGroup: 'Pernas' },
  { id: 'ex-8', name: 'Cadeira Extensora', category: 'Força', muscleGroup: 'Pernas' },
  { id: 'ex-9', name: 'Stiff Unilateral', category: 'Força', muscleGroup: 'Pernas' },
  { id: 'ex-10', name: 'Prancha Abdominal Estática', category: 'Força', muscleGroup: 'Core' },
  { id: 'ex-11', name: 'Corrida na Esteira HIIT', category: 'Cardio', muscleGroup: 'Cardio' },
  { id: 'ex-12', name: 'Bicicleta Ergométrica', category: 'Cardio', muscleGroup: 'Cardio' },
  { id: 'ex-13', name: 'Remada Curvada Pronada', category: 'Força', muscleGroup: 'Costas' },
  { id: 'ex-14', name: 'Elevação Lateral Halteres', category: 'Força', muscleGroup: 'Ombros' },
  { id: 'ex-15', name: 'Flexão de Braços Solo', category: 'Força', muscleGroup: 'Peito' },
];

export const FitFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Enterprise Core Info
  const [tenant] = useState<Tenant>({
    id: 't-1',
    name: 'Iron Fit Club',
    slug: 'ironfit',
    logoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=150',
    accentColor: '#10b981',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [currentUser] = useState<User>({
    id: 'u-1',
    email: 'contato@ironfit.com',
    name: 'Rodrigo Lima',
    role: 'ADMIN',
    tenantId: 't-1',
    createdAt: new Date().toISOString()
  });

  // Business entities managed by LocalState with persistence
  const [students, setStudents] = useState<Student[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises] = useState<Exercise[]>(DEFAULT_EXERCISES);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [evaluations, setEvaluations] = useState<PhysicalEvaluation[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);

  // 1. Initial State Loading & Hydration
  useEffect(() => {
    // Theme setup
    const savedTheme = localStorage.getItem('fitflow-theme') as 'light' | 'dark' | null;
    const currentTheme = savedTheme || 'dark';
    setTheme(currentTheme);
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Seed mock data if not existing in localStorage
    const storedStudents = localStorage.getItem('ff_students');
    const storedWorkouts = localStorage.getItem('ff_workouts');
    const storedPayments = localStorage.getItem('ff_payments');
    const storedSchedules = localStorage.getItem('ff_schedules');
    const storedAttendances = localStorage.getItem('ff_attendances');
    const storedEvaluations = localStorage.getItem('ff_evaluations');
    const storedLeads = localStorage.getItem('ff_leads');
    const storedNotifications = localStorage.getItem('ff_notifications');
    const storedTrainers = localStorage.getItem('ff_trainers');

    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
      setWorkouts(JSON.parse(storedWorkouts || '[]'));
      setPayments(JSON.parse(storedPayments || '[]'));
      setSchedules(JSON.parse(storedSchedules || '[]'));
      setAttendances(JSON.parse(storedAttendances || '[]'));
      setEvaluations(JSON.parse(storedEvaluations || '[]'));
      setLeads(JSON.parse(storedLeads || '[]'));
      setNotifications(JSON.parse(storedNotifications || '[]'));
      setTrainers(JSON.parse(storedTrainers || '[]'));
    } else {
      // Seed default initial mock data
      const mockStudents: Student[] = [
        {
          id: 'st-1',
          tenantId: 't-1',
          name: 'Fernanda Vasconcelos',
          email: 'fernanda.vas@gmail.com',
          phone: '(11) 98765-4321',
          photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
          status: 'ACTIVE',
          contractType: 'ANUAL',
          startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
          endDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'st-2',
          tenantId: 't-1',
          name: 'Gabriel Menezes Siqueira',
          email: 'gabriel.siqueira@outlook.com',
          phone: '(21) 99122-3838',
          photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
          status: 'DELINQUENT',
          contractType: 'MENSAL',
          startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'st-3',
          tenantId: 't-1',
          name: 'Mariana Duarte Souza',
          email: 'mari.duarte@hotmail.com',
          phone: '(31) 97722-1100',
          photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          status: 'ACTIVE',
          contractType: 'TRIMESTRAL',
          startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'st-4',
          tenantId: 't-1',
          name: 'Lucas Antunes Rocha',
          email: 'lucas.antunes.rocha@gmail.com',
          phone: '(19) 98111-2299',
          photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
          status: 'INACTIVE',
          contractType: 'MENSAL',
          startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      // Default Schedules (Classes)
      const mockSchedules: Schedule[] = [
        { id: 'sch-1', tenantId: 't-1', className: 'Crossfit WOD', instructorName: 'Coach Bruno', maxCapacity: 15, time: '07:00', weekday: 'Segunda', attendancesCount: 12 },
        { id: 'sch-2', tenantId: 't-1', className: 'Spinning Energy', instructorName: 'Juliana Costa', maxCapacity: 20, time: '19:00', weekday: 'Segunda', attendancesCount: 18 },
        { id: 'sch-3', tenantId: 't-1', className: 'Pilates Funcional', instructorName: 'Dra. Patricia', maxCapacity: 8, time: '18:00', weekday: 'Terça', attendancesCount: 6 },
        { id: 'sch-4', tenantId: 't-1', className: 'Crossfit WOD', instructorName: 'Coach Bruno', maxCapacity: 15, time: '19:00', weekday: 'Quarta', attendancesCount: 14 },
        { id: 'sch-5', tenantId: 't-1', className: 'Ritmos Dance', instructorName: 'Lucas Lima', maxCapacity: 30, time: '20:00', weekday: 'Quinta', attendancesCount: 22 }
      ];

      // Physical Evaluations
      const mockEvaluations: PhysicalEvaluation[] = [
        { id: 'ev-1', studentId: 'st-1', weightKg: 62.5, heightCm: 165, bodyFatPct: 22.4, musclePct: 34.2, chestCm: 90, waistCm: 68, hipsCm: 98, date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Ótima evolução de força e perda de percentual lipídico.' },
        { id: 'ev-2', studentId: 'st-1', weightKg: 61.2, heightCm: 165, bodyFatPct: 20.8, musclePct: 35.1, chestCm: 89, waistCm: 66, hipsCm: 96, date: new Date().toISOString(), notes: 'Atingiu a meta de gordura corporal planejada!' },
        { id: 'ev-3', studentId: 'st-2', weightKg: 85.0, heightCm: 180, bodyFatPct: 18.5, musclePct: 38.0, chestCm: 104, waistCm: 88, hipsCm: 102, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }
      ];

      // Workouts & Routines
      const mockWorkouts: Workout[] = [
        {
          id: 'wk-1',
          studentId: 'st-1',
          name: 'Hipertrofia Glúteos e Coxas (Feminino A)',
          description: 'Foco em quadríceps e posterior. Cadência controlada 3.0.1.0',
          active: true,
          startDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          routines: [
            { id: 'rt-1', workoutId: 'wk-1', exerciseId: 'ex-2', exercise: DEFAULT_EXERCISES[1], series: 4, repetitions: '10-12', weightKg: 40, restSeconds: 60, orderIndex: 0, notes: 'Focar na amplitude do movimento.' },
            { id: 'rt-2', workoutId: 'wk-1', exerciseId: 'ex-7', exercise: DEFAULT_EXERCISES[6], series: 4, repetitions: '12', weightKg: 120, restSeconds: 90, orderIndex: 1 },
            { id: 'rt-3', workoutId: 'wk-1', exerciseId: 'ex-8', exercise: DEFAULT_EXERCISES[7], series: 3, repetitions: '15', weightKg: 35, restSeconds: 45, orderIndex: 2, notes: 'Isometria de 2 segundos ao final de cada repetição.' },
            { id: 'rt-4', workoutId: 'wk-1', exerciseId: 'ex-9', exercise: DEFAULT_EXERCISES[8], series: 3, repetitions: '12 (cada perna)', weightKg: 10, restSeconds: 60, orderIndex: 3 }
          ]
        },
        {
          id: 'wk-2',
          studentId: 'st-2',
          name: 'Força Superior - Push Day',
          description: 'Trabalho de força progressiva em supino e desenvolvimento',
          active: true,
          startDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          routines: [
            { id: 'rt-5', workoutId: 'wk-2', exerciseId: 'ex-1', exercise: DEFAULT_EXERCISES[0], series: 4, repetitions: '6-8', weightKg: 80, restSeconds: 120, orderIndex: 0 },
            { id: 'rt-6', workoutId: 'wk-2', exerciseId: 'ex-4', exercise: DEFAULT_EXERCISES[3], series: 3, repetitions: '8', weightKg: 24, restSeconds: 90, orderIndex: 1 },
            { id: 'rt-7', workoutId: 'wk-2', exerciseId: 'ex-15', exercise: DEFAULT_EXERCISES[14], series: 3, repetitions: 'FALHA', weightKg: 0, restSeconds: 60, orderIndex: 2 },
            { id: 'rt-8', workoutId: 'wk-2', exerciseId: 'ex-6', exercise: DEFAULT_EXERCISES[5], series: 4, repetitions: '10', weightKg: 25, restSeconds: 45, orderIndex: 3 }
          ]
        }
      ];

      // Payments
      const mockPayments: Payment[] = [
        { id: 'py-1', studentId: 'st-1', studentName: 'Fernanda Vasconcelos', amount: 120.00, status: 'PAID', method: 'PIX', dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), invoiceUrl: '#', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'py-2', studentId: 'st-1', studentName: 'Fernanda Vasconcelos', amount: 120.00, status: 'PAID', method: 'PIX', dueDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), paidAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'py-3', studentId: 'st-2', studentName: 'Gabriel Menezes Siqueira', amount: 99.90, status: 'PENDING', method: 'PIX', dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), pixQrCode: 'pix-simulated-qr-gabriel', pixCopyPaste: '00020126580014br.gov.bcb.pix0136gabrielsiqueira-mundofit-pay9990', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'py-4', studentId: 'st-3', studentName: 'Mariana Duarte Souza', amount: 110.00, status: 'PAID', method: 'CARD', dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
      ];

      // Attendances
      const mockAttendances: Attendance[] = [
        { id: 'at-1', studentId: 'st-1', studentName: 'Fernanda Vasconcelos', scheduleId: 'sch-1', className: 'Crossfit WOD', checkInTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'at-2', studentId: 'st-1', studentName: 'Fernanda Vasconcelos', scheduleId: 'sch-2', className: 'Spinning Energy', checkInTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'at-3', studentId: 'st-3', studentName: 'Mariana Duarte Souza', scheduleId: 'sch-3', className: 'Pilates Funcional', checkInTime: new Date().toISOString() }
      ];

      // Leads CRM
      const mockLeads: Lead[] = [
        { id: 'ld-1', name: 'Rodrigo Medeiros', phone: '(11) 99111-5500', email: 'rodrigo.m@gmail.com', origin: 'Instagram', status: 'LEAD', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Perguntou sobre o plano de musculação livre e horário de pico.' },
        { id: 'ld-2', name: 'Jessica Ramos', phone: '(11) 98822-4411', email: 'jess.ramos@outlook.com', origin: 'WhatsApp', status: 'CONTACT', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Quer marcar uma aula experimental de Spinning.' },
        { id: 'ld-3', name: 'Felipe Camargo', phone: '(11) 97733-1122', email: 'felipe.c@hotmail.com', origin: 'Indicação', status: 'VISIT', createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Visitou as instalações e demonstrou forte interesse no plano anual.' },
        { id: 'ld-4', name: 'Camila Pitanga', phone: '(11) 96644-8800', email: 'camila.pitanga@gmail.com', origin: 'Google', status: 'CONVERTED', createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() }
      ];

      // Notifications
      const mockNotifications: Notification[] = [
        { id: 'nt-1', studentId: 'st-2', title: 'Mensalidade Vencida', message: 'Sua parcela de R$ 99,90 com vencimento em 13/05/2026 está pendente.', read: false, createdAt: new Date().toISOString() },
        { id: 'nt-2', studentId: 'st-1', title: 'Novo Treino Liberado!', message: 'O professor liberou sua nova ficha "Feminino A" de Glúteos e Coxas.', read: false, createdAt: new Date().toISOString() }
      ];

      // Trainers
      const mockTrainers: Trainer[] = [
        { id: 'tr-1', tenantId: 't-1', name: 'Juliana Costa', cpf: '123.456.789-00', cref: '012345-G/SP', specialty: 'Spinning & Dança', dayOff: 'Domingo', startTime: '07:00', endTime: '16:00', bio: 'Especialista em treinos de alta intensidade e ciclismo indoor.', createdAt: new Date().toISOString() },
        { id: 'tr-2', tenantId: 't-1', name: 'Coach Bruno', cpf: '987.654.321-11', cref: '098765-G/RJ', specialty: 'Crossfit WOD & Cardio', dayOff: 'Sábado', startTime: '06:00', endTime: '15:00', bio: 'Formado em Ed. Física com especialização em treinamento funcional de alta performance.', createdAt: new Date().toISOString() },
        { id: 'tr-3', tenantId: 't-1', name: 'Dra. Patricia', cpf: '456.789.123-22', cref: '045678-G/MG', specialty: 'Pilates Clínico & Postura', dayOff: 'Quarta-feira', startTime: '13:00', endTime: '21:00', bio: 'Fisioterapeuta focada em reabilitação postural e fortalecimento de core.', createdAt: new Date().toISOString() }
      ];

      setStudents(mockStudents);
      setWorkouts(mockWorkouts);
      setPayments(mockPayments);
      setSchedules(mockSchedules);
      setAttendances(mockAttendances);
      setEvaluations(mockEvaluations);
      setLeads(mockLeads);
      setNotifications(mockNotifications);
      setTrainers(mockTrainers);

      // Save to localStorage
      localStorage.setItem('ff_students', JSON.stringify(mockStudents));
      localStorage.setItem('ff_workouts', JSON.stringify(mockWorkouts));
      localStorage.setItem('ff_payments', JSON.stringify(mockPayments));
      localStorage.setItem('ff_schedules', JSON.stringify(mockSchedules));
      localStorage.setItem('ff_attendances', JSON.stringify(mockAttendances));
      localStorage.setItem('ff_evaluations', JSON.stringify(mockEvaluations));
      localStorage.setItem('ff_leads', JSON.stringify(mockLeads));
      localStorage.setItem('ff_notifications', JSON.stringify(mockNotifications));
      localStorage.setItem('ff_trainers', JSON.stringify(mockTrainers));
    }
  }, []);

  // 2. State Sync Handlers
  const saveState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('fitflow-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Add a Student
  const addStudent = (studentData: Omit<Student, 'id' | 'tenantId' | 'createdAt'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `st-${Math.floor(Math.random() * 100000)}`,
      tenantId: 't-1',
      createdAt: new Date().toISOString()
    };
    
    const updated = [newStudent, ...students];
    setStudents(updated);
    saveState('ff_students', updated);

    // Create a pending invoice for the new student
    const planCost = studentData.contractType === 'MENSAL' ? 99.90 : studentData.contractType === 'TRIMESTRAL' ? 270.00 : 960.00;
    addPayment(newStudent.id, planCost, 'PIX', newStudent.endDate);

    // Welcome Notification
    const newNotif: Notification = {
      id: `nt-${Math.floor(Math.random() * 100000)}`,
      studentId: newStudent.id,
      title: 'Bem-vindo ao Iron Fit!',
      message: 'Seu cadastro está ativo. Baixe o aplicativo para ver seus treinos e check-ins.',
      read: false,
      createdAt: new Date().toISOString()
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveState('ff_notifications', updatedNotifs);

    return newStudent;
  };

  // Update Status
  const updateStudentStatus = (id: string, status: Student['status']) => {
    const updated = students.map(s => s.id === id ? { ...s, status } : s);
    setStudents(updated);
    saveState('ff_students', updated);
  };

  // Delete Student
  const deleteStudent = (id: string) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    saveState('ff_students', updated);
  };

  // Add Workout Manual
  const addWorkout = (studentId: string, name: string, description: string, routines: any[]) => {
    const newWorkout: Workout = {
      id: `wk-${Math.floor(Math.random() * 100000)}`,
      studentId,
      name,
      description,
      active: true,
      startDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      routines: routines.map((r, index) => ({
        ...r,
        id: `rt-${Math.floor(Math.random() * 100000)}`,
        orderIndex: index
      }))
    };

    // Desativa treinos anteriores do aluno
    const updatedWorkouts = workouts.map(w => w.studentId === studentId ? { ...w, active: false } : w);
    const finalWorkouts = [newWorkout, ...updatedWorkouts];
    setWorkouts(finalWorkouts);
    saveState('ff_workouts', finalWorkouts);

    // Enviar notificação
    const newNotif: Notification = {
      id: `nt-${Math.floor(Math.random() * 100000)}`,
      studentId,
      title: 'Treino Atualizado!',
      message: `Sua ficha foi atualizada para "${name}" pelo seu professor.`,
      read: false,
      createdAt: new Date().toISOString()
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveState('ff_notifications', updatedNotifs);

    return newWorkout;
  };

  // 3. Simulated AI Workout Builder Generator
  const generateAIWorkout = (studentId: string, goal: string, focus: string, level: string) => {
    // Determine exercises based on focus and goals
    let selectedExercises: Exercise[] = [];
    if (focus === 'inferiores') {
      selectedExercises = [
        DEFAULT_EXERCISES[1], // Squat
        DEFAULT_EXERCISES[6], // Leg Press
        DEFAULT_EXERCISES[7], // Extensora
        DEFAULT_EXERCISES[8], // Stiff
        DEFAULT_EXERCISES[9]  // Abdominal
      ];
    } else if (focus === 'superiores') {
      selectedExercises = [
        DEFAULT_EXERCISES[0], // Supino
        DEFAULT_EXERCISES[2], // Pulldown
        DEFAULT_EXERCISES[3], // Desenvolvimento
        DEFAULT_EXERCISES[4], // Rosca Direta
        DEFAULT_EXERCISES[5]  // Triceps
      ];
    } else {
      // Full body
      selectedExercises = [
        DEFAULT_EXERCISES[1], // Squat
        DEFAULT_EXERCISES[0], // Supino
        DEFAULT_EXERCISES[2], // Pulldown
        DEFAULT_EXERCISES[9], // Abdominal
        DEFAULT_EXERCISES[10] // Corrida
      ];
    }

    const series = level === 'avancado' ? 4 : 3;
    const reps = level === 'iniciante' ? '12-15' : level === 'intermediario' ? '10-12' : '6-8 (Força)';
    const rest = level === 'avancado' ? 90 : 60;

    const routines = selectedExercises.map((ex, index) => {
      let defaultWeight = 10;
      if (ex.name.includes('Supino')) defaultWeight = level === 'iniciante' ? 20 : level === 'intermediario' ? 40 : 70;
      if (ex.name.includes('Agachamento')) defaultWeight = level === 'iniciante' ? 15 : level === 'intermediario' ? 30 : 60;
      if (ex.name.includes('Leg Press')) defaultWeight = level === 'iniciante' ? 80 : level === 'intermediario' ? 140 : 220;
      if (ex.name.includes('Rosca')) defaultWeight = level === 'iniciante' ? 5 : level === 'intermediario' ? 10 : 15;
      if (ex.name.includes('Abdominal') || ex.name.includes('Corrida')) defaultWeight = 0;

      return {
        id: `rt-${Math.floor(Math.random() * 100000)}`,
        workoutId: '',
        exerciseId: ex.id,
        exercise: ex,
        series,
        repetitions: reps,
        weightKg: defaultWeight > 0 ? defaultWeight : undefined,
        restSeconds: rest,
        orderIndex: index,
        notes: index === 0 ? 'Fazer aquecimento de 5 minutos antes de começar.' : undefined
      };
    });

    const goalName = goal === 'hipertrofia' ? 'Hipertrofia' : goal === 'emagrecimento' ? 'Definição & Cardio' : 'Condicionamento Físico';
    const focusName = focus === 'inferiores' ? 'Membros Inferiores' : focus === 'superiores' ? 'Membros Superiores' : 'Fullbody Funcional';
    const levelName = level === 'iniciante' ? 'Starter' : level === 'intermediario' ? 'Pro' : 'Elite';

    const newWorkout: Workout = {
      id: `wk-${Math.floor(Math.random() * 100000)}`,
      studentId,
      name: `⚡ AI Flex: ${goalName} (${focusName} - ${levelName})`,
      description: `Treino completo gerado sob demanda pela nossa Inteligência Artificial para foco em ${focus}.`,
      active: true,
      startDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      routines
    };

    // Desativa treinos anteriores do aluno
    const updatedWorkouts = workouts.map(w => w.studentId === studentId ? { ...w, active: false } : w);
    const finalWorkouts = [newWorkout, ...updatedWorkouts];
    setWorkouts(finalWorkouts);
    saveState('ff_workouts', finalWorkouts);

    // Enviar notificação
    const newNotif: Notification = {
      id: `nt-${Math.floor(Math.random() * 100000)}`,
      studentId,
      title: '🦾 Treino de IA Gerado!',
      message: `Seu novo treino personalizado de IA "${newWorkout.name}" já está disponível.`,
      read: false,
      createdAt: new Date().toISOString()
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveState('ff_notifications', updatedNotifs);

    return newWorkout;
  };

  // Add manual Invoice
  const addPayment = (studentId: string, amount: number, method: Payment['method'], dueDate: string) => {
    const student = students.find(s => s.id === studentId);
    const newPayment: Payment = {
      id: `py-${Math.floor(Math.random() * 100000)}`,
      studentId,
      studentName: student?.name || 'Aluno Desconhecido',
      amount,
      status: 'PENDING',
      method,
      dueDate,
      pixQrCode: method === 'PIX' ? `pix-qr-${Math.random()}` : undefined,
      pixCopyPaste: method === 'PIX' ? `00020126580014br.gov.bcb.pix0136pix-fitflow-${Math.floor(Math.random()*900000+100000)}` : undefined,
      createdAt: new Date().toISOString()
    };

    const updated = [newPayment, ...payments];
    setPayments(updated);
    saveState('ff_payments', updated);
    return newPayment;
  };

  // Simulate confirming a Pix payment
  const simulatePixPayment = (paymentId: string) => {
    const toPay = payments.find(p => p.id === paymentId);
    if (!toPay) return;

    const updatedPayments = payments.map(p => 
      p.id === paymentId 
        ? { ...p, status: 'PAID' as const, paidAt: new Date().toISOString() } 
        : p
    );
    setPayments(updatedPayments);
    saveState('ff_payments', updatedPayments);

    // Reactiva aluno se ele estivesse inadimplente
    const updatedStudents = students.map(s => 
      s.id === toPay.studentId && s.status === 'DELINQUENT' 
        ? { ...s, status: 'ACTIVE' as const } 
        : s
    );
    setStudents(updatedStudents);
    saveState('ff_students', updatedStudents);

    // Enviar notificação de sucesso de faturamento
    const newNotif: Notification = {
      id: `nt-${Math.floor(Math.random() * 100000)}`,
      studentId: toPay.studentId,
      title: 'Pagamento Confirmado!',
      message: `Seu PIX de R$ ${toPay.amount.toFixed(2)} foi processado com sucesso. Obrigado!`,
      read: false,
      createdAt: new Date().toISOString()
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveState('ff_notifications', updatedNotifs);
  };

  // Update CRM Lead Status
  const updateLeadStatus = (leadId: string, status: Lead['status']) => {
    const lead = leads.find(l => l.id === leadId);
    let updated = leads.map(l => l.id === leadId ? { ...l, status } : l);
    
    // Se o lead foi matriculado (convertido), adicionamos ele como aluno!
    if (status === 'CONVERTED' && lead) {
      const isAlreadyStudent = students.some(s => s.email === lead.email);
      if (!isAlreadyStudent) {
        // Gera um contrato de 30 dias por padrão
        addStudent({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          status: 'ACTIVE',
          contractType: 'MENSAL',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    }

    setLeads(updated);
    saveState('ff_leads', updated);
  };

  // Add Lead to CRM
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `ld-${Math.floor(Math.random() * 100000)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newLead, ...leads];
    setLeads(updated);
    saveState('ff_leads', updated);
    return newLead;
  };

  // Register Class Attendance (Check-in)
  const registerAttendance = (studentId: string, scheduleId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student || student.status === 'DELINQUENT') {
      return false; // Alunos inadimplentes não podem fazer check-in!
    }

    const schedule = schedules.find(sc => sc.id === scheduleId);
    if (!schedule || schedule.attendancesCount >= schedule.maxCapacity) {
      return false; // Turma cheia!
    }

    // Cria check-in
    const newAttendance: Attendance = {
      id: `at-${Math.floor(Math.random() * 100000)}`,
      studentId,
      studentName: student.name,
      scheduleId,
      className: schedule.className,
      checkInTime: new Date().toISOString()
    };

    const updatedAttendances = [newAttendance, ...attendances];
    setAttendances(updatedAttendances);
    saveState('ff_attendances', updatedAttendances);

    // Incrementa contador de presenças no cronograma
    const updatedSchedules = schedules.map(sc => 
      sc.id === scheduleId 
        ? { ...sc, attendancesCount: sc.attendancesCount + 1 } 
        : sc
    );
    setSchedules(updatedSchedules);
    saveState('ff_schedules', updatedSchedules);

    // Notificação
    const newNotif: Notification = {
      id: `nt-${Math.floor(Math.random() * 100000)}`,
      studentId,
      title: 'Check-in Realizado!',
      message: `Presença confirmada na aula de ${schedule.className} às ${schedule.time}.`,
      read: false,
      createdAt: new Date().toISOString()
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveState('ff_notifications', updatedNotifs);

    return true;
  };

  // Add physical evaluation
  const addEvaluation = (studentId: string, evaluationData: Omit<PhysicalEvaluation, 'id' | 'date' | 'studentId'>) => {
    const newEval: PhysicalEvaluation = {
      ...evaluationData,
      id: `ev-${Math.floor(Math.random() * 100000)}`,
      studentId,
      date: new Date().toISOString()
    };

    const updated = [newEval, ...evaluations];
    setEvaluations(updated);
    saveState('ff_evaluations', updated);
    return newEval;
  };

  // Clear student notifications
  const clearNotifications = (studentId?: string) => {
    const updated = notifications.map(n => 
      (!studentId || studentId === 'all' || n.studentId === studentId) ? { ...n, read: true } : n
    );
    setNotifications(updated);
    saveState('ff_notifications', updated);
  };

  // CRUD de Professores
  const addTrainer = (newTrainerData: Omit<Trainer, 'id' | 'tenantId' | 'createdAt'>) => {
    const newTrainer: Trainer = {
      ...newTrainerData,
      id: `tr-${Math.floor(Math.random() * 1000000)}`,
      tenantId: 't-1',
      createdAt: new Date().toISOString()
    };
    const updated = [newTrainer, ...trainers];
    setTrainers(updated);
    saveState('ff_trainers', updated);
    return newTrainer;
  };

  const deleteTrainer = (id: string) => {
    const updated = trainers.filter(t => t.id !== id);
    setTrainers(updated);
    saveState('ff_trainers', updated);
  };

  return (
    <FitFlowContext.Provider value={{
      tenant,
      currentUser,
      students,
      workouts,
      exercises,
      payments,
      schedules,
      attendances,
      evaluations,
       leads,
      notifications,
      trainers,
      theme,
      toggleTheme,
      addStudent,
      updateStudentStatus,
      deleteStudent,
      addWorkout,
      generateAIWorkout,
      addPayment,
      simulatePixPayment,
      updateLeadStatus,
      addLead,
      registerAttendance,
      addEvaluation,
      clearNotifications,
      addTrainer,
      deleteTrainer
    }}>
      {children}
    </FitFlowContext.Provider>
  );
};

export const useFitFlow = () => {
  const context = useContext(FitFlowContext);
  if (context === undefined) {
    throw new Error('useFitFlow must be used within a FitFlowProvider');
  }
  return context;
};
