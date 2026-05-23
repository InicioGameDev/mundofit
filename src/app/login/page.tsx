'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, ShieldCheck, User, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [accessMode, setAccessMode] = useState<'admin' | 'student'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate short network JWT verification
    setTimeout(() => {
      setLoading(false);
      if (accessMode === 'admin') {
        router.push('/admin');
      } else {
        router.push('/app-aluno');
      }
    }, 1200);
  };

  return (
    <div className="mesh-bg grid-bg min-h-screen flex items-center justify-center p-4 selection:bg-lime-400 selection:text-black">
      
      {/* 3D glow overlay behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl animate-pulse-glow" />

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/40 p-6 md:p-8 shadow-2xl backdrop-blur-md relative space-y-6">
        
        {/* Logo and branding */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-lime-400 to-emerald-500 glow-lime">
            <Dumbbell className="h-5 w-5 text-black font-extrabold" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">MundoFit PRO</h2>
          <p className="text-[11px] text-slate-400">Entre na plataforma de gestão fitness de alta performance.</p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/5 bg-slate-950 p-1 text-xs">
          <button
            onClick={() => { setAccessMode('admin'); setEmail('contato@ironfit.com'); }}
            className={`flex items-center justify-center gap-1.5 rounded py-2 font-semibold border transition duration-200 ${
              accessMode === 'admin' 
                ? 'bg-lime-400/10 text-lime-400 border-lime-400/25 shadow-sm' 
                : 'text-slate-400 hover:text-white border-transparent'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Administrador</span>
          </button>
          
          <button
            onClick={() => { setAccessMode('student'); setEmail('fernanda.vas@gmail.com'); }}
            className={`flex items-center justify-center gap-1.5 rounded py-2 font-semibold border transition duration-200 ${
              accessMode === 'student' 
                ? 'bg-lime-400/10 text-lime-400 border-lime-400/25 shadow-sm' 
                : 'text-slate-400 hover:text-white border-transparent'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Aluno</span>
          </button>
        </div>

        {/* Login form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-400 mb-1.5">Endereço de E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={accessMode === 'admin' ? 'contato@ironfit.com' : 'aluno@gmail.com'}
              className="w-full rounded-lg border border-white/5 bg-slate-950 p-3 outline-none focus:border-lime-400/50 text-white font-semibold"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block font-bold text-slate-400">Senha de Acesso</label>
              <a href="#" className="text-[10px] text-lime-400 font-bold hover:underline">Esqueceu?</a>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/5 bg-slate-950 p-3 outline-none focus:border-lime-400/50 text-white font-semibold pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-lime-400 to-emerald-500 py-3 text-xs font-black text-black hover:opacity-95 transition shadow glow-lime"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Demo Mode credentials warning */}
        <div className="rounded border border-lime-400/10 bg-lime-400/5 p-3 text-[10px] text-slate-400 space-y-1 leading-relaxed">
          <p className="font-bold text-lime-400 flex items-center gap-1"><Sparkles className="h-3 w-3 fill-lime-400" /> Modo de Demonstração Ativo:</p>
          <p>Credenciais pré-carregadas. Basta escolher o modo de acesso (Administrador ou Aluno) e clicar em entrar para simular o login.</p>
        </div>

      </div>

    </div>
  );
}
