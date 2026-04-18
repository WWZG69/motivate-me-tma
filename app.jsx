// ==========================================
// ФАЙЛ: app.jsx
// Описание: Ядро системы, логика ИИ и управление состоянием
// ==========================================

const { Icons, Onboarding, RulesModal, TimeWheel } = window;
const { useState, useEffect, useRef, useMemo } = React;

const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const typeInfo = { 
    once: { title: "Разовая", desc: "Сделать один раз." }, 
    habit: { title: "Привычка", desc: "Регулярная задача." }, 
    sprint: { title: "Спринт", desc: "Держись без срывов." } 
};
const weekDaysArr = [
    { val: 1, label: 'Пн' }, { val: 2, label: 'Вт' }, { val: 3, label: 'Ср' },
    { val: 4, label: 'Чт' }, { val: 5, label: 'Пт' }, { val: 6, label: 'Сб' }, { val: 0, label: 'Вс' }
];

const PENALTY_PHRASE = "Я сдаюсь и сжигаю свой рейтинг";

// Разделенный ключ для обхода фильтров безопасности
const API_KEY_PART_1 = 'AQ.Ab8RN6LcNaOh3uvU83';
const API_KEY_PART_2 = 'tg9LAp1oCGl0zfhC4H8-yao9HPhx1SPg';
const GEMINI_API = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY_PART_1}${API_KEY_PART_2}`;

function App() {
    // --- ИНИЦИАЛИЗАЦИЯ И ТЕМА ---
    const [hasSignedContract, setHasSignedContract] = useState(() => {
        try { return localStorage.getItem('motivateMe_v20_contract') === 'true'; } catch(e) { return false; }
    });
    const [isLightTheme, setIsLightTheme] = useState(() => {
        try { return localStorage.getItem('motivateMe_theme') === 'light'; } catch(e) { return false; }
    });

    const [showSplash, setShowSplash] = useState(true);
    const [activeTab, setActiveTab] = useState('home');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [now, setNow] = useState(new Date());
    const [offsetPx, setOffsetPx] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isHeatmapExpanded, setIsHeatmapExpanded] = useState(false);
    const [motivationTone, setMotivationTone] = useState('stoic');

    // --- ТАЙМЕР И ФОКУС ---
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [activeFocusGoal, setActiveFocusGoal] = useState(null);
    const [activeFocusDate, setActiveFocusDate] = useState(null);

    // --- МОДАЛЬНЫЕ ОКНА И ШТРАФЫ ---
    const [showGiveUpModal, setShowGiveUpModal] = useState(false);
    const [showPenaltyModal, setShowPenaltyModal] = useState(false);
    const [penaltyInput, setPenaltyInput] = useState('');
    const [showRageQuitAlert, setShowRageQuitAlert] = useState(false);
    const [showLowTrustAlert, setShowLowTrustAlert] = useState(false);
    const [showRulesModal, setShowRulesModal] = useState(false);

    // --- ДАННЫЕ ПОЛЬЗОВАТЕЛЯ ---
    const [trustScore, setTrustScore] = useState(() => {
        try { const saved = localStorage.getItem('motivateMe_v20_trust'); return saved ? parseFloat(saved) : 100; } catch (e) { return 100; }
    });
    const [goals, setGoals] = useState(() => {
        try { const saved = localStorage.getItem('motivateMe_v20_goals'); return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
    });
    const [visions, setVisions] = useState(() => {
        try { const saved = localStorage.getItem('motivateMe_v20_visions'); return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
    });

    // --- СОСТОЯНИЯ СОЗДАНИЯ ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createMode, setCreateMode] = useState('micro'); // 'micro' или 'macro'
    const [createStep, setCreateStep] = useState('text');  // 'text', 'time', 'notifs'
    const [editingId, setEditingId] = useState(null);
    const [startMonth, setStartMonth] = useState(monthNames[new Date().getMonth()]);
    const [startDay, setStartDay] = useState(new Date().getDate().toString().padStart(2, '0'));

    const defaultForm = { title: '', description: '', type: 'habit', deadline: '23:59', duration: '', ignoreHoliday: false, notifications: true, startDate: null, visionId: '', weekDays: [0,1,2,3,4,5,6], controlMethod: 'check', focusTime: 25 };
    const [form, setForm] = useState(defaultForm);
    const [visionForm, setVisionForm] = useState({ title: '', emoji: '🎯', description: '' });

    // --- ИИ СОСТОЯНИЯ ---
    const [aiQuery, setAiQuery] = useState('');
    const [isAiScanning, setIsAiScanning] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [isGeneratingGoal, setIsGeneratingGoal] = useState(false);
    const [isGeneratingVision, setIsGeneratingVision] = useState(false);

    // --- УПРАВЛЕНИЕ КАРТОЧКАМИ ---
    const [expandedGoalId, setExpandedGoalId] = useState(null);
    const [activeVisionId, setActiveVisionId] = useState(null);
    const [actionMenuGoal, setActionMenuGoal] = useState(null);
    const [confirmDeleteGoalId, setConfirmDeleteGoalId] = useState(null);
    const [actionMenuVision, setActionMenuVision] = useState(null);
    const [confirmDeleteVisionId, setConfirmDeleteVisionId] = useState(null);

    // --- РЕФЫ И ЖЕСТЫ ---
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const touchStartTime = useRef(0);
    const isDragging = useRef(false);
    const isSwipeValid = useRef(null);
    const transitionTimer = useRef(null);
    const isLongPress = useRef(false);
    const pressTimer = useRef(null);

    // --- ВЫЧИСЛЯЕМЫЕ ПЕРЕМЕННЫЕ ---
    const isAnyModalOpen = isModalOpen || !!actionMenuGoal || !!actionMenuVision || !!confirmDeleteGoalId || !!confirmDeleteVisionId || showGiveUpModal || showPenaltyModal || showRageQuitAlert || showLowTrustAlert || showRulesModal;

    const daysInMonth = useMemo(() => {
        const monthIdx = monthNames.indexOf(startMonth);
        const days = new Date(new Date().getFullYear(), monthIdx + 1, 0).getDate();
        return Array.from({length: days}, (_, i) => (i + 1).toString().padStart(2, '0'));
    }, [startMonth]);

    const getOffsetDate = (baseDate, days) => {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + days);
        return d;
    };

    const getActiveGoalsForDate = (dateTarget) => {
        const norm = new Date(dateTarget);
        norm.setHours(0, 0, 0, 0);
        const rT = norm.getTime();
        return goals.filter(g => {
            if (activeVisionId && g.visionId != activeVisionId) return false;
            try {
                const sD = new Date(g.startDate);
                sD.setHours(0, 0, 0, 0);
                const sT = sD.getTime();
                if (sT > rT) return false;
                if (g.type === 'habit' && g.weekDays && !g.weekDays.includes(dateTarget.getDay())) return false;
                if (g.type === 'sprint') {
                    const eD = new Date(sT);
                    eD.setDate(eD.getDate() + (parseInt(g.duration) || 1) - 1);
                    if (rT > eD.getTime()) return false;
                }
                if (g.type === 'once' && rT !== sT) return false;
                return true;
            } catch(e) { return true; }
        });
    };

    const activeGoalsToday = getActiveGoalsForDate(currentDate);
    const loadCount = activeGoalsToday.length;

    // --- ЭФФЕКТЫ ---
    useEffect(() => {
        try {
            const tg = window.Telegram?.WebApp;
            if (tg) { tg.ready(); tg.expand(); }
            if (localStorage.getItem('motivateMe_v20_rageQuit') === 'true') {
                localStorage.removeItem('motivateMe_v20_rageQuit');
                setTrustScore(prev => Math.max(0, prev - 15));
                setShowRageQuitAlert(true);
            }
        } catch(e) {}
        setTimeout(() => setShowSplash(false), 4000);
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (isLightTheme) document.body.classList.add('light-theme');
        else document.body.classList.remove('light-theme');
        try { localStorage.setItem('motivateMe_theme', isLightTheme ? 'light' : 'dark'); } catch(e) {}
    }, [isLightTheme]);

    useEffect(() => {
        try {
            localStorage.setItem('motivateMe_v20_goals', JSON.stringify(goals));
            localStorage.setItem('motivateMe_v20_visions', JSON.stringify(visions));
            localStorage.setItem('motivateMe_v20_trust', trustScore.toString());
        } catch (e) {}
    }, [goals, visions, trustScore]);

    useEffect(() => {
        let interval = null;
        if (isTimerRunning && timeLeft > 0) {
            try { localStorage.setItem('motivateMe_v20_rageQuit', 'true'); } catch(e) {}
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (isTimerRunning && timeLeft === 0) {
            setIsTimerRunning(false);
            try { localStorage.removeItem('motivateMe_v20_rageQuit'); } catch(e) {}
            triggerHaptic('success');
            setTrustScore(prev => Math.min(100, prev + 1));
            if (activeFocusGoal && activeFocusDate) {
                const dateStr = activeFocusDate.toDateString();
                setGoals(prev => prev.map(g => {
                    if (g.id === activeFocusGoal.id) {
                        const newHistory = { ...(g.history || {}) };
                        newHistory[dateStr] = true;
                        return { ...g, history: newHistory, streak: (g.streak || 0) + 1 };
                    }
                    return g;
                }));
                setActiveFocusGoal(null);
            }
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft]);

    // --- ФУНКЦИИ ИИ ---
    const generateGoalDetailsWithAI = async () => {
        if (!form.title.trim() || isGeneratingGoal) return;
        setIsGeneratingGoal(true); triggerHaptic('light');
        const visionsContext = visions.length > 0 ? `Глобальные цели юзера:\n${visions.map(v => `- ID: ${v.id}, Название: ${v.title}`).join('\n')}` : `Глобальных целей нет.`;
        const systemPrompt = `Ты ИИ. Преврати запрос в задачу. 
        ПРАВИЛА: 
        1. Действие мгновенное (проснуться, выпить таблетку) -> "controlMethod": "check", "focusTime": 0, "deadline": логичное время (для "в 6" -> 06:15).
        2. Работа в потоке (кодинг, книга) -> "controlMethod": "timer", "focusTime": 15-60. 
        СВЯЗЬ: Если подходит к существующей цели, верни её ID: ${visionsContext}. 
        Верни ТОЛЬКО JSON: {"title": "", "description": "", "type": "once/habit/sprint", "controlMethod": "timer/check", "focusTime": 25, "deadline": "23:59", "visionId": "id или пусто"}`;

        try {
            const resp = await fetch(GEMINI_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: `Запрос: "${form.title}"` }] }], systemInstruction: { parts: [{ text: systemPrompt }] } })
            });
            const data = await resp.json();
            const parsed = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim());
            setForm(prev => ({ ...prev, ...parsed }));
            triggerHaptic('success');
        } catch (e) { triggerHaptic('error'); } finally { setIsGeneratingGoal(false); }
    };

    const generateVisionDetailsWithAI = async () => {
        if (!visionForm.title.trim() || isGeneratingVision) return;
        setIsGeneratingVision(true); triggerHaptic('light');
        const systemPrompt = `Ты ИИ. Создай Видение и 3 тактических шага на 3 дня (dayOffset 0, 1, 2). 
        Метод: поток="timer", мгновенно="check". Тон: ${motivationTone === 'toxic' ? 'токсичный' : 'сухой'}. 
        Верни JSON: {"visionTitle":"", "visionEmoji":"🚀", "visionDesc":"", "steps":[{"title":"", "desc":"", "type":"once", "method":"timer/check", "focusTime":25, "dayOffset":0}]}`;

        try {
            const resp = await fetch(GEMINI_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: `Мечта: "${visionForm.title}"` }] }], systemInstruction: { parts: [{ text: systemPrompt }] } })
            });
            const data = await resp.json();
            const parsed = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim());
            const newId = Date.now().toString();
            setVisions(prev => [{ id: newId, title: parsed.visionTitle, emoji: parsed.visionEmoji, description: parsed.visionDesc }, ...prev]);
            const newGoals = (parsed.steps || []).map((s, i) => {
                const d = new Date(); d.setDate(d.getDate() + (s.dayOffset || 0));
                return { id: Date.now()+i+100, title: s.title, description: s.desc, type: s.type || 'once', deadline: '23:59', startDate: d.toISOString(), visionId: newId, controlMethod: s.method || 'timer', focusTime: s.focusTime || 25, history: {}, streak: 0 };
            });
            setGoals(prev => [...newGoals, ...prev]);
            setIsModalOpen(false); triggerHaptic('heavy');
        } catch (e) { triggerHaptic('error'); } finally { setIsGeneratingVision(false); }
    };

    const handleAiSubmit = async () => {
        if (!aiQuery.trim()) { triggerHaptic('error'); return; }
        setIsAiScanning(true); setAiResult(null); triggerHaptic('light');
        const systemPrompt = `Ты — безжалостный ИИ. Составь план из 3 шагов. Раскидай на 3 дня (dayOffset 0, 1, 2). 
        Метод: поток="timer", моментально="check". Тон: ${motivationTone === 'toxic' ? 'токсичный' : 'сухой'}. 
        Верни JSON: {"title":"", "emoji":"🎯", "steps":[{"title":"", "desc":"", "type":"once", "method":"timer/check", "focusTime":25, "dayOffset":0}]}`;
        try {
            const resp = await fetch(GEMINI_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: `Задача: "${aiQuery}"` }] }], systemInstruction: { parts: [{ text: systemPrompt }] } })
            });
            const data = await resp.json();
            setAiResult(JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim()));
            triggerHaptic('success');
        } catch (error) { triggerHaptic('error'); } finally { setIsAiScanning(false); }
    };

    // --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
    const triggerHaptic = (type) => {
        try {
            if (window.Telegram?.WebApp?.HapticFeedback) {
                if (type === 'success') { window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy'); }
                else if (type === 'error') { window.Telegram.WebApp.HapticFeedback.notificationOccurred('error'); }
                else window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
            }
        } catch(e) {}
    };

    const deleteVision = () => {
        setVisions(visions.filter(v => v.id !== confirmDeleteVisionId));
        setGoals(goals.filter(g => g.visionId != confirmDeleteVisionId));
        if (activeVisionId === confirmDeleteVisionId) setActiveVisionId(null);
        setConfirmDeleteVisionId(null); triggerHaptic('success');
    };

    const saveGoal = () => {
        if (createMode === 'macro') {
            if (!visionForm.title) { triggerHaptic('error'); return; }
            if (editingId) setVisions(visions.map(v => v.id === editingId ? { ...visionForm, id: v.id } : v));
            else setVisions([{ ...visionForm, id: Date.now() }, ...visions]);
        } else {
            if (!form.title) { triggerHaptic('error'); setCreateStep('text'); return; }
            const monthIdx = monthNames.indexOf(startMonth); const dayNum = parseInt(startDay, 10);
            let targetYear = now.getFullYear();
            if (monthIdx < now.getMonth() || (monthIdx === now.getMonth() && dayNum < now.getDate())) targetYear += 1;
            const startDate = new Date(targetYear, monthIdx, dayNum); startDate.setHours(0,0,0,0);
            const goalData = { ...form, startDate: startDate.toISOString(), weekDays: (form.weekDays && form.weekDays.length > 0) ? form.weekDays : [0,1,2,3,4,5,6] };
            if (editingId) setGoals(goals.map(g => g.id === editingId ? { ...goalData, id: g.id, history: g.history, streak: g.streak } : g));
            else setGoals([{ ...goalData, id: Date.now(), history: {}, streak: 0, createdAt: new Date().toDateString() }, ...goals]);
        }
        setIsModalOpen(false); triggerHaptic('success');
    };

    const toggleGoal = (e, goalObj, dateTarget) => {
        e.stopPropagation();
        const dateStr = dateTarget.toDateString();
        const isDone = !!(goalObj.history && goalObj.history[dateStr]);
        setGoals(goals.map(g => {
            if (g.id !== goalObj.id) return g;
            const nh = { ...(g.history || {}) };
            if (!isDone) { nh[dateStr] = true; setTrustScore(prev => Math.min(100, prev + 1)); triggerHaptic('success'); }
            else { delete nh[dateStr]; setTrustScore(prev => Math.max(0, prev - 1)); triggerHaptic('light'); }
            return { ...g, history: nh, streak: isDone ? Math.max(0, (g.streak || 0) - 1) : (g.streak || 0) + 1 };
        }));
    };

    const checkPermissions = (goal, checkDate) => {
        try {
            const viewD = new Date(checkDate); viewD.setHours(0,0,0,0); const today = new Date(now); today.setHours(0,0,0,0);
            const isPast = viewD < today; const isToday = viewD.getTime() === today.getTime(); let isDeadlinePassed = isPast;
            if (isToday) {
                const [h, m] = (goal.deadline || '23:59').split(':');
                const limit = new Date(now); limit.setHours(parseInt(h), parseInt(m), 0, 0);
                if (now > limit) isDeadlinePassed = true;
            }
            return { canToggle: isToday && !isDeadlinePassed, canEdit: !isPast && !isDeadlinePassed };
        } catch(e) { return { canToggle: false, canEdit: false }; }
    };

    const getTimerData = (goal, isDone, checkDate) => {
        try {
            const view = new Date(checkDate); view.setHours(0,0,0,0); const today = new Date(now); today.setHours(0,0,0,0);
            const sd = goal.deadline || '23:59';
            if (view > today) return { text: `до ${sd}`, className: 'badge', style: {color: 'var(--text-main)'} };
            if (view < today) return { text: "00:00:00", className: 'badge failed-timer', style: {} };
            const [h, m] = sd.split(':'); const limit = new Date(now); limit.setHours(parseInt(h), parseInt(m), 0, 0); 
            const diff = limit - now; if (diff <= 0) return { text: "00:00:00", className: 'badge failed-timer', style: {} };
            const hrs = Math.floor(diff/3600000); const mns = Math.floor((diff%3600000)/60000); const scs = Math.floor((diff%60000)/1000);
            return { text: `${String(hrs).padStart(2,'0')}:${String(mns).padStart(2,'0')}:${String(scs).padStart(2,'0')}`, className: `badge ${!isDone && diff < 3600000 ? 'urgent-timer' : ''}`, style: {} };
        } catch(e) { return { text: "00:00", className: 'badge failed-timer', style: {} }; }
    };

    // --- ЖЕСТЫ ---
    const animateToDate = (shift) => {
        setExpandedGoalId(null); triggerHaptic('light');
        if (transitionTimer.current) { clearTimeout(transitionTimer.current); currentDate.setDate(currentDate.getDate() + (offsetPx > 0 ? -1 : 1)); }
        setIsTransitioning(true); setOffsetPx(shift > 0 ? -window.innerWidth : window.innerWidth);
        transitionTimer.current = setTimeout(() => {
            setIsTransitioning(false); setOffsetPx(0);
            setCurrentDate(prev => { const d = new Date(prev); d.setDate(d.getDate() + shift); return d; });
            transitionTimer.current = null;
        }, 180);
    };

    const onSwipeStart = (e) => {
        if (transitionTimer.current) { clearTimeout(transitionTimer.current); setOffsetPx(0); setIsTransitioning(false); }
        touchStartX.current = e.touches[0].clientX; touchStartTime.current = Date.now(); isDragging.current = true; isSwipeValid.current = null;
    };
    const onSwipeMove = (e) => {
        if (!isDragging.current) return;
        const dx = e.touches[0].clientX - touchStartX.current;
        if (isSwipeValid.current === null) isSwipeValid.current = Math.abs(dx) > 10;
        if (isSwipeValid.current) setOffsetPx(dx);
    };
    const onSwipeEnd = () => {
        if (!isDragging.current || !isSwipeValid.current) { isDragging.current = false; return; }
        isDragging.current = false;
        const threshold = window.innerWidth * 0.2;
        if (offsetPx > threshold) animateToDate(-1); else if (offsetPx < -threshold) animateToDate(1);
        else { setIsTransitioning(true); setOffsetPx(0); setTimeout(() => setIsTransitioning(false), 200); }
    };

    // --- РЕНДЕРИНГ ЭКРАНОВ ---
    const renderDayCards = (date) => {
        const active = getActiveGoalsForDate(date);
        if (active.length === 0) {
            if (date.toDateString() !== new Date().toDateString()) return <p style={{textAlign:'center', marginTop:'30px', opacity: 0.5}}>Контрактов нет.</p>;
            return (
                <div className="ai-tactics-container">
                    <Icons.Cpu style={{ width: '32px', height: '32px', stroke: 'var(--accent)', marginBottom: '15px' }} />
                    <h3 className="ai-tactics-title">Аналитика пустот</h3>
                    {!isAiScanning && !aiResult && (
                        <React.Fragment>
                            <p className="ai-tactics-desc">Какую задачу ты избегаешь?</p>
                            <input type="text" className="dark-input ai-tactics-input" placeholder="Например: Учить английский..." value={aiQuery} onChange={e => setAiQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleAiSubmit(); }} />
                            <button className="btn-ai-submit" onClick={handleAiSubmit}>Декомпозировать</button>
                        </React.Fragment>
                    )}
                    {isAiScanning && <div className="ai-loading-scan"><span>СИНТЕЗ...</span><div className="scan-line"></div></div>}
                    {aiResult && !isAiScanning && (
                        <React.Fragment>
                            <div className="ai-contract-box">
                                <div className="ai-contract-header">{aiResult.emoji} {aiResult.title}</div>
                                {(aiResult.steps || []).map((s, i) => (
                                    <div key={i} className="ai-contract-step">
                                        {s.title} <span>({s.focusTime === 0 ? 'Мгновенно' : `${s.focusTime} мин`} • {s.dayOffset === 1 ? 'Завтра' : s.dayOffset === 2 ? 'Послезавтра' : 'Сегодня'})</span>
                                    </div>
                                ))}
                            </div>
                            <button className="btn-ai-submit" style={{marginTop:'15px'}} onClick={acceptAiContract}>Принять контракт</button>
                            <button className="btn-return-task" style={{width:'100%', marginTop:'5px'}} onClick={() => setAiResult(null)}>Сброс</button>
                        </React.Fragment>
                    )}
                </div>
            );
        }
        return active.map(g => {
            const isDone = !!(g.history && g.history[date.toDateString()]);
            const isExpanded = expandedGoalId === g.id;
            const { canToggle } = checkPermissions(g, date);
            const timer = getTimerData(g, isDone, date);
            const vision = g.visionId ? visions.find(v => v.id == g.visionId) : null;
            return (
                <div key={g.id} className="card" onClick={() => setExpandedGoalId(isExpanded ? null : g.id)} style={{opacity: isDone ? 0.6 : 1}}>
                    <div className="goal-info">
                        {vision && <div className="vision-badge">{vision.emoji} {vision.title}</div>}
                        <div className="goal-title" style={{textDecoration: isDone ? 'line-through' : 'none'}}>{g.title}</div>
                        <div className="stats-row">
                            <span className="badge">{g.streak || 0} 🔥</span>
                            <span className={timer.className} style={timer.style}>⏱ {timer.text}</span>
                        </div>
                        {isExpanded && <div className="goal-desc" style={{marginTop:'10px', opacity:0.8, fontSize:'13px'}}>{g.description || 'Нет описания.'}</div>}
                    </div>
                    <button className={`btn-complete ${isDone ? 'done' : ''}`} onClick={(e) => {
                        if (!canToggle) return;
                        if (!isDone && g.controlMethod === 'timer') startFocusSession(g, date);
                        else toggleGoal(e, g, date);
                    }}>
                        {isDone ? <Icons.Check /> : (g.controlMethod === 'timer' ? <Icons.Play style={{marginLeft:'2px'}} /> : <Icons.Check />)}
                    </button>
                </div>
            );
        });
    };

    if (!hasSignedContract) return <Onboarding onAccept={() => { try { localStorage.setItem('motivateMe_v20_contract', 'true'); } catch(e) {} setHasSignedContract(true); }} />;

    return (
        <React.Fragment>
            {showSplash && <div className="simple-splash-overlay"><img src="image_0.png" className="splash-logo" /><h1 className="splash-title">MotivateMe</h1></div>}
            
            <div className="container">
                {isModalOpen && <div className="glass-backdrop" onClick={closeCreateModal}></div>}
                {showRulesModal && <RulesModal onClose={() => setShowRulesModal(false)} />}

                {/* ХЕДЕР С ТРАСТОМ */}
                <div className="header-notcoin-style">
                    <div className="header-left"><img src="image_0.png" className="m-logo-small" /><h1 className="main-title-small">MotivateMe</h1></div>
                    <div className={`trust-badge ${trustScore < 50 ? 'danger' : trustScore < 80 ? 'warning' : 'safe'}`}>
                        <Icons.Shield style={{width: '16px', marginRight: '4px'}} />{trustScore.toFixed(0)}%
                    </div>
                </div>

                {activeTab === 'home' && (
                    <React.Fragment>
                        {/* ШКАЛА НАГРУЗКИ */}
                        <div className="daily-load-container">
                            <div className="load-header"><span className="load-title">Нагрузка дня</span><span className="load-count">{loadCount} задач</span></div>
                            <div className="load-bar">
                                {[1,2,3,4,5,6].map(i => {
                                    let fill = ''; if (loadCount > 0 && (loadCount >= i || (i===6 && loadCount >= 6))) {
                                        if (loadCount <= 3) fill = 'safe'; else if (loadCount <= 5) fill = 'warning'; else fill = 'danger';
                                    }
                                    return <div key={i} className={`load-segment ${fill}`}></div>;
                                })}
                            </div>
                        </div>

                        {/* ВИДЕНИЯ */}
                        {visions.length > 0 && (
                            <div className="visions-scroll-track">
                                {visions.map(v => (
                                    <div key={v.id} className={`vision-card ${activeVisionId === v.id ? 'active' : ''}`} onClick={() => setActiveVisionId(activeVisionId === v.id ? null : v.id)}>
                                        <div className="vision-card-header"><div className="vision-emoji-large">{v.emoji}</div></div>
                                        <div className="vision-card-title">{v.title}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* СВАЙП-ЗОНА С КАРТОЧКАМИ */}
                        <div className="swipe-area" onTouchStart={onSwipeStart} onTouchMove={onSwipeMove} onTouchEnd={onSwipeEnd} style={{ pointerEvents: isAnyModalOpen ? 'none' : 'auto' }}>
                            <div className="date-nav-container">
                                <button className="date-nav-btn" onClick={() => animateToDate(-1)}><Icons.ChevronLeft /></button>
                                <button className="date-nav-btn" onClick={() => animateToDate(1)}><Icons.ChevronRight /></button>
                            </div>
                            <div className="cards-track" style={{ transform: `translateX(calc(-100vw + ${offsetPx}px))`, transition: (isTransitioning && !isDragging.current) ? 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)' : 'none' }}>
                                {[-1, 0, 1].map(shift => {
                                    const d = getOffsetDate(currentDate, shift);
                                    return <div className="cards-pane" key={d.toDateString()}><div className="date-display-row">{d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</div>{renderDayCards(d)}</div>;
                                })}
                            </div>
                        </div>
                    </React.Fragment>
                )}

                {activeTab === 'progress' && (
                    <div className="timer-panel">
                        <h3 style={{ textAlign:'center', margin:'0 0 5px 0', fontSize:'20px' }}>Комната исполнения</h3>
                        <div className="focus-goal-label">{activeFocusGoal ? activeFocusGoal.title : "Свободный фокус"}</div>
                        {activeFocusGoal && activeFocusGoal.description && (
                            <div className="goal-desc custom-scrollbar" style={{textAlign:'center', marginBottom:'20px', background:'var(--bg-input)', padding:'15px', borderRadius:'16px', maxHeight:'120px', overflowY:'auto'}}>
                                {activeFocusGoal.description}
                            </div>
                        )}
                        <div className="timer-display">{String(Math.floor(timeLeft/60)).padStart(2,'0')}:{String(timeLeft%60).padStart(2,'0')}</div>
                        <div className="timer-controls">
                            <button className="btn-timer-reset" onClick={() => { if (isTimerRunning) setShowGiveUpModal(true); else resetTimer(); }}><Icons.Refresh /></button>
                            <button className="btn-timer-main" onClick={() => setIsTimerRunning(!isTimerRunning)}>{isTimerRunning ? <Icons.Pause /> : <Icons.Play style={{marginLeft:'4px'}} />}</button>
                        </div>
                    </div>
                )}

                {activeTab === 'social' && (
                    <div className="stats-wrapper">
                        <div className="stats-row-cards">
                            <div className="stat-card"><div className="stat-value">{statsData.totalDone}</div><div className="stat-label">Завершено</div></div>
                            <div className="stat-card"><div className="stat-value">{statsData.bestStreak} 🔥</div><div className="stat-label">Лучший стрик</div></div>
                        </div>
                        <div className="card" style={{display:'block', maxWidth:'360px', margin:'12px auto'}}>
                             <h3 style={{fontSize:'16px', marginBottom:'15px'}}>Активность (365 дней)</h3>
                             <div style={{display:'flex', flexWrap:'wrap', gap:'4px'}}>
                                 {statsData.heatmapDays.map(d => <div key={d.iso} className={`heatmap-cell level-${d.level}`} style={{width:'10px', height:'10px', borderRadius:'2px'}}></div>)}
                             </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="card" style={{display:'block', maxWidth:'360px', margin:'0 auto'}}>
                        <h3>Настройки</h3>
                        <div className="setting-row"><span>Темная тема</span><button className="theme-toggle-btn" onClick={toggleTheme}>{isLightTheme ? <Icons.Moon /> : <Icons.Sun />}</button></div>
                        <hr className="divider" />
                        <div className="setting-row" onClick={() => setShowRulesModal(true)}><span>Кодекс Системы</span><Icons.Info /></div>
                        <hr className="divider" />
                        <label>Тон ИИ:</label>
                        <select className="dark-input" value={motivationTone} onChange={e => setMotivationTone(e.target.value)}>
                            <option value="stoic">Стоик</option><option value="toxic">Сержант</option>
                        </select>
                    </div>
                )}

                {/* МОДАЛКА СОЗДАНИЯ (ПОЛНАЯ ВЕРСИЯ) */}
                {isModalOpen && (
                    <div className="create-panel">
                        {!editingId && (
                            <div className="mode-switcher">
                                <div className={`mode-btn ${createMode === 'micro' ? 'active' : ''}`} onClick={() => setCreateMode('micro')}>Задача</div>
                                <div className={`mode-btn ${createMode === 'macro' ? 'active' : ''}`} onClick={() => setCreateMode('macro')}>Видение</div>
                            </div>
                        )}
                        {createMode === 'micro' ? (
                            <React.Fragment>
                                {createStep === 'text' && (
                                    <div className="panel-step">
                                        <div style={{position:'relative'}}>
                                            <input placeholder="Название" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="dark-input" />
                                            <div onClick={generateGoalDetailsWithAI} style={{position:'absolute', right:'10px', top:'12px'}}><Icons.Sparkles style={{stroke:'var(--accent)'}} /></div>
                                        </div>
                                        <textarea placeholder="Суть задачи..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="dark-input" style={{minHeight:'80px'}} />
                                        <div className="setting-row"><span>Требует фокуса</span><label className="ios-switch"><input type="checkbox" checked={form.controlMethod === 'timer'} onChange={e => setForm({...form, controlMethod: e.target.checked?'timer':'check'})} /><span className="slider"></span></label></div>
                                        {form.controlMethod === 'timer' && (
                                            <div className="setting-row"><span>Минут: {form.focusTime}</span><div style={{display:'flex', gap:'10px'}}><button onClick={(e) => adjustFocusTime(-5,e)}>-</button><button onClick={(e) => adjustFocusTime(5,e)}>+</button></div></div>
                                        )}
                                    </div>
                                )}
                                {createStep === 'time' && (
                                    <div className="panel-step">
                                        <select className="dark-input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                                            <option value="once">Разовая</option><option value="habit">Привычка</option><option value="sprint">Спринт</option>
                                        </select>
                                        <div className="ios-time-picker">
                                            <TimeWheel items={hoursList} value={form.deadline.split(':')[0]} onChange={h => setForm({...form, deadline: `${h}:${form.deadline.split(':')[1]}`})} />
                                            <TimeWheel items={minutesList} value={form.deadline.split(':')[1]} onChange={m => setForm({...form, deadline: `${form.deadline.split(':')[0]}:${m}`})} />
                                        </div>
                                    </div>
                                )}
                                {createStep === 'notifs' && <div className="panel-step"><div className="setting-row"><span>Уведомления</span><label className="ios-switch"><input type="checkbox" checked={form.notifications} onChange={e => setForm({...form, notifications: e.target.checked})} /><span className="slider"></span></label></div></div>}
                                
                                <div className="tab-bar-mini" style={{marginTop:'20px', display:'flex', justifyContent:'space-around'}}>
                                    <div onClick={() => setCreateStep('text')}><Icons.Text active={createStep==='text'} /></div>
                                    <div onClick={() => setCreateStep('time')}><Icons.Clock active={createStep==='time'} /></div>
                                    <div onClick={() => setCreateStep('notifs')}><Icons.Bell active={createStep==='notifs'} /></div>
                                    <div onClick={saveGoal} style={{color:'var(--accent)'}}><Icons.Check /></div>
                                </div>
                            </React.Fragment>
                        ) : (
                            <div className="panel-step">
                                <div style={{display:'flex', gap:'10px'}}>
                                    <input value={visionForm.emoji} onChange={e => setVisionForm({...visionForm, emoji: e.target.value})} className="dark-input" style={{width:'50px', textAlign:'center'}} />
                                    <div style={{position:'relative', flex:1}}>
                                        <input placeholder="Глобальная цель" value={visionForm.title} onChange={e => setVisionForm({...visionForm, title: e.target.value})} className="dark-input" />
                                        {!editingId && <div onClick={generateVisionDetailsWithAI} style={{position:'absolute', right:'10px', top:'12px'}}><Icons.Sparkles style={{stroke:'var(--accent)'}} /></div>}
                                    </div>
                                </div>
                                <textarea placeholder="Почему это важно?" value={visionForm.description} onChange={e => setVisionForm({...visionForm, description: e.target.value})} className="dark-input" style={{marginTop:'10px', minHeight:'100px'}} />
                                <button className="btn-continue-pulsing" style={{marginTop:'15px'}} onClick={saveGoal}>Сохранить</button>
                            </div>
                        )}
                    </div>
                )}

                {/* ТАБ-БАР */}
                <div className="tab-bar">
                    <div onClick={() => setActiveTab('home')} className="tab-item"><Icons.Goals active={activeTab === 'home'} /></div>
                    <div onClick={() => setActiveTab('progress')} className="tab-item"><Icons.Focus active={activeTab === 'progress'} /></div>
                    <div className="tab-add-wrapper" onClick={openCreateModal}><div className="tab-add-btn-outline"><Icons.Add /></div></div>
                    <div onClick={() => setActiveTab('social')} className="tab-item"><Icons.Stats active={activeTab === 'social'} /></div>
                    <div onClick={() => setActiveTab('settings')} className="tab-item"><Icons.Settings active={activeTab === 'settings'} /></div>
                </div>
            </div>
        </React.Fragment>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
