import { useNavigate } from 'react-router-dom';
import { School, ArrowRight, Info, UserRoundSearch, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <button 
              onClick={() => window.history.back()}
              className="p-2 -ml-2 text-slate-400 hover:text-blue-600 transition-colors sm:hidden"
              title="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
              <School className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">TKA Simulation Portal</h2>
          </div>
            <button 
              onClick={() => navigate('/teacher/login')}
              className="group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-600"
            >
              <UserRoundSearch className="w-5 h-5" />
              <span className="hidden sm:inline">Login Guru / Admin</span>
            </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col justify-center">
        <div className="layout-container flex w-full flex-col">
          <div className="flex flex-1 justify-center py-5">
            <div className="layout-content-container flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-8 py-6 lg:flex-row lg:items-center lg:gap-16 lg:py-12">
                {/* Illustration Side */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-full lg:w-1/2"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-blue-600/5 p-8 dark:bg-slate-800/50">
                    <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl"></div>
                    <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl"></div>
                    <div className="relative z-10 aspect-[4/3] w-full bg-cover bg-center rounded-xl shadow-sm overflow-hidden">
                      <img 
                        src="https://picsum.photos/seed/school/800/600" 
                        alt="School" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="mt-6">
                      <blockquote className="border-l-4 border-blue-600 pl-4 italic text-slate-600 dark:text-slate-400">
                        "Pendidikan adalah senjata paling ampuh yang bisa kamu gunakan untuk mengubah dunia."
                      </blockquote>
                    </div>
                  </div>
                </motion.div>

                {/* Login Form Side */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex w-full flex-col lg:w-1/2 lg:max-w-md"
                >
                  <div className="mb-8">
                    <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                      Selamat Datang <br/> <span className="text-blue-600">Siswa Juara!</span>
                    </h1>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                      Silakan pilih portal login Anda.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => navigate('/student/login')}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700 hover:shadow-blue-600/50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                    >
                      <span>Login Siswa</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => navigate('/teacher/login')}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-3.5 text-base font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-900"
                    >
                      <span>Login Guru / Admin</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Instructions Section */}
              <div className="my-12 flex flex-col gap-8 rounded-2xl bg-white px-6 py-10 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10 sm:px-10">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Panduan Ujian</h2>
                  <p className="text-slate-600 dark:text-slate-400">Ikuti langkah-langkah berikut agar ujian berjalan lancar dan sukses.</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50 p-6 transition-transform hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-800/50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                      <Info className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Siapkan Perangkat</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        Pastikan laptop atau komputer terisi daya penuh dan layar bersih.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50 p-6 transition-transform hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-800/50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <Info className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Koneksi Stabil</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        Gunakan jaringan internet yang stabil agar tidak terputus saat mengerjakan soal.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50 p-6 transition-transform hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-800/50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                      <Info className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Jujur & Teliti</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        Kerjakan soal dengan jujur, teliti, dan percaya diri untuk hasil maksimal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 dark:bg-slate-900 dark:border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row gap-6 text-center md:text-left">
            <a className="text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-600 transition-colors" href="#">Bantuan Teknis</a>
            <a className="text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-600 transition-colors" href="#">Kebijakan Privasi</a>
            <a className="text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-600 transition-colors" href="#">Syarat & Ketentuan</a>
          </div>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            © 2024 Sekolah Dasar TKA. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
