'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import {
  ArrowRight, Play, Check, RefreshCw, Shield,
  HelpCircle, Sliders, Eye, FileText, BarChart2, Pen,
  Mail,
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const ctaHref = isAuthenticated ? '/workspace' : '/login';

  return (
    <div className="min-h-screen bg-[#f4f5f7] font-sans text-[#1a1a2e] selection:bg-teal-100">

      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2d6b5e] rounded-xl flex items-center justify-center font-serif font-bold text-white text-sm shadow-md">
            T
          </div>
          <span className="text-lg font-bold tracking-tight text-[#1a1a2e]">TaxCopilot</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#555]">
          <Link href="/" className="hover:text-[#4a8f7f] transition-colors">Home</Link>
          <Link href="#features" className="hover:text-[#4a8f7f] transition-colors">Features</Link>
          <Link href="#workflow" className="hover:text-[#4a8f7f] transition-colors">How it Works</Link>
          <Link href="#pricing" className="hover:text-[#4a8f7f] transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href={ctaHref} className="text-sm font-medium text-[#555] hover:text-[#4a8f7f] transition-colors px-2">
            Login
          </Link>
          <Link href={ctaHref} className="bg-[#2d6b5e] hover:bg-[#235549] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-8 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 bg-[#f9d5c5] text-[#c05c30] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#c05c30] rounded-full animate-pulse" />
            Now with GST Portal Sync
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-[#1a1a2e] mb-6">
            Automated{' '}
            <span className="text-[#4a8f7f]">Tax<br />Strategy</span>
            {' '}&amp; Legal<br />Drafting
          </h1>

          <p className="text-lg text-[#555] leading-relaxed mb-8 max-w-md">
            Empower your practice with AI that analyzes notices, identifies root causes,
            and drafts professional legal responses in minutes, not hours.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Link
              href={ctaHref}
              className="flex items-center gap-2 bg-[#2d6b5e] hover:bg-[#235549] text-white px-7 py-3.5 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg"
            >
              Start Free Trial
            </Link>
            <button className="flex items-center gap-2 text-sm font-semibold text-[#1a1a2e] bg-white border border-[#ddd] hover:border-[#4a8f7f] px-6 py-3.5 rounded-lg transition-all">
              <Play className="w-4 h-4 fill-[#1a1a2e]" /> Watch Demo
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['#4a8f7f', '#6b5ea8', '#c05c30'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: c }}>
                  {['CA', 'LA', 'CF'][i]}
                </div>
              ))}
            </div>
            <p className="text-sm text-[#777]">Trusted by <strong className="text-[#1a1a2e]">500+</strong> CAs and Legal Firms</p>
          </div>
        </div>

        {/* Right – Browser Mockup */}
        <div className="relative">
          {/* soft pink blob */}
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#fde8df] rounded-full blur-3xl opacity-60 -z-10" />

          <div className="bg-white rounded-2xl shadow-2xl border border-[#e5e7eb] overflow-hidden">
            {/* Browser chrome */}
            <div className="bg-[#f9fafb] border-b border-[#e5e7eb] px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 mx-4 bg-white border border-[#e5e7eb] rounded-md px-3 py-1 text-xs text-[#888]">
                app.taxcopilot.ai/workspace
              </div>
            </div>

            {/* App content */}
            <div className="flex divide-x divide-[#f0f0f0]">
              {/* AI Analysis Panel */}
              <div className="w-[44%] p-4 bg-[#f9fafb]">
                <p className="text-[10px] font-bold text-[#888] uppercase tracking-widest mb-3">AI Analysis</p>
                <div className="bg-white rounded-xl border border-[#e5e7eb] p-3 mb-3 shadow-sm">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-5 h-5 bg-[#fde8df] rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#c05c30] text-[9px] font-bold">!</span>
                    </div>
                    <p className="text-xs font-semibold text-[#1a1a2e] leading-tight">Root Cause: ITC Mismatch</p>
                  </div>
                  <p className="text-[10px] text-[#4a8f7f] leading-relaxed">
                    Discrepancy in GSTR-3B vs 2A. Supplier ABC Traders has not paid tax (CGST Act Sec 16(2)(c)).
                  </p>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Confidence Score</span>
                    <span className="text-[10px] font-bold text-[#4a8f7f]">85% High</span>
                  </div>
                  <div className="h-1.5 bg-[#e5e7eb] rounded-full">
                    <div className="h-1.5 bg-[#4a8f7f] rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="bg-[#f0faf7] border border-[#4a8f7f]/20 rounded-lg p-2.5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold text-[#1a1a2e]">Option A: Pay ₹45k</p>
                      <p className="text-[9px] text-[#888]">Recommended Strategy</p>
                    </div>
                    <Check className="w-3.5 h-3.5 text-[#4a8f7f]" />
                  </div>
                  <div className="bg-white border border-[#e5e7eb] rounded-lg p-2.5">
                    <p className="text-[10px] font-semibold text-[#1a1a2e]">Option B: Appeal</p>
                    <p className="text-[9px] text-[#888]">Long Process</p>
                  </div>
                </div>
              </div>

              {/* Drafting Panel */}
              <div className="flex-1 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-[#1a1a2e]">Drafting Studio</p>
                  <div className="flex gap-1">
                    <span className="w-5 h-5 rounded bg-[#f0f0f0] flex items-center justify-center text-[9px] text-[#888]">⊞</span>
                    <span className="w-5 h-5 rounded bg-[#f0f0f0] flex items-center justify-center text-[9px] text-[#888]">↗</span>
                  </div>
                </div>
                <div className="text-[11px] text-[#1a1a2e] space-y-2 leading-relaxed">
                  <p className="font-semibold">Subject: Reply to Notice GST-REG-17 dated 12/03/2024</p>
                  <p>Dear Sir,</p>
                  <p>With reference to the above notice regarding the alleged default of ₹1.2 Lakhs, we submit that...</p>
                  <p>The discrepancy arises due to a timing difference in filing by the supplier.</p>
                  <p>We have attached the relevant invoices and proof of payment...</p>
                  <div className="inline-flex items-center gap-1 bg-[#f0faf7] text-[#4a8f7f] text-[9px] font-medium px-2 py-0.5 rounded-full border border-[#4a8f7f]/20">
                    <span className="w-1.5 h-1.5 bg-[#4a8f7f] rounded-full animate-pulse" />
                    AI Drafting…
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WORKFLOW ── */}
      <section id="workflow" className="bg-white py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-[#4a8f7f] uppercase tracking-widest mb-3">Workflow</p>
            <h2 className="text-4xl font-bold text-[#1a1a2e] mb-4">From Notice to Notice-Reply in 3 Steps</h2>
            <p className="text-[#666] max-w-xl mx-auto">
              TaxCopilot streamlines the complex workflow of tax litigation into a simple, guided process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '1', title: 'Intake & Parse',
                icon: FileText, iconBg: '#fde8df', iconColor: '#c05c30',
                desc: 'Upload the government notice (PDF/Image). Our Smart OCR extracts key allegations, dates, and amounts instantly.',
                checks: ['Auto-fetch from Portal', 'Multi-format Support'],
                badge: false,
              },
              {
                num: '2', title: 'Analysis & Strategy',
                icon: BarChart2, iconBg: '#2d6b5e', iconColor: '#fff',
                desc: 'The engine cross-references allegations with the Act, identifies the root cause (e.g. ITC Mismatch), and suggests defense strategies.',
                checks: ['Legal Cross-Referencing', 'Confidence Scoring'],
                badge: true,
              },
              {
                num: '3', title: 'Drafting Studio',
                icon: Pen, iconBg: '#1a1a2e', iconColor: '#fff',
                desc: 'Generate a complete, legally sound reply. Use the Fact-Check tool to verify numbers and the Tone Optimizer for professional nuance.',
                checks: ['One-Click Export PDF', 'Human-in-the-loop Edit'],
                badge: false,
              },
            ].map((step) => (
              <div key={step.num} className="relative bg-[#f9fafb] border border-[#e5e7eb] rounded-2xl p-7 hover:shadow-md transition-shadow">
                {step.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2d6b5e] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    AI Powered
                  </div>
                )}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: step.iconBg }}
                >
                  <step.icon className="w-5 h-5" style={{ color: step.iconColor }} />
                </div>
                <h3 className="text-base font-bold text-[#1a1a2e] mb-2">{step.num}. {step.title}</h3>
                <p className="text-[13px] text-[#666] leading-relaxed mb-4">{step.desc}</p>
                <ul className="space-y-1.5">
                  {step.checks.map((c) => (
                    <li key={c} className="flex items-center gap-2 text-[12px] text-[#555]">
                      <Check className="w-3.5 h-3.5 text-[#4a8f7f] flex-shrink-0" /> {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section id="features" className="py-24 px-8 bg-[#f4f5f7]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Feature cards 2×2 */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Sliders, title: 'Legal RAG Search', desc: 'Retrieves relevant case laws and precedents instantly.', iconBg: '#f4f5f7' },
              { icon: RefreshCw, title: 'Real-time Sync', desc: 'Direct integration with GST portal to fetch GSTR-3B data.', iconBg: '#ede9fe', iconColor: '#7c3aed' },
              { icon: Shield, title: 'Privacy Mode', desc: 'Analyze notices without connecting live financial data.', iconBg: '#fde8df', iconColor: '#c05c30' },
              { icon: HelpCircle, title: 'Context Aware', desc: 'Remembers client profile and past notices for better context.', iconBg: '#fef9c3', iconColor: '#ca8a04' },
            ].map((feat) => (
              <div key={feat.title} className="bg-white rounded-2xl border border-[#e5e7eb] p-5 hover:shadow-md transition-shadow">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: feat.iconBg || '#f0faf7' }}
                >
                  <feat.icon className="w-5 h-5" style={{ color: feat.iconColor || '#4a8f7f' }} />
                </div>
                <p className="text-sm font-bold text-[#1a1a2e] mb-1">{feat.title}</p>
                <p className="text-[12px] text-[#777] leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* Right: Text */}
          <div>
            <p className="text-xs font-bold text-[#4a8f7f] uppercase tracking-widest mb-3">Capabilities</p>
            <h2 className="text-4xl font-bold text-[#1a1a2e] mb-5 leading-tight">
              Built on Advanced Legal AI Architecture
            </h2>
            <p className="text-[#666] leading-relaxed mb-8">
              TaxCopilot isn&#39;t just a wrapper. It uses a sophisticated backend combining Intelligent OCR,
              Vector Databases for law similarity, and Graph Databases for understanding complex clause relationships.
            </p>

            <div className="space-y-6">
              {[
                { icon: Sliders, title: 'Smart Draft Improvement', desc: "The AI doesn't just write; it optimizes tone, checks facts against uploaded documents, and ensures legal formatting." },
                { icon: Eye, title: 'Data Blind Options', desc: 'Choose between Full Mode for exact liability calculation or Privacy Mode for generic legal defense drafting.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white border border-[#e5e7eb] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <item.icon className="w-4 h-4 text-[#4a8f7f]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1a1a2e] mb-1">{item.title}</p>
                    <p className="text-[13px] text-[#666] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING CTA ── */}
      <section id="pricing" className="py-24 px-8 bg-white">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1a1a2e] mb-4">Ready to modernize your practice?</h2>
          <p className="text-[#666]">Join hundreds of Chartered Accountants saving 80% of their time on notice replies.</p>
        </div>

        <div className="max-w-sm mx-auto bg-white border border-[#e5e7eb] rounded-2xl shadow-lg p-8">
          <p className="text-xs font-bold text-[#888] uppercase tracking-widest text-center mb-4">Professional</p>
          <div className="flex items-baseline justify-center gap-1 mb-6">
            <span className="text-5xl font-bold text-[#1a1a2e]">₹4,999</span>
            <span className="text-[#888] text-sm">/month</span>
          </div>
          <ul className="space-y-3 mb-8">
            {['Unlimited Notice Analysis', 'GST Portal Integration', 'Advanced Strategy Engine', 'Export to PDF & Word'].map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-[#555]">
                <Check className="w-4 h-4 text-[#4a8f7f] flex-shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <Link
            href={ctaHref}
            className="block w-full text-center bg-[#2d6b5e] hover:bg-[#235549] text-white py-3.5 rounded-xl font-semibold text-sm transition-all"
          >
            Start 14-Day Free Trial
          </Link>
          <p className="text-center text-[11px] text-[#aaa] mt-3">No credit card required for trial.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1a1a2e] text-[#aab4c0] py-14 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-[#2d6b5e] rounded-xl flex items-center justify-center font-serif font-bold text-white text-xs shadow">
                T
              </div>
              <span className="text-white font-bold text-sm">TaxCopilot</span>
            </div>
            <p className="text-[12px] leading-relaxed">AI-powered assistant for the modern tax professional.</p>
          </div>

          {/* Product */}
          <div>
            <p className="text-white text-sm font-semibold mb-4">Product</p>
            <ul className="space-y-2 text-[13px]">
              {['Features', 'Pricing', 'Integrations'].map((l) => (
                <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-white text-sm font-semibold mb-4">Company</p>
            <ul className="space-y-2 text-[13px]">
              {['About Us', 'Blog', 'Careers'].map((l) => (
                <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-white text-sm font-semibold mb-4">Legal</p>
            <ul className="space-y-2 text-[13px]">
              {['Privacy Policy', 'Terms of Service'].map((l) => (
                <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px]">
          <p>© 2024 TaxCopilot AI. All rights reserved.</p>
          <div className="flex gap-3">
            <a href="#" className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
