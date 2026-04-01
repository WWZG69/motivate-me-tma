const { useState, useEffect, useRef } = React;

const Icons = {
    Goals: (props) => (
        <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#ccc"} {...props}>
            <path d="M12 2v20M2 12h20M7 7l10 10M7 17L17 7" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
    ),
    Focus: (props) => (
        <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#ccc"} {...props}>
            <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="2" fill={props.active ? "#FF8C00" : "#ccc"} stroke="none"/>
        </svg>
    ),
    Leaders: (props) => (
        <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#ccc"} {...props}>
            <path d="M7 21v-4M17 21v-8M12 21V7" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 21h16M7 17a2 2 0 110-4 2 2 0 010 4zM12 7a2 2 0 110-4 2 2 0 010 4zM17 13a2 2 0 110-4 2 2 0 010 4z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    Options: (props) => (
        <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "#FF8C00" : "#ccc"} {...props}>
            <path d="M12 8a4 4 0 100 8 4 4 0 000-8zM4.6 9a10 10 0 000 6M2 12h2.6M19.4 9a10 10 0 000 6M21.4 12H19.4M9 4.6a10 10 0 006 0M12 2v2.6M9 19.4a10 10 0 006 0M12 21.4v-2.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
};

function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [userName, setUserName] = useState('Чемпион');
    const [streak, setStreak] = useState(128);
    const [currentDate, setCurrentDate] = useState(new Date());
    
    const [motivationTone, setMotivationTone] = useState('soft');
    const [soundTheme, setSoundTheme] = useState('standard');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    
    const [goals, setGoals] = useState(() => {
        try {
            const saved = localStorage.getItem('motivateMe_v20_goals');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.log("Локальное хранилище недоступно");
            return [];
        }
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
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
            if (type === 'success' || type === 'error') {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
            } else {
                window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
            }
        }
    };

    const showAlert = (msg) => {
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.showAlert) {
            window.Telegram.WebApp.showAlert(msg);
        } else {
            alert(msg);
        }
    };

    useEffect(() => {
        const tg = window.Telegram && window.Telegram.WebApp;
        if (tg) {
            tg.ready(); tg.expand();
            if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
                setUserName(tg.initDataUnsafe.user.first_name);
            }
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
            showAlert('Время фокуса вышло!');
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
        setForm({ title: '', description: '', type: 'habit', deadline: '23:59', duration: '', ignoreHoliday: false });
        setEditingGoalId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (goal) => {
        setForm(goal);
        setEditingGoalId(goal.id);
        setActionMenuGoal(null);
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

    const handleTouchStart = (goal) => {
        pressTimer.current = setTimeout(() => {
            triggerHaptic('heavy');
            setActionMenuGoal(goal);
        }, 500); 
    };
    
    const handleTouchEnd = () => {
        if (pressTimer.current) clearTimeout(pressTimer.current);
    };

    const toggleGoal = (e, goalObj) => {
        e.stopPropagation(); 
        
        const todayStr = currentDate.toDateString();
        const isCheckingToday = todayStr === new Date().toDateString();
        const isCurrentlyDone = !!goalObj.history[todayStr];

        if (!isCurrentlyDone && isCheckingToday) {
            const [h, m] = goalObj.deadline.split(':');
            const limit = new Date(); limit.setHours(parseInt(h, 10), parseInt(m, 10), 0);
            
            if (new Date() > limit) {
                const msg = motivationTone === 'hard' ? "Время вышло! Провал. Соберись!" : "Увы, время вышло. Завтра получится лучше!";
                showAlert(msg);
                triggerHaptic('error');
                return; 
            }
        }

        setGoals(goals.map(g => {
            if (g.id !== goalObj.id) return g;
            const newHistory = { ...g.history };
            if (!isCurrentlyDone) {
                newHistory[todayStr] = true;
                triggerHaptic('success');
            } else {
                delete newHistory[todayStr];
                triggerHaptic('light');
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
                    <div className="card" style={{ padding: '15px', borderRadius: '15px', display: 'block' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button onClick={() => changeDate(-1)} style={{ border: 'none', background: 'none', color: '#FF8C00', fontSize: '22px', cursor: 'pointer' }}>◀</button>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>{currentDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                            <button onClick={() => changeDate(1)} style={{ border: 'none', background: 'none', color: '#FF8C00', fontSize: '22px', cursor: 'pointer' }}>▶</button>
                        </div>
                    </div>

                    {goals.length === 0 && <p style={{textAlign:'center', marginTop:'20px', color:'white'}}>Список пуст. Добавь свою первую цель!</p>}
                    
                    {goals.map(g => {
                        const isDone = !!g.history[currentDate.toDateString()];
                        return (
                            <div 
                                key={g.id} 
                                className="card" 
                                onTouchStart={() => handleTouchStart(g)}
                                onTouchEnd={handleTouchEnd}
                                onTouchMove={handleTouchEnd}
                                onMouseDown={() => handleTouchStart(g)}
                                onMouseUp={handleTouchEnd}
                                onMouseLeave={handleTouchEnd}
                                onClick={() => triggerHaptic('light')} 
                                style={{ borderLeft: g.ignoreHoliday ? '6px solid #FF8C00' : 'none', opacity: isDone ? 0.7 : 1 }}
                            >
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
                                
                                <button 
                                    className={`btn-complete ${isDone ? 'done' : ''}`} 
                                    onClick={(e) => toggleGoal(e, g)}
                                >
                                    {isDone ? '✓' : ''}
                                </button>
                            </div>
                        );
                    })}

                    <button className="btn-add" onClick={openCreateModal}>+ Добавить цель</button>
                </React.Fragment>
            )}

            {activeTab === 'progress' && (
                <div className="card" style={{ display: 'block' }}>
                    <h3 style={{ textAlign: 'center', color: '#FF8C00', margin:'0 0 10px 0' }}>Таймер Фокуса</h3>
                    <div style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' }}>
                        {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                    <button onClick={() => setIsTimerRunning(!isTimerRunning)} style={{ width: '100%', background: '#FF8C00', border: 'none', color: 'white', padding: '12px', borderRadius: '12px', fontWeight: 'bold' }}>
                        {isTimerRunning ? 'ПАУЗА' : 'СТАРТ'}
                    </button>
                </div>
            )}

            {activeTab === 'social' && (
                <div className="card" style={{ display: 'block' }}>
                    <h3 style={{ textAlign: 'center', color: '#FF8C00', margin:'0 0 15px 0' }}>Лидеры</h3>
                    {[ {n:'Алексей М.', s:150}, {n:userName+' (Вы)', s:streak, me:true}, {n:'Мария К.', s:112} ].map((u, i) => (
                        <div key={i} style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', background: u.me ? '#fff4e5' : 'none', borderRadius: u.me ? '10px' : '0' }}>
                            <span style={{color: '#000'}}>{i+1}. {u.n}</span>
                            <strong>{u.s} 🔥</strong>
                        </div>
                    ))}
                    <button onClick={() => {
                        if(window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.openTelegramLink) {
                            window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=https://t.me/MotivateMe_ibot`);
                        }
                    }} style={{ width: '100%', marginTop: '20px', background: 'white', border: '1px dashed #FF8C00', color: '#FF8C00', padding: '12px', borderRadius: '12px', fontWeight: 'bold' }}>+ ПОЗВАТЬ ДРУГА</button>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="card" style={{ display: 'block' }}>
                    <h3 style={{ textAlign: 'center', color: '#FF8C00', margin:'0 0 20px 0' }}>Настройки</h3>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#000' }}>Тон поддержки:</label>
                    <select className="custom-select" value={motivationTone} onChange={e => setMotivationTone(e.target.value)}>
                        <option value="soft">Мягкий (Поддержка)</option>
                        <option value="hard">Жесткий (Спарта)</option>
                    </select>
                </div>
            )}
            
            {actionMenuGoal && (
                <div className="modal-overlay" onClick={() => setActionMenuGoal(null)}>
                    <div className="modal-content" style={{ paddingBottom: '40px', display: 'block' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{margin:'0 0 5px 0', textAlign: 'center'}}>{actionMenuGoal.title}</h2>
                        <p style={{textAlign: 'center', color: '#777', marginTop: 0, marginBottom: '25px'}}>Выберите действие</p>
                        
                        <button className="btn-save" style={{background: '#000', marginBottom: '10px'}} onClick={() => openEditModal(actionMenuGoal)}>✏️ Редактировать</button>
                        <button className="btn-danger" onClick={() => { setConfirmDeleteGoalId(actionMenuGoal.id); setActionMenuGoal(null); }}>🗑 Удалить цель</button>
                        <button className="btn-cancel" onClick={() => setActionMenuGoal(null)}>Закрыть</button>
                    </div>
                </div>
            )}

            {confirmDeleteGoalId && (
                <div className="modal-overlay modal-center" onClick={() => setConfirmDeleteGoalId(null)}>
                    <div className="modal-content-center" style={{ display: 'block' }} onClick={e => e.stopPropagation()}>
                        <h2>Удалить цель?</h2>
                        <p style={{color: '#777', marginBottom: '25px'}}>История и ударный режим будут стерты безвозвратно.</p>
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

                        <button className="btn-save" onClick={saveGoal}>{editingGoalId ? 'СОХРАНИТЬ ИЗМЕНЕНИЯ' : 'СОЗДАТЬ ЦЕЛЬ'}</button>
                        <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>ОТМЕНА</button>
                    </div>
                </div>
            )}

            <div className="tab-bar">
                <div onClick={() => setActiveTab('home')} className="tab-item" style={{ color: activeTab === 'home' ? '#FF8C00' : '#ccc' }}>
                    <Icons.Goals active={activeTab === 'home'} />
                    <div className="tab-label">ГЛАВНАЯ</div>
                </div>
                <div onClick={() => setActiveTab('progress')} className="tab-item" style={{ color: activeTab === 'progress' ? '#FF8C00' : '#ccc' }}>
                    <Icons.Focus active={activeTab === 'progress'} />
                    <div className="tab-label">ФОКУС</div>
                </div>
                <div onClick={() => setActiveTab('social')} className="tab-item" style={{ color: activeTab === 'social' ? '#FF8C00' : '#ccc' }}>
                    <Icons.Leaders active={activeTab === 'social'} />
                    <div className="tab-label">ЛИДЕРЫ</div>
                </div>
                <div onClick={() => setActiveTab('settings')} className="tab-item" style={{ color: activeTab === 'settings' ? '#FF8C00' : '#ccc' }}>
                    <Icons.Options active={activeTab === 'settings'} />
                    <div className="tab-label">ОПЦИИ</div>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
