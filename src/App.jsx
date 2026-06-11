import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar, 
  Plus, 
  Trash2, 
  Search, 
  Bell, 
  LayoutDashboard, 
  CheckSquare, 
  AlertCircle,
  X,
  Hash,
  User,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  Mail,
  Lock,
  Filter,
  ChevronDown,
  StickyNote,
  Palette,
  Cake,
  Check,
  Volume2
} from 'lucide-react';

export default function App() {
  // -------------------------------------------------------------
  // LOCALSTORAGE PERSISTENCE
  // -------------------------------------------------------------
  const getInitialTasks = () => {
    const saved = localStorage.getItem('tf_tasks');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, title: 'Finalize Q3 Marketing Report', category: 'Fitness', priority: 'High', status: 'Pending', dueDate: '2026-06-09', dueTime: '14:00', section: 'Work', isBirthday: false },
      { id: 2, title: 'Study Chapter 4: Calculus', category: 'Groceries', priority: 'Medium', status: 'Completed', dueDate: '2026-06-08', dueTime: '16:30', section: 'Study', isBirthday: false },
      { id: 3, title: "Nix's Surprise Birthday Party 🎂", category: 'Appointments', priority: 'High', status: 'Pending', dueDate: '2026-06-12', dueTime: '20:00', section: 'Work', isBirthday: true },
      { id: 4, title: 'Schedule team alignment meeting', category: 'Appointments', priority: 'High', status: 'Pending', dueDate: '2026-06-07', dueTime: '11:00', section: 'Work', isBirthday: false },
      { id: 5, title: 'Dental checkup', category: 'Appointments', priority: 'Low', status: 'Pending', dueDate: '2026-06-15', dueTime: '09:00', section: 'Personal', isBirthday: false }
    ];
  };

  const getInitialNotes = () => {
    const saved = localStorage.getItem('tf_notes');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, content: 'Remember to look up formulas for derivatives', color: 'bg-amber-100 border-amber-400 text-amber-950 dark:bg-amber-900/60 dark:border-amber-700 dark:text-amber-100' },
      { id: 2, content: 'Bring sample mockups to team meeting', color: 'bg-rose-100 border-rose-400 text-rose-950 dark:bg-rose-900/60 dark:border-rose-700 dark:text-rose-100' }
    ];
  };

  // -------------------------------------------------------------
  // AUTHENTICATION & CORE STATES
  // -------------------------------------------------------------
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('tf_auth');
    if (saved) return JSON.parse(saved).loggedIn;
    return false;
  });
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState(() => {
    const saved = localStorage.getItem('tf_auth');
    if (saved) return { name: saved.name, email: saved.email, password: '' };
    return { name: '', email: '', password: '' };
  });
  const [authError, setAuthError] = useState('');

  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedSidebarProject, setSelectedSidebarProject] = useState('All');
  const [horizontalFilter, setHorizontalFilter] = useState('All');
  const [priorityLabelFilter, setPriorityLabelFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('2026-06-09');

  // Overdue notification state
  const [overdueAlert, setOverdueAlert] = useState(null);
  const [alarmMessage, setAlarmMessage] = useState(null);

  // New Task Form State
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'Fitness',
    priority: 'Medium',
    dueDate: '2026-06-09',
    dueTime: '12:00',
    section: 'Work',
    isBirthday: false
  });

  // Notes state
  const [notes, setNotes] = useState(getInitialNotes);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedNoteColor, setSelectedNoteColor] = useState('amber');
  const colorMap = {
    amber: 'bg-amber-100 border-amber-400 text-amber-950 dark:bg-amber-900/60 dark:border-amber-700 dark:text-amber-100',
    rose: 'bg-rose-100 border-rose-400 text-rose-950 dark:bg-rose-900/60 dark:border-rose-700 dark:text-rose-100',
    sky: 'bg-sky-100 border-sky-400 text-sky-950 dark:bg-sky-900/60 dark:border-sky-700 dark:text-sky-100',
    emerald: 'bg-emerald-100 border-emerald-400 text-emerald-950 dark:bg-emerald-900/60 dark:border-emerald-700 dark:text-emerald-100'
  };

  const [projects] = useState([
    { id: 'p1', name: 'Fitness', color: 'text-rose-500' },
    { id: 'p2', name: 'Groceries', color: 'text-amber-500' },
    { id: 'p3', name: 'Appointments', color: 'text-sky-500' },
    { id: 'p4', name: 'New Brand', color: 'text-purple-500' },
    { id: 'p5', name: 'Website Update', color: 'text-indigo-500' },
    { id: 'p6', name: 'Product Roadmap', color: 'text-emerald-500' }
  ]);

  const [tasks, setTasks] = useState(getInitialTasks);

  // Audio reference for alarm
  const audioRef = useRef(null);
  useEffect(() => {
    audioRef.current = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
    audioRef.current.load();
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem('tf_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('tf_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('tf_auth', JSON.stringify({ loggedIn: true, name: authForm.name, email: authForm.email }));
    } else {
      localStorage.removeItem('tf_auth');
    }
  }, [isAuthenticated, authForm]);

  // -------------------------------------------------------------
  // OVERDUE & ALARM LOGIC (new features)
  // -------------------------------------------------------------
  const checkOverdueTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = tasks.filter(t => {
      if (t.status === 'Completed') return false;
      const dueDate = new Date(t.dueDate);
      return !isNaN(dueDate.getTime()) && dueDate < today;
    });
    if (overdue.length > 0 && !overdueAlert) {
      setOverdueAlert(`⚠️ You have ${overdue.length} overdue task(s)!`);
      setTimeout(() => setOverdueAlert(null), 5000);
    }
  };

  const checkAlarms = () => {
    const now = new Date();
    const currentDateStr = now.toISOString().split('T')[0];
    const currentTimeStr = now.toTimeString().slice(0, 5); // HH:MM

    tasks.forEach(task => {
      if (task.status === 'Completed') return;
      if (task.dueDate === currentDateStr && task.dueTime === currentTimeStr) {
        if (audioRef.current) {
          audioRef.current.play().catch(e => console.log("Audio play failed", e));
        }
        setAlarmMessage(`🔔 ALARM: "${task.title}" is due now!`);
        setTimeout(() => setAlarmMessage(null), 8000);
      }
    });
  };

  // Run checks every minute
  useEffect(() => {
    checkOverdueTasks();
    const interval = setInterval(() => {
      checkOverdueTasks();
      checkAlarms();
    }, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!authForm.email || !authForm.password || (authMode === 'signup' && !authForm.name)) {
      setAuthError('Please fill in all operational fields correctly.');
      return;
    }
    setAuthError('');
    setIsAuthenticated(true);
  };

  const handleToggleTaskStatus = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    
    const finalTitle = newTask.isBirthday ? `${newTask.title} 🎂` : newTask.title;
    const finalPriority = newTask.isBirthday ? 'High' : newTask.priority;

    const node = {
      id: Date.now(),
      title: finalTitle,
      category: newTask.category,
      priority: finalPriority,
      status: 'Pending',
      dueDate: newTask.dueDate,
      dueTime: newTask.dueTime,
      section: newTask.section,
      isBirthday: newTask.isBirthday
    };

    setTasks([node, ...tasks]);
    setNewTask({
      title: '',
      category: 'Fitness',
      priority: 'Medium',
      dueDate: '2026-06-09',
      dueTime: '12:00',
      section: 'Work',
      isBirthday: false
    });
    setShowTaskModal(false);
  };

  const handleCreateNote = (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    const noteNode = {
      id: Date.now(),
      content: newNoteContent,
      color: colorMap[selectedNoteColor] || colorMap.amber
    };
    setNotes([noteNode, ...notes]);
    setNewNoteContent('');
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const getOverdueCount = () => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return tasks.filter(t => {
      if (t.status === 'Completed') return false;
      const d = new Date(t.dueDate);
      return isNaN(d.getTime()) ? false : d < today;
    }).length;
  };

  // Filtered tasks stream
  const filteredTasksStream = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSidebarProject = selectedSidebarProject === 'All' || task.category === selectedSidebarProject;
    
    if (activeTab === 'My Tasks' && task.status !== 'Pending') return false;
    if (activeTab === 'Calendar' && task.dueDate !== selectedCalendarDate) return false;

    if (horizontalFilter === 'Active' && task.status !== 'Pending') return false;
    if (horizontalFilter === 'Completed' && task.status !== 'Completed') return false;

    if (priorityLabelFilter !== 'All' && task.priority !== priorityLabelFilter) return false;

    return matchesSearch && matchesSidebarProject;
  });

  const totalItems = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const pendingCount = tasks.filter(t => t.status === 'Pending').length;
  const overdueCount = getOverdueCount();
  const metricsProgress = totalItems ? Math.round((completedCount / totalItems) * 100) : 0;

  // -------------------------------------------------------------
  // AUTH SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${darkMode ? 'bg-[#0f172a]' : 'bg-[#cbd5e1]'}`}>
        <div className={`w-full max-w-md rounded-3xl p-8 border-2 shadow-2xl transition-all ${darkMode ? 'bg-[#1e293b] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white p-2 rounded-xl">
                <CheckSquare className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight">TaskFlow <span className="text-xs text-indigo-500">v2.1</span></span>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
          <h2 className="text-xl font-black mb-1">{authMode === 'login' ? 'Welcome Back Node' : 'Create Cluster Session'}</h2>
          <p className="text-xs text-slate-400 mb-6">{authMode === 'login' ? 'Enter credentials to authorize pipeline access' : 'Register configuration keys to deploy workspace'}</p>
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider block text-slate-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Aliza Khan" value={authForm.name} onChange={(e) => setAuthForm({...authForm, name: e.target.value})} className={`w-full text-xs font-bold pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:border-indigo-500 ${darkMode ? 'bg-[#0f172a] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                </div>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider block text-slate-400">Email Pipeline</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" placeholder="aliza@workspace.com" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} className={`w-full text-xs font-bold pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:border-indigo-500 ${darkMode ? 'bg-[#0f172a] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider block text-slate-400">Access Key / Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="password" placeholder="••••••••" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} className={`w-full text-xs font-bold pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:border-indigo-500 ${darkMode ? 'bg-[#0f172a] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
            </div>
            {authError && <p className="text-[11px] text-rose-500 font-bold">{authError}</p>}
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-colors flex items-center justify-center gap-2 mt-2">
              {authMode === 'login' ? 'Authorize Session' : 'Deploy Cluster Initialization'}
            </button>
          </form>
          <div className="mt-6 text-center border-t border-slate-200 dark:border-slate-800 pt-4">
            <button onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(''); }} className="text-xs font-black text-indigo-500 hover:underline">
              {authMode === 'login' ? "Don't have an operational account? Signup" : 'Already configured workspace matrices? Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN APP UI (first code's look + extra features + alarm/overdue)
  // -------------------------------------------------------------
  return (
    <div className={`min-h-screen p-0 md:p-6 flex items-center justify-center font-sans transition-colors duration-200 ${darkMode ? 'bg-[#0f172a]' : 'bg-[#cbd5e1]'}`}>
      
      {/* Overdue & Alarm Notification Banners */}
      {overdueAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-black animate-bounce">
          {overdueAlert}
        </div>
      )}
      {alarmMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-amber-500 text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-black flex items-center gap-2 animate-pulse">
          <Volume2 className="w-5 h-5" /> {alarmMessage}
        </div>
      )}

      <div className={`w-full max-w-6xl rounded-3xl shadow-2xl border-2 overflow-hidden flex flex-col md:flex-row min-h-[86vh] transition-colors duration-200 ${darkMode ? 'bg-[#1e293b] border-slate-700' : 'bg-white border-slate-300'}`}>
        
        {/* SIDEBAR */}
        <aside className={`w-full md:w-60 border-r-2 p-4 flex flex-col justify-between gap-6 transition-colors duration-200 ${darkMode ? 'bg-[#0f172a] border-slate-700' : 'bg-[#f8fafc] border-slate-200'}`}>
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 px-1">
              <div className="bg-indigo-600 text-white p-1.5 rounded-xl shadow-md">
                <CheckSquare className="w-4.5 h-4.5" />
              </div>
              <span className={`text-base font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>TaskFlow <span className="text-xs text-indigo-500 font-normal">v2.1</span></span>
            </div>
            <div className="space-y-1">
              <button onClick={() => { setSelectedSidebarProject('All'); setActiveTab('Dashboard'); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${selectedSidebarProject === 'All' && activeTab === 'Dashboard' ? 'bg-indigo-600 text-white shadow-md' : darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-900 hover:bg-slate-200/60'}`}>
                <LayoutDashboard className="w-4 h-4" /> <span>All Task Layout</span>
              </button>
              <button onClick={() => { setActiveTab('My Tasks'); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'My Tasks' ? 'bg-indigo-600 text-white shadow-md' : darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-900 hover:bg-slate-200/60'}`}>
                <CheckSquare className="w-4 h-4" /> <span>Today's Stream</span>
              </button>
            </div>
            <div className="space-y-1">
              <span className={`text-[10px] font-black uppercase tracking-widest block px-3 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                <User className="w-3 h-3 inline mr-1.5" /> MY PROJECTS
              </span>
              <div className="space-y-0.5">
                {projects.map(p => (
                  <button key={p.id} onClick={() => { setSelectedSidebarProject(p.name); if(activeTab === 'Calendar') setActiveTab('Dashboard'); }} className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedSidebarProject === p.name && activeTab !== 'Calendar' ? (darkMode ? 'bg-slate-800 text-white font-black' : 'bg-slate-200 text-slate-950 font-black') : (darkMode ? 'text-slate-400 hover:bg-slate-800/40' : 'text-slate-700 hover:bg-slate-100')}`}>
                    <div className="flex items-center gap-2.5 truncate">
                      <Hash className={`w-4 h-4 flex-shrink-0 ${p.color}`} />
                      <span className="truncate">{p.name}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-950'}`}>
                      {tasks.filter(t => t.category === p.name).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className={`border-t pt-3 flex items-center justify-between px-1 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                {authForm.name ? authForm.name.substring(0,2).toUpperCase() : 'AK'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className={`text-xs font-black truncate ${darkMode ? 'text-white' : 'text-slate-950'}`}>{authForm.name || 'Aliza Khan'}</span>
                <span className="text-[10px] text-slate-400 truncate">{authForm.email || 'aliza@workspace.com'}</span>
              </div>
            </div>
            <button onClick={() => setIsAuthenticated(false)} className="text-slate-400 hover:text-rose-500 p-1.5 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col bg-transparent overflow-y-auto">
          
          {/* TOP BAR */}
          <header className={`border-b px-6 py-3.5 flex items-center justify-between relative z-30 ${darkMode ? 'bg-[#1e293b] border-slate-800' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center gap-6">
              {['Dashboard', 'My Tasks', 'Calendar'].map(tab => (
                <button key={tab} onClick={() => { setActiveTab(tab); setHorizontalFilter('All'); setPriorityLabelFilter('All'); }} className={`text-xs font-black pb-4 -mb-4 border-b-2 transition-all uppercase tracking-wider ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 relative">
              <button onClick={() => setDarkMode(!darkMode)} className={`p-1.5 rounded-xl border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <div className="relative">
                <button onClick={() => setShowNotifMenu(!showNotifMenu)} className={`p-1.5 rounded-xl relative transition-colors ${darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}>
                  <Bell className="w-4.5 h-4.5" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                </button>
                {showNotifMenu && (
                  <div className={`absolute right-0 top-10 w-72 border rounded-2xl shadow-2xl p-3 z-50 space-y-2 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b pb-1">System Activity Sync</p>
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-400">
                      All components synchronized.
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className={`w-7.5 h-7.5 rounded-xl font-black text-xs border flex items-center justify-center transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-950'}`}>
                {authForm.name ? authForm.name.substring(0,2).toUpperCase() : 'AK'}
              </button>
              {showProfileMenu && (
                <div className={`absolute right-0 top-10 w-48 border rounded-2xl shadow-2xl p-3 z-50 space-y-1.5 text-xs ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <p className={`font-black ${darkMode ? 'text-white' : 'text-slate-950'}`}>{authForm.name || 'Aliza Khan'}</p>
                  <button onClick={() => setIsAuthenticated(false)} className="w-full text-left px-2 py-1 rounded-lg font-black text-rose-500 hover:bg-rose-50/10 flex items-center gap-2">
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* METRICS CARDS */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 pt-5 pb-2">
            <div className={`border p-4 rounded-2xl flex items-center gap-3.5 transition-colors ${darkMode ? 'bg-[#0f172a]/40 border-slate-800' : 'bg-[#f8fafc] border-slate-200'}`}>
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-xl"><LayoutDashboard className="w-5 h-5" /></div>
              <div><p className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total Tasks</p><h4 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-950'}`}>{totalItems}</h4></div>
            </div>
            <div className={`border p-4 rounded-2xl flex items-center gap-3.5 transition-colors ${darkMode ? 'bg-[#0f172a]/40 border-slate-800' : 'bg-[#f8fafc] border-slate-200'}`}>
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl"><CheckCircle2 className="w-5 h-5" /></div>
              <div><p className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Completed</p><h4 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-950'}`}>{completedCount}</h4></div>
            </div>
            <div className={`border p-4 rounded-2xl flex items-center gap-3.5 transition-colors ${darkMode ? 'bg-[#0f172a]/40 border-slate-800' : 'bg-[#f8fafc] border-slate-200'}`}>
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 text-amber-500 rounded-xl"><Clock className="w-5 h-5" /></div>
              <div><p className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pending</p><h4 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-950'}`}>{pendingCount}</h4></div>
            </div>
            <div className={`border p-4 rounded-2xl flex items-center gap-3.5 transition-colors ${darkMode ? 'bg-[#0f172a]/40 border-slate-800' : 'bg-[#f8fafc] border-slate-200'}`}>
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-xl"><AlertCircle className="w-5 h-5" /></div>
              <div><p className={`text-[10px] font-black uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Overdue</p><h4 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-950'}`}>{overdueCount}</h4></div>
            </div>
          </section>

          {/* FILTERS + PRIORITY DROPDOWN */}
          {activeTab !== 'Calendar' && (
            <div className="px-6 pt-3 pb-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className={`flex items-center gap-1 p-1 rounded-xl ${darkMode ? 'bg-slate-800/80' : 'bg-slate-100'}`}>
                {['All', 'Active', 'Completed'].map(pill => (
                  <button key={pill} onClick={() => setHorizontalFilter(pill)} className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${horizontalFilter === pill ? (darkMode ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-950 shadow-sm') : 'text-slate-400 hover:text-slate-600'}`}>
                    {pill === 'Completed' ? '✓ Task Completed' : pill}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Priority Filter Dropdown */}
                <div className="relative">
                  <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider border ${priorityLabelFilter !== 'All' ? 'bg-indigo-600 text-white border-indigo-600' : darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
                    <Filter className="w-3.5 h-3.5" /> Priority: {priorityLabelFilter} <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {showFilterDropdown && (
                    <div className={`absolute right-0 mt-2 w-36 border rounded-xl shadow-lg z-40 p-1 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                      {['All', 'High', 'Medium', 'Low'].map(level => (
                        <button key={level} onClick={() => { setPriorityLabelFilter(level); setShowFilterDropdown(false); }} className={`w-full text-left px-3 py-1.5 text-xs font-black rounded-lg ${priorityLabelFilter === level ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600' : darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}`}>
                          {level === 'All' ? 'Clear filter' : level}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search task nodes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full sm:w-52 border rounded-xl pl-9 pr-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500 ${darkMode ? 'bg-[#0f172a]/60 border-slate-700 text-white' : 'bg-[#f8fafc] border-slate-200 text-slate-950'}`} />
                </div>
                <button onClick={() => setShowTaskModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1 shadow-md uppercase tracking-wider whitespace-nowrap">
                  <Plus className="w-4 h-4" /> Add Task & Timer
                </button>
              </div>
            </div>
          )}

          {/* DYNAMIC CONTENT */}
          <main className="flex-1 px-6 py-2 overflow-y-auto space-y-4">
            {activeTab === 'Calendar' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`border p-4 rounded-2xl lg:col-span-2 ${darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-[#f8fafc] border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-indigo-400' : 'text-slate-950'}`}>Calendar Grid</h3>
                    <span className="text-xs font-black text-indigo-600">June 2026</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-black text-slate-400 uppercase mb-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d}>{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 30 }).map((_, idx) => {
                      const dayNumber = idx + 1;
                      const dateString = `2026-06-${dayNumber < 10 ? '0' + dayNumber : dayNumber}`;
                      const hasTasks = tasks.some(t => t.dueDate === dateString);
                      const isSelected = selectedCalendarDate === dateString;
                      return (
                        <button key={idx} onClick={() => setSelectedCalendarDate(dateString)} className={`p-2.5 rounded-xl font-black text-xs relative flex flex-col items-center justify-center border transition-all ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : darkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-950 hover:bg-slate-100'}`}>
                          <span>{dayNumber}</span>
                          {hasTasks && <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-rose-500'}`}></span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="border-b pb-2 flex items-center justify-between">
                    <h3 className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-950'}`}>Tasks for {selectedCalendarDate}</h3>
                  </div>
                  {filteredTasksStream.length === 0 ? (
                    <p className="text-xs font-bold text-slate-400 py-6 text-center border border-dashed rounded-2xl">No tasks</p>
                  ) : (
                    filteredTasksStream.map(task => (
                      <div key={task.id} className={`border rounded-xl p-3.5 space-y-2 ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-2">
                          {task.isBirthday && <Cake className="w-3.5 h-3.5 text-purple-500" />}
                          <span className={`w-2 h-2 rounded-full ${task.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          <h4 className={`text-xs font-black truncate ${task.status === 'Completed' ? 'line-through text-slate-400' : darkMode ? 'text-white' : 'text-slate-950'}`}>{task.title}</h4>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-black text-slate-400">
                          <span className="uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{task.category}</span>
                          <span className={task.priority === 'High' ? 'text-rose-500' : 'text-amber-500'}>{task.priority}</span>
                        </div>
                        {task.dueTime && <div className="text-[10px] font-black text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {task.dueTime}</div>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b-2 pb-2 border-slate-100 dark:border-slate-800">
                  <h2 className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-indigo-400' : 'text-slate-950'}`}>{selectedSidebarProject} / {activeTab}</h2>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
                {filteredTasksStream.length === 0 ? (
                  <div className={`py-14 border border-dashed rounded-2xl text-center text-xs font-bold ${darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>No tasks</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTasksStream.map(task => (
                      <div key={task.id} className={`border rounded-2xl p-4 flex flex-col justify-between gap-3.5 shadow-sm transition-all group ${task.status === 'Completed' ? 'opacity-50' : darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200/90'} ${task.isBirthday ? 'border-purple-300 dark:border-purple-700' : ''}`}>
                        <div className="flex items-start gap-3.5">
                          <button onClick={() => handleToggleTaskStatus(task.id)} className={`mt-0.5 transition-transform hover:scale-110 ${task.status === 'Completed' ? 'text-indigo-600' : 'text-slate-300'}`}>
                            {task.status === 'Completed' ? <CheckCircle2 className="w-5 h-5 fill-indigo-50 dark:fill-indigo-950" /> : <Circle className="w-5 h-5" />}
                          </button>
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {task.isBirthday && <Cake className="w-4 h-4 text-purple-600 animate-bounce" />}
                              <h4 className={`text-sm font-black tracking-tight leading-snug block truncate ${task.status === 'Completed' ? 'line-through text-slate-400 font-normal' : darkMode ? 'text-white' : 'text-slate-950'}`}>{task.title}</h4>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-950 border-slate-950 text-white'}`}>{task.category}</span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${task.priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/30' : task.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30' : 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800'}`}>{task.priority} Priority</span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${darkMode ? 'bg-indigo-950/50 text-indigo-400' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>{task.section}</span>
                              {task.dueTime && <span className="text-[10px] font-black px-2 py-0.5 rounded border bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><Clock className="w-3 h-3 inline mr-1" />{task.dueTime}</span>}
                            </div>
                          </div>
                        </div>
                        <div className={`flex items-center justify-between border-t pt-3 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                          <span className="text-[11px] font-black flex items-center gap-1.5 text-slate-500 dark:text-slate-400"><Calendar className="w-4 h-4 text-indigo-500" /> Due: {task.dueDate}</span>
                          <button onClick={() => handleDeleteTask(task.id)} className="text-slate-300 hover:text-rose-500 p-1 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>

          {/* STICKY NOTES SECTION */}
          <div className="px-6 pb-4 pt-2">
            <hr className={`my-2 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`} />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2 mb-3">
              <div className="flex items-center gap-2"><StickyNote className="w-5 h-5 text-indigo-600" /><h3 className={`text-sm font-black uppercase tracking-wider ${darkMode ? 'text-white' : 'text-slate-900'}`}>Sticky Workspace Notes</h3></div>
              <form onSubmit={handleCreateNote} className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <input type="text" required placeholder="Write a sticky memo note..." value={newNoteContent} onChange={e => setNewNoteContent(e.target.value)} className={`border-2 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-indigo-500 flex-1 sm:w-64 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-300 dark:border-slate-700">
                  {['amber', 'rose', 'sky', 'emerald'].map(c => (
                    <button key={c} type="button" onClick={() => setSelectedNoteColor(c)} className={`w-5 h-5 rounded-full border transition-transform ${c === 'amber' ? 'bg-amber-300' : c === 'rose' ? 'bg-rose-300' : c === 'sky' ? 'bg-sky-300' : 'bg-emerald-300'} ${selectedNoteColor === c ? 'scale-125 border-slate-900 ring-2 ring-indigo-400' : 'border-transparent'}`} />
                  ))}
                </div>
                <button type="submit" className="bg-indigo-600 text-white font-black text-xs px-3 py-2 rounded-xl flex items-center gap-1 shadow-md hover:bg-indigo-700 uppercase tracking-wider"><Plus className="w-4 h-4" /> Stick Note</button>
              </form>
            </div>
            {notes.length === 0 ? (
              <p className="text-xs font-bold text-slate-400 italic">No sticky notes yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {notes.map(note => (
                  <div key={note.id} className={`border-2 rounded-2xl p-4 shadow-sm flex flex-col justify-between min-h-[110px] transform hover:rotate-1 transition-all ${note.color}`}>
                    <p className="text-xs font-black tracking-tight leading-relaxed break-words">{note.content}</p>
                    <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-2 mt-2">
                      <span className="text-[9px] font-bold opacity-60 flex items-center gap-1"><Palette className="w-3 h-3" /> Memo</span>
                      <button type="button" onClick={() => handleDeleteNote(note.id)} className="opacity-60 hover:opacity-100 hover:text-rose-600 transition-colors"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PROGRESS BAR */}
          <footer className={`border-t p-4 mt-auto flex items-center justify-between text-xs font-black px-6 ${darkMode ? 'bg-[#0f172a]/20 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
            <div className="flex items-center gap-3 w-full">
              <span className="whitespace-nowrap uppercase tracking-wider">{metricsProgress}% Sync Active</span>
              <div className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${metricsProgress}%` }}></div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md rounded-2xl border-2 p-6 space-y-4 shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
            <div className="flex items-center justify-between border-b pb-2"><h3 className="text-sm font-black uppercase tracking-wider">New Task</h3><button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-rose-500"><X className="w-4 h-4" /></button></div>
            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs font-bold">
              <div><label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Title</label><input type="text" required placeholder="Task title..." value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className={`w-full p-2 rounded-xl border focus:outline-none focus:border-indigo-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-950'}`} /></div>
              <div className="grid grid-cols-2 gap-3"><div><label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Due Date</label><input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} className={`w-full p-2 rounded-xl border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-950'}`} /></div><div><label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Due Time</label><input type="time" value={newTask.dueTime} onChange={(e) => setNewTask({...newTask, dueTime: e.target.value})} className={`w-full p-2 rounded-xl border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-950'}`} /></div></div>
              <div className={`p-3 rounded-xl border-2 flex items-center justify-between ${newTask.isBirthday ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20' : darkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center gap-2"><Cake className={`w-4 h-4 ${newTask.isBirthday ? 'text-purple-600' : 'text-slate-400'}`} /><div><p className={`text-xs font-black uppercase ${newTask.isBirthday ? 'text-purple-900 dark:text-purple-300' : 'text-slate-500'}`}>Birthday Mode</p><p className="text-[10px] text-slate-400 font-bold">Forces High priority & 🎂</p></div></div>
                <input type="checkbox" checked={newTask.isBirthday} onChange={(e) => setNewTask({...newTask, isBirthday: e.target.checked, priority: e.target.checked ? 'High' : newTask.priority})} className="w-4 h-4 accent-purple-600 rounded" />
              </div>
              <div className="grid grid-cols-3 gap-3"><div><label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Project</label><select value={newTask.category} onChange={(e) => setNewTask({...newTask, category: e.target.value})} className={`w-full p-2 rounded-xl border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-950'}`}>{projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}</select></div><div><label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Priority</label><select value={newTask.priority} disabled={newTask.isBirthday} onChange={(e) => setNewTask({...newTask, priority: e.target.value})} className={`w-full p-2 rounded-xl border focus:outline-none disabled:opacity-60 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-950'}`}><option>High</option><option>Medium</option><option>Low</option></select></div><div><label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Section</label><input type="text" placeholder="Work, Home..." value={newTask.section} onChange={(e) => setNewTask({...newTask, section: e.target.value})} className={`w-full p-2 rounded-xl border focus:outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-950'}`} /></div></div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2.5 rounded-xl uppercase tracking-wider shadow-md">Create Task</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}