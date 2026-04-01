const { useState, useEffect, useRef } = React;

const Icons = {
    // 1. Прицел (Counter Strike 1.6 стиль)
    Goals: (props) => (
        <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}>
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="2" x2="12" y2="5" strokeLinecap="round"/>
            <line x1="12" y1="19" x2="12" y2="22" strokeLinecap="round"/>
            <line x1="2" y1="12" x2="5" y2="12" strokeLinecap="round"/>
            <line x1="19" y1="12" x2="22" y2="12" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="0.5" fill={props.active ? "#FF8C00" : "#fff"} />
        </svg>
    ),
    // 2. Фокус (Камера: квадрат с углами и кругом)
    Focus: (props) => (
        <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}>
            <path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="3" />
        </svg>
    ),
    // 3. Статистика (Точки соединенные линией)
    Stats: (props) => (
        <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}>
            <circle cx="4" cy="17" r="1.5" fill={props.active ? "#FF8C00" : "#fff"} />
            <circle cx="12" cy="7" r="1.5" fill={props.active ? "#FF8C00" : "#fff"} />
            <circle cx="20" cy="14" r="1.5" fill={props.active ? "#FF8C00" : "#fff"} />
            <path d="M5.5 16l5-7.5M13.5 8l5 4.5" strokeLinecap="round" />
        </svg>
    ),
    // 4. Шестеренка (Минимализм)
    Settings: (props) => (
        <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
    )
};

