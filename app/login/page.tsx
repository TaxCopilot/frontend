"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Scale, FileSearch, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';

const FEATURES = [
  {
    icon: FileSearch,
    title: 'Intelligent Notice Analysis',
    desc: 'Decode tax notices in seconds with AI-powered OCR and legal reasoning.',
  },
  {
    icon: Scale,
    title: 'Legal Knowledge Base',
    desc: 'Grounded in GST, Income Tax, and case law — always up to date.',
  },
  {
    icon: Sparkles,
    title: 'Draft Replies Instantly',
    desc: 'Generate professional response drafts ready for your review.',
  },
];

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/workspace');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/workspace');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setError(axiosErr.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-background-light">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] bg-gradient-to-br from-primary via-primary-dark to-[#0a2a1f] flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/3 rounded-full blur-2xl" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center font-serif font-bold text-white text-base shadow-lg">
            T
          </div>
          <span className="font-serif font-semibold text-[17px] text-white tracking-tight">TaxCopilot</span>
        </div>

        {/* Main headline */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1 mb-6">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-white/80 text-xs font-medium tracking-wide">AI-Powered Tax Intelligence</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-serif font-bold text-white leading-tight mb-4">
            Your AI Partner<br />for Tax Law
          </h1>
          <p className="text-white/60 text-[15px] leading-relaxed max-w-sm">
            Analyse notices, research provisions, and draft replies — all in one intelligent workspace.
          </p>
        </div>

        {/* Feature list */}
        <div className="relative z-10 space-y-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0 group-hover:bg-white/15 transition-colors">
                <Icon className="w-5 h-5 text-white/80" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{title}</p>
                <p className="text-white/50 text-xs mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom badge */}
        <div className="relative z-10 flex items-center gap-2 text-white/40 text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Bank-grade encryption · Data never leaves your account</span>
        </div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 py-12 relative overflow-y-auto overflow-x-hidden">
        {/* Subtle blobs for right panel */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/8 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[380px] relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-serif font-bold text-sm">T</div>
            <span className="font-serif font-semibold text-lg text-text-heading">TaxCopilot</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-[26px] font-bold text-text-heading tracking-tight">Welcome back</h2>
            <p className="text-text-sub text-sm mt-1.5">Sign in to your workspace</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-text-heading mb-1.5" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light pointer-events-none" />
                <input
                  id="email" name="email" type="email" required
                  placeholder="name@firm.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-border-default rounded-xl bg-background-light text-text-main placeholder-text-light text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[13px] font-medium text-text-heading" htmlFor="password">Password</label>
                <Link href="#" className="text-[12px] text-primary hover:text-primary-dark font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light pointer-events-none" />
                <input
                  id="password" name="password" type={showPassword ? 'text' : 'password'} required
                  placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-border-default rounded-xl bg-background-light text-text-main placeholder-text-light text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-light hover:text-text-sub transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-0.5">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded text-primary border-border-default focus:ring-primary cursor-pointer" />
              <label htmlFor="remember-me" className="text-[13px] text-text-sub cursor-pointer select-none">Remember me for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all transform hover:-translate-y-0.5 shadow-sm hover:shadow-md mt-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-border-subtle" />
            <span className="flex-shrink-0 mx-4 text-text-light text-[11px] font-medium uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-border-subtle" />
          </div>

          {/* Google */}
          <button
            onClick={googleLogin}
            className="w-full flex items-center justify-center gap-3 bg-surface-light border border-border-default text-text-heading hover:bg-background-light font-medium py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md mb-2"
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-sm">Continue with Google</span>
          </button>

          {/* Sign up link */}
          <p className="text-center text-[13px] text-text-sub mt-6">
            New to TaxCopilot?{' '}
            <Link href="/register" className="font-semibold text-primary hover:text-primary-dark transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
