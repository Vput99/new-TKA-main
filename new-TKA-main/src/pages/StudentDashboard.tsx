import { useNavigate } from 'react-router-dom';
import { School, LogOut, Calculator, BookOpen, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface StudentDashboardProps {
  user: { name: string; id: string };
  onLogout: () => void;
}

export default function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const navigate = useNavigate();

  const subjects = [
    {
      id: 'matematika',
      name: 'Matematika',
      description: 'Latihan soal berhitung, logika matematika, dan pemecahan masalah dasar.',
      questions: 40,
      time: 60,
      icon: <Calculator className="w-8 h-8" />,
      color: 'blue'
    },
    {
      id: 'bahasa-indonesia',
      name: 'Bahasa Indonesia',
      description: 'Pemahaman bacaan, tata bahasa, dan kosa kata dalam Bahasa Indonesia.',
      questions: 50,
      time: 60,
      icon: <BookOpen className="w-8 h-8" />,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600">
              <School className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">TKA Online</h1>
              <p className="text-xs text-slate-500 font-medium">Platform Simulasi</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 pl-4 pr-2 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">Siswa Kelas 6</p>
              </div>
              <div className="size-9 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-600 shadow-sm overflow-hidden">
                <img src="https://picsum.photos/seed/student/100/100" alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
            <button 
              onClick={() => {
                onLogout();
                navigate('/');
              }}
              className="flex items-center justify-center size-10 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <button 
              onClick={() => {
                onLogout();
                navigate('/');
              }}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Keluar ke Beranda
            </button>
            <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wide text-blue-600 bg-blue-600/10 rounded-full uppercase">Student Dashboard</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Selamat Datang, {user.name.split(' ')[0]}! 👋</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl">Siap untuk menguji kemampuanmu? Pilih mata pelajaran di bawah ini untuk memulai simulasi ujian.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 min-w-[140px]">
              <div className="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">Selesai</span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">0<span className="text-slate-400 text-lg font-medium">/2</span></p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 min-w-[140px]">
              <div className="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-400">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">Skor Rata-rata</span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">-</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {subjects.map((subject) => (
            <motion.article 
              key={subject.id}
              whileHover={{ y: -4 }}
              className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-blue-600/50 transition-all duration-300"
            >
              <div className="p-8 relative z-10 flex flex-col h-full">
                <div className={`size-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${
                  subject.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                }`}>
                  {subject.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{subject.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 line-clamp-2">{subject.description}</p>
                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" /> {subject.questions} Soal
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium">
                    <Clock className="w-4 h-4" /> {subject.time} Menit
                  </span>
                </div>
                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-700">
                  <button 
                    onClick={() => navigate(`/exam/${subject.id}`)}
                    className={`w-full font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 group/btn ${
                      subject.color === 'blue' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900'
                    }`}
                  >
                    Mulai Ujian
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      <footer className="mt-auto py-8 text-center text-slate-400 dark:text-slate-600 text-sm">
        <p>© 2024 Platform Simulasi TKA. Butuh bantuan? <a className="text-blue-600 hover:underline" href="#">Hubungi Dukungan</a></p>
      </footer>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}
