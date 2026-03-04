import { useNavigate } from 'react-router-dom';
import { School, ArrowRight, Info, CheckCircle2, UserRoundSearch, ArrowLeft, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 ring-blue-500/20",
    emerald: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    violet: "bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 ring-violet-500/20"
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B1120] selection:bg-blue-500/30 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -z-10 mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 mix-blend-multiply dark:mix-blend-screen opacity-70" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/10 rounded-full blur-[120px] -z-10" />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full border-b border-slate-200/50 bg-white/70 dark:bg-slate-900/50 dark:border-slate-800/50 backdrop-blur-xl sticky top-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <button
              onClick={() => window.history.back()}
              className="p-2 -ml-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors sm:hidden"
              title="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <School className="w-5 h-5" />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
            </div>
            <h2 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">TKA Portal</h2>
          </div>
          <button
            onClick={() => navigate('/teacher/login')}
            className="group relative flex items-center gap-2 rounded-xl bg-white/50 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:shadow-md hover:ring-slate-300 dark:bg-slate-800/50 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800 dark:hover:ring-slate-600"
          >
            <UserRoundSearch className="w-4 h-4 text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            <span className="hidden sm:inline">Login Guru</span>
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center relative z-10">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* Left side / Text & CTA */}
            <motion.div
              className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-300 mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Platform Simulasi Ujian V2.0</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
                Mulai Perjalanan <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  Prestasi Anda
                </span> Disini.
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl leading-relaxed">
                Persiapkan diri Anda untuk menghadapi ujian dengan simulasi terbaik. Akses materi, kerjakan latihan, dan pantau perkembangan nilai Anda dalam satu platform yang mudah digunakan.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/student/login')}
                className="group relative inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:shadow-2xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#0B1120] w-full sm:w-auto"
              >
                <span>Login Sebagai Siswa</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
              </motion.button>

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Cepat</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Aman</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Terpercaya</span>
                </div>
              </div>
            </motion.div>

            {/* Right side / Illustration */}
            <motion.div
              className="flex-1 w-full max-w-lg lg:max-w-none relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              <div className="relative aspect-square md:aspect-[4/3] w-full rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl overflow-hidden p-2 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
                  alt="Students studying"
                  className="w-full h-full object-cover rounded-2xl grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Elements */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                  className="absolute -top-4 -right-4 sm:top-6 sm:-right-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col gap-2 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tingkat Kelulusan</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">99.8%</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, type: "spring", stiffness: 100 }}
                  className="absolute -bottom-4 -left-4 sm:bottom-8 sm:-left-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col gap-2 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Bank Soal</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">+5000 Tersedia</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>

          {/* Features / Instructions */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mt-32 border-t border-slate-200/50 dark:border-slate-800/50 pt-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Panduan Ujian</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Tiga langkah mudah untuk memastikan ujian Anda berjalan dengan lancar dan sukses.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Info className="w-6 h-6" />,
                  title: "Siapkan Perangkat",
                  desc: "Pastikan laptop atau komputer terisi daya penuh dan layar bersih untuk kenyamanan mata.",
                  color: "blue"
                },
                {
                  icon: <Info className="w-6 h-6" />,
                  title: "Koneksi Stabil",
                  desc: "Gunakan jaringan internet yang stabil agar tidak terputus saat mengerjakan soal evaluasi.",
                  color: "emerald"
                },
                {
                  icon: <Info className="w-6 h-6" />,
                  title: "Jujur & Teliti",
                  desc: "Kerjakan soal dengan jujur, teliti, dan percaya diri untuk mendapatkan hasil yang memuaskan.",
                  color: "violet"
                }
              ].map((item, i) => (
                <motion.div key={i} variants={itemVariants} className="relative group">
                  <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:border-blue-500/30" />
                  <div className="relative p-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ring-1 ${colorMap[item.color]}`}>
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/50 bg-white/50 dark:bg-slate-900/50 dark:border-slate-800/50 backdrop-blur-lg py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            © 2024 SD TKA. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Bantuan Teknis</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Ketentuan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
