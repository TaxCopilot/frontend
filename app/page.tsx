'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import {
  ArrowRight, Play, Check, Shield,
  FileText, BarChart2, Pen,
  Mail, Scale, Sparkles, Building2,
  Lock
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const ctaHref = isAuthenticated ? '/workspace' : '/login';

  return (
    <div className="min-h-screen bg-background-light font-sans text-text-main selection:bg-primary/20">

      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-5 max-w-[1400px] mx-auto border-b border-border-subtle/50 mb-8 lg:mb-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-serif font-bold text-white text-base shadow-sm">
            T
          </div>
          <span className="text-xl font-serif font-bold tracking-tight text-text-heading">TaxCopilot</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[15px] font-medium text-text-sub">
          <Link href="/" className="hover:text-primary transition-colors">Platform</Link>
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#workflow" className="hover:text-primary transition-colors">Workflow</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href={ctaHref} className="text-[15px] font-medium text-text-sub hover:text-primary transition-colors px-2">
            Sign In
          </Link>
          <Link href={ctaHref} className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-[15px] font-semibold transition-all shadow-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2.5 bg-secondary/15 border border-secondary/20 text-secondary-dark text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="tracking-wide">Enterprise Tax Intelligence</span>
          </div>

          <h1 className="text-[56px] xl:text-[68px] font-serif font-bold leading-[1.05] text-text-heading mb-8 tracking-tight">
            The Modern Way to<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
              Resolve Tax Disputes
            </span>
          </h1>

          <p className="text-xl text-text-sub leading-relaxed mb-10 max-w-lg">
            Streamline your litigation workflow. Automatically analyze complex government notices, cross-reference the latest tax code, and draft professional legal responses in minutes.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Link
              href={ctaHref}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold text-base transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="flex items-center justify-center gap-2 text-base font-semibold text-text-heading bg-white border border-border-default hover:border-border-hover px-8 py-4 rounded-xl transition-all shadow-sm w-full sm:w-auto">
              <Play className="w-5 h-5 fill-text-heading" /> Watch Platform Demo
            </button>
          </div>

          <div className="flex items-center gap-4 pt-6 border-t border-border-subtle max-w-md">
            <div className="flex -space-x-3">
              {[Building2, Scale, FileText].map((Icon, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-[3px] border-background-light bg-surface-main flex items-center justify-center text-text-sub shadow-sm">
                  <Icon className="w-4 h-4" />
                </div>
              ))}
            </div>
            <div className="text-sm text-text-sub">
              Trusted by leading <strong className="text-text-heading font-semibold">Chartered Accountants</strong> and Legal Firms nationwide.
            </div>
          </div>
        </div>

        {/* Right – App Mockup */}
        <div className="relative lg:h-[600px] flex items-center justify-center">
          {/* Decorative background blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[80px] -z-10" />
          <div className="absolute top-1/4 -right-12 w-64 h-64 bg-secondary/15 rounded-full blur-[60px] -z-10" />

          {/* Premium Mockup Frame */}
          <div className="w-full bg-surface-main rounded-2xl shadow-2xl border border-border-default/50 overflow-hidden transform lg:-rotate-2 transition-transform hover:rotate-0 duration-500 relative z-10">
            {/* Browser chrome */}
            <div className="bg-surface-light border-b border-border-subtle px-4 py-3 flex items-center gap-3">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 mx-4 bg-white border border-border-default/50 rounded-md px-3 py-1.5 text-xs text-text-light font-medium flex items-center justify-center">
                <Lock className="w-3 h-3 inline-block mr-1 opacity-50" />
                app.taxcopilot.ai/workspace/notice-gst-reg-17
              </div>
            </div>

            {/* App UI Snapshot */}
            <div className="flex h-[400px]">
              {/* Sidebar tiny mockup */}
              <div className="w-16 border-r border-border-subtle bg-surface-light flex flex-col items-center py-4 gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex justify-center items-center font-bold font-serif shadow-sm">T</div>
                <div className="w-6 h-6 rounded bg-border-subtle mt-4"></div>
                <div className="w-6 h-6 rounded bg-border-subtle/50"></div>
                <div className="w-6 h-6 rounded bg-border-subtle/50"></div>
              </div>

              {/* Main content mockup */}
              <div className="flex-1 p-6 flex flex-col gap-4 bg-white">
                <div className="h-6 w-1/3 bg-border-subtle rounded"></div>
                
                <div className="flex gap-4 flex-1">
                  {/* Left Column (Analysis) */}
                  <div className="w-1/2 flex flex-col gap-3">
                    <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 flex-1">
                      <div className="h-4 w-1/2 bg-orange-200/50 rounded mb-4"></div>
                      <div className="h-3 w-5/6 bg-orange-100 rounded mb-2"></div>
                      <div className="h-3 w-4/6 bg-orange-100 rounded mb-2"></div>
                      <div className="h-3 w-3/6 bg-orange-100 rounded"></div>
                    </div>
                    <div className="bg-surface-light border border-border-subtle rounded-xl p-4 flex-1">
                      <div className="h-4 w-1/3 bg-border-default rounded mb-4"></div>
                      <div className="h-3 w-full bg-border-subtle/50 rounded mb-2"></div>
                      <div className="h-3 w-4/5 bg-border-subtle/50 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Right Column (Draft) */}
                  <div className="w-1/2 bg-surface-light border border-border-subtle rounded-xl p-4">
                    <div className="h-4 w-1/3 bg-primary/20 rounded mb-6"></div>
                    <div className="space-y-3">
                      <div className="h-3 w-full bg-border-subtle rounded"></div>
                      <div className="h-3 w-full bg-border-subtle rounded"></div>
                      <div className="h-3 w-5/6 bg-border-subtle rounded"></div>
                      <div className="h-3 w-11/12 bg-border-subtle rounded"></div>
                      <div className="h-3 w-4/5 bg-border-subtle rounded"></div>
                      <div className="h-3 w-full bg-border-subtle rounded"></div>
                    </div>
                    <div className="mt-8 inline-flex items-center gap-2 bg-primary/5 text-primary text-[10px] font-semibold px-2.5 py-1 rounded-md border border-primary/10">
                      <Sparkles className="w-3 h-3" /> Drafting Response...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-border-default to-transparent max-w-5xl mx-auto my-8" />

      {/* ── WORKFLOW ── */}
      <section id="workflow" className="py-24 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">The Workflow</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-text-heading mb-6">From Notice to Notice-Reply in Minutes</h3>
            <p className="text-text-sub text-lg max-w-2xl mx-auto leading-relaxed">
              TaxCopilot streamlines the complex workflow of tax litigation into a simple, professional, and secure process designed for modern firms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px bg-border-default z-0 border-dashed border-t-2" />

            {[
              {
                num: '01', title: 'Intake & Parse',
                icon: FileText, iconBg: 'bg-orange-50', iconColor: 'text-orange-500',
                desc: 'Securely upload the government notice. The platform instantly extracts key dates, claims, and exact numeric discrepancies.',
              },
              {
                num: '02', title: 'Legal Analysis',
                icon: Scale, iconBg: 'bg-primary/10', iconColor: 'text-primary',
                desc: 'Cross-references allegations against the Act and recent case law to pinpoint the core issue (e.g., ITC Mismatch under Sec 16).',
              },
              {
                num: '03', title: 'Drafting Studio',
                icon: Pen, iconBg: 'bg-secondary/15', iconColor: 'text-secondary-dark',
                desc: 'Generates a legally sound, structured reply draft. Review the citations, adjust the tone, and export directly to PDF/Word.',
              },
            ].map((step) => (
              <div key={step.num} className="relative z-10 bg-white border border-border-default rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${step.iconBg}`}>
                    <step.icon className={`w-6 h-6 ${step.iconColor}`} />
                  </div>
                  <span className="text-4xl font-serif font-bold text-border-default/50">{step.num}</span>
                </div>
                <h4 className="text-xl font-bold text-text-heading mb-3">{step.title}</h4>
                <p className="text-text-sub leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section id="features" className="py-24 px-6 lg:px-12 bg-white border-y border-border-subtle">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Text */}
          <div className="order-2 lg:order-1">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">Platform Capabilities</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-text-heading mb-6 leading-[1.15]">
              Enterprise-Grade<br />Software for Tax Teams
            </h3>
            <p className="text-text-sub text-lg leading-relaxed mb-10">
              Go beyond simple chatbots. TaxCopilot provides a comprehensive suite of tools built specifically for the rigor of tax law, combining deep legal search with a structured drafting workspace.
            </p>

            <div className="space-y-8">
               <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-surface-light border border-border-default rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                    <BarChart2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-text-heading mb-2">Data-Driven Strategy</h4>
                    <p className="text-text-sub leading-relaxed">Evaluate the exact financial impact of a notice and receive clear, actionable defense strategies grounded in precedent.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-surface-light border border-border-default rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-text-heading mb-2">Absolute Data Privacy</h4>
                    <p className="text-text-sub leading-relaxed">Your client data is encrypted and never used for training models. Maintain strict confidentiality with bank-grade security protocols.</p>
                  </div>
                </div>
            </div>
          </div>

          {/* Right: Feature cards */}
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-5 relative">
             {/* Decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-secondary/10 rounded-full blur-[60px] -z-10" />

            {[
              { icon: FileText, title: 'Smart Extraction', desc: 'Auto-identify demand amounts and crucial deadlines.', iconBg: 'bg-white', shadow: 'shadow-sm' },
              { icon: Scale, title: 'Legal Search', desc: 'Scan thousands of case laws and tribunal orders instantly.', iconBg: 'bg-primary text-white', shadow: 'shadow-lg shadow-primary/20', isPrimary: true },
              { icon: Pen, title: 'Drafting Studio', desc: 'Professional formatting ready for immediate submission.', iconBg: 'bg-white', shadow: 'shadow-sm' },
              { icon: Building2, title: 'Audit Trail', desc: 'Maintain complete history of analysis and generated drafts.', iconBg: 'bg-white', shadow: 'shadow-sm' },
            ].map((feat) => (
              <div key={feat.title} className={`rounded-2xl border ${feat.isPrimary ? 'border-primary' : 'border-border-default'} p-6 bg-white/80 backdrop-blur-sm ${feat.shadow} hover:-translate-y-1 transition-transform duration-300`}>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${feat.iconBg}`}
                >
                  <feat.icon className={`w-5 h-5 ${feat.isPrimary ? 'text-white' : 'text-text-heading'}`} />
                </div>
                <h4 className="text-base font-bold text-text-heading mb-2">{feat.title}</h4>
                <p className="text-sm text-text-sub leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING CTA ── */}
      <section id="pricing" className="py-24 px-6 lg:px-12 bg-surface-main">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 bg-gradient-to-br from-primary via-primary-dark to-[#0a2a1f] rounded-3xl p-10 lg:p-16 overflow-hidden relative">
           <div className="absolute inset-0 opacity-[0.05]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[80px]" />

          <div className="relative z-10 flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">Ready to modernize<br/>your practice?</h2>
            <p className="text-white/70 text-lg mb-8 max-w-md leading-relaxed">Join hundreds of Chartered Accountants saving 80% of their time on notice replies and legal research.</p>
            <ul className="space-y-4 mb-10 text-white/90">
                {['Unlimited Notice Analysis', 'Comprehensive Legal Library Access', 'Bank-Grade Security', 'Export to PDF & Word'].map((f) => (
                  <li key={f} className="flex items-center gap-3 font-medium">
                     <div className="w-5 h-5 rounded-full bg-secondary/30 flex items-center justify-center">
                        <Check className="w-3 h-3 text-secondary" />
                     </div>
                     {f}
                  </li>
                ))}
              </ul>
          </div>

          <div className="relative z-10 flex items-center justify-center lg:justify-end">
             <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">Professional Plan</div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-serif font-bold text-text-heading">₹4,999</span>
                <span className="text-text-sub font-medium">/month</span>
              </div>
              <Link
                href={ctaHref}
                className="block w-full text-center bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold text-base transition-all shadow-md mb-4"
              >
                Start 14-Day Free Trial
              </Link>
              <p className="text-center text-xs text-text-light font-medium">No credit card required. Cancel anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-border-default pt-20 pb-10 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center font-serif font-bold text-white text-sm shadow">
                T
              </div>
              <span className="text-text-heading font-serif font-bold text-lg">TaxCopilot</span>
            </div>
            <p className="text-text-sub text-sm leading-relaxed max-w-xs mb-6">The definitive intelligence platform for modern tax professionals and chartered accountants.</p>
            <div className="flex gap-3">
               <a href="#" className="w-9 h-9 border border-border-default rounded-lg flex items-center justify-center text-text-light hover:text-text-heading hover:border-border-hover transition-colors">
                 <Mail className="w-4 h-4" />
               </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-text-heading text-sm font-bold mb-5 uppercase tracking-wider">Product</h4>
            <ul className="space-y-3 text-sm font-medium text-text-sub">
              {['Features', 'Pricing', 'Security', 'Changelog'].map((l) => (
                <li key={l}><Link href="#" className="hover:text-primary transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-text-heading text-sm font-bold mb-5 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm font-medium text-text-sub">
              {['About Us', 'Blog', 'Careers', 'Contact'].map((l) => (
                <li key={l}><Link href="#" className="hover:text-primary transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-text-heading text-sm font-bold mb-5 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3 text-sm font-medium text-text-sub">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
                <li key={l}><Link href="#" className="hover:text-primary transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto border-t border-border-subtle pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-text-light">
          <p>© {new Date().getFullYear()} TaxCopilot Technologies. All rights reserved.</p>
          <div className="flex gap-6">
             <span>Made with precision for CA workflows</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
