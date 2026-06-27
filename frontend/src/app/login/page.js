'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KeyRound, Mail, AlertCircle, Loader2 } from 'lucide-react';
import apiService from '../../services/api';

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth-token');
      if (token) {
        router.push('/dashboard');
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await apiService.login({ email, password });
      if (response.success && response.token) {
        localStorage.setItem('auth-token', response.token);
        localStorage.setItem('auth-user', JSON.stringify(response.user));
        // Redirect to dashboard overview
        router.push('/dashboard');
      } else {
        setErrorMsg(response.message || 'Login failed.');
      }
    } catch (err) {
      console.error('[Login Page Error]:', err.message);
      setErrorMsg(err.message || 'Failed to connect to authentication services.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 bg-white border border-gray-100 p-8 rounded-[2rem] shadow-xl relative z-10">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="h-10 w-10 rounded-xl bg-indigo-650 flex items-center justify-center text-white font-black shadow-md mx-auto text-base">
            A
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-950 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-bold tracking-wide uppercase">
            Sign in to your AI discoverability portal
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl flex items-start space-x-2.5 text-xs sm:text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="font-semibold leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email-address" className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:border-[#5939fc]/40 focus:ring-1 focus:ring-[#5939fc]/20 transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password-field" className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <KeyRound className="h-4.5 w-4.5" />
                </div>
                <input
                  id="password-field"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl text-sm font-semibold focus:outline-none focus:bg-white focus:border-[#5939fc]/40 focus:ring-1 focus:ring-[#5939fc]/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-650 to-blue-600 hover:from-indigo-600 hover:to-blue-500 text-white rounded-xl text-sm font-black tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5 focus:outline-none disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log In to Dashboard</span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs sm:text-sm text-gray-500 font-semibold">
            Don't have an account?{' '}
            <Link href="/signup" className="text-indigo-600 hover:text-indigo-500 font-bold transition-all underline">
              Create an account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
