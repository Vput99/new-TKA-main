import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, User, Lock, LogIn, Eye, EyeOff, Shield, BarChart, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { dbService } from '../services/db';

interface StudentLoginProps {
  onLogin: (name: string, id: string) => void;
}

export default function StudentLogin({ onLogin }: StudentLoginProps) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const profile = await dbService.loginStudent(studentId, password);
      onLogin(profile.full_name, profile.id);
      navigate('/student/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message?.includes('Supabase URL and Anon Key are required')) {
        setError('Konfigurasi Database belum lengkap. Silakan atur Environment Variables.');
      } else {
        setError('ID Siswa atau kata sandi salah. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    onLogin("Siswa Demo", "demo-student-id");
    navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col antialiased selection:bg-blue-600/20 selection:text-blue-600">
      <div className="flex flex-1 min-h-0 relative">
        {/* Left Side: Login Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[480px] xl:w-[560px] bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-10 relative shadow-2xl shadow-slate-200/50 dark:shadow-none"
        >
          <div className="mx-auto w-full max-sm:max-w-xs lg:w-96">
            <div className="mb-10">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Beranda
              </button>
              <div className="flex items-center gap-3 text-blue-600 mb-6">
                <div className="size-10 rounded bg-blue-600/10 flex items-center justify-center">
                  <School className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Platform Akademik TKA</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Portal Siswa</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Silakan masuk untuk memulai simulasi Anda.
              </p>
              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200" htmlFor="student-id">
                  ID Siswa / Nama Pengguna
                </label>
                <div className="mt-2 relative">
                  <input 
                    className="block w-full rounded-lg border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-blue-600 pl-10" 
                    id="student-id" 
                    name="student-id" 
                    placeholder="misal: tka_siswa_01" 
                    required 
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="text-slate-400 w-5 h-5" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200" htmlFor="password">
                  Kata Sandi
                </label>
                <div className="mt-2 relative">
                  <input 
                    className="block w-full rounded-lg border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-blue-600 pl-10 pr-10" 
                    id="password" 
                    name="password" 
                    placeholder="••••••••" 
                    required 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="text-slate-400 w-5 h-5" />
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:ring-offset-slate-900" id="remember-me" name="remember-me" type="checkbox"/>
                  <label className="ml-2 block text-sm text-slate-900 dark:text-slate-300" htmlFor="remember-me">Ingat saya</label>
                </div>
                <div className="text-sm">
                  <a className="font-medium text-blue-600 hover:text-blue-700 transition-colors" href="#">Lupa kata sandi?</a>
                </div>
              </div>
              <div>
                <button 
                  className="flex w-full justify-center items-center gap-2 rounded-lg bg-blue-600 px-3 py-3 text-sm font-bold leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      Masuk
                    </>
                  )}
                </button>
                <div className="mt-4 relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                  <span className="flex-shrink mx-4 text-xs text-slate-400 uppercase font-bold tracking-widest">Atau</span>
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                </div>
                <button 
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-3 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors border border-blue-600/20 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Gunakan Akun Demo Siswa
                </button>
              </div>
            </form>

            <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Koneksi Aman SSL 256-bit</span>
              </div>
              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                Butuh bantuan? <a className="font-semibold leading-6 text-blue-600 hover:text-blue-700" href="#">Hubungi Guru Anda</a>
              </p>
              <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-8">
                © 2024 Platform Akademik TKA. Versi Sistem 5.0.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Decorative Panel */}
        <div className="hidden lg:flex flex-1 relative bg-slate-100 dark:bg-slate-900">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://picsum.photos/seed/student/1200/1200" 
              alt="Background" 
              className="w-full h-full object-cover opacity-50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-blue-600/70 to-slate-900/90 mix-blend-multiply"></div>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          </div>
          <div className="relative z-10 w-full h-full flex flex-col justify-between p-12 xl:p-24 text-white">
            <div className="flex justify-end">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Sistem Operasional
              </div>
            </div>
            <div className="max-w-lg">
              <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white">
                <BarChart className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">
                Uji Pengetahuan Anda
              </h1>
              <p className="text-lg text-slate-100/90 leading-relaxed mb-8">
                Akses simulasi, pantau kemajuan Anda, dan persiapkan diri untuk ujian dengan percaya diri.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                  <p className="text-3xl font-bold mb-1">100+</p>
                  <p className="text-sm text-white/70">Materi Ujian</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                  <p className="text-3xl font-bold mb-1">24/7</p>
                  <p className="text-sm text-white/70">Akses Tersedia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
