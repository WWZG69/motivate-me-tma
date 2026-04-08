// PRE-BOOT THEME SYNC (ЗАЩИТА ОТ МЕРЦАНИЯ ФОНА НА СТАРТЕ)
try {
    if (localStorage.getItem('motivateMe_theme') === 'light') {
        document.body.classList.add('light-theme');
    }
} catch(e) {}

const { useState, useEffect, useRef, useMemo } = React;

const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const typeInfo = { once: { title: "Разовая", desc: "Сделать один раз." }, habit: { title: "Привычка", desc: "Регулярная задача." }, sprint: { title: "Спринт", desc: "Держись без срывов." } };

const weekDaysArr = [
    { val: 1, label: 'Пн' }, { val: 2, label: 'Вт' }, { val: 3, label: 'Ср' },
    { val: 4, label: 'Чт' }, { val: 5, label: 'Пт' }, { val: 6, label: 'Сб' }, { val: 0, label: 'Вс' }
];

const Icons = {
    Goals: (props) => ( <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} {...props}><circle cx="12" cy="12" r="9" /><line x1="12" y1="2" x2="12" y2="5" strokeLinecap="round"/><line x1="12" y1="19" x2="12" y2="22" strokeLinecap="round"/><line x1="2" y1="12" x2="5" y2="12" strokeLinecap="round"/><line x1="19" y1="12" x2="22" y2="12" strokeLinecap="round"/><circle cx="12" cy="12" r="0.5" fill={props.active ? "var(--accent)" : "var(--icon-color)"} /></svg> ),
    Focus: (props) => ( <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} {...props}><path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" /></svg> ),
    Add: (props) => ( <svg viewBox="0 0 24 24" className="tab-add-icon" {...props}><line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" /><line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" /></svg> ),
    Stats: (props) => ( <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} {...props}><circle cx="4" cy="17" r="1.5" fill={props.active ? "var(--accent)" : "var(--icon-color)"} /><circle cx="12" cy="7" r="1.5" fill={props.active ? "var(--accent)" : "var(--icon-color)"} /><circle cx="20" cy="14" r="1.5" fill={props.active ? "var(--accent)" : "var(--icon-color)"} /><path d="M5.5 16l5-7.5M13.5 8l5 4.5" strokeLinecap="round" /></svg> ),
    Settings: (props) => ( <svg viewBox="0 0 24 24" className="tab-icon" fill="none" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> ),
    ChevronLeft: () => <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>,
    ChevronRight: () => <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>,
    Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    Save: (props) => <svg viewBox="0 0 24 24" className="tab-icon" stroke="#000" {...props}><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    
    // ПЕРЕРИСОВАННЫЕ ИКОНКИ ТИПОВ ЦЕЛИ
    Target: (props) => <svg viewBox="0 0 24 24" fill="none" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill={props.active ? "var(--accent)" : "var(--icon-color)"}/></svg>,
    Infinity: (props) => <svg viewBox="0 0 24 24" fill="none" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 8a4 4 0 1 0 0 8h8a4 4 0 1 0 0-8H8z"/></svg>,
    Sprint: (props) => <svg viewBox="0 0 24 24" fill="none" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    
    Play: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    Pause: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
    Refresh: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>,
    Pencil: () => <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
    Trash: () => <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
    Check: () => <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>,
    Close: () => <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    Text: (props) => <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} {...props}><line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round"/><line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round"/><line x1="4" y1="18" x2="14" y2="18" strokeLinecap="round"/></svg>,
    Clock: (props) => <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Bell: (props) => <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round"/></svg>
};

// ИСПРАВЛЕНО: Колесо с фиксированной высотой строк и плавным масштабированием текста
const TimeWheel = ({ items, value, onChange, width }) => {
    const ref = useRef(null);
    const itemHeight = 44; 
    useEffect(() => {
        const idx = items.indexOf(value);
        if(ref.current && idx !== -1) ref.current.scrollTop = idx * itemHeight;
    }, [value, items]);
    const handleScroll = (e) => {
        const idx = Math.round(e.target.scrollTop / itemHeight);
        if (items[idx] && items[idx] !== value) {
            onChange(items[idx]);
            // Вибрация срабатывает только при смене индекса
            if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.selectionChanged();
        }
    };
    return (
        <div className="wheel-container" onScroll={handleScroll} ref={ref} style={{ width: width ? width : "60px" }}>
            <div className="wheel-spacer"></div>
            {items.map(item => (
                <div key={item} className={`wheel-item ${item === value ? 'selected' : ''}`}>
                    <span>{item}</span>
                </div>
            ))}
            <div className="wheel-spacer"></div>
        </div>
    );
};

