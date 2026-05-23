/**
 * @author Carlos Henrique Ferreira
 * @description MundoFit PRO - Plataforma SaaS de Gestão Fitness Inteligente
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Dumbbell, Users, DollarSign, Smartphone, Target, TrendingUp, 
  Bot, Calendar, QrCode, ShieldCheck, Check, ChevronDown, 
  ChevronUp, ArrowRight, Zap, Play, Star, MessageSquare 
} from 'lucide-react';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activeTab, setActiveTab] = useState<'students' | 'workouts' | 'financial' | 'mobile'>('students');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const featureTabs = {
    students: {
      title: 'Gestão Inteligente de Alunos',
      description: 'Cadastre alunos, tire fotos online, anexe contratos digitais e acompanhe o status financeiro em tempo real. Veja o histórico de frequências, avaliações físicas e evolução antropométrica com gráficos gerados na hora.',
      icon: Users,
      kpis: [
        { label: 'Matrículas Rápidas', value: '< 60s' },
        { label: 'Retenção Média', value: '94.8%' },
        { label: 'Status Visuais', value: 'Ativo/Atrasado' }
      ],
      mockup: (
        <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-slate-500">fitflow.io/admin/alunos</span>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Fernanda Vasconcelos', type: 'Plano Anual', status: 'Ativo', color: 'bg-green-500/10 text-green-400' },
              { name: 'Gabriel Siqueira', type: 'Plano Mensal', status: 'Inadimplente', color: 'bg-red-500/10 text-red-400' },
              { name: 'Mariana Duarte', type: 'Plano Trimestral', status: 'Ativo', color: 'bg-green-500/10 text-green-400' }
            ].map((stu, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 p-3 transition hover:bg-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 font-bold text-xs text-white">
                    {stu.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{stu.name}</h4>
                    <p className="text-[10px] text-slate-400">{stu.type}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${stu.color}`}>
                  {stu.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    workouts: {
      title: 'Prescrição de Treino & Copiloto IA',
      description: 'Chega de fichas de papel rasgadas. Monte treinos completos em segundos escolhendo em nossa biblioteca de exercícios. Quer otimizar seu tempo? Use nosso assistente de IA integrado para gerar fichas altamente personalizadas baseadas no objetivo, nível e biotipo do aluno.',
      icon: Dumbbell,
      kpis: [
        { label: 'Biblioteca', value: '150+ Exercícios' },
        { label: 'Geração por IA', value: '< 3 segundos' },
        { label: 'Evolução de Cargas', value: 'Automática' }
      ],
      mockup: (
        <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-lime-400" />
              <span className="text-xs font-bold text-white">Pronto para Gerar (AI Engine)</span>
            </div>
            <span className="rounded bg-lime-400/10 px-2 py-0.5 text-[9px] font-bold text-lime-400">Ativo</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="rounded bg-white/5 p-2 text-[10px] text-slate-300">
              🤖 <span className="font-semibold text-white">Configurações selecionadas:</span> Hipertrofia • Membros Inferiores • Intermediário.
            </div>
            <div className="rounded border border-lime-400/20 bg-lime-400/5 p-2">
              <h5 className="font-bold text-lime-400">Agachamento Livre</h5>
              <p className="text-[10px] text-slate-300">4 séries x 12 repetições • Carga inicial: 30kg • 60s descanso</p>
            </div>
            <div className="rounded border border-white/5 bg-white/5 p-2">
              <h5 className="font-bold text-white">Leg Press 45°</h5>
              <p className="text-[10px] text-slate-400">4 séries x 12 repetições • Carga inicial: 120kg • 90s descanso</p>
            </div>
          </div>
        </div>
      )
    },
    financial: {
      title: 'Controle Financeiro e PIX Automático',
      description: 'Monitore seu faturamento recorrente (MRR), inadimplência e fluxo de caixa em tempo real. O MundoFit PRO gera cobranças automaticamente e envia o QR Code do PIX. Quando o aluno paga, a catraca/sistema libera a entrada na hora e muda o status para pago.',
      icon: DollarSign,
      kpis: [
        { label: 'Redução de Inadimplência', value: '-65%' },
        { label: 'Confirmação PIX', value: 'Imediata' },
        { label: 'Relatórios de Lucro', value: 'Exportáveis' }
      ],
      mockup: (
        <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4 shadow-2xl backdrop-blur-md">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Receita Recorrente Mensal</span>
            <span className="text-xs text-lime-400 font-bold">+18% vs mês anterior</span>
          </div>
          <div className="mb-4">
            <h4 className="text-2xl font-extrabold text-white">R$ 24.890,00</h4>
            <div className="mt-2 h-16 w-full overflow-hidden">
              {/* Simple Mock Chart Bar */}
              <div className="flex h-full items-end gap-1.5 pt-4">
                {[40, 55, 45, 65, 80, 70, 95].map((val, idx) => (
                  <div key={idx} className="w-full bg-lime-400 rounded-t transition-all hover:bg-green-400" style={{ height: `${val}%` }} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 rounded bg-white/5 p-2 text-[10px] items-center">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-300">Última mensalidade paga via PIX há 2 min</span>
          </div>
        </div>
      )
    },
    mobile: {
      title: 'Aplicativo do Aluno & Check-in QR Code',
      description: 'Seus alunos terão acesso a um aplicativo moderno de celular (Web-app responsivo). Eles visualizam os treinos, registram as cargas utilizadas, reservam vaga nas aulas presenciais (Pilates, Crossfit, etc.) e geram o QR Code para liberação física na recepção.',
      icon: Smartphone,
      kpis: [
        { label: 'Check-in Ágil', value: 'QR Code Dinâmico' },
        { label: 'Engajamento', value: '+40% de Treinos Concluídos' },
        { label: 'Reservas de Aula', value: 'Na palma da mão' }
      ],
      mockup: (
        <div className="mx-auto max-w-[200px] rounded-3xl border-4 border-slate-800 bg-slate-950 p-3 shadow-2xl">
          <div className="mb-2 flex justify-between items-center px-1">
            <span className="text-[9px] text-slate-500 font-bold">14:04</span>
            <div className="h-3 w-12 rounded-full bg-slate-800" />
            <span className="text-[9px] text-slate-500">100%</span>
          </div>
          <div className="rounded-2xl bg-slate-900 p-2.5 text-center">
            <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-lg bg-white p-1.5">
              {/* Mock QR Code lines using borders */}
              <div className="h-full w-full border-2 border-slate-950 border-dashed opacity-80" />
            </div>
            <p className="text-[9px] font-bold text-white">QR Code de Entrada</p>
            <p className="text-[7px] text-slate-400 mt-0.5">Aproxime do leitor da catraca</p>
            <button className="mt-3 w-full rounded bg-gradient-to-r from-lime-400 to-emerald-500 py-1.5 text-[9px] font-extrabold text-black hover:opacity-90 transition">
              Ver Treino de Hoje
            </button>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="mesh-bg min-h-screen selection:bg-lime-400 selection:text-black">
      {/* 1. Header Navigation */}
      <header className="glass-nav sticky top-0 z-50 transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4 px-6 md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-lime-400 to-emerald-500 glow-lime">
              <Dumbbell className="h-5 w-5 text-black font-extrabold" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-lime-400 bg-clip-text text-transparent">
              MundoFit <span className="text-lime-400">Pro</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <a href="#features" className="transition hover:text-lime-400">Recursos</a>
            <a href="#pix-integration" className="transition hover:text-lime-400">PIX Auto</a>
            <a href="#testimonials" className="transition hover:text-lime-400">Depoimentos</a>
            <a href="#pricing" className="transition hover:text-lime-400">Planos</a>
            <a href="#faq" className="transition hover:text-lime-400">Dúvidas</a>
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition">
              Entrar
            </Link>
            <Link 
              href="/admin" 
              className="group flex items-center gap-1.5 rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 px-5 py-2 text-sm font-extrabold text-black transition hover:opacity-95 shadow glow-lime-sm"
            >
              Acessar Painel
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded border border-white/10 md:hidden"
          >
            <Zap className={`h-5 w-5 ${mobileMenuOpen ? 'text-lime-400 animate-spin' : 'text-white'}`} />
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="border-b border-white/10 bg-slate-950/95 p-6 backdrop-blur-lg md:hidden space-y-4">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-300 hover:text-lime-400">Recursos</a>
            <a href="#pix-integration" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-300 hover:text-lime-400">PIX Auto</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-300 hover:text-lime-400">Depoimentos</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-300 hover:text-lime-400">Planos</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-slate-300 hover:text-lime-400">Dúvidas</a>
            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-center py-2 text-sm font-bold text-slate-300 hover:text-white">
                Entrar
              </Link>
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-center rounded bg-gradient-to-r from-lime-400 to-emerald-500 py-2.5 text-sm font-extrabold text-black hover:opacity-90 transition">
                Acessar Painel
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative px-6 py-20 md:py-32 grid-bg">
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/5 px-4 py-1.5 text-xs font-semibold text-lime-400 glow-lime-sm">
              <Zap className="h-3.5 w-3.5 fill-lime-400 animate-pulse" />
              <span>Próxima Geração de Gestão Fitness</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.1] md:leading-[1.15]">
              O sistema mais completo para decolar sua{' '}
              <span className="bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
                Academia ou Box
              </span>
            </h1>
            <p className="text-base text-slate-400 md:text-lg max-w-2xl mx-auto lg:mx-0">
              Modernize a experiência dos alunos, reduza a inadimplência com faturamento PIX automático, prescreva treinos otimizados por Inteligência Artificial e tenha o controle financeiro total em um painel impressionante.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                href="/admin" 
                className="w-full sm:w-auto text-center rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 px-8 py-4 text-base font-extrabold text-black transition hover:opacity-95 shadow-xl glow-lime-sm"
              >
                Começar Teste Grátis
              </Link>
              <Link 
                href="/app-aluno" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-8 py-4 text-base font-semibold text-white transition"
              >
                <Play className="h-4 w-4 fill-white" />
                Ver App do Aluno
              </Link>
            </div>

            {/* Simulated Live Statistics */}
            <div className="pt-8 border-t border-white/5 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div>
                <h3 className="text-xl md:text-2xl font-extrabold text-lime-400">+150</h3>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Academias Ativas</p>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-extrabold text-lime-400">98.2%</h3>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Taxa de Retenção</p>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-extrabold text-lime-400">R$ 4.8M</h3>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">PIX Processados</p>
              </div>
            </div>
          </div>

          {/* Interactive Mockup Container */}
          <div className="flex-1 w-full max-w-xl lg:max-w-none animate-float">
            <div className="relative rounded-2xl border border-white/10 bg-slate-900/60 p-2.5 shadow-2xl backdrop-blur-md">
              {/* Outer frame styling */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-lime-400 to-emerald-500 opacity-20 blur-md animate-pulse-glow" />
              <div className="relative rounded-xl overflow-hidden bg-slate-950/90 border border-white/5">
                {/* Simulated Header */}
                <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 bg-slate-900/40">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded text-[10px] text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-lime-400" />
                    <span>fitflow.io/admin/dashboard</span>
                  </div>
                  <div className="h-2.5 w-10 rounded bg-slate-800" />
                </div>
                
                {/* Simulated Content */}
                <div className="p-4 md:p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-white/5 p-3">
                      <p className="text-[9px] uppercase tracking-wider text-slate-400">Mensalidades</p>
                      <h4 className="text-lg font-bold text-white mt-1">R$ 14.890</h4>
                      <span className="text-[9px] text-green-400 font-bold">▲ +12%</span>
                    </div>
                    <div className="rounded-lg bg-white/5 p-3">
                      <p className="text-[9px] uppercase tracking-wider text-slate-400">Check-ins Hoje</p>
                      <h4 className="text-lg font-bold text-white mt-1">84</h4>
                      <span className="text-[9px] text-lime-400 font-bold">▲ +8%</span>
                    </div>
                    <div className="rounded-lg bg-white/5 p-3">
                      <p className="text-[9px] uppercase tracking-wider text-slate-400">Novos Alunos</p>
                      <h4 className="text-lg font-bold text-white mt-1">36</h4>
                      <span className="text-[9px] text-green-400 font-bold">▲ +22%</span>
                    </div>
                  </div>

                  {/* Simulated Chart */}
                  <div className="rounded-lg bg-white/5 p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-white">Fluxo de Caixa (Mensal)</span>
                      <div className="flex gap-2 text-[9px] text-slate-400">
                        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-lime-400" /> Faturamento</span>
                        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Lucro Líquido</span>
                      </div>
                    </div>
                    <div className="h-28 flex items-end gap-2 pt-4 border-b border-white/5 pb-1">
                      {[30, 45, 60, 50, 75, 90, 85, 100].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end h-full gap-1">
                          <div className="w-full bg-emerald-500/40 rounded-t" style={{ height: `${h * 0.6}%` }} />
                          <div className="w-full bg-lime-400 rounded-t" style={{ height: `${h * 0.9}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Clients Logos Section */}
      <section className="border-y border-white/5 bg-slate-950/50 py-8 text-center">
        <p className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-semibold">
          Parceiro oficial das melhores marcas fitness
        </p>
        <div className="mx-auto max-w-6xl px-6 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale contrast-200">
          {['Iron Gym', 'Legacy Box', 'Studio Pilates 10', 'Performance Club', 'Action Box'].map((name, i) => (
            <span key={i} className="text-lg md:text-xl font-extrabold tracking-wider text-slate-300">
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* 4. Core Features Tabs Section */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20 md:py-32 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
            Tudo o que sua academia precisa,{' '}
            <span className="bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
              sem complicação
            </span>
          </h2>
          <p className="text-slate-400">
            Diga adeus a planilhas complicadas e sistemas lentos do passado. O MundoFit PRO une as melhores ferramentas de gestão em uma única plataforma incrivelmente veloz.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {(Object.keys(featureTabs) as Array<keyof typeof featureTabs>).map((key) => {
            const tab = featureTabs[key];
            const Icon = tab.icon;
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition border duration-300 ${
                  isActive 
                    ? 'bg-lime-400/10 text-lime-400 border-lime-400/35 shadow-[0_0_12px_-3px_rgba(52,211,153,0.2)]' 
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border-transparent'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.title.split(' ')[0]} {tab.title.split(' ')[1] || ''}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-6 md:p-12 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
                {React.createElement(featureTabs[activeTab].icon, { className: 'h-6 w-6' })}
              </div>
              <h3 className="text-2xl font-bold text-white md:text-3xl">
                {featureTabs[activeTab].title}
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                {featureTabs[activeTab].description}
              </p>

              {/* Specific KPIs */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                {featureTabs[activeTab].kpis.map((kpi, idx) => (
                  <div key={idx}>
                    <h4 className="text-lg font-bold text-lime-400">{kpi.value}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">{kpi.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full max-w-md">
              {featureTabs[activeTab].mockup}
            </div>
          </div>
        </div>
      </section>

      {/* 5. PIX Auto Highlight Section */}
      <section id="pix-integration" className="border-t border-white/5 bg-slate-950/30 py-20 px-6">
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <span className="rounded bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">Redução de Inadimplência</span>
            <h2 className="text-3xl font-extrabold text-white md:text-4xl">
              Faturamento Recorrente Inteligente via PIX
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Evite taxas abusivas de cartão de crédito. Com nossa integração de cobrança via PIX, o sistema gera mensalidades recorrentes automaticamente. 
            </p>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-lime-400/20 text-lime-400">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>Disparo automático de cobranças via e-mail e WhatsApp</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-lime-400/20 text-lime-400">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>Confirmação e liquidação em lote em menos de 2 segundos</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-lime-400/20 text-lime-400">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>Liberação imediata no aplicativo do aluno e catraca física</span>
              </li>
            </ul>
          </div>
          <div className="flex-1 w-full max-w-md bg-gradient-to-tr from-slate-900 to-slate-950 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-sm font-bold text-white">Cobrança Gerada</span>
              <span className="rounded bg-yellow-500/10 px-2.5 py-0.5 text-xs font-semibold text-yellow-400">Aguardando PIX</span>
            </div>
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto h-36 w-36 rounded-xl bg-white p-2 border border-slate-700 shadow-inner flex items-center justify-center">
                {/* SVG Mock QR Code */}
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none" className="text-slate-950">
                  <path d="M10 10h30v30H10zm0 50h30v30H10zm50-50h30v30H60z" fill="currentColor" />
                  <path d="M20 20h10v10H20zm0 50h10v10H20zm50-50h10v10H70z" fill="white" />
                  <path d="M50 50h10v10H50zm10 10h10v10H60zm10-10h20v10H70zm20 20h10v10H90zm-30 10h10v10H60zm10 10h20v10H70z" fill="currentColor" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-extrabold text-white">R$ 99,90</p>
                <p className="text-[10px] text-slate-400">Vencimento: Hoje • Beneficiário: Iron Fit Club</p>
              </div>
            </div>
            <button className="w-full rounded bg-emerald-500 hover:bg-emerald-400 py-3 text-xs font-bold text-white transition shadow-lg shadow-emerald-950/20">
              Copiar Código PIX Copia e Cola
            </button>
          </div>
        </div>
      </section>

      {/* 6. Plans/Pricing Section */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20 md:py-32 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="rounded-full border border-lime-400/20 bg-lime-400/5 px-4 py-1 text-xs font-bold text-lime-400">Preços Justos</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Escolha o plano ideal para o seu negócio
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Sem taxas escondidas. Cancele ou altere de plano a qualquer momento.
          </p>

          {/* Monthly / Annual Selector Toggle */}
          <div className="inline-flex items-center gap-1 rounded-full border border-white/5 bg-slate-950/60 p-1 mt-6">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-full px-4 py-2 text-xs font-semibold border transition duration-200 ${
                billingCycle === 'monthly' 
                  ? 'bg-lime-400/10 text-lime-400 border-lime-400/25 shadow-sm' 
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              Mensal
            </button>
            <button 
              onClick={() => setBillingCycle('annual')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold border transition duration-200 ${
                billingCycle === 'annual' 
                  ? 'bg-lime-400/10 text-lime-400 border-lime-400/25 shadow-sm' 
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
            >
              Anual
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-black text-emerald-400">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: Startup */}
          <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-8 backdrop-blur-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white">Startup</h3>
                <p className="text-xs text-slate-400 mt-1">Para estúdios e boxes iniciantes.</p>
              </div>
              <div className="py-2 border-y border-white/5">
                <span className="text-4xl font-extrabold text-white">
                  R$ {billingCycle === 'annual' ? '99' : '129'}
                </span>
                <span className="text-slate-500 text-xs"> /mês</span>
                {billingCycle === 'annual' && <p className="text-[10px] text-emerald-400 font-bold mt-1">Cobrado anualmente (R$ 1.188)</p>}
              </div>
              <ul className="space-y-4 text-xs text-slate-300">
                {['Até 100 alunos ativos', 'Gestão financeira básica', 'Fichas de treino clássicas', 'Aplicativo do Aluno básico', 'Suporte via e-mail'].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-lime-400" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/admin" className="w-full text-center rounded-lg border border-white/10 bg-white/5 py-3 text-xs font-bold text-white hover:bg-white/10 transition block">
              Iniciar Teste
            </Link>
          </div>

          {/* Card 2: Pro (Scale) */}
          <div className="rounded-2xl border border-lime-400/40 bg-slate-900/40 p-8 shadow-[0_0_30px_-5px_rgba(52,211,153,0.15)] relative space-y-6 flex flex-col justify-between">
            <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 px-3 py-1 text-[9px] font-extrabold uppercase text-black glow-lime-sm">
              Mais Vendido
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white">Pro (Scale)</h3>
                <p className="text-xs text-slate-400 mt-1">Ideal para academias de médio porte.</p>
              </div>
              <div className="py-2 border-y border-white/5">
                <span className="text-4xl font-extrabold text-white">
                  R$ {billingCycle === 'annual' ? '189' : '239'}
                </span>
                <span className="text-slate-500 text-xs"> /mês</span>
                {billingCycle === 'annual' && <p className="text-[10px] text-emerald-400 font-bold mt-1">Cobrado anualmente (R$ 2.268)</p>}
              </div>
              <ul className="space-y-4 text-xs text-slate-300">
                {['Alunos ativos ILIMITADOS', 'PIX automático com liberação imediata', 'Copiloto de IA Gerador de Treinos', 'Estatísticas e KPIs avançados', 'CRM / Kanban integrado de leads', 'Suporte prioritário via WhatsApp'].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-lime-400" />
                    <span className="font-semibold text-white">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/admin" className="w-full text-center rounded-lg bg-lime-400 py-3 text-xs font-bold text-black hover:bg-lime-300 transition block shadow">
              Experimentar Grátis
            </Link>
          </div>

          {/* Card 3: Enterprise */}
          <div className="rounded-2xl border border-white/5 bg-slate-900/30 p-8 backdrop-blur-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white">Redes / Enterprise</h3>
                <p className="text-xs text-slate-400 mt-1">Para grandes redes e marcas multi-unidades.</p>
              </div>
              <div className="py-2 border-y border-white/5">
                <span className="text-4xl font-extrabold text-white">
                  R$ {billingCycle === 'annual' ? '359' : '449'}
                </span>
                <span className="text-slate-500 text-xs"> /mês</span>
                {billingCycle === 'annual' && <p className="text-[10px] text-emerald-400 font-bold mt-1">Cobrado anualmente (R$ 4.308)</p>}
              </div>
              <ul className="space-y-4 text-xs text-slate-300">
                {['Gestão Multi-unidades consolidada', 'Customização completa da marca (White-label)', 'Integração de catraca física física API', 'Relatórios financeiros personalizados', 'Gerente de contas exclusivo'].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-lime-400" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/admin" className="w-full text-center rounded-lg border border-white/10 bg-white/5 py-3 text-xs font-bold text-white hover:bg-white/10 transition block">
              Falar com Vendas
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Testimonials Section */}
      <section id="testimonials" className="border-t border-white/5 bg-slate-950/20 py-20 px-6">
        <div className="mx-auto max-w-7xl space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold text-white md:text-4xl">
              Quem usa o MundoFit PRO aprova!
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Descubra como gestores de todo o país economizaram tempo e aumentaram o faturamento das suas academias.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "O MundoFit PRO revolucionou meu box. A geração de treinos por IA economiza mais de 10 horas semanais do nosso professor de musculação, e o app do aluno é fantástico. Recomendamos fortemente!",
                name: "Renato Silveira",
                role: "Proprietário do Legacy Cross Box",
                stars: 5,
                photo: "R"
              },
              {
                text: "A inadimplência era nossa dor de cabeça. Com o faturamento via PIX automatizado, a nossa inadimplência caiu para menos de 3% no segundo mês. A entrada na catraca física liberou perfeitamente.",
                name: "Patricia Mendes",
                role: "Gestora da Studio Flow Pilates",
                stars: 5,
                photo: "P"
              },
              {
                text: "Interface rápida, limpa e extremamente moderna. Meus alunos adoram marcar as aulas de Spinning diretamente no app e ver a evolução física com gráficos de peso e bioimpedância.",
                name: "Thiago Albuquerque",
                role: "Dono da Iron Gym Club",
                stars: 5,
                photo: "T"
              }
            ].map((testi, i) => (
              <div key={i} className="rounded-xl border border-white/5 bg-slate-900/40 p-6 space-y-4 backdrop-blur-sm">
                <div className="flex gap-1 text-lime-400">
                  {Array.from({ length: testi.stars }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-lime-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-xs md:text-sm italic leading-relaxed">
                  "{testi.text}"
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-lime-400 to-emerald-500 font-extrabold text-xs text-black">
                    {testi.photo}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{testi.name}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold">{testi.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section id="faq" className="mx-auto max-w-4xl px-6 py-20 md:py-32 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-extrabold text-white md:text-4xl">
            Perguntas Frequentes
          </h2>
          <p className="text-slate-400 text-sm">
            Tem alguma dúvida sobre o funcionamento do MundoFit PRO? Respondemos às principais perguntas abaixo.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Como funciona a integração de PIX automático?",
              a: "O sistema gera um QR Code PIX dinâmico exclusivo para cada mensalidade de seus alunos. Assim que o pagamento é feito pelo banco do aluno, nosso sistema recebe uma notificação instantânea em lote (Webhook) e liquida a fatura, liberando o check-in do aluno automaticamente."
            },
            {
              q: "O gerador de treinos por IA é ilimitado?",
              a: "Sim! No plano Pro (Scale) e Enterprise você pode gerar quantos treinos inteligentes quiser por IA para seus alunos. O assistente analisa o nível, foco de membros e os objetivos informados para prescrever séries, cargas e tempos de descanso ideais."
            },
            {
              q: "Posso gerenciar mais de uma unidade com a mesma assinatura?",
              a: "O plano Enterprise oferece suporte completo para Redes (Multi-tenant multi-unidades), permitindo consolidar os relatórios financeiros e de alunos das suas filiais em uma única conta unificada."
            },
            {
              q: "Preciso assinar um plano antes de testar?",
              a: "Não! Você pode acessar o painel de demonstração e criar seus dados fictícios clicando em 'Acessar Painel' para testar todas as funcionalidades premium do sistema gratuitamente."
            }
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-slate-900/20 backdrop-blur-sm overflow-hidden">
              <button 
                onClick={() => toggleFaq(i)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-white hover:text-lime-400 transition"
              >
                <span>{item.q}</span>
                {openFaq === i ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
              </button>
              {openFaq === i && (
                <div className="p-5 pt-0 text-xs text-slate-400 leading-relaxed border-t border-white/5 bg-slate-950/20">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="border-t border-white/5 bg-slate-950 py-12 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400">
              <Dumbbell className="h-4 w-4 text-black font-extrabold" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-white">
              MundoFit <span className="text-lime-400">Pro</span>
            </span>
          </div>

          <p className="text-[11px] text-slate-500 font-semibold">
            &copy; 2026 MundoFit PRO Inc. Desenvolvido com Next.js 15, React, TypeScript e Tailwind CSS. Todos os direitos reservados.
          </p>

          <div className="flex gap-6 text-[11px] font-semibold text-slate-400">
            <a href="#" className="hover:text-lime-400">Termos</a>
            <a href="#" className="hover:text-lime-400">Privacidade</a>
            <a href="/login" className="hover:text-lime-400">Admin Login</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
