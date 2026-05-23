'use client';

import React, { useState } from 'react';
import { useFitFlow } from '@/context/FitFlowContext';
import { 
  Settings, Shield, Smartphone, Heart, Sparkles, 
  Save, AlertTriangle, Key, Landmark, Database, HelpCircle 
} from 'lucide-react';

export default function SettingsAdmin() {
  const { tenant, currentUser } = useFitFlow();

  // Settings states
  const [gymName, setGymName] = useState(tenant.name);
  const [gymSlug, setGymSlug] = useState(tenant.slug);
  const [primaryColor, setPrimaryColor] = useState(tenant.accentColor);
  const [pixWebhook, setPixWebhook] = useState('https://mundofitpro.com/api/v1/billing/webhook-pix');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6 text-lime-400" />
            <span>Configurações do Sistema</span>
          </h2>
          <p className="text-xs text-slate-400">Gerencie a identidade visual da sua marca, chaves de API e preferências multi-tenant.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: General Profile and Branding */}
        <div className="lg:col-span-2 space-y-6">
          
          <form onSubmit={handleSaveSettings} className="rounded-xl border border-white/5 bg-slate-900/30 p-6 backdrop-blur-sm space-y-6">
            <div className="border-b border-white/5 pb-3">
              <h3 className="text-sm font-extrabold text-white">Identidade da Academia (Multi-Tenant)</h3>
              <p className="text-[10px] text-slate-500">Altere o nome e o domínio de acesso dos seus alunos.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1.5">Nome Fantasia</label>
                <input 
                  type="text" 
                  required
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  className="w-full rounded-lg border border-white/5 bg-slate-900/60 p-2.5 outline-none focus:border-lime-400/50 text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1.5">Subdomínio / Slug único</label>
                <div className="flex items-center rounded-lg border border-white/5 bg-slate-900/60 overflow-hidden px-2.5">
                  <input 
                    type="text" 
                    required
                    value={gymSlug}
                    onChange={(e) => setGymSlug(e.target.value)}
                    className="w-full bg-transparent border-none outline-none py-2.5 text-white font-medium focus:ring-0"
                  />
                  <span className="text-[10px] text-slate-500 font-bold shrink-0">.mundofitpro.com</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="block font-bold text-slate-400 mb-1.5">Cor Principal da Interface</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-8 w-8 rounded border border-white/5 bg-transparent cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-slate-300 font-bold">{primaryColor}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 flex justify-between items-center">
              {saveSuccess && (
                <span className="text-xs font-bold text-lime-400 flex items-center gap-1">
                  <Sparkles className="h-4 w-4 animate-pulse fill-lime-400" /> Configurações salvas com sucesso!
                </span>
              )}
              <button 
                type="submit"
                className="ml-auto flex items-center gap-1.5 rounded-lg bg-lime-400 px-6 py-2.5 text-xs font-black text-black hover:bg-lime-300 transition shadow glow-lime-sm"
              >
                <Save className="h-4 w-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </form>

          {/* Integration API Credentials */}
          <div className="rounded-xl border border-white/5 bg-slate-900/30 p-6 backdrop-blur-sm space-y-6">
            <div className="border-b border-white/5 pb-3">
              <h3 className="text-sm font-extrabold text-white">Chaves de API & Webhooks</h3>
              <p className="text-[10px] text-slate-500">Configure integrações de faturamento PIX e notificações.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1.5">Webhook de Confirmação PIX (Banco)</label>
                <input 
                  type="text" 
                  value={pixWebhook}
                  onChange={(e) => setPixWebhook(e.target.value)}
                  className="w-full rounded-lg border border-white/5 bg-slate-900/60 p-2.5 outline-none focus:border-lime-400/50 text-slate-300 font-mono text-[10px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Token de Acesso Integrado</label>
                  <div className="flex items-center gap-2 rounded bg-white/5 border border-white/5 px-2.5 py-2">
                    <Key className="h-3.5 w-3.5 text-slate-500" />
                    <span className="font-mono text-[9px] text-slate-400">sk_live_51M087Fllw...</span>
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Status do Gateway</label>
                  <div className="flex items-center gap-2 rounded bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-2">
                    <Landmark className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400">Banco PIX Ativo (Produção)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Multi-tenant Plan billing Status */}
        <div className="space-y-6">
          
          <div className="rounded-xl border border-white/5 bg-slate-900/30 p-6 backdrop-blur-sm space-y-6">
            <div className="border-b border-white/5 pb-3">
              <h3 className="text-sm font-extrabold text-white">Sua Assinatura SaaS</h3>
              <p className="text-[10px] text-slate-500">Dados do seu plano MundoFit PRO contratado.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="rounded-lg border-2 border-lime-400 bg-lime-400/5 p-4 text-center space-y-2 glow-lime">
                <span className="rounded bg-lime-400 px-2.5 py-0.5 text-[9px] font-black uppercase text-black">ATIVO</span>
                <h4 className="text-base font-extrabold text-white">Plano Pro (Scale)</h4>
                <p className="text-[10px] text-slate-400">Sua próxima fatura vence em 10/06/2026</p>
                <div className="h-px bg-white/10 my-2" />
                <p className="text-[11px] font-extrabold text-lime-400">R$ 189,00 /mês</p>
              </div>

              <div className="space-y-2 text-[10px] text-slate-400">
                <p className="flex justify-between"><span>Usuários Administrativos:</span> <span className="text-white font-bold">3 / 5</span></p>
                <p className="flex justify-between"><span>Unidades Ativas:</span> <span className="text-white font-bold">1 unidade</span></p>
                <p className="flex justify-between"><span>Banco de Dados Prisma:</span> <span className="text-emerald-400 font-bold flex items-center gap-1"><Database className="h-3 w-3" /> Conectado</span></p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
