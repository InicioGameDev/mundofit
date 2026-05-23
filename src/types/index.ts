export type Role = 'SUPERADMIN' | 'ADMIN' | 'TRAINER' | 'STUDENT';

export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'DELINQUENT';

export type ContractType = 'MENSAL' | 'TRIMESTRAL' | 'ANUAL';

export type PaymentStatus = 'PAID' | 'PENDING' | 'EXPIRED';

export type PaymentMethod = 'PIX' | 'CARD' | 'CASH';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  accentColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  tenantId: string;
  createdAt: string;
}

export interface Student {
  id: string;
  userId?: string;
  tenantId: string;
  name: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  status: StudentStatus;
  contractType: ContractType;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface Workout {
  id: string;
  studentId: string;
  name: string;
  description?: string;
  active: boolean;
  startDate: string;
  endDate?: string;
  createdAt: string;
  routines: ExerciseRoutine[];
}

export interface Exercise {
  id: string;
  name: string;
  category: string; // Cardio, Força, Flexibilidade, etc.
  muscleGroup: string; // Peito, Costas, Pernas, Ombros, Braços, Core
  videoUrl?: string;
}

export interface ExerciseRoutine {
  id: string;
  workoutId: string;
  exerciseId: string;
  exercise: Exercise;
  series: number;
  repetitions: string;
  weightKg?: number;
  restSeconds: number;
  orderIndex: number;
  notes?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName?: string; // Cache para facilitar exibições
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  dueDate: string;
  paidAt?: string;
  pixQrCode?: string;
  pixCopyPaste?: string;
  invoiceUrl?: string;
  createdAt: string;
}

export interface Schedule {
  id: string;
  tenantId: string;
  className: string; // Pilates, Spinning, Crossfit, Funcional, etc.
  instructorName: string;
  maxCapacity: number;
  time: string; // ex: "19:00"
  weekday: string; // Segunda, Terça, etc.
  attendancesCount: number;
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName?: string;
  scheduleId: string;
  className?: string;
  checkInTime: string;
}

export interface PhysicalEvaluation {
  id: string;
  studentId: string;
  weightKg: number;
  heightCm: number;
  bodyFatPct?: number;
  musclePct?: number;
  chestCm?: number;
  waistCm?: number;
  hipsCm?: number;
  date: string;
  notes?: string;
}

export interface Notification {
  id: string;
  studentId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// CRM Interface
export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  origin: string; // WhatsApp, Instagram, Indicação, etc.
  status: 'LEAD' | 'CONTACT' | 'VISIT' | 'CONVERTED';
  createdAt: string;
  notes?: string;
}

export interface Trainer {
  id: string;
  tenantId: string;
  name: string;
  cpf: string;
  cref: string;
  specialty: string;
  dayOff: string;
  startTime: string;
  endTime: string;
  bio?: string;
  createdAt: string;
}
