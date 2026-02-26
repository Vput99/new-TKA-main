import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { School, Timer, PauseCircle, Flag, ArrowLeft, ArrowRight, CheckCircle, Grid, Loader2, Image as ImageIcon, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { dbService, Question, QuestionOption } from '../services/db';

interface ExamWorkspaceProps {
  user: { name: string; id: string };
  onLogout: () => void;
}

export default function ExamWorkspace({ user, onLogout }: ExamWorkspaceProps) {
  const { subject } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flagged, setFlagged] = useState<string[]>([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        // In a real app, we'd get the subject ID from the subject name or a lookup
        // For now, we'll fetch all subjects and find the match
        const subjects = await dbService.getSubjects();
        const matchedSubject = subjects.find(s => s.name.toLowerCase().includes(subject?.replace('-', ' ') || ''));
        
        if (matchedSubject) {
          const data = await dbService.getQuestions(matchedSubject.id);
          setQuestions(data);
        }
      } catch (err) {
        console.error('Failed to fetch questions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [subject]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const toggleFlag = (questionId: string) => {
    setFlagged(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId) 
        : [...prev, questionId]
    );
  };

  const currentQuestion = questions[currentQuestionIdx];
  const totalQuestions = questions.length;

  const loadDemoQuestions = () => {
    setQuestions([
      {
        id: '1',
        subject_id: 'math',
        type: 'multiple_choice',
        question_text: 'Berapakah hasil dari 15 x 4?',
        options: [
          { id: 'a', text: '50' },
          { id: 'b', text: '60' },
          { id: 'c', text: '70' },
          { id: 'd', text: '80' }
        ],
        correct_answer: 'b'
      },
      {
        id: '2',
        subject_id: 'math',
        type: 'multiple_answer',
        question_text: 'Manakah dari bilangan berikut yang merupakan bilangan prima?',
        options: [
          { id: 'a', text: '2' },
          { id: 'b', text: '4' },
          { id: 'c', text: '7' },
          { id: 'd', text: '9' }
        ],
        correct_answer: ['a', 'c']
      },
      {
        id: '3',
        subject_id: 'math',
        type: 'true_false',
        question_text: 'Sudut siku-siku memiliki besar 90 derajat.',
        correct_answer: 'Benar'
      },
      {
        id: '4',
        subject_id: 'math',
        type: 'table_true_false',
        question_text: 'Tentukan apakah pernyataan dalam tabel berikut Benar atau Salah.',
        table_data: {
          headers: ['Pernyataan'],
          rows: [
            { id: 'r1', text: '2 + 2 = 4' },
            { id: 'r2', text: '5 x 3 = 12' },
            { id: 'r3', text: '10 / 2 = 5' }
          ]
        },
        correct_answer: { r1: true, r2: false, r3: true }
      }
    ]);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Memuat Soal Ujian...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4 text-center p-6">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <Grid className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">Tidak Ada Soal</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xs">Belum ada soal yang tersedia untuk mata pelajaran ini atau database belum terhubung.</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={loadDemoQuestions} 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Muat Soal Demo
            </button>
            <button onClick={() => navigate('/dashboard')} className="text-slate-500 font-medium hover:underline">Kembali ke Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      // Calculate score
      let correctCount = 0;
      questions.forEach(q => {
        const userAnswer = answers[q.id];
        const correctAnswer = q.correct_answer;

        if (q.type === 'multiple_choice' || q.type === 'true_false') {
          if (userAnswer === correctAnswer) correctCount++;
        } else if (q.type === 'multiple_answer') {
          if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
            const isMatch = userAnswer.length === correctAnswer.length && 
                           userAnswer.every(val => correctAnswer.includes(val));
            if (isMatch) correctCount++;
          }
        } else if (q.type === 'table_true_false') {
          if (typeof userAnswer === 'object' && typeof correctAnswer === 'object') {
            const keys = Object.keys(correctAnswer);
            const isMatch = keys.every(key => userAnswer[key] === correctAnswer[key]);
            if (isMatch) correctCount++;
          }
        }
      });

      const score = Math.round((correctCount / totalQuestions) * 100);
      
      // Only submit if not in demo mode
      if (!user.id.includes('demo')) {
        await dbService.submitExamResult(user.id, questions[0].subject_id, score);
      }
      
      navigate('/results', { state: { score, totalQuestions, correctCount, answers, questions } });
    } catch (err) {
      console.error('Failed to submit exam:', err);
      alert('Gagal mengumpulkan ujian. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-none h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (window.confirm('Apakah Anda yakin ingin keluar dari ujian? Kemajuan Anda mungkin tidak tersimpan.')) {
                navigate('/dashboard');
              }
            }}
            className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="p-2 bg-blue-600/10 rounded-lg text-blue-600">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight capitalize">{subject?.replace('-', ' ')} TKA</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{user.name}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700">
          <Timer className="w-5 h-5 text-blue-600" />
          <span className="text-lg font-bold font-mono tracking-widest text-blue-600">{formatTime(timeLeft)}</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors text-sm font-bold">
            <PauseCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Jeda</span>
          </button>
          <button 
            onClick={() => setShowSubmitModal(true)}
            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
          >
            <Flag className="w-4 h-4" />
            <span className="hidden sm:inline">Selesai Ujian</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-10 hidden lg:flex">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Navigasi Soal</h3>
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-600"></div><span>Saat Ini</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500"></div><span>Terjawab</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full border border-slate-300 bg-slate-50 dark:bg-slate-800"></div><span>Belum Terjawab</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-orange-400"></div><span>Ditandai</span></div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            <div className="grid grid-cols-5 gap-2">
                {questions.map((q, i) => {
                  const isCurrent = currentQuestionIdx === i;
                  const isAnswered = answers[q.id] !== undefined;
                  const isFlagged = flagged.includes(q.id);
                  
                  let bgColor = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
                  let textColor = 'text-slate-600 dark:text-slate-400';
                  
                  if (isCurrent) {
                    bgColor = 'bg-blue-600 ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-slate-900';
                    textColor = 'text-white';
                  } else if (isFlagged) {
                    bgColor = 'bg-orange-100 border-orange-400 dark:bg-orange-900/30';
                    textColor = 'text-orange-600 dark:text-orange-400';
                  } else if (isAnswered) {
                    bgColor = 'bg-green-500';
                    textColor = 'text-white';
                  }

                  return (
                    <button 
                      key={q.id}
                      onClick={() => setCurrentQuestionIdx(i)}
                      className={`aspect-square flex items-center justify-center rounded border font-medium text-sm transition-all ${bgColor} ${textColor}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
            </div>
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>Kemajuan</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {Math.round((Object.keys(answers).length / totalQuestions) * 100)}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-500" 
                style={{ width: `${(Object.keys(answers).length / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 md:p-8 lg:p-12 flex justify-center">
          <div className="w-full max-w-4xl flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Soal {currentQuestionIdx + 1}</h2>
              <button 
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  flagged.includes(currentQuestion.id) 
                    ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' 
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Flag className="w-4 h-4" />
                <span>{flagged.includes(currentQuestion.id) ? 'Ditandai' : 'Tandai untuk Ditinjau'}</span>
              </button>
            </div>

            <motion.div 
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-10"
            >
              {currentQuestion.image_url && (
                <div className="mb-8 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                  <img src={currentQuestion.image_url} alt="Question" className="max-h-80 mx-auto object-contain" referrerPolicy="no-referrer" />
                </div>
              )}

              <div className="prose prose-slate dark:prose-invert max-w-none mb-10">
                <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
                  {currentQuestion.question_text}
                </p>
              </div>

              {/* Question Types Rendering */}
              {currentQuestion.type === 'multiple_choice' && (
                <div className="flex flex-col gap-3">
                  {currentQuestion.options?.map((option) => {
                    const isSelected = answers[currentQuestion.id] === option.id;
                    return (
                      <label 
                        key={option.id}
                        className={`group relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-600/5' 
                            : 'border-slate-200 dark:border-slate-800 hover:border-blue-600/50 hover:bg-blue-600/5'
                        }`}
                      >
                        <input 
                          className="sr-only" 
                          name={`question_${currentQuestion.id}`} 
                          type="radio"
                          checked={isSelected}
                          onChange={() => handleAnswer(currentQuestion.id, option.id)}
                        />
                        <div className={`flex-none h-6 w-6 rounded-full border-2 transition-all mr-4 ${
                          isSelected ? 'border-blue-600 border-[6px] bg-white' : 'border-slate-300 bg-white'
                        }`}></div>
                        <span className={`flex-none w-8 font-bold ${isSelected ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'}`}>
                          {option.id}
                        </span>
                        <div className="flex flex-col gap-2 flex-1">
                          <span className={`font-medium text-base ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                            {option.text}
                          </span>
                          {option.image_url && (
                            <img src={option.image_url} alt={option.id} className="mt-2 h-24 w-auto object-contain rounded border border-slate-200 dark:border-slate-700" referrerPolicy="no-referrer" />
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'multiple_answer' && (
                <div className="flex flex-col gap-3">
                  {currentQuestion.options?.map((option) => {
                    const currentAnswers = answers[currentQuestion.id] || [];
                    const isSelected = currentAnswers.includes(option.id);
                    return (
                      <label 
                        key={option.id}
                        className={`group relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-600/5' 
                            : 'border-slate-200 dark:border-slate-800 hover:border-blue-600/50 hover:bg-blue-600/5'
                        }`}
                      >
                        <input 
                          className="sr-only" 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            const newAnswers = isSelected 
                              ? currentAnswers.filter((a: string) => a !== option.id)
                              : [...currentAnswers, option.id];
                            handleAnswer(currentQuestion.id, newAnswers);
                          }}
                        />
                        <div className={`flex-none h-6 w-6 rounded border-2 transition-all mr-4 flex items-center justify-center ${
                          isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className={`flex-none w-8 font-bold ${isSelected ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'}`}>
                          {option.id}
                        </span>
                        <span className={`font-medium text-base ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                          {option.text}
                        </span>
                        {option.image_url && (
                          <img src={option.image_url} alt={option.id} className="mt-2 h-24 w-auto object-contain rounded border border-slate-200 dark:border-slate-700" referrerPolicy="no-referrer" />
                        )}
                      </label>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'true_false' && (
                <div className="flex gap-4">
                  {['Benar', 'Salah'].map((val) => {
                    const isSelected = answers[currentQuestion.id] === val;
                    return (
                      <button
                        key={val}
                        onClick={() => handleAnswer(currentQuestion.id, val)}
                        className={`flex-1 py-6 rounded-xl border-2 font-bold text-lg transition-all ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-600 text-white' 
                            : 'border-slate-200 dark:border-slate-800 hover:border-blue-600/50 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'table_true_false' && currentQuestion.table_data && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-slate-200 dark:border-slate-800">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        {currentQuestion.table_data.headers.map((h, i) => (
                          <th key={i} className="border border-slate-200 dark:border-slate-800 p-3 text-left text-sm font-bold">{h}</th>
                        ))}
                        <th className="border border-slate-200 dark:border-slate-800 p-3 text-center text-sm font-bold w-24">Benar</th>
                        <th className="border border-slate-200 dark:border-slate-800 p-3 text-center text-sm font-bold w-24">Salah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentQuestion.table_data.rows.map((row) => {
                        const rowAnswers = answers[currentQuestion.id] || {};
                        return (
                          <tr key={row.id}>
                            <td className="border border-slate-200 dark:border-slate-800 p-3 text-sm">{row.text}</td>
                            {/* Assuming headers are handled, we just show the text for now */}
                            <td className="border border-slate-200 dark:border-slate-800 p-3 text-center">
                              <button 
                                onClick={() => handleAnswer(currentQuestion.id, { ...rowAnswers, [row.id]: true })}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mx-auto transition-all ${
                                  rowAnswers[row.id] === true ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                                }`}
                              >
                                {rowAnswers[row.id] === true && <Check className="w-4 h-4" />}
                              </button>
                            </td>
                            <td className="border border-slate-200 dark:border-slate-800 p-3 text-center">
                              <button 
                                onClick={() => handleAnswer(currentQuestion.id, { ...rowAnswers, [row.id]: false })}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mx-auto transition-all ${
                                  rowAnswers[row.id] === false ? 'border-red-600 bg-red-600 text-white' : 'border-slate-300'
                                }`}
                              >
                                {rowAnswers[row.id] === false && <X className="w-4 h-4" />}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {currentQuestion.type === 'short_answer' && (
                <div className="flex flex-col gap-4">
                  <textarea
                    className="w-full p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-base"
                    rows={5}
                    placeholder="Ketik jawaban Anda di sini..."
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  ></textarea>
                </div>
              )}

              {currentQuestion.type === 'matching' && currentQuestion.options && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">Item Kiri</h4>
                      {currentQuestion.options.filter(opt => opt.id.startsWith('left_')).map((leftItem) => (
                        <div key={leftItem.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                          {leftItem.text}
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">Item Kanan</h4>
                      {currentQuestion.options.filter(opt => opt.id.startsWith('right_')).map((rightItem) => (
                        <select
                          key={rightItem.id}
                          className="w-full p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          value={(answers[currentQuestion.id] && answers[currentQuestion.id][rightItem.id]) || ''}
                          onChange={(e) => {
                            const newAnswers = { ...answers[currentQuestion.id], [rightItem.id]: e.target.value };
                            handleAnswer(currentQuestion.id, newAnswers);
                          }}
                        >
                          <option value="">Pilih Pasangan</option>
                          {currentQuestion.options.filter(opt => opt.id.startsWith('left_')).map((leftItem) => (
                            <option key={leftItem.id} value={leftItem.id}>{leftItem.text}</option>
                          ))}
                        </select>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            <div className="flex items-center justify-between pt-4 pb-12">
              <button 
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5" />
                Sebelumnya
              </button>
              <button 
                onClick={() => {
                  if (currentQuestionIdx < totalQuestions - 1) {
                    setCurrentQuestionIdx(currentQuestionIdx + 1);
                  } else {
                    setShowSubmitModal(true);
                  }
                }}
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
              >
                {currentQuestionIdx === totalQuestions - 1 ? 'Selesai' : 'Selanjutnya'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Submit Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-6 text-center"
            >
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Selesaikan Ujian?</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Anda telah menjawab {Object.keys(answers).length} dari {totalQuestions} soal. Apakah Anda yakin ingin mengumpulkan jawaban Anda? Anda tidak dapat mengubahnya setelah dikumpulkan.
              </p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setShowSubmitModal(false)}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Kembali
                </button>
                <button 
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                >
                  Kumpulkan Ujian
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
