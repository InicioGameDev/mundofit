'use client';

import React, { useState } from 'react';
import { useFitFlow } from '@/context/FitFlowContext';
import { 
  MessageSquare, Plus, ArrowRight, Trash2, CheckCircle, 
  Send, Sparkles, PhoneCall, Globe, Users, X, ChevronRight, MessageCircle 
} from 'lucide-react';
import { Lead } from '@/types';

// Ícone do Instagram customizado para evitar incompatibilidade da biblioteca de ícones
const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function CRMAdmin() {
  const { leads, addLead, updateLeadStatus } = useFitFlow();

  // Modals state
  const [addLeadModalOpen, setAddLeadModalOpen] = useState(false);
  const [detailsLeadId, setDetailsLeadId] = useState<string | null>(null);

  // New Lead form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [origin, setOrigin] = useState('Instagram');
  const [notes, setNotes] = useState('');

  const selectedLead = leads.find(l => l.id === detailsLeadId);

  // 1. Kanban stages definitions
  const stages: Array<{ id: Lead['status']; label: string; color: string; bg: string }> = [
    { id: 'LEAD', label: 'Novos Leads', color: 'text-cyan-400 border-cyan-500/20', bg: 'bg-cyan-500/5' },
    { id: 'CONTACT', label: 'Contato Iniciado', color: 'text-yellow-400 border-yellow-500/20', bg: 'bg-yellow-500/5' },
    { id: 'VISIT', label: 'Visitas Agendadas', color: 'text-purple-400 border-purple-500/20', bg: 'bg-purple-500/5' },
    { id: 'CONVERTED', label: 'Convertidos / Alunos', color: 'text-green-400 border-green-500/20', bg: 'bg-green-500/5' }
  ];

  const getLeadsInStage = (stageId: Lead['status']) => {
    return leads.filter(l => l.status === stageId);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    addLead({
      name,
      phone,
      email,
      origin,
      status: 'LEAD',
      notes: notes || undefined
    });

    // Reset Form
    setName('');
    setPhone('');
    setEmail('');
    setOrigin('Instagram');
    setNotes('');
    setAddLeadModalOpen(false);
  };

  const getOriginIcon = (source: string) => {
    if (source === 'Instagram') return <Instagram className="h-3.5 w-3.5 text-pink-400" />;
    if (source === 'WhatsApp') return <MessageCircle className="h-3.5 w-3.5 text-green-400" />;
    if (source === 'Google') return <Globe className="h-3.5 w-3.5 text-blue-400" />;
    return <Users className="h-3.5 w-3.5 text-slate-400" />;
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-lime-400" />
            <span>Funil de Leads (CRM)</span>
          </h2>
          <p className="text-xs text-slate-400">Capture contatos das redes sociais, acompanhe o funil de vendas e dispare convites.</p>
        </div>
        <button 
          onClick={() => setAddLeadModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-lime-400 px-4 py-2.5 text-xs font-bold text-black hover:bg-lime-300 transition shadow glow-lime-sm shrink-0 self-start sm:self-center"
        >
          <Plus className="h-4 w-4" />
          <span>Capturar Lead</span>
        </button>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {stages.map((stage) => {
          const stageLeads = getLeadsInStage(stage.id);
          
          return (
            <div key={stage.id} className="rounded-xl border border-white/5 bg-slate-900/30 p-4 space-y-4 backdrop-blur-sm h-[70vh] flex flex-col min-h-[400px]">
              
              {/* Stage Header */}
              <div className={`flex justify-between items-center border-b border-white/5 pb-2 shrink-0`}>
                <span className={`text-[10px] font-black uppercase tracking-wider ${stage.color}`}>
                  {stage.label}
                </span>
                <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-bold text-slate-400">
                  {stageLeads.length}
                </span>
              </div>

              {/* Stage Body list cards */}
              <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar py-1">
                {stageLeads.length === 0 ? (
                  <p className="text-center py-10 text-[10px] text-slate-600 italic">Sem contatos nesta etapa.</p>
                ) : (
                  stageLeads.map((lead) => (
                    <div 
                      key={lead.id} 
                      onClick={() => setDetailsLeadId(lead.id)}
                      className="rounded-lg bg-slate-950 border border-white/5 p-4 hover:border-lime-400/30 transition duration-150 cursor-pointer space-y-3 shadow relative overflow-hidden group"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white leading-snug group-hover:text-lime-400 transition">{lead.name}</h4>
                        <p className="text-[9px] text-slate-500 font-semibold">{lead.phone}</p>
                      </div>

                      <div className="flex justify-between items-center text-[9px] border-t border-white/5 pt-2">
                        <div className="flex items-center gap-1.5 font-bold text-slate-400">
                          {getOriginIcon(lead.origin)}
                          <span>{lead.origin}</span>
                        </div>

                        {/* Move action click */}
                        {stage.id !== 'CONVERTED' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextStage = 
                                stage.id === 'LEAD' ? 'CONTACT' : stage.id === 'CONTACT' ? 'VISIT' : 'CONVERTED';
                              updateLeadStatus(lead.id, nextStage);
                            }}
                            className="h-5 w-5 rounded bg-white/5 hover:bg-lime-400 text-slate-400 hover:text-black flex items-center justify-center transition border border-white/5"
                            title="Avançar Funil"
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL: Novo Lead Form */}
      {addLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-950 p-6 shadow-2xl relative">
            <button 
              onClick={() => setAddLeadModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
              <Sparkles className="h-5 w-5 text-lime-400" />
              <h3 className="text-sm font-bold text-white">Capturar Novo Lead</h3>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1.5">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Nome do contato..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-white/5 bg-slate-900/60 p-2.5 outline-none focus:border-lime-400/50 text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">WhatsApp / Celular</label>
                  <input 
                    type="text" 
                    required
                    placeholder="(11) 98888-8888"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-white/5 bg-slate-900/60 p-2.5 outline-none focus:border-lime-400/50 text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">Origem da Prospecção</label>
                  <select 
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full rounded-lg border border-white/5 bg-slate-900/60 p-2.5 outline-none focus:border-lime-400/50 text-white font-medium"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="WhatsApp">WhatsApp Direto</option>
                    <option value="Google">Google / Busca</option>
                    <option value="Indicação">Indicação Aluno</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1.5">E-mail (Opcional)</label>
                <input 
                  type="email" 
                  placeholder="contato@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/5 bg-slate-900/60 p-2.5 outline-none focus:border-lime-400/50 text-white font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1.5">Anotações Iniciais</label>
                <textarea 
                  placeholder="Perguntou sobre valores dos planos trimestrais..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-white/5 bg-slate-900/60 p-2.5 outline-none focus:border-lime-400/50 text-slate-300 font-medium"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full rounded-lg bg-lime-400 py-3 text-xs font-bold text-black hover:bg-lime-300 transition shadow glow-lime-sm"
                >
                  Registrar Oportunidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL/DRAWER: Lead details & Whatsapp text copy */}
      {detailsLeadId && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-950 p-6 shadow-2xl relative space-y-6">
            <button 
              onClick={() => setDetailsLeadId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Users className="h-5 w-5 text-lime-400" />
              <h3 className="text-sm font-bold text-white">Ficha de Oportunidade</h3>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Contato</p>
                <p className="text-sm font-bold text-white mt-0.5">{selectedLead.name}</p>
                <p className="text-slate-400">{selectedLead.phone} • {selectedLead.email || 'Sem e-mail'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded p-2 border border-white/5">
                  <p className="text-[8px] text-slate-500 uppercase font-black">Rede Origem</p>
                  <p className="font-bold text-white mt-0.5">{selectedLead.origin}</p>
                </div>
                <div className="bg-white/5 rounded p-2 border border-white/5">
                  <p className="text-[8px] text-slate-500 uppercase font-black">Estágio de Vendas</p>
                  <p className="font-bold text-lime-400 mt-0.5">{selectedLead.status}</p>
                </div>
              </div>

              {selectedLead.notes && (
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Feedback / Histórico</p>
                  <p className="text-slate-300 italic bg-white/5 rounded p-2.5 border border-white/5 mt-1">"{selectedLead.notes}"</p>
                </div>
              )}
            </div>

            {/* Broadcast pre-written WhatsApp template */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <span className="text-[10px] uppercase text-lime-400 font-black tracking-wider flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 fill-lime-400" /> WhatsApp Direct Pitch
              </span>
              
              <div className="rounded border border-lime-400/20 bg-lime-400/5 p-3 text-[10px] text-slate-300 font-medium">
                "Olá, <span className="font-bold text-white">{selectedLead.name.split(' ')[0]}</span>! Vimos seu interesse nas instalações da Iron Fit Club através do {selectedLead.origin}. Criamos um cupom VIP de 15% de desconto no plano trimestral + avaliação física inclusa no primeiro mês. Que tal agendarmos sua visita hoje?"
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const text = `Olá, ${selectedLead.name.split(' ')[0]}! Vimos seu interesse nas instalações da Iron Fit Club...`;
                    navigator.clipboard.writeText(text);
                    setDetailsLeadId(null);
                  }}
                  className="w-full flex items-center justify-center gap-1 rounded bg-lime-400 py-3 text-xs font-bold text-black hover:bg-lime-300 transition shadow"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Copiar Mensagem Convite</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