function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [userName, setUserName] = useState('Чемпион');
    const [currentDate, setCurrentDate] = useState(new Date());
    
    const [motivationTone, setMotivationTone] = useState('soft');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    
    const [goals, setGoals] = useState(() => {
        try {
            const saved = localStorage.getItem('motivateMe_v20_goals');
            return saved ? JSON.parse(saved) : [];
        } catch (e) { return []; }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoalId, setEditingGoalId] = useState(null);
    const [actionMenuGoal, setActionMenuGoal] = useState(null);
    const [confirmDeleteGoalId, setConfirmDeleteGoalId] = useState(null);
    
    const [form, setForm] = useState({
        title: '', description: '', type: 'habit', deadline: '23:59', duration: '', ignoreHoliday: false
    });

    const pressTimer = useRef(null);

    const triggerHaptic = (type) => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            if (type === 'success' || type === 'error') window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
            else window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
        }
    };

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready(); tg.expand();
            if (tg.initDataUnsafe?.user) setUserName(tg.initDataUnsafe.user.first_name);
        }
    }, []);

    useEffect(() => {
        try { localStorage.setItem('motivateMe_v20_goals', JSON.stringify(goals)); } catch (e) {}
    }, [goals]);

    useEffect(() => {
        let interval = null;
        if (isTimerRunning && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setIsTimerRunning(false);
            triggerHaptic('success');
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft]);

    const changeDate = (days) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + days);
        setCurrentDate(newDate);
        triggerHaptic('light');
    };

    const saveGoal = () => {
        if (!form.title) return;
        if (editingGoalId) {
            setGoals(goals.map(g => g.id === editingGoalId ? { ...form, id: g.id, streak: g.streak, history: g.history, createdAt: g.createdAt } : g));
        } else {
            const newGoal = { ...form, id: Date.now(), streak: 0, history: {}, createdAt: new Date().toDateString() };
            setGoals([newGoal, ...goals]);
        }
        setIsModalOpen(false);
        triggerHaptic('success');
    };

    const deleteGoal = () => {
        setGoals(goals.filter(g => g.id !== confirmDeleteGoalId));
        setConfirmDeleteGoalId(null);
        triggerHaptic('success');
    };

    const handleTouchStart = (goal) => {
        pressTimer.current = setTimeout(() => {
            triggerHaptic('heavy');
            setActionMenuGoal(goal);
        }, 500); 
    };
    
    const handleTouchEnd = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };

    const toggleGoal = (e, goalObj) => {
        e.stopPropagation(); 
        const todayStr = currentDate.toDateString();
        const isCurrentlyDone = !!goalObj.history[todayStr];
        setGoals(goals.map(g => {
            if (g.id !== goalObj.id) return g;
            const newHistory = { ...g.history };
            if (!isCurrentlyDone) { newHistory[todayStr] = true; triggerHaptic('success'); }
            else { delete newHistory[todayStr]; triggerHaptic('light'); }
            return { ...g, history: newHistory, streak: isCurrentlyDone ? Math.max(0, g.streak - 1) : g.streak + 1 };
        }));
    };

    return (
        <div className="container">
            <div className="header">
                <div className="title-row">
                    <h1 className="main-title">MotivateMe</h1>
                    <img src="image_0.png" alt="Logo" className="m-logo" onError={(e) => e.target.style.display='none'} />
                </div>
                <p style={{ opacity: 0.9, margin: '5px 0', fontSize: '15px' }}>{userName}, действуй!</p>
            </div>

            {activeTab === 'home' && (
                <React.Fragment>
                    <div className="card" style={{ padding: '15px', borderRadius: '15px', display: 'block' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button onClick={() => changeDate(-1)} style={{ border: 'none', background: 'none', color: '#FF8C00', fontSize: '22px' }}>◀</button>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>{currentDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                            <button onClick={() => changeDate(1)} style={{ border: 'none', background: 'none', color: '#FF8C00', fontSize: '22px' }}>▶</button>
                        </div>
                    </div>
                    {goals.length === 0 && <p style={{textAlign:'center', marginTop:'20px'}}>Список пуст. Добавь цель!</p>}
                    {goals.map(g => {
                        const isDone = !!g.history[currentDate.toDateString()];
                        return (
                            <div key={g.id} className="card" onTouchStart={() => handleTouchStart(g)} onTouchEnd={handleTouchEnd} onMouseDown={() => handleTouchStart(g)} onMouseUp={handleTouchEnd} onClick={() => triggerHaptic('light')} style={{ borderLeft: g.ignoreHoliday ? '6px solid #FF8C00' : 'none', opacity: isDone ? 0.7 : 1 }}>
                                <div className="goal-info">
                                    <div className="goal-title" style={{ textDecoration: isDone ? 'line-through' : 'none' }}>{g.title}</div>
                                    {g.description && <div className="goal-desc">{g.description}</div>}
                                    <div className="stats-row">
                                        {g.type !== 'once' && <span className="badge">🔥 {g.streak}</span>}
                                        {g.type === 'habit' && <span className="badge">∞</span>}
                                        {g.type === 'sprint' && <span className="badge">⏳ {Math.max(0, parseInt(g.duration || 0) - g.streak)} дн.</span>}
                                    </div>
                                    <div className="deadline-tag">до {g.deadline}</div>
                                </div>
                                <button className={`btn-complete ${isDone ? 'done' : ''}`} onClick={(e) => toggleGoal(e, g)}>{isDone ? '✓' : ''}</button>
                            </div>
                        );
                    })}
                    <button className="btn-add" onClick={() => { setEditingGoalId(null); setForm({title:'', description:'', type:'habit', deadline:'23:59', duration:'', ignoreHoliday:false}); setIsModalOpen(true); }}>+ Добавить цель</button>
                </React.Fragment>
            )}

            {activeTab === 'progress' && (
                <div className="card" style={{ display: 'block' }}>
                    <h3 style={{ textAlign: 'center', color: '#FF8C00' }}>Таймер Фокуса</h3>
                    <div style={{ fontSize: '42px', fontWeight: 'bold', textAlign: 'center', margin: '20px 0', color: '#000' }}>
                        {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                    <button onClick={() => setIsTimerRunning(!isTimerRunning)} style={{ width: '100%', background: '#FF8C00', border: 'none', color: 'white', padding: '12px', borderRadius: '12px', fontWeight: 'bold' }}>
                        {isTimerRunning ? 'ПАУЗА' : 'СТАРТ'}
                    </button>
                </div>
            )}

            {activeTab === 'social' && (
                <div className="card" style={{ display: 'block' }}>
                    <h3 style={{ textAlign: 'center', color: '#FF8C00' }}>Статистика</h3>
                    <p style={{textAlign: 'center', color: '#777'}}>Графики появятся здесь совсем скоро!</p>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="card" style={{ display: 'block' }}>
                    <h3 style={{ textAlign: 'center', color: '#FF8C00' }}>Настройки</h3>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#000' }}>Тон поддержки:</label>
                    <select className="custom-select" value={motivationTone} onChange={e => setMotivationTone(e.target.value)}>
                        <option value="soft">Мягкий</option>
                        <option value="hard">Жесткий</option>
                    </select>
                </div>
            )}

            {/* Всплывающие меню и модалки (остались прежними) */}
            {actionMenuGoal && (
                <div className="modal-overlay" onClick={() => setActionMenuGoal(null)}>
                    <div className="modal-content" style={{ display: 'block' }} onClick={e => e.stopPropagation()}>
                        <button className="btn-save" style={{background: '#000', width: '100%', marginBottom: '10px'}} onClick={() => { setForm(actionMenuGoal); setEditingGoalId(actionMenuGoal.id); setActionMenuGoal(null); setIsModalOpen(true); }}>✏️ Редактировать</button>
                        <button className="btn-danger" style={{width: '100%'}} onClick={() => { setConfirmDeleteGoalId(actionMenuGoal.id); setActionMenuGoal(null); }}>🗑 Удалить</button>
                    </div>
                </div>
            )}

            {confirmDeleteGoalId && (
                <div className="modal-overlay modal-center" onClick={() => setConfirmDeleteGoalId(null)}>
                    <div className="modal-content-center" style={{ display: 'block' }} onClick={e => e.stopPropagation()}>
                        <h2>Удалить?</h2>
                        <button className="btn-danger" onClick={deleteGoal}>Да</button>
                        <button className="btn-cancel" onClick={() => setConfirmDeleteGoalId(null)}>Нет</button>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" style={{ display: 'block' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{color: '#000'}}>{editingGoalId ? 'Правка' : 'Новая цель'}</h2>
                        <input placeholder="Название" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                        <textarea placeholder="Описание" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                        <select className="custom-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                            <option value="once">Разовая</option>
                            <option value="habit">Постоянная</option>
                            <option value="sprint">Спринт</option>
                        </select>
                        <input type="time" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
                        <button className="btn-save" style={{width: '100%'}} onClick={saveGoal}>ГОТОВО</button>
                    </div>
                </div>
            )}

            {/* НИЖНЯЯ ПАНЕЛЬ С НОВЫМИ ИКОНКАМИ */}
            <div className="tab-bar">
                <div onClick={() => setActiveTab('home')} className="tab-item">
                    <Icons.Goals active={activeTab === 'home'} />
                </div>
                <div onClick={() => setActiveTab('progress')} className="tab-item">
                    <Icons.Focus active={activeTab === 'progress'} />
                </div>
                <div onClick={() => setActiveTab('social')} className="tab-item">
                    <Icons.Stats active={activeTab === 'social'} />
                </div>
                <div onClick={() => setActiveTab('settings')} className="tab-item">
                    <Icons.Settings active={activeTab === 'settings'} />
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
