const { useState, useEffect, useRef, useMemo } = React;

const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const typeInfo = { once: { title: "Разовая", desc: "Сделать один раз." }, habit: { title: "Привычка", desc: "Регулярная задача." }, sprint: { title: "Спринт", desc: "Держись без срывов." } };
const toneInfo = { soft: { title: "Мягкий", desc: "Позитивная поддержка." }, hard: { title: "Жесткий", desc: "Суровая дисциплина." } };

const Icons = {
    Goals: (props) => ( <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}><circle cx="12" cy="12" r="9" /><line x1="12" y1="2" x2="12" y2="5" strokeLinecap="round"/><line x1="12" y1="19" x2="12" y2="22" strokeLinecap="round"/><line x1="2" y1="12" x2="5" y2="12" strokeLinecap="round"/><line x1="19" y1="12" x2="22" y2="12" strokeLinecap="round"/><circle cx="12" cy="12" r="0.5" fill={props.active ? "#FF8C00" : "#fff"} /></svg> ),
    Focus: (props) => ( <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}><path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" /></svg> ),
    Add: (props) => ( <svg viewBox="0 0 24 24" className="tab-add-icon" {...props}><line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" /><line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" /></svg> ),
    Stats: (props) => ( <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}><circle cx="4" cy="17" r="1.5" fill={props.active ? "#FF8C00" : "#fff"} /><circle cx="12" cy="7" r="1.5" fill={props.active ? "#FF8C00" : "#fff"} /><circle cx="20" cy="14" r="1.5" fill={props.active ? "#FF8C00" : "#fff"} /><path d="M5.5 16l5-7.5M13.5 8l5 4.5" strokeLinecap="round" /></svg> ),
    Settings: (props) => ( <svg viewBox="0 0 24 24" className="tab-icon" fill="none" stroke={props.active ? "#FF8C00" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> ),
    ChevronLeft: () => <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>,
    ChevronRight: () => <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>,
    Text: (props) => <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}><line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round"/><line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round"/><line x1="4" y1="18" x2="14" y2="18" strokeLinecap="round"/></svg>,
    Clock: (props) => <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Bell: (props) => <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Save: (props) => <svg viewBox="0 0 24 24" className="tab-icon" stroke="#fff" {...props}><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Target: (props) => <svg viewBox="0 0 24 24" fill="none" stroke={props.active ? "#FF8C00" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>,
    Infinity: (props) => <svg viewBox="0 0 24 24" fill="none" stroke={props.active ? "#FF8C00" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4z"/></svg>,
    Sprint: (props) => <svg viewBox="0 0 24 24" fill="none" stroke={props.active ? "#FF8C00" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    Soft: (props) => <svg viewBox="0 0 24 24" fill="none" stroke={props.active ? "#FF8C00" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
    Hard: (props) => <svg viewBox="0 0 24 24" fill="none" stroke={props.active ? "#FF8C00" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
    Play: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    Pause: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
    Refresh: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
};

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
            if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.selectionChanged();
        }
    };
    return (
        <div className="wheel-container" onScroll={handleScroll} ref={ref} style={{ width: width ? width : "60px" }}>
            <div className="wheel-spacer"></div>
            {items.map(item => <div key={item} className={`wheel-item ${item === value ? 'selected' : ''}`}>{item}</div>)}
            <div className="wheel-spacer"></div>
        </div>
    );
};

function App() {
    const [showSplash, setShowSplash] = useState(true);
    const [activeTab, setActiveTab] = useState('home');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [now, setNow] = useState(new Date());
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [offsetPx, setOffsetPx] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const touchStartTime = useRef(0); 
    const isDragging = useRef(false);
    const isSwipeValid = useRef(null); 
    const transitionTimer = useRef(null);
    const pendingShiftRef = useRef(0);
    
    const [motivationTone, setMotivationTone] = useState('soft');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    
    const [expandedGoalId, setExpandedGoalId] = useState(null);
    const [shakingGoalId, setShakingGoalId] = useState(null);
    const isLongPress = useRef(false);
    const pressTimer = useRef(null);
    
    const [goals, setGoals] = useState(() => {
        try { const saved = localStorage.getItem('motivateMe_v20_goals'); return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createStep, setCreateStep] = useState('text'); 
    const [editingGoalId, setEditingGoalId] = useState(null);
    const [actionMenuGoal, setActionMenuGoal] = useState(null);
    const [confirmDeleteGoalId, setConfirmDeleteGoalId] = useState(null);
    
    const [startMonth, setStartMonth] = useState(monthNames[new Date().getMonth()]);
    const [startDay, setStartDay] = useState(new Date().getDate().toString().padStart(2, '0'));

    const defaultForm = { title: '', description: '', type: 'habit', deadline: '23:59', duration: '', ignoreHoliday: false, notifications: true, supportTone: 'soft', startDate: null };
    const [form, setForm] = useState(defaultForm);

    const hoursList = Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0'));
    const minutesList = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));

    const daysInMonth = useMemo(() => {
        const monthIdx = monthNames.indexOf(startMonth);
        const year = new Date().getFullYear();
        const days = new Date(year, monthIdx + 1, 0).getDate();
        return Array.from({length: days}, (_, i) => (i + 1).toString().padStart(2, '0'));
    }, [startMonth]);

    useEffect(() => {
        if (daysInMonth && startDay && !daysInMonth.includes(startDay)) {
            setStartDay('01');
        }
    }, [daysInMonth, startDay]);

    const triggerHaptic = (type) => {
        try {
            if (window.Telegram?.WebApp?.HapticFeedback) {
                if (type === 'success') { window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy'); setTimeout(() => window.Telegram.WebApp.HapticFeedback.impactOccurred('rigid'), 150); }
                else if (type === 'error') { window.Telegram.WebApp.HapticFeedback.notificationOccurred('error'); setTimeout(() => window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy'), 50); }
                else window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
            }
        } catch(e) {}
    };

    // --- ЛОГИКА СТАТИСТИКИ ---
    const statsData = useMemo(() => {
        const today = new Date();
        let totalDone = 0;
        let bestStreak = 0;
        let completionByDate = {}; 

        // Собираем сырые данные
        goals.forEach(g => {
            if (!g || !g.history) return;
            const historyDates = Object.keys(g.history);
            totalDone += historyDates.length;
            if ((g.streak || 0) > bestStreak) bestStreak = g.streak;
            
            historyDates.forEach(dStr => {
                const d = new Date(dStr);
                if (isNaN(d.getTime())) return;
                const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                completionByDate[iso] = (completionByDate[iso] || 0) + 1;
            });
        });

        // Данные за последние 7 дней (для Bar Chart)
        const last7Days = [];
        let maxDaily = 1; 
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            const count = completionByDate[iso] || 0;
            if (count > maxDaily) maxDaily = count;
            last7Days.push({ 
                day: d.toLocaleDateString('ru-RU', { weekday: 'short' }), 
                count, iso
            });
        }

        // Данные для Тепловой карты (91 день = 13 недель)
        const heatmapCols = [];
        let currentWeek = [];
        for (let i = 90; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            const count = completionByDate[iso] || 0;
            
            let level = 0;
            if (count > 0) level = 1;
            if (count > 2) level = 2;
            if (count > 4) level = 3;

            currentWeek.push({ iso, level, count });
            if (currentWeek.length === 7 || i === 0) {
                heatmapCols.push(currentWeek);
                currentWeek = [];
            }
        }

        return { totalDone, bestStreak, last7Days, maxDaily, heatmapCols };
    }, [goals]);

    useEffect(() => {
        try { const tg = window.Telegram?.WebApp; if (tg) { tg.ready(); tg.expand(); } } catch(e) {}
        const endSplash = setTimeout(() => setShowSplash(false), 4000);
        return () => clearTimeout(endSplash);
    }, []);

    useEffect(() => {
        try { const tg = window.Telegram?.WebApp; if (tg) { const checkExpand = () => { setIsFullscreen(tg.isExpanded); }; checkExpand(); tg.onEvent('viewportChanged', checkExpand); } } catch(e) {}
    }, []);

    useEffect(() => { try { localStorage.setItem('motivateMe_v20_goals', JSON.stringify(goals)); } catch (e) {} }, [goals]);
    useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer); }, []);
    
    useEffect(() => {
        let interval = null;
        if (isTimerRunning && timeLeft > 0) interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        else if (timeLeft === 0) { setIsTimerRunning(false); triggerHaptic('success'); }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft]);

    const resetTimer = () => { setIsTimerRunning(false); setTimeLeft(25 * 60); triggerHaptic('light'); };
    const getOffsetDate = (baseDate, days) => { const d = new Date(baseDate); d.setDate(d.getDate() + days); return d; };

    const animateToDate = (daysShift) => {
        if (transitionTimer.current) { clearTimeout(transitionTimer.current); setCurrentDate(prev => getOffsetDate(prev, pendingShiftRef.current)); }
        pendingShiftRef.current = daysShift;
        setExpandedGoalId(null); setIsTransitioning(true);
        setOffsetPx(daysShift > 0 ? -window.innerWidth : window.innerWidth);
        triggerHaptic('light');
        transitionTimer.current = setTimeout(() => { setIsTransitioning(false); setOffsetPx(0); setCurrentDate(prev => getOffsetDate(prev, daysShift)); transitionTimer.current = null; pendingShiftRef.current = 0; }, 200); 
    };

    const onSwipeStart = (e) => {
        if (transitionTimer.current) { clearTimeout(transitionTimer.current); transitionTimer.current = null; setCurrentDate(prev => getOffsetDate(prev, pendingShiftRef.current)); setOffsetPx(0); setIsTransitioning(false); pendingShiftRef.current = 0; }
        touchStartX.current = e.touches[0].clientX; touchStartY.current = e.touches[0].clientY; touchStartTime.current = Date.now(); 
        isDragging.current = true; isSwipeValid.current = null; 
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
        const swipeDuration = Date.now() - touchStartTime.current; const velocity = offsetPx / swipeDuration; const threshold = window.innerWidth * 0.25; 
        if (offsetPx > threshold || velocity > 0.6) animateToDate(-1); else if (offsetPx < -threshold || velocity < -0.6) animateToDate(1); 
        else { setIsTransitioning(true); setOffsetPx(0); setTimeout(() => setIsTransitioning(false), 200); }
    };

    const openCreateModal = () => { 
        triggerHaptic('light'); 
        setEditingGoalId(null); 
        setForm(defaultForm); 
        setStartMonth(monthNames[new Date().getMonth()]);
        setStartDay(new Date().getDate().toString().padStart(2, '0'));
        setCreateStep('text'); 
        setIsModalOpen(true); 
    };
    const closeCreateModal = () => { triggerHaptic('light'); setIsModalOpen(false); };

    const saveGoal = () => {
        if (!form.title) { triggerHaptic('error'); setCreateStep('text'); return; }
        try {
            const nowObj = new Date();
            const currentYear = nowObj.getFullYear();
            const selectedMonthIdx = monthNames.indexOf(startMonth);
            const selectedDayNum = parseInt(startDay, 10);
            let targetYear = currentYear;
            if (selectedMonthIdx < nowObj.getMonth() || (selectedMonthIdx === nowObj.getMonth() && selectedDayNum < nowObj.getDate())) {
                targetYear = currentYear + 1;
            }
            const finalStartDate = new Date(targetYear, selectedMonthIdx, selectedDayNum);
            finalStartDate.setHours(0, 0, 0, 0);
            const goalData = { ...form, startDate: finalStartDate.toISOString() };
            if (editingGoalId) setGoals(goals.map(g => g.id === editingGoalId ? { ...goalData, id: g.id, streak: g.streak || 0, history: g.history || {}, createdAt: g.createdAt } : g));
            else setGoals([{ ...goalData, id: Date.now(), streak: 0, history: {}, createdAt: new Date().toDateString() }, ...goals]);
        } catch(e) { console.error("Save error", e); }
        setIsModalOpen(false); triggerHaptic('success');
    };
    
    const deleteGoal = () => { setGoals(goals.filter(g => g.id !== confirmDeleteGoalId)); setConfirmDeleteGoalId(null); triggerHaptic('success'); };
    
    const checkPermissions = (goal, checkDate) => {
        try {
            const viewingDate = new Date(checkDate); viewingDate.setHours(0, 0, 0, 0);
            const actualToday = new Date(now); actualToday.setHours(0, 0, 0, 0);
            const isPast = viewingDate < actualToday;
            const isToday = viewingDate.getTime() === actualToday.getTime();
            let isDeadlinePassed = isPast;
            if (isToday) { 
                const safeDeadline = goal.deadline || '23:59';
                const [h, m] = safeDeadline.split(':'); 
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
            if (view > today) return { text: `до ${safeDeadline}`, className: 'badge', style: {color: 'white'} };
            if (view < today) return { text: "00:00:00", className: 'badge failed-timer', style: {} };
            const [h, m] = safeDeadline.split(':'); 
            const limit = new Date(now); limit.setHours(parseInt(h, 10)||23, parseInt(m, 10)||59, 0, 0); 
            const diffMs = limit - now;
            if (diffMs <= 0) return { text: "00:00:00", className: 'badge failed-timer', style: {} };
            const hours = Math.floor(diffMs / (1000 * 60 * 60)); const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
            return { text: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`, className: `badge ${!isDone && diffMs < 3600000 ? 'urgent-timer' : ''}`, style: {} };
        } catch(e) { return { text: "00:00", className: 'badge failed-timer', style: {} }; }
    };

    const renderDayCards = (renderDate) => {
        const dateKey = renderDate.toDateString();
        const renderTime = renderDate.getTime();
        const activeGoals = goals.filter(g => { try { if (!g || !g.startDate) return true; return new Date(g.startDate).getTime() <= renderTime; } catch(e) { return true; } });
        if (activeGoals.length === 0) return <p style={{textAlign:'center', marginTop:'20px', opacity: 0.7}}>Задач на этот день нет.</p>;
        
        return activeGoals.map(g => {
            const isDone = !!(g.history && g.history[dateKey]); 
            const isExpanded = expandedGoalId === g.id; 
            const isShaking = shakingGoalId === g.id; 
            const { canToggle } = checkPermissions(g, renderDate); 
            const timerData = getTimerData(g, isDone, renderDate);
            
            return (
                <div key={g.id} className={`card ${isShaking ? 'shake' : ''}`} onTouchStart={() => handleCardTouchStart(g, renderDate)} onTouchEnd={handleCardTouchEnd} onMouseDown={() => handleCardTouchStart(g, renderDate)} onMouseUp={handleCardTouchEnd} onClick={() => handleCardClick(g)} style={{ opacity: isDone ? 0.6 : 1 }}>
                    <div className="goal-info">
                        <div className="goal-title" style={{ textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'rgba(255,255,255,0.6)' : 'white' }}>{g.title}</div>
                        <div className="stats-row">
                            {g.type !== 'once' && <span className="badge">{g.streak || 0} 🔥</span>}
                            {g.type === 'habit' && <span className="badge">∞</span>}
                            {g.type === 'sprint' && <span className="badge">{Math.max(0, parseInt(g.duration || 0) - (g.streak || 0))} ⏳</span>}
                            <span className={timerData.className} style={timerData.style}>⏱ {timerData.text}</span>
                        </div>
                        <div className={`goal-desc-wrapper ${isExpanded ? 'expanded' : ''}`}><div className="goal-desc-inner"><div className="goal-desc">{g.description || 'Описания нет. Просто бери и делай!'}</div></div></div>
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
    
    const toggleGoal = (e, goalObj, dateTarget) => {
        e.stopPropagation(); const { canToggle } = checkPermissions(goalObj, dateTarget);
        if (!canToggle) { triggerHaptic('error'); setShakingGoalId(goalObj.id); setTimeout(() => setShakingGoalId(null), 400); return; }
        const dateStr = dateTarget.toDateString(); 
        const isCurrentlyDone = !!(goalObj.history && goalObj.history[dateStr]);
        setGoals(goals.map(g => {
            if (g.id !== goalObj.id) return g;
            const newHistory = { ...(g.history || {}) };
            if (!isCurrentlyDone) { newHistory[dateStr] = true; triggerHaptic('success'); } else { delete newHistory[dateStr]; triggerHaptic('light'); }
            return { ...g, history: newHistory, streak: isCurrentlyDone ? Math.max(0, (g.streak || 0) - 1) : (g.streak || 0) + 1 };
        }));
    };

    const handleDescChange = (e) => { setForm({...form, description: e.target.value}); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'; };
    const transitionStyle = isTransitioning ? 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';

    return (
        <React.Fragment>
            {showSplash && (
                <div className="simple-splash-overlay">
                    <img src="image_0.png" alt="Logo" className="splash-logo" />
                    <h1 className="splash-title">MotivateMe</h1>
                </div>
            )}

            <div className="container" style={{ paddingTop: isFullscreen ? 'calc(5px + 7vh)' : '10px' }}>
                {isModalOpen && <div className="glass-backdrop" onClick={closeCreateModal}></div>}
                
                <div className="header-notcoin-style">
                    <img src="image_0.png" alt="Logo" className="m-logo-small" />
                    <h1 className="main-title-small">MotivateMe</h1>
                </div>

                {activeTab === 'home' && (
                    <div className="swipe-area" onTouchStart={onSwipeStart} onTouchMove={onSwipeMove} onTouchEnd={onSwipeEnd} style={{ pointerEvents: isModalOpen ? 'none' : 'auto' }}>
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
                )}
                
                {activeTab === 'progress' && (
                    <div className="timer-panel">
                        <h3 style={{ textAlign: 'center', color: '#fff', margin: '0 0 20px 0', fontSize: '20px' }}>Фокус</h3>
                        <div className="timer-display">{Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
                        <div className="timer-controls">
                            <button className="btn-timer-reset" onClick={resetTimer}><Icons.Refresh /></button>
                            <button className="btn-timer-main" onClick={() => { setIsTimerRunning(!isTimerRunning); triggerHaptic('light'); }}>{isTimerRunning ? <Icons.Pause /> : <Icons.Play />}</button>
                            <div style={{ width: '48px' }}></div> 
                        </div>
                    </div>
                )}

                {/* НОВАЯ ВКЛАДКА: СТАТИСТИКА */}
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
                            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#fff' }}>Активность за 7 дней</h3>
                            <div className="bar-chart">
                                {statsData.last7Days.map(day => (
                                    <div key={day.iso} className="bar-col">
                                        <div className="bar-track">
                                            <div className="bar-fill" style={{ height: `${(day.count / statsData.maxDaily) * 100}%` }}></div>
                                        </div>
                                        <div className="bar-label">{day.day}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card" style={{ display: 'block', maxWidth: '360px', margin: '0 auto 12px auto' }}>
                            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#fff' }}>Пульс (90 дней)</h3>
                            <div className="heatmap-scroll">
                                <div className="heatmap-grid">
                                    {statsData.heatmapCols.map((col, cIdx) => (
                                        <div key={cIdx} className="heatmap-col">
                                            {col.map(cell => (
                                                <div key={cell.iso} className={`heatmap-cell level-${cell.level}`}></div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="card" style={{ display: 'block', background: 'rgba(0,0,0,0.65)', maxWidth: '360px', margin: '0 auto' }}>
                        <h3 style={{ textAlign: 'center', color: '#fff', margin: '0 0 15px 0' }}>Настройки</h3>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#fff' }}>Тон поддержки:</label>
                        <select className="custom-select dark-input" value={motivationTone} onChange={e => setMotivationTone(e.target.value)}>
                            <option value="soft" style={{color: '#000'}}>Мягкий</option>
                            <option value="hard" style={{color: '#000'}}>Жесткий</option>
                        </select>
                    </div>
                )}

                {actionMenuGoal && (
                    <div className="modal-overlay" onClick={() => setActionMenuGoal(null)}>
                        <div className="modal-content" style={{ paddingBottom: '40px', display: 'block' }} onClick={e => e.stopPropagation()}>
                            <h2 style={{margin:'0 0 5px 0', textAlign: 'center', color: '#000'}}>{actionMenuGoal.title}</h2><p style={{textAlign: 'center', color: '#777', marginTop: 0, marginBottom: '25px'}}>Выберите действие</p>
                            <button className="btn-save" style={{background: '#000', marginBottom: '10px'}} onClick={() => { setForm({...actionMenuGoal}); setEditingGoalId(actionMenuGoal.id); setActionMenuGoal(null); setCreateStep('text'); setIsModalOpen(true); }}>✏️ Редактировать</button>
                            <button className="btn-danger" onClick={() => { setConfirmDeleteGoalId(actionMenuGoal.id); setActionMenuGoal(null); }}>🗑 Удалить цель</button>
                            <button className="btn-cancel" onClick={() => setActionMenuGoal(null)}>Закрыть</button>
                        </div>
                    </div>
                )}
                {confirmDeleteGoalId && (<div className="modal-overlay modal-center" onClick={() => setConfirmDeleteGoalId(null)}><div className="modal-content-center" style={{ display: 'block' }} onClick={e => e.stopPropagation()}><h2>Удалить цель?</h2><p style={{color: '#777', marginBottom: '25px'}}>История будет стерта.</p><button className="btn-danger" onClick={deleteGoal}>Удалить</button><button className="btn-cancel" onClick={() => setConfirmDeleteGoalId(null)}>Отмена</button></div></div>)}

                {isModalOpen && (
                    <div className="create-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{margin: '0 0 15px 0', textAlign: 'center', fontSize: '18px'}}>{editingGoalId ? 'Редактировать' : 'Новая цель'}</h3>
                        {createStep === 'text' && (<div className="panel-step"><input placeholder="Название" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="dark-input" /><textarea placeholder="Описание" value={form.description} onChange={handleDescChange} className="dark-input custom-scrollbar" style={{ minHeight: '60px', maxHeight: '140px', resize: 'none', overflowY: 'auto' }} /></div>)}
                        
                        {createStep === 'time' && (
                            <div className="panel-step">
                                <div className="radio-group">
                                    <div className={`radio-btn ${(form.type || 'habit') === 'once' ? 'active' : ''}`} onClick={() => {triggerHaptic('light'); setForm({...form, type: 'once'})}}><Icons.Target active={(form.type || 'habit') === 'once'} /></div>
                                    <div className={`radio-btn ${(form.type || 'habit') === 'habit' ? 'active' : ''}`} onClick={() => {triggerHaptic('light'); setForm({...form, type: 'habit'})}}><Icons.Infinity active={(form.type || 'habit') === 'habit'} /></div>
                                    <div className={`radio-btn ${(form.type || 'habit') === 'sprint' ? 'active' : ''}`} onClick={() => {triggerHaptic('light'); setForm({...form, type: 'sprint'})}}><Icons.Sprint active={(form.type || 'habit') === 'sprint'} /></div>
                                </div>
                                <div className="info-box"><div className="info-title">{typeInfo[form.type || 'habit'].title}</div><div className="info-desc">{typeInfo[form.type || 'habit'].desc}</div></div>
                                {(form.type || 'habit') === 'sprint' && (<input type="number" placeholder="Дней соблюдать?" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="dark-input" style={{textAlign: 'center', marginTop: '10px'}} />)}
                                
                                <hr className="divider" />
                                
                                <div className="wheels-grid">
                                    <div className="wheel-section">
                                        <div className="wheel-label">Дедлайн</div>
                                        <div className="ios-time-picker mini">
                                            <TimeWheel items={hoursList} value={(form.deadline || '23:59').split(':')[0]} onChange={h => setForm({...form, deadline: `${h}:${(form.deadline || '23:59').split(':')[1]}`})} width="40px" />
                                            <span className="time-colon">:</span>
                                            <TimeWheel items={minutesList} value={(form.deadline || '23:59').split(':')[1]} onChange={m => setForm({...form, deadline: `${(form.deadline || '23:59').split(':')[0]}:${m}`})} width="40px" />
                                        </div>
                                    </div>
                                    <div className="wheel-section">
                                        <div className="wheel-label">Начало</div>
                                        <div className="ios-time-picker mini">
                                            <TimeWheel items={monthNames} value={startMonth} onChange={setStartMonth} width="85px" />
                                            <TimeWheel items={daysInMonth} value={startDay} onChange={setStartDay} width="40px" />
                                        </div>
                                    </div>
                                </div>

                                <div className="setting-row"><span style={{fontSize: '15px', fontWeight: '500'}}>Без выходных</span><label className="ios-switch"><input type="checkbox" checked={form.ignoreHoliday || false} onChange={e => {triggerHaptic('light'); setForm({...form, ignoreHoliday: e.target.checked})}} /><span className="slider"></span></label></div>
                            </div>
                        )}
                        
                        {createStep === 'notifs' && (
                            <div className="panel-step">
                                <div className="setting-row" style={{marginBottom: '20px'}}><span style={{fontSize: '15px', fontWeight: '500'}}>Уведомления</span><label className="ios-switch"><input type="checkbox" checked={form.notifications !== false} onChange={e => {triggerHaptic('light'); setForm({...form, notifications: e.target.checked})}} /><span className="slider"></span></label></div><hr className="divider" />
                                <div style={{textAlign: 'center', fontWeight: 'bold', marginBottom: '10px', fontSize: '14px'}}>Тон поддержки</div>
                                <div className="radio-group" style={{ maxWidth: '200px', margin: '0 auto 10px auto' }}>
                                    <div className={`radio-btn ${(form.supportTone || 'soft') === 'soft' ? 'active' : ''}`} onClick={() => {triggerHaptic('light'); setForm({...form, supportTone: 'soft'})}}><Icons.Soft active={(form.supportTone || 'soft') === 'soft'} /></div>
                                    <div className={`radio-btn ${(form.supportTone || 'soft') === 'hard' ? 'active' : ''}`} onClick={() => {triggerHaptic('light'); setForm({...form, supportTone: 'hard'})}}><Icons.Hard active={(form.supportTone || 'soft') === 'hard'} /></div>
                                </div>
                                <div className="info-box"><div className="info-title">{toneInfo[form.supportTone || 'soft'].title}</div><div className="info-desc">{toneInfo[form.supportTone || 'soft'].desc}</div></div>
                            </div>
                        )}
                    </div>
                )}

                <div className="bottom-touch-shield"></div>
                <div className="tab-bar">
                    {!isModalOpen ? (
                        <React.Fragment>
                            <div onClick={() => setActiveTab('home')} className="tab-item"><Icons.Goals active={activeTab === 'home'} /></div><div onClick={() => setActiveTab('progress')} className="tab-item"><Icons.Focus active={activeTab === 'progress'} /></div>
                            <div className="tab-add-wrapper" onClick={openCreateModal}><div className="tab-add-btn-outline"><Icons.Add /></div></div>
                            <div onClick={() => setActiveTab('social')} className="tab-item"><Icons.Stats active={activeTab === 'social'} /></div><div onClick={() => setActiveTab('settings')} className="tab-item"><Icons.Settings active={activeTab === 'settings'} /></div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <div onClick={() => {triggerHaptic('light'); setCreateStep('text');}} className="tab-item"><Icons.Text active={createStep === 'text'} /></div><div onClick={() => {triggerHaptic('light'); setCreateStep('time');}} className="tab-item"><Icons.Clock active={createStep === 'time'} /></div>
                            <div className="tab-add-wrapper" onClick={closeCreateModal}><div className="tab-add-btn-outline" style={{ borderColor: '#444' }}><Icons.Add style={{ transform: 'rotate(45deg)', transition: 'transform 0.3s ease' }} /></div></div>
                            <div onClick={() => {triggerHaptic('light'); setCreateStep('notifs');}} className="tab-item"><Icons.Bell active={createStep === 'notifs'} /></div>
                            <div onClick={saveGoal} className="tab-item-save"><Icons.Save /></div>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
