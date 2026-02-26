import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, LayoutDashboard, FileText, Users, BarChart, Settings, LogOut, Search, RefreshCw, Download, Timer, StopCircle, Trophy, TrendingUp, TrendingDown, Bell, Cast, MessageSquare, PauseCircle, CheckCircle, ArrowLeft, Loader2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { dbService, Profile } from '../services/db';

interface TeacherDashboardProps {
  user: { name: string; id: string };
  onLogout: () => void;
}

export default function TeacherDashboard({ user, onLogout }: TeacherDashboardProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('Semua');
  const [allStudents, setAllStudents] = useState<Profile[]>([]);
  const [examResults, setExamResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const studentsData = await dbService.getProfiles('student');
      setAllStudents(studentsData);

      const resultsData = await dbService.getAllExamResults();
      setExamResults(resultsData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const studentsWithData = allStudents.map(student => {
    const studentResults = examResults.filter(result => result.student_id === student.id);
    const totalScore = studentResults.reduce((sum, result) => sum + result.score, 0);
    const averageScore = studentResults.length > 0 ? (totalScore / studentResults.length) : null;
    
    // Simulate status and progress for now, as real-time status isn't implemented yet
    const statusOptions = ['Online', 'Idle (2m)', 'Offline'];
    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const randomProgress = Math.floor(Math.random() * 100);
    const classOptions = ['5A', '5B', '6A', '6B'];
    const randomClass = classOptions[Math.floor(Math.random() * classOptions.length)];

    const initials = student.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    const colors = ['blue', 'amber', 'red', 'indigo', 'teal'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return {
      id: student.id,
      name: student.full_name,
      status: randomStatus, // Placeholder
      progress: randomProgress, // Placeholder
      score: averageScore ? averageScore.toFixed(1) : null,
      initials: initials,
      color: randomColor,
      class: randomClass,
    };
  });

  const filteredStudents = studentsWithData.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedClass === 'Semua' || student.class === selectedClass)
  );

  const totalStudents = allStudents.length;
  const studentsInProgress = studentsWithData.filter(s => s.status === 'Online' || s.status.includes('Idle')).length;
  const studentsCompleted = studentsWithData.filter(s => s.score !== null).length;
  const overallAverageScore = studentsCompleted > 0 ? (studentsWithData.filter(s => s.score !== null).reduce((sum, s) => sum + parseFloat(s.score as string), 0) / studentsCompleted) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="ml-3 text-lg text-slate-700 dark:text-slate-300">Memuat data...</p>
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
          <button onClick={() => navigate('/teacher/dashboard')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-600/20 text-blue-600 font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm">Dashboard</span>
          </button>
          <button onClick={() => navigate('/teacher/bank-soal')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
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
            {/* Banner */}
            <div className="relative w-full rounded-xl overflow-hidden min-h-[180px] bg-blue-600 shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700/90 to-blue-500/40"></div>
              <img src="https://picsum.photos/seed/banner/1200/400" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 flex flex-col justify-center px-8">
                <div className="flex items-center gap-2 mb-2 text-white/80">
                  <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-medium backdrop-blur-sm">Sesi Langsung</span>
                  <span className="text-xs font-medium">• Terakhir diperbarui: Baru saja</span>
                </div>
                <h1 className="text-white text-3xl font-bold leading-tight tracking-tight">Simulasi TKA - Angkatan 2023</h1>
                <p className="text-white/90 mt-2 text-base font-medium max-w-xl">Pantau kemajuan siswa secara real-time untuk tryout Matematika dan Bahasa Indonesia.</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32">
                <div className="flex justify-between items-start">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Kelas 5A</span>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Siswa</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalStudents}</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div className="bg-orange-50 dark:bg-orange-900/30 p-2 rounded-lg text-orange-500 relative">
                    <span className="flex h-2 w-2 absolute top-0 right-0 -mt-1 -mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    <Timer className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">+{studentsInProgress} Aktif</span>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Sedang Berlangsung</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{studentsInProgress}</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32">
                <div className="flex justify-between items-start">
                  <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-lg text-green-600">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Selesai</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{studentsCompleted}</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32">
                <div className="flex justify-between items-start">
                  <div className="bg-purple-50 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> 1.2%
                  </span>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Skor Rata-rata</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{overallAverageScore ? overallAverageScore.toFixed(1) : '--'}</p>
                </div>
              </div>
            </div>

            {/* Monitoring Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex-1 flex flex-col">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 sm:text-sm" 
                      placeholder="Cari siswa..." 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select 
                    className="block w-full sm:w-40 pl-3 pr-10 py-2 text-sm border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-blue-600 focus:border-blue-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="Semua">Kelas: Semua</option>
                    <option value="5A">Kelas: 5A</option>
                    <option value="5B">Kelas: 5B</option>
                    <option value="6A">Kelas: 6A</option>
                    <option value="6B">Kelas: 6B</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={fetchData}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-sm font-medium"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Segarkan
                  </button>
                  <button 
                    onClick={() => alert('Fungsionalitas ekspor akan datang!')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-bold shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Ekspor
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Siswa</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kelas</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kemajuan</th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Skor (Est)</th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs mr-3 ${
                              student.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                              student.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                              student.color === 'red' ? 'bg-red-100 text-red-600' :
                              student.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                              'bg-teal-100 text-teal-600'
                            }`}>
                              {student.initials}
                            </div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">{student.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          {student.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.status === 'Online' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
                            student.status.includes('Idle') ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
                            'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 max-w-[100px]">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${student.progress}%` }}></div>
                          </div>
                          <span className="text-xs text-slate-500 mt-1">{student.progress}%</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-slate-900 dark:text-white">
                          {student.score || '--'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex items-center justify-center gap-2">
                            <button className="text-slate-400 hover:text-blue-600 transition-colors">
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            <button className="text-slate-400 hover:text-red-500 transition-colors">
                              <PauseCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
