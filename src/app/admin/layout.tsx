'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFitFlow } from '@/context/FitFlowContext';
import { 
  Dumbbell, LayoutDashboard, Users, Dumbbell as WorkoutIcon, 
  DollarSign, Calendar, MessageSquare, Settings, Smartphone,
  Sun, Moon, Bell, LogOut, Menu, X, Search, Contact 
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { tenant, currentUser, theme, toggleTheme, notifications, clearNotifications } = useFitFlow();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Alunos', href: '/admin/alunos', icon: Users },
    { name: 'Treinos', href: '/admin/treinos', icon: WorkoutIcon },
    { name: 'Financeiro', href: '/admin/financeiro', icon: DollarSign },
    { name: 'Agenda', href: '/admin/agenda', icon: Calendar },
    { name: 'Professores', href: '/admin/professores', icon: Contact },
    { name: 'CRM (Leads)', href: '/admin/crm', icon: MessageSquare },
    { name: 'Configurações', href: '/admin/configuracoes', icon: Settings },
  ];

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      
      {/* 1. Sidebar - Desktop view */}
      <aside className="hidden md:flex flex-col w-64 glass-card border-r border-border shrink-0 sticky top-0 h-screen p-4 justify-between z-30 print:hidden">
        <div className="space-y-6">
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-lime-400 to-emerald-500 glow-lime">
              <Dumbbell className="h-4.5 w-4.5 text-black font-extrabold" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-white leading-none">
                {tenant.name}
              </h1>
              <span className="text-[10px] text-lime-400 font-bold tracking-widest uppercase">MundoFit PRO</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold border transition duration-200 ${
                    isActive 
                      ? 'bg-lime-400/10 text-lime-400 border-lime-400/25 shadow-[0_0_12px_-3px_rgba(52,211,153,0.15)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer (User info, Theme, logout) */}
        <div className="space-y-4 pt-4 border-t border-border">
          {/* Student App Shortcut */}
          <Link
            href="/app-aluno"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-bold text-slate-300 hover:text-white transition"
          >
            <Smartphone className="h-4 w-4" />
            <span>Simular App Aluno</span>
          </Link>

          {/* User Profile & Theme Slider */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-lime-400">
                {currentUser?.name[0]}
              </div>
              <div className="leading-tight">
                <p className="text-[10px] font-bold text-white">{currentUser?.name}</p>
                <p className="text-[9px] text-slate-500 font-medium">Administrador</p>
              </div>
            </div>
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 px-2 py-1 text-[10px] text-slate-500 hover:text-red-400 font-bold transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sair do Sistema</span>
          </Link>
        </div>
      </aside>

      {/* 2. Mobile Responsive Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden bg-black/60 backdrop-blur-sm">
          <aside className="w-64 bg-slate-950 p-5 flex flex-col justify-between border-r border-white/10">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-lime-400">
                    <Dumbbell className="h-4 w-4 text-black" />
                  </div>
                  <span className="font-extrabold text-sm text-white">{tenant.name}</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold border transition ${
                        isActive 
                          ? 'bg-lime-400/10 text-lime-400 border-lime-400/25 shadow-sm' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <Link
                href="/app-aluno"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded bg-white/5 py-2.5 text-xs font-bold text-white"
              >
                <Smartphone className="h-4 w-4" />
                <span>Simular App Aluno</span>
              </Link>
              <button 
                onClick={() => { toggleTheme(); setSidebarOpen(false); }}
                className="flex items-center justify-between w-full rounded bg-white/5 px-3 py-2 text-xs text-slate-300 font-bold"
              >
                <span>Tema {theme === 'dark' ? 'Claro' : 'Escuro'}</span>
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 3. Main Dashboard Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen relative">
        {/* Top Header Bar */}
        <header className="glass-nav sticky top-0 z-20 flex h-14 items-center justify-between px-4 md:px-8 border-b border-border shrink-0 backdrop-blur-md print:hidden">
          {/* Mobile menu and search */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded border border-border md:hidden text-slate-300 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-white/5 px-3 py-1.5 text-xs w-60">
              <Search className="h-3.5 w-3.5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Buscar aluno, treino, mensalidade..." 
                className="bg-transparent border-none outline-none text-slate-300 placeholder-slate-500 w-full text-[11px] font-medium"
              />
            </div>
          </div>

          {/* User actions and notifications */}
          <div className="flex items-center gap-4">
            {/* Notification bell */}
            <div className="relative z-30">
              <button 
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:bg-white/5 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <Bell className="h-4 w-4" />
              </button>
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white glow-lime-sm pointer-events-none">
                  {unreadNotifsCount}
                </span>
              )}

              {/* Glassmorphic Dropdown List */}
              {notifDropdownOpen && (
                <>
                  {/* Click outside backdrop to close */}
                  <div className="fixed inset-0 z-40" onClick={() => setNotifDropdownOpen(false)} />
                  
                  <div className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-md z-50 space-y-3 animate-fade-in-up">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-xs font-extrabold text-white">Notificações Recentes</span>
                      {unreadNotifsCount > 0 && (
                        <button 
                          onClick={() => { clearNotifications(); setNotifDropdownOpen(false); }}
                          className="text-[10px] font-bold text-lime-400 hover:underline cursor-pointer"
                        >
                          Limpar tudo
                        </button>
                      )}
                    </div>

                    <div className="max-h-60 overflow-y-auto no-scrollbar space-y-2 text-xs">
                      {notifications.length === 0 ? (
                        <p className="text-center py-6 text-slate-500 font-medium">Nenhuma notificação encontrada.</p>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              if (!n.read) clearNotifications(n.studentId);
                            }}
                            className={`p-2.5 rounded-lg border transition text-left cursor-pointer ${
                              n.read 
                                ? 'bg-white/[0.02] border-transparent text-slate-400' 
                                : 'bg-white/5 border-lime-400/20 text-slate-200'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span className="font-bold text-[11px] leading-tight block">{n.title}</span>
                              {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-lime-400 shrink-0 mt-1" />}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 leading-normal">{n.message}</p>
                            <span className="text-[8px] text-slate-500 font-semibold block mt-1.5">
                              {new Date(n.createdAt).toLocaleDateString('pt-BR')} às {new Date(n.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick Gym Status */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-white/5 px-3 py-1 text-[10px] font-bold text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Unidade Central Ativa</span>
            </div>
          </div>
        </header>

        {/* Page children container */}
        <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
