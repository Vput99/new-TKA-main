import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, LayoutDashboard, FileText, Users, BarChart, Settings, LogOut, Search, PlusCircle, Filter, Edit, Trash2, ArrowLeft, Loader2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { dbService, Question, Subject } from '../services/db';

interface BankSoalProps {
  user: { name: string; id: string };
  onLogout: () => void;
}

export default function BankSoal({ user, onLogout }: BankSoalProps) {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const fetchedSubjects = await dbService.getSubjects();
      setSubjects(fetchedSubjects);

      const allQuestions = await dbService.getAllQuestions(); // Assuming a new method to get all questions
      setQuestions(allQuestions);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Gagal memuat data bank soal.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredQuestions = questions.filter(question => {
    const matchesSubject = selectedSubject === 'all' || question.subject_id === selectedSubject;
    const matchesSearch = question.question_text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="ml-3 text-lg text-slate-700 dark:text-slate-300">Memuat bank soal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-red-600 text-lg">
        <XCircle className="w-8 h-8 mr-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col hidden lg:flex h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3">
          <button 
            onClick={() => {
              onLogout();
              navigate('/');
            }}
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
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Bank Soal</h1>
            <p className="text-slate-600 dark:text-slate-400">Kelola dan tinjau koleksi soal ujian Anda.</p>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex-1 flex flex-col">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 sm:text-sm" 
                      placeholder="Cari soal..." 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select 
                    className="block w-full sm:w-40 pl-3 pr-10 py-2 text-sm border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-blue-600 focus:border-blue-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                  >
                    <option value="all">Semua Mata Pelajaran</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate('/teacher/add-question')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-bold shadow-sm">
                    <PlusCircle className="w-4 h-4" />
                    Tambah Soal Baru
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Soal</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Mata Pelajaran</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tipe</th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredQuestions.length > 0 ? (
                      filteredQuestions.map((question) => (
                        <tr key={question.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white max-w-xs truncate">
                            {question.question_text}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                            {subjects.find(s => s.id === question.subject_id)?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 capitalize">
                            {question.type.replace(/_/g, ' ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <div className="flex items-center justify-center gap-2">
                              <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-slate-400 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                          Tidak ada soal yang ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
