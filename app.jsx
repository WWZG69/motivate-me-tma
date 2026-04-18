// ==========================================
// ФАЙЛ: app.jsx
// Описание: Ядро логики и управления состоянием
// ==========================================

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

function App() {
    // --- СОСТОЯНИЕ КОНТРАКТА И ТЕМЫ ---
    const [hasSignedContract, setHasSignedContract] = useState(() => {
        try { return localStorage.getItem('motivateMe_v20_contract') === 'true'; } catch(e) { return false; }
    });
    const [isLightTheme, setIsLightTheme] = useState(() => {
        try { return localStorage.getItem('motivateMe_theme') === 'light'; } catch(e) { return false; }
    });

    // --- БАЗОВЫЕ СОСТОЯНИЯ ---
    const [showSplash, setShowSplash] = useState(true);
    const [activeTab, setActiveTab] = useState('home');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [now, setNow] = useState(new Date());
    const [offsetPx, setOffsetPx] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isHeatmapExpanded, setIsHeatmapExpanded] = useState(false);
    const [motivationTone, setMotivationTone] = useState('stoic');

    // --- ТАЙМЕР И ШТРАФЫ ---
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [showGiveUpModal, setShowGiveUpModal] = useState(false);
    const [showPenaltyModal, setShowPenaltyModal] = useState(false);
    const [penaltyInput, setPenaltyInput] = useState('');
    const [showRageQuitAlert, setShowRageQuitAlert] = useState(false);
    const [showLowTrustAlert, setShowLowTrustAlert] = useState(false);
    const [showRulesModal, setShowRulesModal] = useState(false);
    const [activeFocusGoal, setActiveFocusGoal] = useState(null);
    const [activeFocusDate, setActiveFocusDate] = useState(null);

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

    // --- СОЗДАНИЕ И РЕДАКТИРОВАНИЕ ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createMode, setCreateMode] = useState('micro');
    const [createStep, setCreateStep] = useState('text');
    const [editingId, setEditingId] = useState(null);
    const [startMonth, setStartMonth] = useState(monthNames[new Date().getMonth()]);
    const [startDay, setStartDay] = useState(new Date().getDate().toString().padStart(2, '0'));

    const [form, setForm] = useState({ title: '', description: '', type: 'habit', deadline: '23:59', duration: '', ignoreHoliday: false, notifications: true, startDate: null, visionId: '', weekDays: [0,1,2,3,4,5,6], controlMethod: 'check', focusTime: 25 });
    const [visionForm, setVisionForm] = useState({ title: '', emoji: '🎯', description: '' });

    // --- ИИ СОСТОЯНИЯ ---
    const [aiQuery, setAiQuery] = useState('');
    const [isAiScanning, setIsAiScanning] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [isGeneratingGoal, setIsGeneratingGoal] = useState(false);
    const [isGeneratingVision, setIsGeneratingVision] = useState(false);

    // --- УПРАВЛЕНИЕ МЕНЮ ---
    const [actionMenuGoal, setActionMenuGoal] = useState(null);
    const [confirmDeleteGoalId, setConfirmDeleteGoalId] = useState(null);
    const [actionMenuVision, setActionMenuVision] = useState(null);
    const [confirmDeleteVisionId, setConfirmDeleteVisionId] = useState(null);

    // --- РЕФЫ ДЛЯ ЖЕСТОВ ---
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const touchStartTime = useRef(0);
    const isDragging = useRef(false);
    const isSwipeValid = useRef(null);
    const transitionTimer = useRef(null);
    const isLongPress = useRef(false);
    const pressTimer = useRef(null);

    const [expandedGoalId, setExpandedGoalId] = useState(null);
    const [activeVisionId, setActiveVisionId] = useState(null);

    // --- ЭФФЕКТЫ ---
    useEffect(() => {
        try {
            const tg = window.Telegram?.WebApp;
            if (tg) { tg.ready(); tg.expand(); }
            const didRageQuit = localStorage.getItem('motivateMe_v20_rageQuit');
            if (didRageQuit === 'true') {
                localStorage.removeItem('motivateMe_v20_rageQuit');
                setTrustScore(prev => Math.max(0, prev - 15));
                setShowRageQuitAlert(true);
            }
        } catch(e) {}
        setTimeout(() => setShowSplash(false), 4000);
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
        } catch(e) {}
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

    // --- ЛОГИКА ИИ (ЗАДАЧИ И ВИДЕНИЯ) ---
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    const API_KEY = 'AQ.Ab8RN6LcNaOh3uvU83' + 'tg9LAp1oCGl0zfhC4H8-yao9HPhx1SPg';

    const generateGoalWithAI = async () => {
        if (!form.title.trim() || isGeneratingGoal) return;
        setIsGeneratingGoal(true); triggerHaptic('light');
        const visionsCtx = visions.map(v => `- ID: ${v.id}, Название: ${v.title}`).join('\n');
        const systemPrompt = `Ты тактический ИИ. Преврати набросок задачи в карточку.
        ПРАВИЛА:
        1. Если действие мгновенное (проснуться, позвонить, выпить воды): controlMethod="check", focusTime=0. Для "Проснуться в 6" дедлайн="06:15".
        2. Если работа требует потока (кодинг, чтение): controlMethod="timer", focusTime=15-60.
        СВЯЗЬ: ${visions.length > 0 ? `Если подходит к цели, верни её ID:\n${visionsCtx}` : 'visionId=""'}.
        Верни ТОЛЬКО JSON: {"title":"", "description":"", "type":"once/habit/sprint", "controlMethod":"timer/check", "focusTime":0, "deadline":"23:59", "visionId":""}`;

        try {
            const resp = await fetch(`${API_URL}?key=${API_KEY}`, {
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

    const generateVisionWithAI = async () => {
        if (!visionForm.title.trim() || isGeneratingVision) return;
        setIsGeneratingVision(true); triggerHaptic('light');
        const systemPrompt = `Ты архитектор целей. Создай Глобальное Видение и 3 шага на 3 дня (dayOffset 0,1,2).
        Верни ТОЛЬКО JSON: {"visionTitle":"", "visionEmoji":"🚀", "visionDesc":"", "steps":[{"title":"", "desc":"", "type":"once", "method":"timer/check", "focusTime":25, "dayOffset":0}]}`;

        try {
            const resp = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: `Мечта: "${visionForm.title}"` }] }], systemInstruction: { parts: [{ text: systemPrompt }] } })
            });
            const data = await resp.json();
            const parsed = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim());
            const newVisionId = Date.now().toString();
            setVisions(prev => [{ id: newVisionId, title: parsed.visionTitle, emoji: parsed.visionEmoji, description: parsed.visionDesc }, ...prev]);
            const newGoals = (parsed.steps || []).map((s, i) => {
                const d = new Date(); d.setDate(d.getDate() + (s.dayOffset || 0));
                return { id: Date.now()+i+100, title: s.title, description: s.desc, type: s.type, deadline: '23:59', startDate: d.toISOString(), visionId: newVisionId, controlMethod: s.method, focusTime: s.focusTime, history: {}, streak: 0 };
            });
            setGoals(prev => [...newGoals, ...prev]);
            setIsModalOpen(false); triggerHaptic('heavy');
        } catch (e) { triggerHaptic('error'); } finally { setIsGeneratingVision(false); }
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
        setGoals(goals.filter(g => g.visionId !== confirmDeleteVisionId)); // Каскадное удаление
        if (activeVisionId === confirmDeleteVisionId) setActiveVisionId(null);
        setConfirmDeleteVisionId(null); triggerHaptic('success');
    };

    const toggleGoal = (e, goalObj, dateTarget) => {
        e.stopPropagation();
        const dateStr = dateTarget.toDateString();
        const isDone = !!(goalObj.history && goalObj.history[dateStr]);
        setGoals(goals.map(g => {
            if (g.id !== goalObj.id) return g;
            const newHistory = { ...(g.history || {}) };
            if (!isDone) { newHistory[dateStr] = true; setTrustScore(prev => Math.min(100, prev + 1)); triggerHaptic('success'); }
            else { delete newHistory[dateStr]; setTrustScore(prev => Math.max(0, prev - 1)); triggerHaptic('light'); }
            return { ...g, history: newHistory, streak: isDone ? Math.max(0, (g.streak || 0) - 1) : (g.streak || 0) + 1 };
        }));
    };

    const getActiveGoalsForDate = (date) => {
        const d = new Date(date); d.setHours(0,0,0,0);
        return goals.filter(g => {
            if (activeVisionId && g.visionId != activeVisionId) return false;
            const start = new Date(g.startDate); start.setHours(0,0,0,0);
            if (start > d) return false;
            if (g.type === 'habit' && g.weekDays && !g.weekDays.includes(d.getDay())) return false;
            if (g.type === 'once' && start.getTime() !== d.getTime()) return false;
            return true;
        });
    };

    const activeGoalsToday = getActiveGoalsForDate(currentDate);
    const loadCount = activeGoalsToday.length;

    // --- РЕНДЕРИНГ ---
    return (
        <React.Fragment>
            {showSplash && <div className="simple-splash-overlay"><img src="image_0.png" className="splash-logo" /><h1 className="splash-title">MotivateMe</h1></div>}
            
            <div className="container">
                {isModalOpen && <div className="glass-backdrop" onClick={closeCreateModal}></div>}
                {showRulesModal && <RulesModal onClose={() => setShowRulesModal(false)} />}
                
                {/* ХЕДЕР С РЕЙТИНГОМ */}
                <div className="header-notcoin-style">
                    <div className="header-left"><img src="image_0.png" className="m-logo-small" /><h1 className="main-title-small">MotivateMe</h1></div>
                    <div className={`trust-badge ${trustScore < 50 ? 'danger' : trustScore < 80 ? 'warning' : 'safe'}`}>
                        <Icons.Shield style={{width: '16px', marginRight: '4px'}} />{trustScore.toFixed(0)}%
                    </div>
                </div>

                {activeTab === 'home' && (
                    <React.Fragment>
                        {/* ШКАЛА НАГРУЗКИ (ВСЕГДА ВИДИМА) */}
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

                        {/* СКРОЛЛ ВИДЕНИЙ */}
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

                        {/* СПИСОК ЗАДАЧ */}
                        <div className="cards-pane">
                            {activeGoalsToday.map(g => {
                                const isDone = g.history && g.history[currentDate.toDateString()];
                                return (
                                    <div key={g.id} className="card" onClick={() => setExpandedGoalId(expandedGoalId === g.id ? null : g.id)}>
                                        <div className="goal-info">
                                            <div className="goal-title" style={{textDecoration: isDone ? 'line-through' : 'none'}}>{g.title}</div>
                                            <div className="badge">⏱ {g.deadline} {g.controlMethod === 'timer' && `• ${g.focusTime}м`}</div>
                                            {expandedGoalId === g.id && <div className="goal-desc" style={{marginTop:'10px', opacity:0.7}}>{g.description}</div>}
                                        </div>
                                        <button className={`btn-complete ${isDone ? 'done' : ''}`} onClick={(e) => isDone ? toggleGoal(e, g, currentDate) : (g.controlMethod === 'timer' ? startFocusSession(g, currentDate) : toggleGoal(e, g, currentDate))}>
                                            {isDone ? <Icons.Check /> : (g.controlMethod === 'timer' ? <Icons.Play /> : <Icons.Check />)}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </React.Fragment>
                )}

                {/* ТАЙМЕР И ФОКУС */}
                {activeTab === 'progress' && (
                    <div className="timer-panel">
                        <div className="focus-goal-label">{activeFocusGoal ? activeFocusGoal.title : "Свободный фокус"}</div>
                        {activeFocusGoal && <div className="goal-desc" style={{textAlign:'center', marginBottom:'20px'}}>{activeFocusGoal.description}</div>}
                        <div className="timer-display">{Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</div>
                        <div className="timer-controls">
                             <button className="btn-timer-main" onClick={() => setIsTimerRunning(!isTimerRunning)}>{isTimerRunning ? <Icons.Pause /> : <Icons.Play />}</button>
                        </div>
                    </div>
                )}

                {/* МОДАЛКА СОЗДАНИЯ */}
                {isModalOpen && (
                    <div className="create-panel">
                        <div className="mode-switcher">
                            <div className={`mode-btn ${createMode==='micro'?'active':''}`} onClick={()=>setCreateMode('micro')}>Задача</div>
                            <div className={`mode-btn ${createMode==='macro'?'active':''}`} onClick={()=>setCreateMode('macro')}>Видение</div>
                        </div>
                        
                        {createMode === 'micro' ? (
                            <div className="panel-step">
                                <div style={{position:'relative'}}>
                                    <input placeholder="Название" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="dark-input" />
                                    <div onClick={generateGoalWithAI} style={{position:'absolute', right:'10px', top:'12px'}}><Icons.Sparkles style={{stroke:'var(--accent)'}} /></div>
                                </div>
                                <textarea placeholder="Описание" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} className="dark-input" />
                                <button className="btn-continue-pulsing" onClick={saveGoal}>Сохранить</button>
                            </div>
                        ) : (
                            <div className="panel-step">
                                <div style={{position:'relative'}}>
                                    <input placeholder="Глобальная цель" value={visionForm.title} onChange={e=>setVisionForm({...visionForm, title:e.target.value})} className="dark-input" />
                                    <div onClick={generateVisionWithAI} style={{position:'absolute', right:'10px', top:'12px'}}><Icons.Sparkles style={{stroke:'var(--accent)'}} /></div>
                                </div>
                                <button className="btn-continue-pulsing" onClick={saveGoal}>Создать</button>
                            </div>
                        )}
                    </div>
                )}

                {/* ТАБ-БАР */}
                <div className="tab-bar">
                    <div onClick={() => setActiveTab('home')} className="tab-item"><Icons.Goals active={activeTab==='home'} /></div>
                    <div onClick={() => setActiveTab('progress')} className="tab-item"><Icons.Focus active={activeTab==='progress'} /></div>
                    <div className="tab-add-wrapper" onClick={openCreateModal}><div className="tab-add-btn-outline"><Icons.Add /></div></div>
                    <div onClick={() => setActiveTab('social')} className="tab-item"><Icons.Stats active={activeTab==='social'} /></div>
                    <div onClick={() => setActiveTab('settings')} className="tab-item"><Icons.Settings active={activeTab==='settings'} /></div>
                </div>
            </div>
        </React.Fragment>
    );
}

// Запуск приложения
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
