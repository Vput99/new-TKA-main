import { useNavigate, useLocation } from 'react-router-dom';
import { School, ArrowLeft, CheckCircle, XCircle, Flag, Loader2, Image as ImageIcon, Check, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { Question, QuestionOption } from '../services/db';

interface ExamReviewProps {
  user: { name: string; id: string };
  onLogout: () => void;
}

export default function ExamReview({ user, onLogout }: ExamReviewProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { questions, answers } = location.state || { questions: [], answers: {} };

  const getAnswerDisplay = (question: Question, userAnswer: any) => {
    if (question.type === 'multiple_choice' || question.type === 'true_false') {
      const option = question.options?.find(opt => opt.id === userAnswer);
      return option ? (
        <div className="flex flex-col items-start">
          <span>{option.text}</span>
          {option.image_url && <img src={option.image_url} alt={option.id} className="mt-2 h-24 w-auto object-contain rounded border border-slate-200 dark:border-slate-700" referrerPolicy="no-referrer" />}
        </div>
      ) : (userAnswer === 'Benar' || userAnswer === 'Salah' ? userAnswer : '-');
    } else if (question.type === 'multiple_answer') {
      if (!Array.isArray(userAnswer) || userAnswer.length === 0) return '-';
      return (
        <div className="flex flex-col items-start gap-2">
          {userAnswer.map((ansId: string) => {
            const option = question.options?.find(opt => opt.id === ansId);
            return option ? (
              <div key={ansId} className="flex flex-col items-start">
                <span>{option.text}</span>
                {option.image_url && <img src={option.image_url} alt={option.id} className="mt-2 h-24 w-auto object-contain rounded border border-slate-200 dark:border-slate-700" referrerPolicy="no-referrer" />}
              </div>
            ) : ansId;
          })}
        </div>
      );
    } else if (question.type === 'table_true_false') {
      if (!userAnswer || typeof userAnswer !== 'object') return '-';
      return Object.entries(userAnswer).map(([rowId, value]) => {
        const row = question.table_data?.rows.find((r: any) => r.id === rowId);
        return `${row ? row.text : rowId}: ${value ? 'Benar' : 'Salah'}`;
      }).join('; ');
    } else if (question.type === 'short_answer') {
      return userAnswer || '-';
    } else if (question.type === 'matching') {
      if (!userAnswer || typeof userAnswer !== 'object') return '-';
      return Object.entries(userAnswer).map(([rightId, leftId]) => {
        const rightItem = question.options?.find(opt => opt.id === rightId);
        const leftItem = question.options?.find(opt => opt.id === leftId);
        return `${rightItem ? rightItem.text : rightId} -> ${leftItem ? leftItem.text : leftId}`;
      }).join('; ');
    }
    return '-';
  };

  const getCorrectAnswerDisplay = (question: Question) => {
    if (question.type === 'multiple_choice' || question.type === 'true_false') {
      const option = question.options?.find(opt => opt.id === question.correct_answer);
      return option ? (
        <div className="flex flex-col items-start">
          <span>{option.text}</span>
          {option.image_url && <img src={option.image_url} alt={option.id} className="mt-2 h-24 w-auto object-contain rounded border border-slate-200 dark:border-slate-700" referrerPolicy="no-referrer" />}
        </div>
      ) : (question.correct_answer === 'Benar' || question.correct_answer === 'Salah' ? question.correct_answer : '-');
    } else if (question.type === 'multiple_answer') {
      if (!Array.isArray(question.correct_answer) || question.correct_answer.length === 0) return '-';
      return (
        <div className="flex flex-col items-start gap-2">
          {question.correct_answer.map((ansId: string) => {
            const option = question.options?.find(opt => opt.id === ansId);
            return option ? (
              <div key={ansId} className="flex flex-col items-start">
                <span>{option.text}</span>
                {option.image_url && <img src={option.image_url} alt={option.id} className="mt-2 h-24 w-auto object-contain rounded border border-slate-200 dark:border-slate-700" referrerPolicy="no-referrer" />}
              </div>
            ) : ansId;
          })}
        </div>
      );
    } else if (question.type === 'table_true_false') {
      if (!question.correct_answer || typeof question.correct_answer !== 'object') return '-';
      return Object.entries(question.correct_answer).map(([rowId, value]) => {
        const row = question.table_data?.rows.find((r: any) => r.id === rowId);
        return `${row ? row.text : rowId}: ${value ? 'Benar' : 'Salah'}`;
      }).join('; ');
    } else if (question.type === 'short_answer') {
      return question.correct_answer || '-';
    } else if (question.type === 'matching') {
      if (!question.correct_answer || typeof question.correct_answer !== 'object') return '-';
      return Object.entries(question.correct_answer).map(([rightId, leftId]) => {
        const rightItem = question.options?.find(opt => opt.id === rightId);
        const leftItem = question.options?.find(opt => opt.id === leftId);
        return `${rightItem ? rightItem.text : rightId} -> ${leftItem ? leftItem.text : leftId}`;
      }).join('; ');
    }
    return '-';
  };

  const isAnswerCorrect = (question: Question, userAnswer: any) => {
    if (question.type === 'multiple_choice' || question.type === 'true_false') {
      return userAnswer === question.correct_answer;
    } else if (question.type === 'multiple_answer') {
      if (!Array.isArray(userAnswer) || !Array.isArray(question.correct_answer)) return false;
      return userAnswer.length === question.correct_answer.length && 
             userAnswer.every((val: string) => question.correct_answer.includes(val));
    } else if (question.type === 'table_true_false') {
      if (!userAnswer || typeof userAnswer !== 'object' || !question.correct_answer || typeof question.correct_answer !== 'object') return false;
      const correctKeys = Object.keys(question.correct_answer);
      return correctKeys.every(key => userAnswer[key] === question.correct_answer[key]);
    } else if (question.type === 'short_answer') {
      if (typeof userAnswer !== 'string' || typeof question.correct_answer !== 'string') return false;
      return userAnswer.trim().toLowerCase() === question.correct_answer.trim().toLowerCase();
    } else if (question.type === 'matching') {
      if (!userAnswer || typeof userAnswer !== 'object' || !question.correct_answer || typeof question.correct_answer !== 'object') return false;
      const userMatches = Object.entries(userAnswer);
      return userMatches.every(([rightId, leftId]) => question.correct_answer[rightId] === leftId);
    }
    return false;
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/results')}
            className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
            title="Kembali ke Ringkasan Hasil"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="size-8 text-blue-600 flex items-center justify-center">
            <School className="w-6 h-6" />
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Tinjauan Ujian</h2>
        </div>
        <div className="flex items-center gap-8">
          <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-slate-100 dark:border-slate-700 overflow-hidden">
            <img src="https://picsum.photos/seed/student/100/100" alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col max-w-5xl w-full gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            {questions.length === 0 ? (
              <div className="text-center text-slate-500 dark:text-slate-400 text-lg">Tidak ada soal untuk ditinjau.</div>
            ) : (
              questions.map((q: Question, i: number) => {
                const userAnswer = answers[q.id];
                const correct = isAnswerCorrect(q, userAnswer);

                return (
                  <div key={q.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Soal {i + 1}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
                        correct ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {correct ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {correct ? 'Benar' : 'Salah'}
                      </span>
                    </div>

                    {q.image_url && (
                      <div className="mb-6 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                        <img src={q.image_url} alt="Question" className="max-h-80 mx-auto object-contain" referrerPolicy="no-referrer" />
                      </div>
                    )}

                    <div className="prose prose-slate dark:prose-invert max-w-none mb-6">
                      <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
                        {q.question_text}
                      </p>
                    </div>

                    {/* User Answer */} 
                    <div className="mb-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Jawaban Anda:</p>
                      <p className="text-base text-slate-900 dark:text-white font-medium">{getAnswerDisplay(q, userAnswer)}</p>
                    </div>

                    {/* Correct Answer */} 
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                      <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">Jawaban Benar:</p>
                      <p className="text-base text-green-900 dark:text-green-100 font-medium">{getCorrectAnswerDisplay(q)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>

          <div className="text-center pb-8">
            <button 
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm shadow-blue-200 dark:shadow-none"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
