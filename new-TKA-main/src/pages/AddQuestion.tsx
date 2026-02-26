import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, LayoutDashboard, FileText, Users, BarChart, Settings, LogOut, ArrowLeft, Loader2, XCircle, PlusCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { dbService, Question, Subject, QuestionType } from '../services/db';

interface AddQuestionProps {
  user: { name: string; id: string };
  onLogout: () => void;
}

export default function AddQuestion({ user, onLogout }: AddQuestionProps) {
  const navigate = useNavigate();
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType>('multiple_choice');
  const [subjectId, setSubjectId] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']); // For multiple_choice, multiple_answer
  const [correctAnswer, setCorrectAnswer] = useState<any>([]); // Can be string, array of strings, boolean
  const [explanation, setExplanation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const fetchedSubjects = await dbService.getSubjects();
        setSubjects(fetchedSubjects);
        if (fetchedSubjects.length > 0) {
          setSubjectId(fetchedSubjects[0].id); // Set default subject
        }
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
        setError('Gagal memuat mata pelajaran.');
      }
    };
    fetchSubjects();
  }, []);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCorrectAnswerChange = (value: any) => {
    if (questionType === 'multiple_choice' || questionType === 'short_answer') {
      setCorrectAnswer(value);
    } else if (questionType === 'multiple_answer') {
      setCorrectAnswer((prev: string[]) => 
        prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
      );
    } else if (questionType === 'true_false') {
      setCorrectAnswer(value === 'true');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!questionText || !subjectId || !correctAnswer) {
      setError('Semua bidang wajib diisi.');
      setIsLoading(false);
      return;
    }

    let formattedOptions: { id: string; text: string; }[] | undefined;
    if (questionType === 'multiple_choice' || questionType === 'multiple_answer') {
      formattedOptions = options.filter(opt => opt.trim() !== '').map((text, index) => ({ id: String.fromCharCode(65 + index), text }));
    }

    const newQuestion: Omit<Question, 'id'> = {
      subject_id: subjectId,
      type: questionType,
      question_text: questionText,
      image_url: imageUrl || undefined,
      options: formattedOptions,
      correct_answer: correctAnswer,
      explanation: explanation || undefined,
    };

    try {
      await dbService.addQuestion(newQuestion);
      setSuccess('Soal berhasil ditambahkan!');
      setQuestionText('');
      setImageUrl('');
      setOptions(['', '', '', '']);
      setCorrectAnswer([]);
      setExplanation('');
    } catch (err: any) {
      console.error('Failed to add question:', err);
      setError(`Gagal menambahkan soal: ${err.message || 'Terjadi kesalahan.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen flex overflow-hidden">
      {/* Sidebar (simplified for this component) */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col hidden lg:flex h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3">
          <button 
            onClick={() => navigate('/teacher/bank-soal')}
            className="p-2 -ml-2 text-slate-400 hover:text-blue-600 transition-colors lg:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="bg-blue-600/10 rounded-full h-10 w-10 flex items-center justify-center text-blue-600">
            <School className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold leading-none">Admin TKA</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Portal Guru</p>
          </div>
        </div>
        <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto">
          <button onClick={() => navigate('/teacher/dashboard')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm">Dashboard</span>
          </button>
          <button onClick={() => navigate('/teacher/bank-soal')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-600/20 text-blue-600 font-medium transition-colors">
            <FileText className="w-5 h-5" />
            <span className="text-sm">Bank Soal</span>
          </button>
          <button onClick={() => navigate('/teacher/manajemen-siswa')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Users className="w-5 h-5" />
            <span className="text-sm">Manajemen Siswa</span>
          </button>
          <button onClick={() => navigate('/teacher/laporan')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <BarChart className="w-5 h-5" />
            <span className="text-sm">Laporan</span>
          </button>
          <button onClick={() => navigate('/teacher/pengaturan')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Settings className="w-5 h-5" />
            <span className="text-sm">Pengaturan</span>
          </button>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 border border-slate-200 overflow-hidden">
              <img src="https://picsum.photos/seed/teacher/100/100" alt="Teacher" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-slate-500">Guru Matematika</p>
            </div>
          </div>
          <button 
            onClick={() => {
              onLogout();
              navigate('/teacher/login');
            }}
            className="w-full flex items-center justify-center gap-2 rounded-lg h-10 px-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-white text-sm font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="lg:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-blue-600" />
            <span className="font-bold">Admin TKA</span>
          </div>
          <button className="text-slate-900 dark:text-white">
            <Settings className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/teacher/bank-soal')}
                className="text-slate-400 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Tambah Soal Baru</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400">Isi formulir di bawah ini untuk menambahkan soal baru ke bank soal.</p>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm font-medium flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col gap-6">
              <div>
                <label htmlFor="questionText" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Teks Soal</label>
                <textarea
                  id="questionText"
                  className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm h-32 p-2"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Masukkan teks soal di sini..."
                  required
                ></textarea>
              </div>
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">URL Gambar (Opsional)</label>
                <input
                  type="text"
                  id="imageUrl"
                  className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL gambar untuk soal (jika ada)"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Mata Pelajaran</label>
                <select
                  id="subject"
                  className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  required
                >
                  <option value="">Pilih Mata Pelajaran</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="questionType" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Tipe Soal</label>
                <select
                  id="questionType"
                  className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                  required
                >
                  <option value="multiple_choice">Pilihan Ganda</option>
                  <option value="multiple_answer">Pilihan Ganda Kompleks</option>
                  <option value="true_false">Benar/Salah</option>
                  <option value="short_answer">Isian Singkat</option>
                </select>
              </div>

              {(questionType === 'multiple_choice' || questionType === 'multiple_answer') && (
                <div className="flex flex-col gap-4">
                  <p className="block text-sm font-medium text-slate-700 dark:text-slate-200">Pilihan Jawaban</p>
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Pilihan ${String.fromCharCode(65 + index)}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {questionType === 'multiple_choice' && options.filter(opt => opt.trim() !== '').length > 0 && (
                <div>
                  <label htmlFor="correctAnswerMC" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Jawaban Benar (Pilihan Ganda)</label>
                  <select
                    id="correctAnswerMC"
                    className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                    value={correctAnswer as string}
                    onChange={(e) => handleCorrectAnswerChange(e.target.value)}
                    required
                  >
                    <option value="">Pilih Jawaban Benar</option>
                    {options.filter(opt => opt.trim() !== '').map((opt, index) => (
                      <option key={index} value={String.fromCharCode(65 + index)}>{String.fromCharCode(65 + index)}. {opt}</option>
                    ))}
                  </select>
                </div>
              )}

              {questionType === 'multiple_answer' && options.filter(opt => opt.trim() !== '').length > 0 && (
                <div>
                  <p className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Jawaban Benar (Pilihan Ganda Kompleks)</p>
                  <div className="flex flex-col gap-2">
                    {options.filter(opt => opt.trim() !== '').map((opt, index) => (
                      <label key={index} className="flex items-center gap-2 text-sm text-slate-900 dark:text-white">
                        <input
                          type="checkbox"
                          className="rounded text-blue-600 focus:ring-blue-600"
                          value={String.fromCharCode(65 + index)}
                          checked={Array.isArray(correctAnswer) && correctAnswer.includes(String.fromCharCode(65 + index))}
                          onChange={(e) => handleCorrectAnswerChange(e.target.value)}
                        />
                        <span>{String.fromCharCode(65 + index)}. {opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {questionType === 'true_false' && (
                <div>
                  <label htmlFor="correctAnswerTF" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Jawaban Benar (Benar/Salah)</label>
                  <select
                    id="correctAnswerTF"
                    className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                    value={correctAnswer === true ? 'true' : correctAnswer === false ? 'false' : ''}
                    onChange={(e) => handleCorrectAnswerChange(e.target.value)}
                    required
                  >
                    <option value="">Pilih Jawaban</option>
                    <option value="true">Benar</option>
                    <option value="false">Salah</option>
                  </select>
                </div>
              )}

              {questionType === 'short_answer' && (
                <div>
                  <label htmlFor="correctAnswerSA" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Jawaban Benar (Isian Singkat)</label>
                  <input
                    type="text"
                    id="correctAnswerSA"
                    className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                    value={correctAnswer as string}
                    onChange={(e) => handleCorrectAnswerChange(e.target.value)}
                    placeholder="Masukkan jawaban singkat yang benar"
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="explanation" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Penjelasan Jawaban (Opsional)</label>
                <textarea
                  id="explanation"
                  className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm h-24 p-2"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Penjelasan untuk jawaban yang benar"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <PlusCircle className="w-4 h-4" />
                )}
                {isLoading ? 'Menambahkan...' : 'Tambah Soal'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
