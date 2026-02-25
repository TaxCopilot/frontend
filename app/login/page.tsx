"use client";

import Link from 'next/link';
import { Mail, Lock, Shield, Bot, FileText, Moon, Sun } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="bg-background-light font-sans text-text-main min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-60 pointer-events-none" />

      {/* Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      {/* Main Content */}
      <main className="w-full max-w-md mx-auto p-6 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg mb-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-text-heading tracking-tight">TaxCopilot</h1>
          <p className="mt-2 text-sm text-text-sub">AI-Powered Legal & Tax Intelligence</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-light rounded-2xl shadow-xl border border-border-subtle p-8 backdrop-blur-sm relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-heading">Welcome Back</h2>
              <p className="text-sm text-text-sub mt-1">Please enter your details to sign in.</p>
            </div>

            {/* Google Sign In */}
            <button className="w-full flex items-center justify-center gap-3 bg-surface-light border border-border-default text-text-heading hover:bg-background-light font-medium py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow group">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border-default" />
              <span className="flex-shrink-0 mx-4 text-text-light text-xs font-medium uppercase tracking-wider">Or</span>
              <div className="flex-grow border-t border-border-default" />
            </div>

            {/* Form */}
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-heading mb-1 ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-text-light" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2.5 border border-border-default rounded-xl leading-5 bg-background-light text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                    id="email"
                    name="email"
                    placeholder="name@firm.com"
                    type="email"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1 ml-1">
                  <label className="block text-sm font-medium text-text-heading" htmlFor="password">
                    Password
                  </label>
                  <Link className="text-xs font-medium text-primary hover:text-primary-dark" href="#">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-text-light" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2.5 border border-border-default rounded-xl leading-5 bg-background-light text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div>

              <div className="flex items-center ml-1">
                <input
                  className="h-4 w-4 text-primary focus:ring-primary border-border-default rounded cursor-pointer"
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                />
                <label className="ml-2 block text-sm text-text-sub cursor-pointer" htmlFor="remember-me">
                  Remember me for 30 days
                </label>
              </div>

              <Link
                href="/workspace"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-secondary-text bg-secondary hover:bg-secondary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all duration-200 transform hover:-translate-y-0.5 mt-2"
              >
                Sign In
              </Link>
            </form>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-text-sub">
              New to TaxCopilot?{' '}
              <Link className="font-semibold text-primary hover:text-primary-dark transition-colors ml-1" href="#">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center text-xs text-text-sub opacity-80">
          <div className="flex flex-col items-center gap-1 group">
            <div className="p-2 rounded-full bg-surface-light shadow-sm text-primary group-hover:scale-110 transition-transform">
              <Shield className="w-4 h-4" />
            </div>
            <span>Secure Data</span>
          </div>
          <div className="flex flex-col items-center gap-1 group">
            <div className="p-2 rounded-full bg-surface-light shadow-sm text-primary group-hover:scale-110 transition-transform">
              <Bot className="w-4 h-4" />
            </div>
            <span>AI Powered</span>
          </div>
          <div className="flex flex-col items-center gap-1 group">
            <div className="p-2 rounded-full bg-surface-light shadow-sm text-primary group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <span>Drafting Studio</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 w-full text-center">
        <p className="text-xs text-text-light">© 2024 TaxCopilot AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
