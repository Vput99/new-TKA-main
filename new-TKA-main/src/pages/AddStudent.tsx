import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, UserPlus, ArrowLeft, Loader2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { dbService, Profile } from '../services/db';

interface AddStudentProps {
  user: { name: string; id: string };
  onLogout: () => void;
}

export default function AddStudent({ user, onLogout }: AddStudentProps) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [nisn, setNisn] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const classOptions = ['5A', '5B', '6A', '6B'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!fullName || !nisn || !accessCode || !selectedClass) {
      setError('Semua bidang harus diisi.');
      setIsLoading(false);
      return;
    }

    try {
      const newStudent: Omit<Profile, 'id'> = {
        role: 'student',
        full_name: fullName,
        nisn: nisn,
        access_code: accessCode,
        class: selectedClass, // Assuming 'class' is a property in Profile
      };
      await dbService.addProfile(newStudent);
      setSuccess('Siswa berhasil ditambahkan!');
      setFullName('');
      setNisn('');
      setAccessCode('');
      setSelectedClass('');
    } catch (err: any) {
      console.error('Failed to add student:', err);
      setError(`Gagal menambahkan siswa: ${err.message || 'Terjadi kesalahan.'}`);
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
            onClick={() => navigate('/teacher/manajemen-siswa')}
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
          <button onClick={() => navigate('/teacher/bank-soal')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <FileText className="w-5 h-5" />
            <span className="text-sm">Bank Soal</span>
          </button>
          <button onClick={() => navigate('/teacher/manajemen-siswa')} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-600/20 text-blue-600 font-medium transition-colors">
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
                onClick={() => navigate('/teacher/manajemen-siswa')}
                className="text-slate-400 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Tambah Siswa Baru</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400">Isi formulir di bawah ini untuk menambahkan siswa baru ke sistem.</p>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm font-medium flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  id="fullName"
                  className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Masukkan nama lengkap siswa"
                  required
                />
              </div>
              <div>
                <label htmlFor="nisn" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">NISN</label>
                <input
                  type="text"
                  id="nisn"
                  className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  placeholder="Masukkan NISN siswa"
                  required
                />
              </div>
              <div>
                <label htmlFor="accessCode" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Kode Akses</label>
                <input
                  type="text"
                  id="accessCode"
                  className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Buat kode akses untuk siswa"
                  required
                />
              </div>
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Kelas</label>
                <select
                  id="class"
                  className="block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  required
                >
                  <option value="">Pilih Kelas</option>
                  {classOptions.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <button 
                type="submit"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                {isLoading ? 'Menambahkan...' : 'Tambah Siswa'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
