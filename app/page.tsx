import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, FileText, Scale, Bot, Upload, Brain, Pen, Check } from 'lucide-react';
import { NavCTA } from '@/components/NavCTA';
import { GetStartedLink } from '@/components/GetStartedLink';
import { LandingWrapper } from '@/components/LandingWrapper';

export default function LandingPage() {
  return (
    <LandingWrapper>
    <div className="min-h-screen bg-surface-light font-sans selection:bg-primary/20">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-primary font-serif font-bold text-xl">T</span>
          </div>
          <span className="text-xl font-bold text-text-heading tracking-tight">TaxCopilot</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-sub">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#workflow" className="hover:text-primary transition-colors">How it Works</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-text-sub hover:text-primary transition-colors">Log in</Link>
          <NavCTA />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero relative pt-20 pb-28 px-8 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-secondary/15 rounded-full blur-[100px] -z-10" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[80px] -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          <span>Agentic AI for Tax Professionals</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-serif text-text-heading leading-tight mb-8 max-w-4xl mx-auto">
          Automated <span className="text-primary italic">Tax Strategy</span> & Legal Drafting.
        </h1>

        <p className="text-lg md:text-xl text-text-sub mb-12 max-w-2xl mx-auto leading-relaxed">
          Upload notices, analyze root causes, and draft responses instantly with our AI-powered legal assistant. Built for modern tax consultants.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <GetStartedLink variant="primary">Start Free Trial</GetStartedLink>
          <Link href="#demo" className="w-full sm:w-auto bg-surface-light border border-border-default hover:bg-background-light text-text-sub px-8 py-4 rounded-full text-lg font-medium shadow-sm transition-all flex items-center justify-center gap-2">
            Book a Demo
          </Link>
        </div>

        {/* Integration Badges */}
        <div className="flex items-center justify-center gap-6 text-[13px] text-text-light mb-16">
          <span>Integrates with:</span>
          <div className="flex gap-4 items-center">
            {['GST Portal', 'Tally', 'Zoho Books', 'SAP'].map((name) => (
              <span key={name} className="px-3 py-1.5 bg-background-light border border-border-subtle rounded-lg font-medium text-text-sub">{name}</span>
            ))}
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mx-auto max-w-5xl">
          <div className="absolute inset-0 bg-gradient-to-t from-surface-light via-transparent to-transparent z-10" />
          <div className="rounded-2xl border border-border-default shadow-2xl overflow-hidden bg-background-light p-2">
            <Image src="https://picsum.photos/seed/dashboard/1200/800" alt="Dashboard Preview" width={1200} height={800} referrerPolicy="no-referrer" className="rounded-xl w-full h-auto object-cover border border-border-subtle" />
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="landing-workflow py-24 bg-background-light px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 landing-heading">
            <h2 className="text-3xl md:text-4xl font-serif text-text-heading mb-4">Three steps to the perfect draft</h2>
            <p className="text-text-sub max-w-2xl mx-auto">From document upload to finished legal response in minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Intake & Parse', desc: 'Upload SCNs, orders, or notices. AI extracts key facts, dates, legal sections, and alleged violations automatically.', icon: Upload, color: 'bg-primary/10 text-primary' },
              { num: '2', title: 'Analysis & Strategy', desc: 'Cross-reference legal databases, find precedents, and generate a strategic response framework based on case analysis.', icon: Brain, color: 'bg-secondary/20 text-secondary-text' },
              { num: '3', title: 'Drafting Studio', desc: 'Generate publication-ready legal responses with AI suggestions, citation checking, and multiple tone options.', icon: Pen, color: 'bg-purple-soft text-purple-text' },
            ].map((step) => (
              <div key={step.num} className="landing-card bg-surface-light p-8 rounded-3xl border border-border-subtle shadow-card hover:shadow-card-hover transition-all group relative overflow-hidden">
                <div className="absolute top-4 right-6 text-6xl font-serif font-bold text-background-light select-none">{step.num}</div>
                <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mb-6 relative z-10`}>
                  <step.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-text-heading mb-3 relative z-10">{step.title}</h3>
                <p className="text-text-sub leading-relaxed relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-features py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 landing-heading">
            <h2 className="text-3xl md:text-4xl font-serif text-text-heading mb-4">Everything you need to handle complex cases</h2>
            <p className="text-text-sub max-w-2xl mx-auto">TaxCopilot combines advanced AI with a comprehensive legal database to streamline your workflow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="landing-feature-card bg-surface-light p-8 rounded-3xl border border-border-subtle shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-14 h-14 bg-blue-soft text-blue-text rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-text-heading mb-3">Intelligent Document Intake</h3>
              <p className="text-text-sub leading-relaxed">Upload SCNs, assessment orders, or client data. Our AI instantly extracts key facts, dates, and alleged violations.</p>
            </div>

            <div className="landing-feature-card bg-surface-light p-8 rounded-3xl border border-border-subtle shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Bot className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-text-heading mb-3">Agentic Drafting</h3>
              <p className="text-text-sub leading-relaxed">Generate highly contextual replies, appeal memorandums, and legal opinions in seconds, tailored to your firm&apos;s style.</p>
            </div>

            <div className="landing-feature-card bg-surface-light p-8 rounded-3xl border border-border-subtle shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-14 h-14 bg-secondary-soft text-secondary-text rounded-2xl flex items-center justify-center mb-6">
                <Scale className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-text-heading mb-3">Unified Law Library</h3>
              <p className="text-text-sub leading-relaxed">Access a vast database of case laws, acts, and circulars. The AI automatically cross-references relevant precedents for your draft.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-background-light px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-text-heading mb-4">Simple, transparent pricing</h2>
            <p className="text-text-sub">Start free. Scale as you grow.</p>
          </div>

          <div className="max-w-md mx-auto bg-surface-light rounded-3xl border border-border-default shadow-card p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
            <span className="bg-secondary/20 text-secondary-text text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
            <h3 className="text-2xl font-serif text-text-heading mt-4 mb-2">Professional</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-text-heading">₹4,999</span>
              <span className="text-text-sub text-sm">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                'Unlimited AI Drafts',
                'Full Law Library Access',
                'Priority Case Analysis',
                'Export to PDF & DOCX',
                'Team Collaboration (up to 5)',
                'Precedent Search & Auto-Cite',
              ].map((feat) => (
                <li key={feat} className="flex items-center gap-3 text-sm text-text-sub">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
            <GetStartedLink
              variant="block"
              className="block w-full text-center bg-secondary hover:bg-secondary-hover text-secondary-text px-6 py-3.5 rounded-xl font-semibold shadow-float transition-all transform hover:-translate-y-0.5"
            >
              Start 14-Day Free Trial
            </GetStartedLink>
            <p className="text-center text-xs text-text-light mt-3">No credit card required</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text-heading text-text-light py-12 px-8 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-surface-light font-serif font-bold text-sm">T</span>
            </div>
            <span className="text-lg font-bold text-surface-light tracking-tight">TaxCopilot</span>
          </div>
          <p className="mb-6 max-w-md mx-auto text-sm">Empowering tax professionals with AI-driven insights and automation.</p>
          <div className="flex justify-center gap-8 text-sm mb-8">
            <Link href="#" className="hover:text-surface-light transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-surface-light transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-surface-light transition-colors">Contact</Link>
          </div>
          <p className="text-xs text-text-sub/50">© {new Date().getFullYear()} TaxCopilot AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </LandingWrapper>
  );
}