function App() {
    const [showSplash, setShowSplash] = useState(true);
    const [activeTab, setActiveTab] = useState('home');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [now, setNow] = useState(new Date());
    const [offsetPx, setOffsetPx] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    const [isLightTheme, setIsLightTheme] = useState(() => localStorage.getItem('motivateMe_theme') === 'light');
    const [isHeatmapExpanded, setIsHeatmapExpanded] = useState(false); 
    
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const touchStartTime = useRef(0); 
    const isDragging = useRef(false);
    const isSwipeValid = useRef(null); 
    const transitionTimer = useRef(null);
    
    const [motivationTone, setMotivationTone] = useState('soft');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    
    const [expandedGoalId, setExpandedGoalId] = useState(null);
    const isLongPress = useRef(false);
    const pressTimer = useRef(null);
    const [activeVisionId, setActiveVisionId] = useState(null);
    
    const [goals, setGoals] = useState(() => {
        try { const saved = localStorage.getItem('motivateMe_v20_goals'); return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
    });
    const [visions, setVisions] = useState(() => {
        try { const saved = localStorage.getItem('motivateMe_v20_visions'); return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createMode, setCreateMode] = useState('micro');
    const [createStep, setCreateStep] = useState('text'); 
    const [editingId, setEditingId] = useState(null); 
    
    const [actionMenuGoal, setActionMenuGoal] = useState(null);
    const [confirmDeleteGoalId, setConfirmDeleteGoalId] = useState(null);
    const [actionMenuVision, setActionMenuVision] = useState(null);
    const [confirmDeleteVisionId, setConfirmDeleteVisionId] = useState(null);
    
    const [startMonth, setStartMonth] = useState(monthNames[new Date().getMonth()]);
    const [startDay, setStartDay] = useState(new Date().getDate().toString().padStart(2, '0'));

    const defaultForm = { title: '', description: '', type: 'habit', deadline: '23:59', duration: '', ignoreHoliday: false, notifications: true, startDate: null, visionId: '', weekDays: [0,1,2,3,4,5,6] };
    const defaultVisionForm = { title: '', emoji: '🎯', description: '' };

    const [form, setForm] = useState(defaultForm);
    const [visionForm, setVisionForm] = useState(defaultVisionForm);

    const hoursList = Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0'));
    const minutesList = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));
    const daysInMonth = useMemo(() => {
        const monthIdx = monthNames.indexOf(startMonth);
        const year = new Date().getFullYear();
        const days = new Date(year, monthIdx + 1, 0).getDate();
        return Array.from({length: days}, (_, i) => (i + 1).toString().padStart(2, '0'));
    }, [startMonth]);

    useEffect(() => {
        if (daysInMonth && startDay && !daysInMonth.includes(startDay)) setStartDay('01');
    }, [daysInMonth, startDay]);

    useEffect(() => {
        if (isLightTheme) document.body.classList.add('light-theme');
        else document.body.classList.remove('light-theme');
        localStorage.setItem('motivateMe_theme', isLightTheme ? 'light' : 'dark');
    }, [isLightTheme]);

    const isAnyModalOpen = isModalOpen || !!actionMenuGoal || !!actionMenuVision || !!confirmDeleteGoalId || !!confirmDeleteVisionId;
    useEffect(() => {
        if (isAnyModalOpen) { document.body.style.overflow = 'hidden'; } 
        else { document.body.style.overflow = ''; }
        return () => { document.body.style.overflow = ''; };
    }, [isAnyModalOpen]);

    const toggleTheme = (e) => {
        const x = e.clientX; const y = e.clientY; const goingToLight = !isLightTheme;
        const ripple = document.createElement('div');
        ripple.className = 'theme-ripple-effect';
        ripple.style.left = `${x}px`; ripple.style.top = `${y}px`; ripple.style.backgroundColor = '#F2F2F7'; 
        triggerHaptic('medium');
        if (goingToLight) {
            ripple.style.animation = 'rippleExpand 0.9s cubic-bezier(0.25, 1, 0.5, 1) forwards';
            document.body.appendChild(ripple);
            setTimeout(() => { setIsLightTheme(true); ripple.classList.add('fade-out'); }, 900);
            setTimeout(() => ripple.remove(), 1200);
        } else {
            setIsLightTheme(false);
            ripple.style.animation = 'rippleCollapse 0.9s cubic-bezier(0.25, 1, 0.5, 1) forwards';
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 900);
        }
    };

    const triggerHaptic = (type) => {
        try {
            if (window.Telegram?.WebApp?.HapticFeedback) {
                if (type === 'success') { window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy'); setTimeout(() => window.Telegram.WebApp.HapticFeedback.impactOccurred('rigid'), 150); }
                else if (type === 'error') { window.Telegram.WebApp.HapticFeedback.notificationOccurred('error'); setTimeout(() => window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy'), 50); }
                else window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
            }
        } catch(e) {}
    };

    const statsData = useMemo(() => {
        const today = new Date(); let totalDone = 0; let bestStreak = 0; let completionByDate = {}; 
        goals.forEach(g => {
            if (!g || !g.history) return;
            const historyDates = Object.keys(g.history); totalDone += historyDates.length;
            if ((g.streak || 0) > bestStreak) bestStreak = g.streak;
            historyDates.forEach(dStr => {
                const d = new Date(dStr); if (isNaN(d.getTime())) return;
                const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                completionByDate[iso] = (completionByDate[iso] || 0) + 1;
            });
        });
        const last7Days = []; let maxDaily = 1; 
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today); d.setDate(d.getDate() - i);
            const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            const count = completionByDate[iso] || 0;
            if (count > maxDaily) maxDaily = count;
            last7Days.push({ day: d.toLocaleDateString('ru-RU', { weekday: 'short' }), count, iso });
        }
        
        const heatmapDays = [];
        for (let i = 364; i >= 0; i--) {
            const d = new Date(today); d.setDate(d.getDate() - i);
            const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            const count = completionByDate[iso] || 0;
            let level = 0; if (count > 0) level = 1; if (count > 2) level = 2; if (count > 4) level = 3;
            heatmapDays.push({ iso, level, count });
        }
        return { totalDone, bestStreak, last7Days, maxDaily, heatmapDays };
    }, [goals]);

    useEffect(() => { try { const tg = window.Telegram?.WebApp; if (tg) { tg.ready(); tg.expand(); } } catch(e) {} const endSplash = setTimeout(() => setShowSplash(false), 4000); return () => clearTimeout(endSplash); }, []);
    useEffect(() => { try { localStorage.setItem('motivateMe_v20_goals', JSON.stringify(goals)); } catch (e) {} }, [goals]);
    useEffect(() => { try { localStorage.setItem('motivateMe_v20_visions', JSON.stringify(visions)); } catch (e) {} }, [visions]);
    useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer); }, []);
    useEffect(() => {
        let interval = null;
        if (isTimerRunning && timeLeft > 0) interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        else if (timeLeft === 0) { setIsTimerRunning(false); triggerHaptic('success'); }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft]);

    const resetTimer = () => { setIsTimerRunning(false); setTimeLeft(25 * 60); triggerHaptic('light'); };
    const getOffsetDate = (baseDate, days) => { const d = new Date(baseDate); d.setDate(d.getDate() + days); return d; };

    const applyDateShift = (shift) => {
        setCurrentDate(prev => { const newDate = new Date(prev); newDate.setDate(newDate.getDate() + shift); return newDate; });
    };

    const animateToDate = (daysShift) => {
        setExpandedGoalId(null); triggerHaptic('light');
        if (transitionTimer.current) { clearTimeout(transitionTimer.current); applyDateShift(offsetPx > 0 ? -1 : 1); }
        setIsTransitioning(true); setOffsetPx(daysShift > 0 ? -window.innerWidth : window.innerWidth);
        transitionTimer.current = setTimeout(() => {
            setIsTransitioning(false); setOffsetPx(0); applyDateShift(daysShift); transitionTimer.current = null;
        }, 180);
    };

    const onSwipeStart = (e) => {
        if (transitionTimer.current) {
            clearTimeout(transitionTimer.current); transitionTimer.current = null;
            applyDateShift(offsetPx > 0 ? -1 : 1); setOffsetPx(0); setIsTransitioning(false);
        }
        touchStartX.current = e.touches[0].clientX; touchStartY.current = e.touches[0].clientY; touchStartTime.current = Date.now(); isDragging.current = true; isSwipeValid.current = null;
    };

    const onSwipeMove = (e) => {
        if (!isDragging.current) return;
        const deltaX = e.touches[0].clientX - touchStartX.current; const deltaY = e.touches[0].clientY - touchStartY.current;
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) { if (pressTimer.current) clearTimeout(pressTimer.current); isLongPress.current = false; }
        if (isSwipeValid.current === null) { if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) isSwipeValid.current = Math.abs(deltaX) > Math.abs(deltaY) * 0.5; }
        if (isSwipeValid.current === true) setOffsetPx(deltaX);
    };

    const onSwipeEnd = () => {
        if (!isDragging.current || isSwipeValid.current !== true) { isDragging.current = false; return; }
        isDragging.current = false;
        const swipeDuration = Date.now() - touchStartTime.current; const velocity = offsetPx / swipeDuration; const threshold = window.innerWidth * 0.2; 
        if (offsetPx > threshold || velocity > 0.4) animateToDate(-1); else if (offsetPx < -threshold || velocity < -0.4) animateToDate(1); 
        else { setIsTransitioning(true); setOffsetPx(0); setTimeout(() => setIsTransitioning(false), 200); }
    };

    const openCreateModal = () => { 
        triggerHaptic('light'); setEditingId(null); 
        setForm({...defaultForm, visionId: activeVisionId || '', weekDays: [0,1,2,3,4,5,6]}); 
        setVisionForm(defaultVisionForm);
        setStartMonth(monthNames[new Date().getMonth()]); setStartDay(new Date().getDate().toString().padStart(2, '0'));
        setCreateMode('micro'); setCreateStep('text'); setIsModalOpen(true); 
    };
    const closeCreateModal = () => { triggerHaptic('light'); setIsModalOpen(false); };

    const toggleWeekDay = (dayVal) => {
        triggerHaptic('light');
        setForm(prev => {
            const arr = prev.weekDays || [];
            if (arr.includes(dayVal)) return { ...prev, weekDays: arr.filter(d => d !== dayVal) };
            return { ...prev, weekDays: [...arr, dayVal] };
        });
    };

    const saveGoal = () => {
        if (createMode === 'macro') {
            if (!visionForm.title) { triggerHaptic('error'); return; }
            if (editingId) { setVisions(visions.map(v => v.id === editingId ? { ...visionForm, id: v.id } : v)); } 
            else { setVisions([{ ...visionForm, id: Date.now() }, ...visions]); }
            setIsModalOpen(false); triggerHaptic('success'); return;
        }
        if (!form.title) { triggerHaptic('error'); setCreateStep('text'); return; }
        try {
            const nowObj = new Date(); const currentYear = nowObj.getFullYear();
            const selectedMonthIdx = monthNames.indexOf(startMonth); const selectedDayNum = parseInt(startDay, 10);
            let targetYear = currentYear;
            if (selectedMonthIdx < nowObj.getMonth() || (selectedMonthIdx === nowObj.getMonth() && selectedDayNum < nowObj.getDate())) targetYear = currentYear + 1;
            const finalStartDate = new Date(targetYear, selectedMonthIdx, selectedDayNum); finalStartDate.setHours(0, 0, 0, 0);
            const safeWeekDays = form.weekDays && form.weekDays.length > 0 ? form.weekDays : [0,1,2,3,4,5,6];
            const goalData = { ...form, startDate: finalStartDate.toISOString(), weekDays: safeWeekDays };
            if (editingId) setGoals(goals.map(g => g.id === editingId ? { ...goalData, id: g.id, streak: g.streak || 0, history: g.history || {}, createdAt: g.createdAt } : g));
            else setGoals([{ ...goalData, id: Date.now(), streak: 0, history: {}, createdAt: new Date().toDateString() }, ...goals]);
        } catch(e) {}
        setIsModalOpen(false); triggerHaptic('success');
    };
    
    const deleteGoal = () => { setGoals(goals.filter(g => g.id !== confirmDeleteGoalId)); setConfirmDeleteGoalId(null); triggerHaptic('success'); };
    const deleteVision = () => {
        setVisions(visions.filter(v => v.id !== confirmDeleteVisionId));
        setGoals(goals.map(g => g.visionId === confirmDeleteVisionId ? { ...g, visionId: null } : g));
        if (activeVisionId === confirmDeleteVisionId) setActiveVisionId(null);
        setConfirmDeleteVisionId(null); triggerHaptic('success');
    };
    
    const checkPermissions = (goal, checkDate) => {
        try {
            const viewingDate = new Date(checkDate); viewingDate.setHours(0, 0, 0, 0); const actualToday = new Date(now); actualToday.setHours(0, 0, 0, 0);
            const isPast = viewingDate < actualToday; const isToday = viewingDate.getTime() === actualToday.getTime();
            let isDeadlinePassed = isPast;
            if (isToday) { 
                const safeDeadline = goal.deadline || '23:59'; const [h, m] = safeDeadline.split(':'); 
                const limit = new Date(now); limit.setHours(parseInt(h, 10) || 23, parseInt(m, 10) || 59, 0, 0); 
                if (now > limit) isDeadlinePassed = true; 
            }
            return { canToggle: isToday && !isDeadlinePassed, canEdit: !isPast && !isDeadlinePassed };
        } catch(e) { return { canToggle: false, canEdit: false }; }
    };

    const getTimerData = (goal, isDone, checkDate) => {
        try {
            const view = new Date(checkDate); view.setHours(0, 0, 0, 0); const today = new Date(now); today.setHours(0, 0, 0, 0);
            const safeDeadline = goal.deadline || '23:59';
            if (view > today) return { text: `до ${safeDeadline}`, className: 'badge', style: {color: 'var(--text-main)'} };
            if (view < today) return { text: "00:00:00", className: 'badge failed-timer', style: {} };
            const [h, m] = safeDeadline.split(':'); const limit = new Date(now); limit.setHours(parseInt(h, 10)||23, parseInt(m, 10)||59, 0, 0); 
            const diffMs = limit - now;
            if (diffMs <= 0) return { text: "00:00:00", className: 'badge failed-timer', style: {} };
            const hours = Math.floor(diffMs / (1000 * 60 * 60)); const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
            return { text: `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`, className: `badge ${!isDone && diffMs < 3600000 ? 'urgent-timer' : ''}`, style: {} };
        } catch(e) { return { text: "00:00", className: 'badge failed-timer', style: {} }; }
    };

    const getActiveGoalsForDate = (dateTarget) => {
        const renderTime = dateTarget.getTime();
        return goals.filter(g => { 
            if (activeVisionId && g.visionId != activeVisionId) return false;
            try { 
                if (g.startDate && new Date(g.startDate).getTime() > renderTime) return false; 
                if (g.type === 'habit' && g.weekDays && g.weekDays.length > 0) {
                    if (!g.weekDays.includes(dateTarget.getDay())) return false;
                }
                return true; 
            } catch(e) { return true; } 
        });
    };

    const activeGoalsToday = getActiveGoalsForDate(currentDate);
    const loadCount = activeGoalsToday.length;

    const renderDayCards = (renderDate) => {
        const dateKey = renderDate.toDateString(); const activeGoals = getActiveGoalsForDate(renderDate);
        if (activeGoals.length === 0) return <p style={{textAlign:'center', marginTop:'20px', opacity: 0.7}}>Задач на этот день нет.</p>;
        return activeGoals.map(g => {
            const isDone = !!(g.history && g.history[dateKey]); const isExpanded = expandedGoalId === g.id; 
            const { canToggle } = checkPermissions(g, renderDate); const timerData = getTimerData(g, isDone, renderDate);
            const linkedVision = g.visionId ? visions.find(v => v.id == g.visionId) : null;
            
            const textLen = (g.description || 'Описания нет').length;
            const animDuration = Math.min(0.8, Math.max(0.2, textLen * 0.002));

            return (
                <div key={g.id} className="card" onTouchStart={() => handleCardTouchStart(g, renderDate)} onTouchMove={handleCardTouchEnd} onTouchEnd={handleCardTouchEnd} onMouseDown={() => handleCardTouchStart(g, renderDate)} onMouseUp={handleCardTouchEnd} onClick={() => handleCardClick(g)} style={{ opacity: isDone ? 0.6 : 1 }}>
                    <div className="goal-info">
                        {linkedVision && (<div className="vision-badge">{linkedVision.emoji} {linkedVision.title}</div>)}
                        <div className="goal-title" style={{ textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--text-muted)' : 'var(--text-main)' }}>{g.title}</div>
                        <div className="stats-row">
                            {g.type !== 'once' && <span className="badge">{g.streak || 0} 🔥</span>}
                            {g.type === 'habit' && <span className="badge">∞</span>}
                            {g.type === 'sprint' && <span className="badge">{Math.max(0, parseInt(g.duration || 0) - (g.streak || 0))} ⏳</span>}
                            <span className={timerData.className} style={timerData.style}>⏱ {timerData.text}</span>
                        </div>
                        <div className={`goal-desc-wrapper ${isExpanded ? 'expanded' : ''}`} style={{ transitionDuration: `${animDuration}s` }}>
                            <div className="goal-desc-inner" style={{ transitionDuration: `${animDuration * 0.8}s` }}>
                                <div className="goal-desc">{g.description || 'Описания нет. Просто бери и делай!'}</div>
                            </div>
                        </div>
                    </div>
                    <button className={`btn-complete ${isDone ? 'done' : ''} ${!canToggle ? 'disabled' : ''}`} onClick={(e) => toggleGoal(e, g, renderDate)}><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
                </div>
            );
        });
    };

    const handleCardTouchStart = (goal, dateTarget) => {
        const { canEdit } = checkPermissions(goal, dateTarget); isLongPress.current = false; if (!canEdit) return;
        pressTimer.current = setTimeout(() => { if (isLongPress.current === false) { isLongPress.current = true; triggerHaptic('heavy'); setActionMenuGoal(goal); } }, 500); 
    };
    const handleCardTouchEnd = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };
    const handleCardClick = (goal) => { if (!isLongPress.current) { setExpandedGoalId(prev => prev === goal.id ? null : goal.id); triggerHaptic('light'); } };
    
    const handleVisionTouchStart = (vision) => {
        isLongPress.current = false;
        pressTimer.current = setTimeout(() => {
            if (isLongPress.current === false) { isLongPress.current = true; triggerHaptic('heavy'); setActionMenuVision(vision); }
        }, 500);
    };
    const handleVisionClick = (vision) => {
        if (!isLongPress.current) { triggerHaptic('light'); setActiveVisionId(activeVisionId === vision.id ? null : vision.id); }
    };

    const toggleGoal = (e, goalObj, dateTarget) => {
        e.stopPropagation(); const { canToggle } = checkPermissions(goalObj, dateTarget);
        if (!canToggle) { triggerHaptic('error'); return; }
        const dateStr = dateTarget.toDateString(); const isCurrentlyDone = !!(goalObj.history && goalObj.history[dateStr]);
        setGoals(goals.map(g => {
            if (g.id !== goalObj.id) return g;
            const newHistory = { ...(g.history || {}) };
            if (!isCurrentlyDone) { newHistory[dateStr] = true; triggerHaptic('success'); } else { delete newHistory[dateStr]; triggerHaptic('light'); }
            return { ...g, history: newHistory, streak: isCurrentlyDone ? Math.max(0, (g.streak || 0) - 1) : (g.streak || 0) + 1 };
        }));
    };

    const transitionStyle = (isTransitioning && !isDragging.current) ? 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';

    return (
        <React.Fragment>
            {showSplash && (
                <div className="simple-splash-overlay">
                    <img src="image_0.png" alt="Logo" className="splash-logo" />
                    <h1 className="splash-title">MotivateMe</h1>
                </div>
            )}

            <div className="container">
                {isModalOpen && <div className="glass-backdrop" onClick={closeCreateModal}></div>}
                
                <div className="header-notcoin-style">
                    <img src="image_0.png" alt="Logo" className="m-logo-small" />
                    <h1 className="main-title-small">MotivateMe</h1>
                </div>

                {activeTab === 'home' && (
                    <React.Fragment>
                        <div className="daily-load-container">
                            <div className="load-header">
                                <span className="load-title">Нагрузка дня</span>
                                <span className="load-count">{loadCount} {loadCount === 1 ? 'задача' : (loadCount > 1 && loadCount < 5) ? 'задачи' : 'задач'}</span>
                            </div>
                            <div className="load-bar">
                                {[1, 2, 3, 4, 5, 6].map(i => {
                                    let fillClass = '';
                                    if (loadCount >= i || (i === 6 && loadCount >= 6)) {
                                        if (loadCount <= 3) fillClass = 'safe';
                                        else if (loadCount <= 5) fillClass = 'warning';
                                        else fillClass = 'danger';
                                    }
                                    return <div key={i} className={`load-segment ${fillClass}`}></div>;
                                })}
                            </div>
                        </div>

                        {visions.length > 0 && (
                            <div className="visions-scroll-track">
                                {visions.map(v => {
                                    const linkedGoals = goals.filter(g => g.visionId == v.id);
                                    const totalStreak = linkedGoals.reduce((sum, g) => sum + (g.streak || 0), 0);
                                    let totalDone = 0;
                                    linkedGoals.forEach(g => { if(g.history) totalDone += Object.keys(g.history).length; });
                                    const isActive = activeVisionId === v.id;
                                    return (
                                        <div key={v.id} className={`vision-card ${isActive ? 'active' : ''}`} 
                                             onTouchStart={() => handleVisionTouchStart(v)} 
                                             onTouchMove={handleCardTouchEnd} onTouchEnd={handleCardTouchEnd} 
                                             onMouseDown={() => handleVisionTouchStart(v)} onMouseUp={handleCardTouchEnd} 
                                             onClick={() => handleVisionClick(v)}>
                                            <div className="vision-card-header">
                                                <div className="vision-emoji-large">{v.emoji}</div>
                                                {isActive && <div className="vision-active-badge">Выбрано</div>}
                                            </div>
                                            <div className="vision-card-title">{v.title}</div>
                                            <div className="vision-card-stats">
                                                <div className="v-stat"><span className="v-stat-val">{totalStreak}</span><span className="v-stat-label">Огонь 🔥</span></div>
                                                <div className="v-stat"><span className="v-stat-val">{totalDone}</span><span className="v-stat-label">Шагов 🎯</span></div>
                                                <div className="v-stat"><span className="v-stat-val">{linkedGoals.length}</span><span className="v-stat-label">Целей 📋</span></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="swipe-area" onTouchStart={onSwipeStart} onTouchMove={onSwipeMove} onTouchEnd={onSwipeEnd} style={{ pointerEvents: isAnyModalOpen ? 'none' : 'auto' }}>
                            <div className="date-nav-container">
                                <button className="date-nav-btn" onClick={() => animateToDate(-1)}><Icons.ChevronLeft /></button>
                                <button className="date-nav-btn" onClick={() => animateToDate(1)}><Icons.ChevronRight /></button>
                            </div>
                            <div className="cards-track" style={{ transform: `translateX(calc(-100vw + ${offsetPx}px))`, transition: transitionStyle }}>
                                {[-1, 0, 1].map(shift => {
                                    const renderDate = getOffsetDate(currentDate, shift);
                                    return (
                                        <div className="cards-pane" key={renderDate.toDateString()}>
                                            <div className="date-display-row">{renderDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</div>
                                            {renderDayCards(renderDate)}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </React.Fragment>
                )}
                
                {activeTab === 'progress' && (
                    <div className="timer-panel">
                        <h3 style={{ textAlign: 'center', margin: '0 0 20px 0', fontSize: '20px' }}>Фокус</h3>
                        <div className="timer-display">
                            {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                        </div>
                        <div className="timer-controls">
                            <button className="btn-timer-reset" onClick={resetTimer}><Icons.Refresh /></button>
                            <button className="btn-timer-main" onClick={() => { setIsTimerRunning(!isTimerRunning); triggerHaptic('light'); }}>
                                {isTimerRunning ? <Icons.Pause /> : <Icons.Play />}
                            </button>
                            <div style={{ width: '48px' }}></div> 
                        </div>
                    </div>
                )}

                {activeTab === 'social' && (
                    <div className="stats-wrapper">
                        <div className="stats-row-cards">
                            <div className="stat-card">
                                <div className="stat-value">{statsData.totalDone}</div>
                                <div className="stat-label">Задач завершено</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-value">{statsData.bestStreak} <span style={{fontSize:'18px'}}>🔥</span></div>
                                <div className="stat-label">Лучший стрик</div>
                            </div>
                        </div>
                        
                        <div className="card" style={{ display: 'block', maxWidth: '360px', margin: '0 auto 12px auto' }}>
                            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px' }}>Активность за 7 дней</h3>
                            <div className="bar-chart">
                                {statsData.last7Days.map(day => (
                                    <div key={day.iso} className="bar-col">
                                        <div className="bar-track"><div className="bar-fill" style={{ height: `${(day.count / statsData.maxDaily) * 100}%` }}></div></div>
                                        <div className="bar-label">{day.day}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card" style={{ display: 'block', maxWidth: '360px', margin: '0 auto 12px auto', padding: '20px' }} onClick={() => {triggerHaptic('light'); setIsHeatmapExpanded(!isHeatmapExpanded)}}>
                            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', textAlign: 'center' }}>
                                Пульс активности ({isHeatmapExpanded ? '365' : '90'} дней)
                            </h3>
                            
                            <div style={{ display: 'grid', gridTemplateRows: isHeatmapExpanded ? '1fr' : '0fr', transition: 'grid-template-rows 0.7s cubic-bezier(0.25, 1, 0.5, 1)' }}>
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-start', width: '100%', marginBottom: '6px' }}>
                                        {statsData.heatmapDays.slice(0, -90).map(day => (
                                            <div key={day.iso} className={`heatmap-cell level-${day.level}`} style={{ width: '13px', height: '13px', borderRadius: '50%', flexShrink: 0 }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-start', width: '100%' }}>
                                {statsData.heatmapDays.slice(-90).map(day => (
                                    <div key={day.iso} className={`heatmap-cell level-${day.level}`} style={{ width: '13px', height: '13px', borderRadius: '50%', flexShrink: 0 }}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="card" style={{ display: 'block', maxWidth: '360px', margin: '0 auto' }}>
                        <h3 style={{ textAlign: 'center', margin: '0 0 20px 0' }}>Настройки</h3>
                        <div className="setting-row" style={{marginBottom: '20px'}}>
                            <span style={{fontWeight: 'bold', fontSize: '16px'}}>Тема оформления</span>
                            <button className="theme-toggle-btn" onClick={toggleTheme}>
                                {isLightTheme ? <Icons.Moon /> : <Icons.Sun />}
                            </button>
                        </div>
                        <hr className="divider" />
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', margin: '15px 0 8px 0' }}>Тон поддержки бота:</label>
                        <select className="custom-select dark-input" value={motivationTone} onChange={e => setMotivationTone(e.target.value)} style={{marginBottom: 0}}>
                            <option value="soft">Мягкий</option><option value="hard">Жесткий</option>
                        </select>
                    </div>
                )}

                {actionMenuGoal && (
                    <div className="glass-overlay-centered" onClick={() => setActionMenuGoal(null)}>
                        <div className="action-buttons-container" onClick={e => e.stopPropagation()}>
                            <button className="glass-btn-circle edit" onClick={() => { setForm({...actionMenuGoal}); setEditingId(actionMenuGoal.id); setCreateMode('micro'); setActionMenuGoal(null); setCreateStep('text'); setIsModalOpen(true); }}><Icons.Pencil /></button>
                            <button className="glass-btn-circle danger" onClick={() => { setConfirmDeleteGoalId(actionMenuGoal.id); setActionMenuGoal(null); }}><Icons.Trash /></button>
                        </div>
                    </div>
                )}
                
                {actionMenuVision && (
                    <div className="glass-overlay-centered" onClick={() => setActionMenuVision(null)}>
                        <div className="action-buttons-container" onClick={e => e.stopPropagation()}>
                            <button className="glass-btn-circle edit" onClick={() => { setVisionForm({...actionMenuVision}); setEditingId(actionMenuVision.id); setCreateMode('macro'); setActionMenuVision(null); setCreateStep('text'); setIsModalOpen(true); }}><Icons.Pencil /></button>
                            <button className="glass-btn-circle danger" onClick={() => { setConfirmDeleteVisionId(actionMenuVision.id); setActionMenuVision(null); }}><Icons.Trash /></button>
                        </div>
                    </div>
                )}

                {confirmDeleteGoalId && (
                    <div className="glass-overlay-centered" onClick={() => setConfirmDeleteGoalId(null)}>
                        <div className="action-buttons-container" onClick={e => e.stopPropagation()}>
                            <button className="glass-btn-circle success" onClick={deleteGoal}><Icons.Check /></button>
                            <button className="glass-btn-circle cancel" onClick={() => setConfirmDeleteGoalId(null)}><Icons.Close /></button>
                        </div>
                    </div>
                )}
                
                {confirmDeleteVisionId && (
                    <div className="glass-overlay-centered" onClick={() => setConfirmDeleteVisionId(null)}>
                        <div className="action-buttons-container" onClick={e => e.stopPropagation()}>
                            <button className="glass-btn-circle success" onClick={deleteVision}><Icons.Check /></button>
                            <button className="glass-btn-circle cancel" onClick={() => setConfirmDeleteVisionId(null)}><Icons.Close /></button>
                        </div>
                    </div>
                )}

                {isModalOpen && (
                    <div className="create-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                        {!editingId && createStep === 'text' && (
                            <div className="mode-switcher">
                                <div className={`mode-btn ${createMode === 'micro' ? 'active' : ''}`} onClick={() => {triggerHaptic('light'); setCreateMode('micro');}}>Задача</div>
                                <div className={`mode-btn ${createMode === 'macro' ? 'active' : ''}`} onClick={() => {triggerHaptic('light'); setCreateMode('macro');}}>Видение</div>
                            </div>
                        )}
                        <h3 style={{margin: '0 0 15px 0', textAlign: 'center', fontSize: '18px'}}>{editingId ? 'Редактировать' : (createMode === 'macro' ? 'Новое Видение' : 'Новая цель')}</h3>
                        {createMode === 'macro' ? (
                            <div className="panel-step">
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input type="text" maxLength="2" value={visionForm.emoji} onChange={e => setVisionForm({...visionForm, emoji: e.target.value})} className="dark-input" style={{ width: '60px', textAlign: 'center', fontSize: '20px', padding: '14px 0' }} />
                                    <input placeholder="Глобальная цель" value={visionForm.title} onChange={e => setVisionForm({...visionForm, title: e.target.value})} className="dark-input" style={{ flex: 1 }} />
                                </div>
                                <textarea placeholder="Почему для тебя это важно?" value={visionForm.description} onChange={e => setVisionForm({...visionForm, description: e.target.value})} className="dark-input custom-scrollbar" style={{ minHeight: '80px', resize: 'none' }} />
                            </div>
                        ) : (
                            <React.Fragment>
                                {createStep === 'text' && (
                                    <div className="panel-step">
                                        <input placeholder="Название" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="dark-input" />
                                        {visions.length > 0 && (
                                            <select className="custom-select dark-input" value={form.visionId || ''} onChange={e => setForm({...form, visionId: e.target.value})}>
                                                <option value="">Без глобальной цели</option>
                                                {visions.map(v => <option key={v.id} value={v.id}>{v.emoji} {v.title}</option>)}
                                            </select>
                                        )}
                                        <textarea placeholder="Опиши шаги" value={form.description} onChange={e => { setForm({...form, description: e.target.value}); e.target.style.height='auto'; e.target.style.height=Math.min(e.target.scrollHeight, 140)+'px';}} className="dark-input custom-scrollbar" style={{ minHeight: '60px', maxHeight: '140px', resize: 'none' }} />
                                    </div>
                                )}
                                {createStep === 'time' && (
                                    <div className="panel-step">
                                        <div className="radio-group">
                                            <div className={`radio-btn ${(form.type || 'habit') === 'once' ? 'active' : ''}`} onClick={() => {triggerHaptic('light'); setForm({...form, type: 'once'})}}><Icons.Target active={(form.type || 'once') === 'once'} /></div>
                                            <div className={`radio-btn ${(form.type || 'habit') === 'habit' ? 'active' : ''}`} onClick={() => {triggerHaptic('light'); setForm({...form, type: 'habit'})}}><Icons.Infinity active={(form.type || 'habit') === 'habit'} /></div>
                                            <div className={`radio-btn ${(form.type || 'habit') === 'sprint' ? 'active' : ''}`} onClick={() => {triggerHaptic('light'); setForm({...form, type: 'sprint'})}}><Icons.Sprint active={(form.type || 'sprint') === 'sprint'} /></div>
                                        </div>
                                        <div className="info-box"><div className="info-title">{typeInfo[form.type || 'habit'].title}</div><div className="info-desc">{typeInfo[form.type || 'habit'].desc}</div></div>
                                        {(form.type || 'habit') === 'habit' && (
                                            <div style={{marginBottom: '20px'}}>
                                                <div className="weekdays-selector">
                                                    {weekDaysArr.map(d => {
                                                        const isActive = form.weekDays && form.weekDays.includes(d.val);
                                                        return ( <div key={d.val} className={`weekday-btn ${isActive ? 'active' : ''}`} onClick={() => toggleWeekDay(d.val)}>{d.label}</div> );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {(form.type || 'habit') === 'sprint' && (<input type="number" placeholder="Дней соблюдать?" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="dark-input" style={{textAlign: 'center'}} />)}
                                        <hr className="divider" />
                                        
                                        {/* ИСПРАВЛЕНО: ДОБАВЛЕНЫ ЗАГОЛОВКИ ДЕДЛАЙН И НАЧАЛО */}
                                        <div className="wheels-grid">
                                            <div className="wheel-section">
                                                <div className="wheel-label" style={{color: 'var(--text-muted)'}}>Дедлайн</div>
                                                <div className="ios-time-picker mini">
                                                    <TimeWheel items={hoursList} value={(form.deadline || '23:59').split(':')[0]} onChange={h => setForm({...form, deadline: `${h}:${(form.deadline || '23:59').split(':')[1]}`})} width="40px" />
                                                    <span className="time-colon">:</span>
                                                    <TimeWheel items={minutesList} value={(form.deadline || '23:59').split(':')[1]} onChange={m => setForm({...form, deadline: `${(form.deadline || '23:59').split(':')[0]}:${m}`})} width="40px" />
                                                </div>
                                            </div>
                                            <div className="wheel-section">
                                                <div className="wheel-label" style={{color: 'var(--text-muted)'}}>Начало</div>
                                                <div className="ios-time-picker mini">
                                                    <TimeWheel items={monthNames} value={startMonth} onChange={setStartMonth} width="85px" />
                                                    <TimeWheel items={daysInMonth} value={startDay} onChange={setStartDay} width="40px" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="setting-row"><span>Без выходных</span><label className="ios-switch"><input type="checkbox" checked={form.ignoreHoliday || false} onChange={e => setForm({...form, ignoreHoliday: e.target.checked})} /><span className="slider"></span></label></div>
                                    </div>
                                )}
                                {createStep === 'notifs' && (
                                    <div className="panel-step">
                                        <div className="card" style={{margin: '0', maxWidth: '100%', border: '1px solid var(--border-color)', background: 'transparent', boxShadow: 'none'}}>
                                            <div className="setting-row" style={{width: '100%'}}>
                                                <span style={{fontWeight: 'bold', fontSize: '15px'}}>Уведомления</span>
                                                <label className="ios-switch">
                                                    <input type="checkbox" checked={form.notifications !== false} onChange={e => setForm({...form, notifications: e.target.checked})} />
                                                    <span className="slider"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        )}
                    </div>
                )}

                <div className="bottom-touch-shield"></div>
                <div className="tab-bar">
                    {!isModalOpen ? (
                        <React.Fragment>
                            <div onClick={() => setActiveTab('home')} className="tab-item"><Icons.Goals active={activeTab === 'home'} /></div>
                            <div onClick={() => setActiveTab('progress')} className="tab-item"><Icons.Focus active={activeTab === 'progress'} /></div>
                            <div className="tab-add-wrapper" onClick={openCreateModal}><div className="tab-add-btn-outline"><Icons.Add /></div></div>
                            <div onClick={() => setActiveTab('social')} className="tab-item"><Icons.Stats active={activeTab === 'social'} /></div>
                            <div onClick={() => setActiveTab('settings')} className="tab-item"><Icons.Settings active={activeTab === 'settings'} /></div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {createMode === 'micro' ? (
                                <React.Fragment>
                                    <div onClick={() => setCreateStep('text')} className="tab-item"><Icons.Text active={createStep === 'text'} /></div>
                                    <div onClick={() => setCreateStep('time')} className="tab-item"><Icons.Clock active={createStep === 'time'} /></div>
                                    <div className="tab-add-wrapper" onClick={closeCreateModal}><div className="tab-add-btn-outline" style={{ borderColor: 'var(--text-muted)', borderWidth: '2px' }}><Icons.Add style={{ transform: 'rotate(45deg)', transition: 'transform 0.3s ease' }} /></div></div>
                                    <div onClick={() => setCreateStep('notifs')} className="tab-item"><Icons.Bell active={createStep === 'notifs'} /></div>
                                    <div onClick={saveGoal} className="tab-item-save"><Icons.Save /></div>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <div style={{flex: 1}}></div>
                                    <div className="tab-add-wrapper" onClick={closeCreateModal}><div className="tab-add-btn-outline" style={{ borderColor: 'var(--text-muted)', borderWidth: '2px' }}><Icons.Add style={{ transform: 'rotate(45deg)', transition: 'transform 0.3s ease' }} /></div></div>
                                    <div onClick={saveGoal} className="tab-item-save"><Icons.Save /></div>
                                    <div style={{flex: 1}}></div>
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
