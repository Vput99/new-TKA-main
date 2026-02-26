import { useNavigate, useLocation } from 'react-router-dom';
import { School, CheckCircle, XCircle, LayoutDashboard, FileText, Download, Calculator, Trophy, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface ResultSummaryProps {
  user: { name: string; id: string };
  onLogout: () => void;
}

export default function ResultSummary({ user, onLogout }: ResultSummaryProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, totalQuestions, correctCount, answers, questions } = location.state || { 
    score: 0, 
    totalQuestions: 0, 
    correctCount: 0, 
    answers: {}, 
    questions: [] 
  };

  const getStatus = (s: number) => {
    if (s >= 90) return { text: 'Sangat Baik', color: 'text-green-600', bg: 'bg-green-100' };
    if (s >= 75) return { text: 'Baik', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (s >= 60) return { text: 'Cukup', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { text: 'Perlu Belajar Lagi', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const status = getStatus(score);

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="size-8 text-blue-600 flex items-center justify-center">
            <School className="w-6 h-6" />
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">TKA Simulation Portal</h2>
        </div>
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-9">
            <button onClick={() => navigate('/dashboard')} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-600 text-sm font-medium leading-normal transition-colors">Beranda</button>
            <button className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-600 text-sm font-medium leading-normal transition-colors">Ujian Saya</button>
            <button className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-600 text-sm font-medium leading-normal transition-colors">Profil</button>
          </nav>
          <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-slate-100 dark:border-slate-700 overflow-hidden">
            <img src="https://picsum.photos/seed/student/100/100" alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col max-w-5xl w-full gap-8">
          {/* Celebration Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-800"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-10 h-10 text-green-500" />
                <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold tracking-tight">Ujian Selesai!</h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-lg">Anda telah berhasil mengumpulkan <span className="font-medium text-slate-900 dark:text-white">Sesi Tryout TKA 1</span>.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={() => navigate('/exam/review', { state: { questions, answers } })}
                className="flex-1 md:flex-none justify-center items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <FileText className="w-5 h-5" />
                Tinjau Jawaban
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex-1 md:flex-none justify-center items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm shadow-blue-200 dark:shadow-none"
              >
                <LayoutDashboard className="w-5 h-5" />
                Kembali ke Beranda
              </button>
            </div>
          </motion.div>

          {/* Stats Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Main Score Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-4 bg-blue-600 text-white rounded-xl p-8 flex flex-col justify-center items-center text-center shadow-lg shadow-blue-200 dark:shadow-none relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
              <h3 className="text-blue-100 text-lg font-medium mb-4 relative z-10">Total Skor Anda</h3>
              <div className="relative size-40 mb-4 z-10">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                  <path className="text-blue-400/30" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
                  <path className="text-white drop-shadow-md" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${score}, 100`} strokeLinecap="round" strokeWidth="3.5"></path>
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <span className="text-5xl font-bold tracking-tighter">{score}</span>
                  <span className="text-sm font-medium text-blue-100">/ 100</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium relative z-10">
                <Trophy className="w-4 h-4" />
                {status.text}
              </div>
            </motion.div>

            {/* Detail Stats */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-blue-600/30 transition-colors">
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-600 dark:text-slate-400 w-fit">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalQuestions}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Soal</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-green-500/30 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-green-600 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full font-bold">{Math.round((correctCount / totalQuestions) * 100)}%</span>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{correctCount}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Jawaban Benar</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-red-500/30 transition-colors">
                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-red-600 dark:text-red-400 w-fit">
                  <XCircle className="w-5 h-5" />
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalQuestions - correctCount}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Jawaban Salah</p>
                </div>
              </div>
              <div className="sm:col-span-3 bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white">Performa Keseluruhan</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Skor akhir Anda berdasarkan jawaban yang dikumpulkan.</p>
                  </div>
                  <span className="text-blue-600 font-bold text-lg">{score}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-blue-600 h-3 rounded-full"
                  ></motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Review Section */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tinjauan Jawaban</h3>
              <span className="text-sm text-slate-500">{questions.length} Soal Total</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {questions.map((q: any, i: number) => {
                const userAnswer = answers[q.id];
                const correctAnswer = q.correct_answer;
                let isCorrect = false;

                if (q.type === 'multiple_choice' || q.type === 'true_false') {
                  isCorrect = userAnswer === correctAnswer;
                } else if (q.type === 'multiple_answer') {
                  isCorrect = Array.isArray(userAnswer) && Array.isArray(correctAnswer) &&
                              userAnswer.length === correctAnswer.length && 
                              userAnswer.every((val: string) => correctAnswer.includes(val));
                } else if (q.type === 'table_true_false') {
                  if (userAnswer && typeof userAnswer === 'object' && typeof correctAnswer === 'object') {
                    const keys = Object.keys(correctAnswer);
                    isCorrect = keys.every(key => userAnswer[key] === correctAnswer[key]);
                  }
                }

                return (
                  <div key={q.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`size-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {i + 1}
                      </div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-1 max-w-md">
                        {q.question_text}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded uppercase">Benar</span>
                      ) : (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded uppercase">Salah</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-center pb-8">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              Butuh bantuan memahami hasil Anda? <a className="text-blue-600 hover:underline" href="#">Hubungi guru Anda</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

