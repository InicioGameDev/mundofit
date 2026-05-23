/**
 * @author Carlos Henrique Ferreira
 * @description MundoFit PRO - Plataforma SaaS de Gestão Fitness Inteligente
 */

import type { Metadata } from 'next';
import { FitFlowProvider } from '@/context/FitFlowContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'MundoFit PRO - Plataforma SaaS de Gestão Fitness Inteligente',
  description: 'Modernize sua academia, box ou estúdio. Gestão financeira de alta performance, treino inteligente com IA, aplicativos móveis para alunos e automação PIX em uma única plataforma.',
  keywords: 'gestão fitness, software academia, mundo fit, erp academia, treinos ia, pix academia, studio pilates',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased font-sans" suppressHydrationWarning>
        <FitFlowProvider>
          {children}
        </FitFlowProvider>
      </body>
    </html>
  );
}
