const { useState, useEffect, useRef } = React;

const Icons = {
    Goals: (props) => ( <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}><circle cx="12" cy="12" r="9" /><line x1="12" y1="2" x2="12" y2="5" strokeLinecap="round"/><line x1="12" y1="19" x2="12" y2="22" strokeLinecap="round"/><line x1="2" y1="12" x2="5" y2="12" strokeLinecap="round"/><line x1="19" y1="12" x2="22" y2="12" strokeLinecap="round"/><circle cx="12" cy="12" r="0.5" fill={props.active ? "#FF8C00" : "#fff"} /></svg> ),
    Focus: (props) => ( <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}><path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" /></svg> ),
    Add: (props) => ( <svg viewBox="0 0 24 24" className="tab-add-icon" {...props}><line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" /><line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" /></svg> ),
    Stats: (props) => ( <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}><circle cx="4" cy="17" r="1.5" fill={props.active ? "#FF8C00" : "#fff"} /><circle cx="12" cy="7" r="1.5" fill={props.active ? "#FF8C00" : "#fff"} /><circle cx="20" cy="14" r="1.5" fill={props.active ? "#FF8C00" : "#fff"} /><path d="M5.5 16l5-7.5M13.5 8l5 4.5" strokeLinecap="round" /></svg> ),
    Settings: (props) => ( <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg> ),
    ChevronLeft: () => <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>,
    ChevronRight: () => <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>,
    Text: (props) => <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}><line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round"/><line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round"/><line x1="4" y1="18" x2="14" y2="18" strokeLinecap="round"/></svg>,
    Clock: (props) => <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Bell: (props) => <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Save: (props) => <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Target: (props) => <svg viewBox="0 0 24 24" fill="none" stroke={props.active ? "#FF8C00" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    Infinity: (props) => <svg viewBox="0 0 24 24" fill="none" stroke={props.active ? "#FF8C00" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 8a4 4 0 1 0 0 8 4 4 0 0 0 4-4 4 4 0 0 1 4-4 4 4 0 1 1 0 8 4 4 0 0 1-4-4"/></svg>,
    Hourglass: (props) => <svg viewBox="0 0 24 24" fill="none" stroke={props.active ? "#FF8C00" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M8 2h8M8 22h8M10 10l-2-8h8l-2 8a2 2 0 0 0 0 4l2 8H8l2-8a2 2 0 0 0 0-4z"/></svg>,
    Heart: (props) => <svg viewBox="0 0 24 24" fill="none" stroke={props.active ? "#FF8C00" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    Fire: (props) => <svg viewBox="0 0 24 24" fill="none" stroke={props.active ? "#FF8C00" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.2 3a2 2 0 0 1 1.4.59 2 2 0 0 1 .6 1.51c-.08 1.33-.86 2.66-2.2 3.9a13 13 0 0 1-1.37 1 8.5 8.5 0 0 0-1.63-2c-.6-.5-1.2-.84-1.8-.84-.5 0-1 .3-1.4.88-.4.57-.6 1.25-.6 2.05 0 1 .3 2 .88 3.03.6.98 1.45 2.02 2.62 3.07a8.5 8.5 0 0 0 3.33 2.1c-1 .85-2.2 1.27-3.53 1.27-1.55 0-2.9-.5-4.05-1.5A5.5 5.5 0 0 1 5.5 15c0-1.45.6-2.95 1.7-4.4.9-1.2 2-2.14 3.3-2.8a10.5 10.5 0 0 1 1.6-1.74c1.1-1 1.83-2.15 2.2-3.46.2-.7.5-1.06.9-1.06.2 0 .4.08.6.22z"/></svg>,
    Play: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    Pause: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
    Refresh: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
};

const TimeWheel = ({ items, value, onChange }) => {
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
        <div className="wheel-container" onScroll={handleScroll} ref={ref}>
            <div className="wheel-spacer"></div>
            {items.map(item => <div key={item} className={`wheel-item ${item === value ? 'selected' : ''}`}>{item}</div>)}
            <div className="wheel-spacer"></div>
        </div>
    );
};

function App() {
    const [showSplash, setShowSplash] = useState(true);
    const [activeTab, setActiveTab] = useState('home');
    const [userName, setUserName] = useState('Чемпион');
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
    const defaultForm = { title: '', description: '', type: 'habit', deadline: '23:59', duration: '', ignoreHoliday: false, notifications: true, supportTone: 'soft' };
    const [form, setForm] = useState(defaultForm);
    const hoursList = Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0'));
    const minutesList = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));

    const triggerHaptic = (type) => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            if (type === 'success') { window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy'); setTimeout(() => window.Telegram.WebApp.HapticFeedback.impactOccurred('rigid'), 150); }
            else if (type === 'error') { window.Telegram.WebApp.HapticFeedback.notificationOccurred('error'); setTimeout(() => window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy'), 50); }
            else window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
        }
    };

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (tg) { tg.ready(); tg.expand(); if (tg.initDataUnsafe?.user) setUserName(tg.initDataUnsafe.user.first_name); }
        
        // ЗАСТАВКА ТЕПЕРЬ ЖИВЕТ 4 СЕКУНДЫ
        const endSplash = setTimeout(() => {
            setShowSplash(false);
        }, 4000);

        return () => clearTimeout(endSplash);
    }, []);

    useEffect(() => {
        const handleGlobalTouch = (e) => { if (!e.target.closest('.card') && !e.target.closest('.modal-content') && expandedGoalId) setExpandedGoalId(null); };
        document.addEventListener('touchstart', handleGlobalTouch);
        document.addEventListener('mousedown', handleGlobalTouch);
        return () => { document.removeEventListener('touchstart', handleGlobalTouch); document.removeEventListener('mousedown', handleGlobalTouch); };
    }, [expandedGoalId]);

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (tg) { const checkExpand = () => { setIsFullscreen(tg.isExpanded); }; checkExpand(); tg.onEvent('viewportChanged', checkExpand); }
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

    const openCreateModal = () => { triggerHaptic('light'); setEditingGoalId(null); setForm(defaultForm); setCreateStep('text'); setIsModalOpen(true); };
    const closeCreateModal = () => { triggerHaptic('light'); setIsModalOpen(false); };
    const saveGoal = () => {
        if (!form.title) { triggerHaptic('error'); setCreateStep('text'); return; }
        if (editingGoalId) setGoals(goals.map(g => g.id === editingGoalId ? { ...form, id: g.id, streak: g.streak, history: g.history, createdAt: g.createdAt } : g));
        else setGoals([{ ...form, id: Date.now(), streak: 0, history: {}, createdAt: new Date().toDateString() }, ...goals]);
        setIsModalOpen(false); triggerHaptic('success');
    };
    const deleteGoal = () => { setGoals(goals.filter(g => g.id !== confirmDeleteGoalId)); setConfirmDeleteGoalId(null); triggerHaptic('success'); };
    const checkPermissions = (goal, checkDate) => {
        const viewingDate = new Date(checkDate); viewingDate.setHours(0, 0, 0, 0); const actualToday = new Date(now); actualToday.setHours(0, 0, 0, 0);
        const isPast = viewingDate < actualToday; const isToday = viewingDate.getTime() === actualToday.getTime();
        let isDeadlinePassed = isPast; if (isToday) { const [h, m] = goal.deadline.split(':'); const limit = new Date(now); limit.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0); if (now > limit) isDeadlinePassed = true; }
        return { canToggle: isToday && !isDeadlinePassed, canEdit: !isPast && !isDeadlinePassed };
    };
    const getTimerData = (goal, isDone, checkDate) => {
        const view = new Date(checkDate); view.setHours(0, 0, 0, 0); const today = new Date(now); today.setHours(0, 0, 0, 0);
        if (view > today) return { text: `до ${goal.deadline}`, className: 'badge', style: {color: 'white'} };
        if (view < today) return { text: "00:00:00", className: 'badge failed-timer', style: {} };
        const [h, m] = goal.deadline.split(':'); const limit = new Date(now); limit.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0); const diffMs = limit - now;
        if (diffMs <= 0) return { text: "00:00:00", className: 'badge failed-timer', style: {} };
        const hours = Math.floor(diffMs / (1000 * 60 * 60)); const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
        return { text: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`, className: `badge ${!isDone && diffMs < 3600000 ? 'urgent-timer' : ''}`, style: {} };
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
        const dateStr = dateTarget.toDateString(); const isCurrentlyDone = !!goalObj.history[dateStr];
        setGoals(goals.map(g => {
            if (g.id !== goalObj.id) return g;
            const newHistory = { ...g.history };
            if (!isCurrentlyDone) { newHistory[dateStr] = true; triggerHaptic('success'); } else { delete newHistory[dateStr]; triggerHaptic('light'); }
            return { ...g, history: newHistory, streak: isCurrentlyDone ? Math.max(0, g.streak - 1) : g.streak + 1 };
        }));
    };
    const handleDescChange = (e) => { setForm({...form, description: e.target.value}); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'; };
    const typeInfo = { once: { title: "Разовая", desc: "Сделать один раз." }, habit: { title: "Привычка", desc: "Регулярная задача." }, sprint: { title: "Спринт", desc: "Держись без срывов." } };
    const toneInfo = { soft: { title: "Мягкий", desc: "Позитивная поддержка." }, hard: { title: "Жесткий", desc: "Суровая дисциплина." } };
    const renderDayCards = (renderDate) => {
        const dateKey = renderDate.toDateString(); if (goals.length === 0) return <p style={{textAlign:'center', marginTop:'20px', opacity: 0.7}}>Список пуст. Нажми + внизу!</p>;
        return goals.map(g => {
            const isDone = !!g.history[dateKey]; const isExpanded = expandedGoalId === g.id; const isShaking = shakingGoalId === g.id; const { canToggle } = checkPermissions(g, renderDate); const timerData = getTimerData(g, isDone, renderDate);
            return (
                <div key={g.id} className={`card ${isShaking ? 'shake' : ''}`} onTouchStart={() => handleCardTouchStart(g, renderDate)} onTouchEnd={handleCardTouchEnd} onMouseDown={() => handleCardTouchStart(g, renderDate)} onMouseUp={handleCardTouchEnd} onClick={() => handleCardClick(g)} style={{ opacity: isDone ? 0.6 : 1 }}>
                    <div className="goal-info">
                        <div className="goal-title" style={{ textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'rgba(255,255,255,0.6)' : 'white' }}>{g.title}</div>
                        <div className="stats-row">
                            {g.type !== 'once' && <span className="badge">{g.streak} 🔥</span>}
                            {g.type === 'habit' && <span className="badge">∞</span>}
                            {g.type === 'sprint' && <span className="badge">{Math.max(0, parseInt(g.duration || 0) - g.streak)} ⏳</span>}
                            <span className={timerData.className} style={timerData.style}>⏱ {timerData.text}</span>
                        </div>
                        <div className={`goal-desc-wrapper ${isExpanded ? 'expanded' : ''}`}><div className="goal-desc-inner"><div className="goal-desc">{g.description || 'Описания нет. Просто бери и делай!'}</div></div></div>
                    </div>
                    <button className={`btn-complete ${isDone ? 'done' : ''} ${!canToggle ? 'disabled' : ''}`} onClick={(e) => toggleGoal(e, g, renderDate)}><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
                </div>
            );
        });
    };
    const transitionStyle = isTransitioning ? 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';

    return (
        <React.Fragment>
            {/* ПРОСТАЯ И СТРОГАЯ ЗАСТАВКА */}
            {showSplash && (
                <div className="simple-splash-overlay">
                    <img src="image_0.png" alt="Logo" className="splash-logo" onError={(e) => e.target.style.display='none'} />
                    <h1 className="splash-title">MotivateMe</h1>
                </div>
            )}

            <div className="container" style={{ paddingTop: isFullscreen ? 'calc(20px + 7vh)' : '20px' }}>
                {isModalOpen && <div className="glass-backdrop" onClick={closeCreateModal}></div>}
                <div className="header">
                    <div className="title-row"><h1 className="main-title">MotivateMe</h1><img src="image_0.png" alt="Logo" className="m-logo" onError={(e) => e.target.style.display='none'} /></div>
                    <p style={{ opacity: 0.9, margin: '5px 0', fontSize: '15px' }}>{userName}, действуй!</p>
                </div>
                {activeTab === 'home' && (
                    <div className="swipe-area" onTouchStart={onSwipeStart} onTouchMove={onSwipeMove} onTouchEnd={onSwipeEnd} style={{ pointerEvents: isModalOpen ? 'none' : 'auto' }}>
                        <div style={{ position: 'absolute', top: '2px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '400px', display: 'flex', justifyContent: 'space-between', padding: '0 10px', boxSizing: 'border-box', zIndex: 10, pointerEvents: 'none' }}>
                            <button className="date-nav-btn" style={{ pointerEvents: 'auto' }} onClick={() => animateToDate(-1)}><Icons.ChevronLeft /></button>
                            <button className="date-nav-btn" style={{ pointerEvents: 'auto' }} onClick={() => animateToDate(1)}><Icons.ChevronRight /></button>
                        </div>
                        <div className="cards-track" style={{ transform: `translateX(calc(-100vw + ${offsetPx}px))`, transition: transitionStyle }}>
                            {[-1, 0, 1].map(shift => {
                                const renderDate = getOffsetDate(currentDate, shift);
                                return (
                                    <div className="cards-pane" key={renderDate.toDateString()}>
                                        <div style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold', color: '#fff', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>{renderDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</div>
                                        {renderDayCards(renderDate)}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {activeTab === 'progress' && (
                    <div className="timer-panel">
                        <h3 style={{ textAlign: 'center', color: '#fff', margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600' }}>Фокус</h3>
                        <div className="timer-display">{Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
                        <div className="timer-controls">
                            <button className="btn-timer-reset" onClick={resetTimer}><Icons.Refresh /></button>
                            <button className="btn-timer-main" onClick={() => { setIsTimerRunning(!isTimerRunning); triggerHaptic('light'); }}>{isTimerRunning ? <Icons.Pause /> : <Icons.Play />}</button>
                            <div style={{ width: '48px' }}></div> 
                        </div>
                    </div>
                )}
                {activeTab === 'social' && (<div className="card" style={{ display: 'block', background: 'rgba(0,0,0,0.65)', maxWidth: '360px', margin: '0 auto' }}><h3 style={{ textAlign: 'center', color: '#fff', margin: '0 0 10px 0' }}>Статистика</h3><p style={{textAlign: 'center', color: 'rgba(255,255,255,0.6)'}}>Графики появятся скоро!</p></div>)}
                {activeTab === 'settings' && (<div className="card" style={{ display: 'block', background: 'rgba(0,0,0,0.65)', maxWidth: '360px', margin: '0 auto' }}><h3 style={{ textAlign: 'center', color: '#fff', margin: '0 0 15px 0' }}>Настройки</h3><label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#fff' }}>Тон поддержки:</label><select className="custom-select dark-input" value={motivationTone} onChange={e => setMotivationTone(e.target.value)}><option value="soft" style={{color: '#000'}}>Мягкий</option><option value="hard" style={{color: '#000'}}>Жесткий</option></select></div>)}
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
                                <div className="radio-group"><div className={`radio-btn ${form.type === 'once' ? 'active' : ''}`} onClick={() => {triggerHaptic('light'); setForm({...form, type: 'once'})}}><Icons.Target active={form.type === 'once'} /></div><div className={`radio-btn ${form.type === 'habit' ? 'active' : ''}`} onClick={() => {triggerHaptic('light'); setForm({...form, type: 'habit'})}}><Icons.Infinity active={form.type === 'habit'} /></div><div className={`radio-btn ${form.type === 'sprint' ? 'active' : ''}`} onClick={() => {triggerHaptic('light'); setForm({...form, type: 'sprint'})}}><Icons.Hourglass active={form.type === 'sprint'} /></div></div>
                                <div className="info-box"><div className="info-title">{typeInfo[form.type].title}</div><div className="info-desc">{typeInfo[form.type].desc}</div></div>
                                {form.type === 'sprint' && (<input type="number" placeholder="Дней" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="dark-input" style={{textAlign: 'center', marginTop: '10px'}} />)}<hr className="divider" />
                                <div style={{textAlign: 'center', fontWeight: 'bold', marginBottom: '10px', fontSize: '14px'}}>Дедлайн</div>
                                <div className="ios-time-picker"><TimeWheel items={hoursList} value={form.deadline.split(':')[0]} onChange={h => setForm({...form, deadline: `${h}:${form.deadline.split(':')[1]}`})} /><span className="time-colon">:</span><TimeWheel items={minutesList} value={form.deadline.split(':')[1]} onChange={m => setForm({...form, deadline: `${form.deadline.split(':')[0]}:${m}`})} /></div>
                                <div className="setting-row"><span style={{fontSize: '15px', fontWeight: '500'}}>Без выходных</span><label className="ios-switch"><input type="checkbox" checked={form.ignoreHoliday} onChange={e => {triggerHaptic('light'); setForm({...form, ignoreHoliday: e.target.checked})}} /><span className="slider"></span></label></div>
                            </div>
                        )}
                        {createStep === 'notifs' && (
                            <div className="panel-step">
                                <div className="setting-row" style={{marginBottom: '20px'}}><span style={{fontSize: '15px', fontWeight: '500'}}>Уведомления</span><label className="ios-switch"><input type="checkbox" checked={form.notifications} onChange={e => {triggerHaptic('light'); setForm({...form, notifications: e.target.checked})}} /><span className="slider"></span></label></div><hr className="divider" />
                                <div style={{textAlign: 'center', fontWeight: 'bold', marginBottom: '10px', fontSize: '14px'}}>Тон поддержки</div>
                                <div className="radio-group" style={{ maxWidth: '200px', margin: '0 auto 10px auto' }}><div className={`radio-btn ${form.supportTone === 'soft' ? 'active' : ''}`} onClick={() => {triggerHaptic('light'); setForm({...form, supportTone: 'soft'})}}><Icons.Heart active={form.supportTone === 'soft'} /></div><div className={`radio-btn ${form.supportTone === 'hard' ? 'active' : ''}`} onClick={() => {triggerHaptic('light'); setForm({...form, supportTone: 'hard'})}}><Icons.Fire active={form.supportTone === 'hard'} /></div></div>
                                <div className="info-box"><div className="info-title">{toneInfo[form.supportTone].title}</div><div className="info-desc">{toneInfo[form.supportTone].desc}</div></div>
                            </div>
                        )}
                    </div>
                )}
                <div className="bottom-touch-shield"></div>
                <div className="tab-bar">
                    {!isModalOpen ? (
                        <React.Fragment>
                            <div onClick={() => setActiveTab('home')} className="tab-item"><Icons.Goals active={activeTab === 'home'} /></div><div onClick={() => setActiveTab('progress')} className="tab-item"><Icons.Focus active={activeTab === 'progress'} /></div><div className="tab-add-wrapper" onClick={openCreateModal}><div className="tab-add-btn"><Icons.Add /></div></div><div onClick={() => setActiveTab('social')} className="tab-item"><Icons.Stats active={activeTab === 'social'} /></div><div onClick={() => setActiveTab('settings')} className="tab-item"><Icons.Settings active={activeTab === 'settings'} /></div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <div onClick={() => {triggerHaptic('light'); setCreateStep('text');}} className="tab-item"><Icons.Text active={createStep === 'text'} /></div><div onClick={() => {triggerHaptic('light'); setCreateStep('time');}} className="tab-item"><Icons.Clock active={createStep === 'time'} /></div><div className="tab-add-wrapper" onClick={closeCreateModal}><div className="tab-add-btn" style={{ background: '#444' }}><Icons.Add style={{ transform: 'rotate(45deg)', transition: 'transform 0.3s ease' }} /></div></div><div onClick={() => {triggerHaptic('light'); setCreateStep('notifs');}} className="tab-item"><Icons.Bell active={createStep === 'notifs'} /></div><div onClick={saveGoal} className="tab-item"><Icons.Save active={false} /></div>
                        </React.Fragment>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
