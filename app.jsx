const { useState, useEffect, useRef } = React;

const Icons = {
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
    Focus: (props) => (
        <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}>
            <path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="3" />
        </svg>
    ),
    Add: (props) => (
        <svg viewBox="0 0 24 24" className="tab-add-icon" {...props}>
            <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
            <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
        </svg>
    ),
    Stats: (props) => (
        <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#fff"} {...props}>
            <circle cx="4" cy="17" r="1.5" fill={props.active ? "#FF8C00" : "#fff"} />
            <circle cx="12" cy="7" r="1.5" fill={props.active ? "#FF8C00" : "#fff"} />
            <circle cx="20" cy="14" r="1.5" fill={props.active ? "#FF8C00" : "#fff"} />
            <path d="M5.5 16l5-7.5M13.5 8l5 4.5" strokeLinecap="round" />
        </svg>
    ),
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
    
    const [expandedGoalId, setExpandedGoalId] = useState(null);
    const [shakingGoalId, setShakingGoalId] = useState(null); // Стейт для трясущейся карточки
    const isLongPress = useRef(false);

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

    const openCreateModal = () => {
        triggerHaptic('light');
        setEditingGoalId(null);
        setForm({title:'', description:'', type:'habit', deadline:'23:59', duration:'', ignoreHoliday:false});
        setIsModalOpen(true);
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

    const checkPermissions = (goal) => {
        const now = new Date();
        const viewingDate = new Date(currentDate);
        viewingDate.setHours(0, 0, 0, 0);
        const actualToday = new Date();
        actualToday.setHours(0, 0, 0, 0);

        const isPast = viewingDate < actualToday;
        const isToday = viewingDate.getTime() === actualToday.getTime();

        let isDeadlinePassed = isPast;
        if (isToday) {
            const [h, m] = goal.deadline.split(':');
            const limit = new Date();
            limit.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
            if (now > limit) isDeadlinePassed = true;
        }

        return {
            canToggle: isToday && !isDeadlinePassed,
            canEdit: !isPast && !isDeadlinePassed
        };
    };

    const handleTouchStart = (goal) => {
        const { canEdit } = checkPermissions(goal);
        isLongPress.current = false;
        
        if (!canEdit) return;

        pressTimer.current = setTimeout(() => {
            isLongPress.current = true;
            triggerHaptic('heavy');
            setActionMenuGoal(goal);
        }, 500); 
    };
    
    const handleTouchEnd = () => { 
        if (pressTimer.current) clearTimeout(pressTimer.current); 
    };

    const handleCardClick = (goal) => {
        if (!isLongPress.current) {
            setExpandedGoalId(prev => prev === goal.id ? null : goal.id);
            triggerHaptic('light');
        }
    };

    const toggleGoal = (e, goalObj) => {
        e.stopPropagation(); 
        const { canToggle } = checkPermissions(goalObj);
        
        // ЕСЛИ НЕЛЬЗЯ ОТМЕТИТЬ: Запускаем тряску карточки и вибрацию ошибки
        if (!canToggle) {
            triggerHaptic('error');
            setShakingGoalId(goalObj.id);
            setTimeout(() => setShakingGoalId(null), 400); // Выключаем тряску через 0.4 сек
            return;
        }

        const todayStr = currentDate.toDateString();
        const isCurrentlyDone = !!goalObj.history[todayStr];
        setGoals(goals.map(g => {
            if (g.id !== goalObj.id) return g;
            const newHistory = { ...g.history };
            if (!isCurrentlyDone) { 
                newHistory[todayStr] = true; 
                triggerHaptic('success'); // Приятный двойной щелчок при выполнении
            } else { 
                delete newHistory[todayStr]; 
                triggerHaptic('light'); // Легкий щелчок при снятии
            }
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '360px', marginBottom: '15px' }}>
                        <button onClick={() => changeDate(-1)} style={{ border: 'none', background: 'none', color: '#fff', fontSize: '22px', padding: '10px' }}>◀</button>
                        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{currentDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                        <button onClick={() => changeDate(1)} style={{ border: 'none', background: 'none', color: '#fff', fontSize: '22px', padding: '10px' }}>▶</button>
                    </div>
                    
                    {goals.length === 0 && <p style={{textAlign:'center', marginTop:'20px', opacity: 0.7}}>Список пуст. Нажми + внизу!</p>}
                    
                    {goals.map(g => {
                        const isDone = !!g.history[currentDate.toDateString()];
                        const isExpanded = expandedGoalId === g.id;
                        const isShaking = shakingGoalId === g.id; // Проверяем, трясется ли эта карточка
                        const { canToggle } = checkPermissions(g);
                        
                        return (
                            <div 
                                key={g.id} 
                                // Добавляем класс shake, если нажали с ошибкой
                                className={`card ${isShaking ? 'shake' : ''}`} 
                                onTouchStart={() => handleTouchStart(g)} 
                                onTouchEnd={handleTouchEnd} 
                                onMouseDown={() => handleTouchStart(g)} 
                                onMouseUp={handleTouchEnd} 
                                onClick={() => handleCardClick(g)} 
                                style={{ opacity: isDone ? 0.6 : 1 }}
                            >
                                <div className="goal-info">
                                    <div className="goal-title" style={{ textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'rgba(255,255,255,0.6)' : 'white' }}>
                                        {g.title}
                                    </div>
                                    <div className="stats-row">
                                        {g.type !== 'once' && <span className="badge">{g.streak} 🔥</span>}
                                        {g.type === 'habit' && <span className="badge">∞</span>}
                                        {g.type === 'sprint' && <span className="badge">{Math.max(0, parseInt(g.duration || 0) - g.streak)} ⏳</span>}
                                    </div>
                                    
                                    <div className={`goal-desc-wrapper ${isExpanded ? 'expanded' : ''}`}>
                                        <div className="goal-desc-inner">
                                            <div className="goal-desc">
                                                {g.description || 'Описания нет. Просто бери и делай!'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <button className={`btn-complete ${isDone ? 'done' : ''} ${!canToggle ? 'disabled' : ''}`} onClick={(e) => toggleGoal(e, g)}>
                                    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </button>
                            </div>
                        );
                    })}
                </React.Fragment>
            )}

            {activeTab === 'progress' && (
                <div className="card" style={{ display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.65)' }}>
                    <h3 style={{ textAlign: 'center', color: '#fff', margin: 0 }}>Таймер Фокуса</h3>
                    <div style={{ fontSize: '42px', fontWeight: 'bold', textAlign: 'center', margin: '20px 0', color: '#FF8C00' }}>
                        {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                    <button onClick={() => setIsTimerRunning(!isTimerRunning)} style={{ width: '100%', background: '#FF8C00', border: 'none', color: 'white', padding: '12px', borderRadius: '12px', fontWeight: 'bold' }}>
                        {isTimerRunning ? 'ПАУЗА' : 'СТАРТ'}
                    </button>
                </div>
            )}

            {activeTab === 'social' && (
                <div className="card" style={{ display: 'block', background: 'rgba(0,0,0,0.65)' }}>
                    <h3 style={{ textAlign: 'center', color: '#fff', margin: '0 0 10px 0' }}>Статистика</h3>
                    <p style={{textAlign: 'center', color: 'rgba(255,255,255,0.6)'}}>Графики появятся здесь совсем скоро!</p>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="card" style={{ display: 'block', background: 'rgba(0,0,0,0.65)' }}>
                    <h3 style={{ textAlign: 'center', color: '#fff', margin: '0 0 15px 0' }}>Настройки</h3>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#fff' }}>Тон поддержки:</label>
                    <select className="custom-select" value={motivationTone} onChange={e => setMotivationTone(e.target.value)} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <option value="soft" style={{color: '#000'}}>Мягкий</option>
                        <option value="hard" style={{color: '#000'}}>Жесткий</option>
                    </select>
                </div>
            )}

            {actionMenuGoal && (
                <div className="modal-overlay" onClick={() => setActionMenuGoal(null)}>
                    <div className="modal-content" style={{ paddingBottom: '40px', display: 'block' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{margin:'0 0 5px 0', textAlign: 'center', color: '#000'}}>{actionMenuGoal.title}</h2>
                        <p style={{textAlign: 'center', color: '#777', marginTop: 0, marginBottom: '25px'}}>Выберите действие</p>
                        
                        <button className="btn-save" style={{background: '#000', marginBottom: '10px'}} onClick={() => { setForm(actionMenuGoal); setEditingGoalId(actionMenuGoal.id); setActionMenuGoal(null); setIsModalOpen(true); }}>✏️ Редактировать</button>
                        <button className="btn-danger" onClick={() => { setConfirmDeleteGoalId(actionMenuGoal.id); setActionMenuGoal(null); }}>🗑 Удалить цель</button>
                        <button className="btn-cancel" onClick={() => setActionMenuGoal(null)}>Закрыть</button>
                    </div>
                </div>
            )}

            {confirmDeleteGoalId && (
                <div className="modal-overlay modal-center" onClick={() => setConfirmDeleteGoalId(null)}>
                    <div className="modal-content-center" style={{ display: 'block' }} onClick={e => e.stopPropagation()}>
                        <h2>Удалить цель?</h2>
                        <p style={{color: '#777', marginBottom: '25px'}}>История будет стерта безвозвратно.</p>
                        <button className="btn-danger" onClick={deleteGoal}>Да, удалить</button>
                        <button className="btn-cancel" onClick={() => setConfirmDeleteGoalId(null)}>Отмена</button>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" style={{ display: 'block' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{margin:'0 0 20px 0', color: '#000'}}>{editingGoalId ? 'Редактировать цель' : 'Новая цель'}</h2>
                        
                        <input placeholder="Название (например: Пробежка)" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={{color: '#000'}} />
                        <textarea placeholder="Описание (зачем тебе это?)" rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{color: '#000'}} />
                        
                        <div style={{fontSize:'13px', marginBottom:'8px', fontWeight:'bold', color: '#000'}}>Тип цели:</div>
                        <select className="custom-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                            <option value="once">Разовая (один раз)</option>
                            <option value="habit">Постоянная (∞)</option>
                            <option value="sprint">Спринт (на N дней)</option>
                        </select>

                        {form.type === 'sprint' && (
                            <input type="number" placeholder="Сколько дней соблюдать?" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} style={{color: '#000'}} />
                        )}

                        <div style={{display:'flex', gap:'15px'}}>
                            <div style={{flex:1}}>
                                <div style={{fontSize:'13px', marginBottom:'8px', fontWeight:'bold', color: '#333'}}>Дедлайн:</div>
                                <input type="time" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} style={{color: '#000'}} />
                            </div>
                            <div style={{flex:1, display:'flex', alignItems:'center'}}>
                                <label style={{fontSize:'13px', display:'flex', alignItems:'center', gap:'8px', marginTop:'10px', fontWeight: 'bold', color: '#000', cursor: 'pointer'}}>
                                    <input type="checkbox" checked={form.ignoreHoliday} onChange={e => setForm({...form, ignoreHoliday: e.target.checked})} style={{width:'auto', margin:0, transform: 'scale(1.2)'}} /> 
                                    Без выходных
                                </label>
                            </div>
                        </div>

                        <button className="btn-save" onClick={saveGoal} style={{marginBottom: '10px'}}>{editingGoalId ? 'СОХРАНИТЬ ИЗМЕНЕНИЯ' : 'СОЗДАТЬ ЦЕЛЬ'}</button>
                        <button className="btn-cancel" onClick={() => setIsModalOpen(false)} style={{margin: 0}}>ОТМЕНА</button>
                    </div>
                </div>
            )}

            <div className="tab-bar">
                <div onClick={() => setActiveTab('home')} className="tab-item">
                    <Icons.Goals active={activeTab === 'home'} />
                </div>
                <div onClick={() => setActiveTab('progress')} className="tab-item">
                    <Icons.Focus active={activeTab === 'progress'} />
                </div>
                
                <div className="tab-add-wrapper" onClick={openCreateModal}>
                    <div className="tab-add-btn">
                        <Icons.Add />
                    </div>
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
