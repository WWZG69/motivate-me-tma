// ==========================================
// ФАЙЛ: app.jsx
// ==========================================

const { Icons, Onboarding, RulesModal, TimeWheel, Utils } = window;
const { useState, useEffect, useRef, useMemo } = React;

const PENALTY_PHRASE = "Я сдаюсь и сжигаю свой рейтинг";

function App() {
    // === СОСТОЯНИЯ ===
    const [hasSignedContract, setHasSignedContract] = useState(() => Utils.storage.get('motivateMe_v20_contract', false));
    const [isLightTheme, setIsLightTheme] = useState(() => Utils.storage.get('motivateMe_theme', 'dark') === 'light');

    const [showSplash, setShowSplash] = useState(true);
    const [activeTab, setActiveTab] = useState('home');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [now, setNow] = useState(new Date());
    const [offsetPx, setOffsetPx] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isHeatmapExpanded, setIsHeatmapExpanded] = useState(false); 
    const [motivationTone, setMotivationTone] = useState('stoic');
    
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
    const [expandedGoalId, setExpandedGoalId] = useState(null);
    const [activeVisionId, setActiveVisionId] = useState(null);
    
    const touchStartX = useRef(0); const touchStartY = useRef(0); const touchStartTime = useRef(0); 
    const isDragging = useRef(false); const isSwipeValid = useRef(null); const transitionTimer = useRef(null);
    const isLongPress = useRef(false); const pressTimer = useRef(null);
    
    // Данные
    const [trustScore, setTrustScore] = useState(() => Utils.storage.get('motivateMe_v20_trust', 100));
    const [goals, setGoals] = useState(() => Utils.storage.get('motivateMe_v20_goals', []));
    const [visions, setVisions] = useState(() => Utils.storage.get('motivateMe_v20_visions', []));

    // Создание/Редактирование
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createMode, setCreateMode] = useState('micro');
    const [createStep, setCreateStep] = useState('text'); 
    const [editingId, setEditingId] = useState(null); 
    const [actionMenuGoal, setActionMenuGoal] = useState(null);
    const [confirmDeleteGoalId, setConfirmDeleteGoalId] = useState(null);
    const [actionMenuVision, setActionMenuVision] = useState(null);
    const [confirmDeleteVisionId, setConfirmDeleteVisionId] = useState(null);
    
    const [startMonth, setStartMonth] = useState(Utils.monthNames[new Date().getMonth()]);
    const [startDay, setStartDay] = useState(new Date().getDate().toString().padStart(2, '0'));

    // ИИ стейт
    const [aiQuery, setAiQuery] = useState('');
    const [isAiScanning, setIsAiScanning] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [isGeneratingGoal, setIsGeneratingGoal] = useState(false);
    const [isGeneratingVision, setIsGeneratingVision] = useState(false);

    const defaultForm = { title: '', description: '', type: 'habit', deadline: '23:59', duration: '', ignoreHoliday: false, notifications: true, startDate: null, visionId: '', weekDays: [0,1,2,3,4,5,6], controlMethod: 'check', focusTime: 25 };
    const defaultVisionForm = { title: '', emoji: '🎯', description: '' };

    const [form, setForm] = useState(defaultForm);
    const [visionForm, setVisionForm] = useState(defaultVisionForm);

    const hoursList = Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0'));
    const minutesList = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));
    const daysInMonth = useMemo(() => {
        const monthIdx = Utils.monthNames.indexOf(startMonth);
        const days = new Date(new Date().getFullYear(), monthIdx + 1, 0).getDate();
        return Array.from({length: days}, (_, i) => (i + 1).toString().padStart(2, '0'));
    }, [startMonth]);

    const isAnyModalOpen = isModalOpen || !!actionMenuGoal || !!actionMenuVision || !!confirmDeleteGoalId || !!confirmDeleteVisionId || showGiveUpModal || showPenaltyModal || showRageQuitAlert || showLowTrustAlert || showRulesModal;

    // === ЭФФЕКТЫ ===
    useEffect(() => {
        document.body.style.overflow = isAnyModalOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isAnyModalOpen]);

    useEffect(() => {
        if (window.Telegram?.WebApp) { window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); }
        if (Utils.storage.get('motivateMe_v20_rageQuit', false)) {
            Utils.storage.remove('motivateMe_v20_rageQuit'); 
            setTrustScore(prev => Math.max(0, prev - 15)); 
            setShowRageQuitAlert(true);
        }
        setTimeout(() => setShowSplash(false), 4000);
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (daysInMonth && startDay && !daysInMonth.includes(startDay)) setStartDay('01');
    }, [daysInMonth, startDay]);

    useEffect(() => {
        if (isLightTheme) document.body.classList.add('light-theme'); else document.body.classList.remove('light-theme');
        Utils.storage.set('motivateMe_theme', isLightTheme ? 'light' : 'dark');
    }, [isLightTheme]);

    useEffect(() => {
        Utils.storage.set('motivateMe_v20_goals', goals);
        Utils.storage.set('motivateMe_v20_visions', visions);
        Utils.storage.set('motivateMe_v20_trust', trustScore);
    }, [goals, visions, trustScore]);

    useEffect(() => {
        let interval = null;
        if (isTimerRunning && timeLeft > 0) {
            Utils.storage.set('motivateMe_v20_rageQuit', 'true');
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (isTimerRunning && timeLeft === 0) {
            setIsTimerRunning(false);
            Utils.storage.remove('motivateMe_v20_rageQuit');
            Utils.haptic('success'); 
            setTrustScore(prev => Math.min(100, prev + 1));
            
            if (activeFocusGoal && activeFocusDate) {
                const dateStr = activeFocusDate.toDateString();
                setGoals(prev => prev.map(g => {
                    if (g.id === activeFocusGoal.id) {
                        const newHistory = { ...(g.history || {}) }; newHistory[dateStr] = true;
                        return { ...g, history: newHistory, streak: (g.streak || 0) + 1 };
                    }
                    return g;
                }));
                setActiveFocusGoal(null);
            }
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft, activeFocusGoal, activeFocusDate]);

    // === ЛОГИКА ===
    const toggleTheme = (e) => {
        const ripple = document.createElement('div'); ripple.className = 'theme-ripple-effect';
        ripple.style.left = `${e.clientX}px`; ripple.style.top = `${e.clientY}px`; ripple.style.backgroundColor = '#F2F2F7'; 
        Utils.haptic('medium'); document.body.appendChild(ripple);
        if (!isLightTheme) {
            ripple.style.animation = 'rippleExpand 0.9s cubic-bezier(0.25, 1, 0.5, 1) forwards';
            setTimeout(() => { setIsLightTheme(true); ripple.classList.add('fade-out'); }, 900);
            setTimeout(() => ripple.remove(), 1200);
        } else {
            setIsLightTheme(false); ripple.style.animation = 'rippleCollapse 0.9s cubic-bezier(0.25, 1, 0.5, 1) forwards';
            setTimeout(() => ripple.remove(), 900);
        }
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
            const count = completionByDate[iso] || 0; if (count > maxDaily) maxDaily = count;
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

    const getActiveGoalsForDate = (dateTarget) => {
        const norm = new Date(dateTarget); norm.setHours(0, 0, 0, 0); const rT = norm.getTime();
        return goals.filter(g => { 
            if (activeVisionId && g.visionId != activeVisionId) return false;
            try { 
                const sD = new Date(g.startDate); sD.setHours(0, 0, 0, 0); const sT = sD.getTime();
                if (sT > rT) return false; 
                if (g.type === 'habit' && g.weekDays && !g.weekDays.includes(dateTarget.getDay())) return false;
                if (g.type === 'sprint') { const eD = new Date(sT); eD.setDate(eD.getDate() + (parseInt(g.duration)||1) - 1); if (rT > eD.getTime()) return false; }
                if (g.type === 'once' && rT !== sT) return false;
                return true; 
            } catch(e) { return true; } 
        });
    };

    const startFocusSession = (goal, dateTarget) => { Utils.haptic('light'); setActiveFocusGoal(goal); setActiveFocusDate(dateTarget); setTimeLeft((goal.focusTime || 25) * 60); setActiveTab('progress'); };
    const resetTimer = () => { setIsTimerRunning(false); setActiveFocusGoal(null); setTimeLeft(25 * 60); Utils.haptic('light'); };
    const applyDateShift = (shift) => { setCurrentDate(prev => Utils.dates.getOffsetDate(prev, shift)); };

    const animateToDate = (daysShift) => {
        setExpandedGoalId(null); Utils.haptic('light');
        if (transitionTimer.current) { clearTimeout(transitionTimer.current); applyDateShift(offsetPx > 0 ? -1 : 1); }
        setIsTransitioning(true); setOffsetPx(daysShift > 0 ? -window.innerWidth : window.innerWidth);
        transitionTimer.current = setTimeout(() => { setIsTransitioning(false); setOffsetPx(0); applyDateShift(daysShift); transitionTimer.current = null; }, 180);
    };

    const onSwipeStart = (e) => {
        if (transitionTimer.current) { clearTimeout(transitionTimer.current); transitionTimer.current = null; applyDateShift(offsetPx > 0 ? -1 : 1); setOffsetPx(0); setIsTransitioning(false); }
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
        isDragging.current = false; const swipeDuration = Date.now() - touchStartTime.current; const velocity = offsetPx / swipeDuration; const threshold = window.innerWidth * 0.2; 
        if (offsetPx > threshold || velocity > 0.4) animateToDate(-1); else if (offsetPx < -threshold || velocity < -0.4) animateToDate(1); else { setIsTransitioning(true); setOffsetPx(0); setTimeout(() => setIsTransitioning(false), 200); }
    };

    const openCreateModal = () => { Utils.haptic('light'); setEditingId(null); setForm({...defaultForm, visionId: activeVisionId || '', weekDays: [0,1,2,3,4,5,6]}); setVisionForm(defaultVisionForm); setStartMonth(Utils.monthNames[new Date().getMonth()]); setStartDay(new Date().getDate().toString().padStart(2, '0')); setCreateMode('micro'); setCreateStep('text'); setIsModalOpen(true); };
    const closeCreateModal = () => { Utils.haptic('light'); setIsModalOpen(false); };

    const toggleWeekDay = (dayVal) => { Utils.haptic('light'); setForm(prev => { const arr = prev.weekDays || []; if (arr.includes(dayVal)) return { ...prev, weekDays: arr.filter(d => d !== dayVal) }; return { ...prev, weekDays: [...arr, dayVal] }; }); };
    const adjustFocusTime = (amount, e) => { e.preventDefault(); Utils.haptic('light'); setForm(prev => { let next = (parseInt(prev.focusTime) || 25) + amount; if (next < 1) next = 1; return {...prev, focusTime: next}; }); };

    // --- ИИ: ГЕНЕРАЦИЯ ---
    const generateGoalDetailsWithAI = async () => {
        if (!form.title.trim() || isGeneratingGoal) return;
        setIsGeneratingGoal(true); Utils.haptic('light');
        const visionsContext = visions.length > 0 ? `Глобальные цели юзера:\n${visions.map(v => `- ID: ${v.id}, Название: ${v.title}`).join('\n')}` : `Глобальных целей нет.`;
        const systemPrompt = `Ты ИИ-трекер. Преврати запрос в задачу. 
ПРАВИЛА:
1. ВРЕМЯ (СУПЕР ВАЖНО): Если в запросе юзер указал конкретное время (например, "в 6 утра"), установи "deadline" точно на это время + 5-10 минут (например, "06:10"), а не "23:59".
2. ФИЗИЧЕСКИЕ ТРИГГЕРЫ: Задачи вроде "проснуться", "встать", "выпить", "заправить" — это МОМЕНТАЛЬНЫЕ действия -> "controlMethod": "check", "focusTime": 0.
3. РАБОТА В ПОТОКЕ (чтение, код, уборка) -> "controlMethod": "timer", "focusTime": 15-60.
4. ЗАПРЕЩЕНО давать таймер на минутные дела.
5. СРОКИ: Если указан жесткий дедлайн (например "за неделю"), ставь максимальный focusTime (60).
Связь с глобальной целью: ${visionsContext}. 
Верни JSON: {"title": "", "description": "", "type": "once/habit/sprint", "controlMethod": "timer/check", "focusTime": 25, "deadline": "23:59", "visionId": "id или пусто"}`;
        try {
            const parsed = await Utils.ai.fetchJSON(`Запрос: "${form.title}"`, systemPrompt, 0.2);
            setForm(prev => ({ ...prev, title: parsed.title || prev.title, description: parsed.description || prev.description, type: parsed.type || 'once', controlMethod: parsed.controlMethod || 'check', focusTime: parsed.focusTime || 0, deadline: parsed.deadline || '23:59', visionId: parsed.visionId || prev.visionId }));
            Utils.haptic('success');
        } catch (error) { Utils.haptic('error'); } finally { setIsGeneratingGoal(false); }
    };

    const generateVisionDetailsWithAI = async () => {
        if (!visionForm.title.trim() || isGeneratingVision) return;
        setIsGeneratingVision(true); Utils.haptic('light');
        const systemPrompt = `Ты — безжалостный ИИ-трекер. Создай Видение и 3 тактических шага на 3 дня (dayOffset 0, 1, 2).
ПРАВИЛА ИЗБЕЖАНИЯ БРЕДА:
1. ЗАПРЕТ НА "ИССЛЕДОВАНИЯ": Строго запрещено давать шаги вроде "посмотреть видео о пользе", "почитать статьи", "составить список плюсов". Если юзер написал цель (например, вставать в 6 утра), он УЖЕ знает зачем. Давай только ФИЗИЧЕСКИЕ ДЕЙСТВИЯ.
2. ИНЖЕНЕРНЫЙ ШАГ 1: Если цель — бытовая привычка (ранний подъем, бег), Шаг 1 (dayOffset 0) должен быть подготовкой среды (например: "Отнести зарядку для телефона в ванную", "Положить форму у кровати").
3. ПАРСИНГ ВРЕМЕНИ: Если цель привязана ко времени (в 6:00), установи "deadline" для этого шага ровно на это время + 5 минут ("06:05"). Если времени нет, ставь "23:59".
4. ФИЗИЧЕСКИЕ ТРИГГЕРЫ: Пробуждение, звонок, прием таблеток — это МОМЕНТАЛЬНЫЕ действия -> "method": "check", "focusTime": 0.
5. РАБОТА: Писать код, читать -> "method": "timer", "focusTime": 15-60.
6. Эмодзи: Подбери СТРОГО 1 тематический.
7. ИНТЕНСИВНОСТЬ И СРОКИ: Если юзер указал безумные сроки (например "выучить за месяц"), не пиши, что это невозможно. Просто сделай эти 3 стартовых дня максимально хардкорными (таймеры по 60 мин). План всегда строго на 3 дня.
Тон: ${motivationTone === 'toxic' ? 'токсичный, уничижительный сержант' : 'сухой, безэмоциональный констататор'}.
Верни JSON: {"visionTitle":"", "visionEmoji":"🧵", "visionDesc":"", "steps":[{"title":"", "desc":"", "type":"once", "method":"timer/check", "focusTime":25, "deadline":"23:59", "dayOffset":0}]}`;
        try {
            const parsed = await Utils.ai.fetchJSON(`Мечта: "${visionForm.title}"`, systemPrompt, 0.3);
            const newVisionId = Date.now().toString();
            setVisions(prev => [{ id: newVisionId, title: parsed.visionTitle, emoji: parsed.visionEmoji, description: parsed.visionDesc }, ...prev]);
            const newGoals = (parsed.steps || []).map((step, idx) => {
                const targetDate = new Date(); if (step.dayOffset) targetDate.setDate(targetDate.getDate() + step.dayOffset);
                return { id: Date.now() + idx + 100, title: step.title, description: step.desc, type: step.type, deadline: step.deadline || '23:59', duration: 1, ignoreHoliday: false, notifications: true, startDate: targetDate.toISOString(), visionId: newVisionId, weekDays: [0,1,2,3,4,5,6], controlMethod: step.method || 'timer', focusTime: step.focusTime || 25, history: {}, streak: 0, createdAt: new Date().toDateString() };
            });
            if (newGoals.length > 0) setGoals(prev => [...newGoals, ...prev]);
            setIsModalOpen(false); Utils.haptic('heavy');
        } catch (error) { Utils.haptic('error'); } finally { setIsGeneratingVision(false); }
    };

    const handleAiSubmit = async () => {
        if (!aiQuery.trim()) { Utils.haptic('error'); return; }
        setIsAiScanning(true); setAiResult(null); Utils.haptic('light');
        const systemPrompt = `Ты — безжалостный ИИ-трекер. Разбей задачу на 3 шага на сегодня, завтра и послезавтра (dayOffset 0, 1, 2). 
ГЛАВНАЯ ЦЕЛЬ: Снять паралич первого шага и дать импульс.

ПРАВИЛА ИЗБЕЖАНИЯ БРЕДА:
1. ЗАПРЕТ НА "ИССЛЕДОВАНИЯ": Строго запрещено давать шаги вроде "посмотреть мотивационное видео", "почитать статьи", "настроиться морально". Давай только ФИЗИЧЕСКИЕ ДЕЙСТВИЯ.
2. ИНЖЕНЕРНЫЙ ШАГ 1: Если цель — рутина (подъем в 6 утра, вода, бег), Шаг 1 (на сегодня) — это изменение среды (например: "Унести будильник в другую комнату", "Налить стакан воды", "Достать кроссовки").
3. ПАРСИНГ ВРЕМЕНИ: Если в запросе есть время (например, "в 6:00"), установи "deadline" для этого шага ровно на это время + 5 минут ("06:05"). Для обычных задач ставь "23:59".
4. ФИЗИЧЕСКИЕ ТРИГГЕРЫ: Пробуждение, чистка зубов, выпить воды — это моментальные действия -> "method": "check", "focusTime": 0.
5. РАБОТА: Кодинг, уборка, чтение -> "method": "timer", "focusTime": 15-60.
6. Эмодзи: Строго 1 тематический.
7. ИНТЕНСИВНОСТЬ И СРОКИ: Если юзер указал безумные сроки ("за неделю"), не спорь. Сделай 3 дня максимально хардкорными (таймеры по 60 мин). План всегда строго на 3 дня.

Тон системы: ${motivationTone === 'toxic' 
    ? 'уничижительный, жесткий сержант, высмеивающий слабость.' 
    : 'холодный, стоический, констататор фактов.'}

Формат ответа СТРОГО валидный JSON:
{
  "title": "Хлесткое название плана",
  "emoji": "⏰",
  "steps": [
    {
      "title": "Действие (глагол)",
      "desc": "Жесткое объяснение",
      "type": "once",
      "method": "timer/check",
      "focusTime": 25,
      "deadline": "23:59",
      "dayOffset": 0
    }
  ]
}`;
        try {
            const parsed = await Utils.ai.fetchJSON(`Задача: "${aiQuery}"`, systemPrompt, 0.2);
            setAiResult(parsed);
            Utils.haptic('success');
        } catch (error) { setAiResult({ title: "Ошибка", emoji: "⚠️", steps: [] }); Utils.haptic('error'); } finally { setIsAiScanning(false); }
    };

    const acceptAiContract = () => {
        if (!aiResult || !aiResult.steps) return;
        const newVisionId = Date.now().toString();
        setVisions(prev => [{ id: newVisionId, title: aiResult.title, emoji: aiResult.emoji, description: `Сгенерировано ИИ по запросу: "${aiQuery}"` }, ...prev]);
        const newGoals = aiResult.steps.map((step, idx) => {
            const targetDate = new Date(); if (step.dayOffset) targetDate.setDate(targetDate.getDate() + step.dayOffset);
            return { id: Date.now() + idx + 100, title: step.title, description: step.desc, type: step.type, deadline: step.deadline || '23:59', duration: 1, startDate: targetDate.toISOString(), visionId: newVisionId, weekDays: [0,1,2,3,4,5,6], controlMethod: step.method || 'timer', focusTime: step.focusTime || 25, history: {}, streak: 0 };
        });
        setGoals(prev => [...newGoals, ...prev]);
        setAiQuery(''); setAiResult(null); Utils.haptic('heavy');
    };

    // --- УПРАВЛЕНИЕ ЦЕЛЯМИ ---
    const saveGoal = () => {
        if (createMode === 'macro') {
            if (!visionForm.title) { Utils.haptic('error'); return; }
            if (editingId) setVisions(visions.map(v => v.id === editingId ? { ...visionForm, id: v.id } : v)); else setVisions([{ ...visionForm, id: Date.now() }, ...visions]);
            setIsModalOpen(false); Utils.haptic('success'); return;
        }
        if (!form.title) { Utils.haptic('error'); setCreateStep('text'); return; }
        try {
            const selectedMonthIdx = Utils.monthNames.indexOf(startMonth); const selectedDayNum = parseInt(startDay, 10);
            let targetYear = now.getFullYear(); if (selectedMonthIdx < now.getMonth() || (selectedMonthIdx === now.getMonth() && selectedDayNum < now.getDate())) targetYear += 1;
            const finalStartDate = new Date(targetYear, selectedMonthIdx, selectedDayNum); finalStartDate.setHours(0, 0, 0, 0);
            const goalData = { ...form, startDate: finalStartDate.toISOString(), weekDays: (form.weekDays && form.weekDays.length > 0) ? form.weekDays : [0,1,2,3,4,5,6] };
            if (editingId) setGoals(goals.map(g => g.id === editingId ? { ...goalData, id: g.id, streak: g.streak || 0, history: g.history || {}, createdAt: g.createdAt } : g)); else setGoals([{ ...goalData, id: Date.now(), streak: 0, history: {}, createdAt: new Date().toDateString() }, ...goals]);
        } catch(e) {}
        setIsModalOpen(false); Utils.haptic('success');
    };
    
    const deleteGoal = () => { setGoals(goals.filter(g => g.id !== confirmDeleteGoalId)); setConfirmDeleteGoalId(null); setTrustScore(prev => Math.max(0, prev - 5)); Utils.haptic('heavy'); };
    const deleteVision = () => { setVisions(visions.filter(v => v.id !== confirmDeleteVisionId)); setGoals(goals.filter(g => g.visionId !== confirmDeleteVisionId)); if (activeVisionId === confirmDeleteVisionId) setActiveVisionId(null); setConfirmDeleteVisionId(null); Utils.haptic('success'); };
    
    const handleCardTouchStart = (goal, dt) => { const { canEdit } = Utils.dates.checkPermissions(goal, dt, now); isLongPress.current = false; if (!canEdit) return; pressTimer.current = setTimeout(() => { if (!isLongPress.current) { isLongPress.current = true; Utils.haptic('heavy'); setActionMenuGoal(goal); } }, 500); };
    const handleCardTouchEnd = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };
    const handleCardClick = (goal) => { if (!isLongPress.current) { setExpandedGoalId(prev => prev === goal.id ? null : goal.id); Utils.haptic('light'); } };
    const handleVisionTouchStart = (vision) => { isLongPress.current = false; pressTimer.current = setTimeout(() => { if (!isLongPress.current) { isLongPress.current = true; Utils.haptic('heavy'); setActionMenuVision(vision); } }, 500); };
    const handleVisionClick = (vision) => { if (!isLongPress.current) { Utils.haptic('light'); setActiveVisionId(activeVisionId === vision.id ? null : vision.id); } };

    const toggleGoal = (e, goalObj, dateTarget) => {
        const { canToggle } = Utils.dates.checkPermissions(goalObj, dateTarget, now); if (!canToggle) { Utils.haptic('error'); return; }
        const ds = dateTarget.toDateString(); const isDone = !!(goalObj.history && goalObj.history[ds]);
        setGoals(goals.map(g => {
            if (g.id !== goalObj.id) return g;
            const nh = { ...(g.history || {}) };
            if (!isDone) { nh[ds] = true; setTrustScore(prev => Math.min(100, prev + 1)); Utils.haptic('success'); } else { delete nh[ds]; setTrustScore(prev => Math.max(0, prev - 1)); Utils.haptic('light'); }
            return { ...g, history: nh, streak: isDone ? Math.max(0, (g.streak || 0) - 1) : (g.streak || 0) + 1 };
        }));
    };

    // === РЕНДЕР-ФУНКЦИИ ===
    const renderDayCards = (renderDate) => {
        const activeGoals = getActiveGoalsForDate(renderDate);
        if (activeGoals.length === 0) {
            if (renderDate.toDateString() !== new Date().toDateString()) return <p style={{textAlign:'center', marginTop:'30px', opacity: 0.5}}>Контракты не найдены.</p>;
            return (
                <div className="ai-tactics-container">
                    <Icons.Cpu style={{ width: '32px', height: '32px', stroke: 'var(--accent)', marginBottom: '15px' }} />
                    
                    {!isAiScanning && !aiResult && (
                        <React.Fragment>
                            <h3 className="ai-tactics-title" style={{ fontSize: '18px', marginBottom: '15px' }}>Назови цель, от которой ты бегаешь.</h3>
                            <input 
                                type="text" 
                                className="dark-input ai-tactics-input" 
                                placeholder="Например: Выучить английский, сменить работу..." 
                                value={aiQuery} 
                                onChange={e => setAiQuery(e.target.value)} 
                                onKeyDown={e => { if (e.key === 'Enter') handleAiSubmit(); }} 
                                onFocus={(e) => {
                                    const el = e.target;
                                    setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
                                }}
                            />
                            <button className="btn-ai-submit" onClick={handleAiSubmit}>Лишить себя выбора</button>
                        </React.Fragment>
                    )}
                    
                    {isAiScanning && (
                        <div className="ai-loading-scan">
                            <span>СИНТЕЗ...</span>
                            <div className="scan-line"></div>
                        </div>
                    )}
                    
                    {aiResult && !isAiScanning && (
                        <React.Fragment>
                            <div className="ai-contract-box" style={{ boxSizing: 'border-box', width: '100%' }}>
                                <div className="ai-contract-header">{aiResult.emoji} {aiResult.title}</div>
                                {(aiResult.steps || []).map((s, i) => ( 
                                    <div key={i} className="ai-contract-step">
                                        {s.title} 
                                        <span>({s.focusTime===0?'Мгновенно':`${s.focusTime} мин`} • {s.deadline && s.deadline !== '23:59' ? `Дедлайн ${s.deadline}` : (s.dayOffset===1?'Завтра':(s.dayOffset===2?'Послезавтра':'Сегодня'))})</span>
                                        {s.desc && <div style={{color:'var(--text-muted)', fontSize:'12px', marginTop:'4px'}}>{s.desc}</div>}
                                    </div> 
                                ))}
                            </div>
                            <button className="btn-ai-submit" style={{ marginTop: '15px' }} onClick={acceptAiContract}>Сделать неизбежным</button>
                            <button className="btn-return-task" style={{ width: '100%', marginTop: '5px' }} onClick={() => setAiResult(null)}>Сброс</button>
                        </React.Fragment>
                    )}
                </div>
            );
        }
        const dateKey = renderDate.toDateString(); 
        return activeGoals.map(g => {
            const isDone = !!(g.history && g.history[dateKey]); const isExpanded = expandedGoalId === g.id; 
            const { canToggle } = Utils.dates.checkPermissions(g, renderDate, now); 
            const timerData = Utils.dates.getTimerData(g, isDone, renderDate, now);
            const linkedVision = g.visionId ? visions.find(v => v.id == g.visionId) : null;
            const isTimerGoal = g.controlMethod === 'timer';
            let btnClass = `btn-complete ${isDone ? 'done' : ''} ${!canToggle ? 'disabled' : ''} ${isTimerGoal && !isDone ? 'timer-ready' : ''}`;
            return (
                <div key={g.id} className="card" onTouchStart={() => handleCardTouchStart(g, renderDate)} onTouchMove={handleCardTouchEnd} onTouchEnd={handleCardTouchEnd} onMouseDown={() => handleCardTouchStart(g, renderDate)} onMouseUp={handleCardTouchEnd} onClick={() => handleCardClick(g)} style={{ opacity: isDone ? 0.6 : 1 }}>
                    <div className="goal-info">
                        {linkedVision && <div className="vision-badge">{linkedVision.emoji} {linkedVision.title}</div>}
                        <div className="goal-title" style={{ textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--text-muted)' : 'var(--text-main)' }}>{g.title}</div>
                        <div className="stats-row">
                            {g.type !== 'once' && <span className="badge">{g.streak || 0} 🔥</span>}
                            {g.type === 'habit' && <span className="badge">∞</span>}
                            {g.type === 'sprint' && <span className="badge">{Math.max(0, parseInt(g.duration || 0) - (g.streak || 0))} ⏳</span>}
                            <span className={timerData.className} style={timerData.style}>⏱ {timerData.text}</span>
                        </div>
                        <div className={`goal-desc-wrapper ${isExpanded ? 'expanded' : ''}`} style={{ transitionDuration: `${Math.min(0.8, Math.max(0.2, (g.description||'').length*0.002))}s` }}>
                            <div className="goal-desc-inner"><div className="goal-desc">{g.description || 'Нет описания.'}</div></div>
                        </div>
                    </div>
                    <button className={btnClass} onClick={(e) => { e.stopPropagation(); if (!canToggle) { Utils.haptic('error'); return; } if (!isDone && isTimerGoal) startFocusSession(g, renderDate); else toggleGoal(e, g, renderDate); }}>
                        {isDone ? <Icons.Check /> : (isTimerGoal ? <Icons.Play style={{marginLeft:'3px'}} /> : <Icons.Check />)}
                    </button>
                </div>
            );
        });
    };

    const renderHomeTab = () => {
        const activeGoalsToday = getActiveGoalsForDate(currentDate);
        const loadCount = activeGoalsToday.length;
        return (
            <React.Fragment>
                <div className="daily-load-container">
                    <div className="load-header"><span className="load-title">Нагрузка дня</span><span className="load-count">{loadCount} {loadCount === 1 ? 'задача' : (loadCount > 1 && loadCount < 5) ? 'задачи' : 'задач'}</span></div>
                    <div className="load-bar">
                        {[1, 2, 3, 4, 5, 6].map(i => {
                            let fillClass = ''; if (loadCount > 0 && (loadCount >= i || (i === 6 && loadCount >= 6))) { if (loadCount <= 3) fillClass = 'safe'; else if (loadCount <= 5) fillClass = 'warning'; else fillClass = 'danger'; }
                            return <div key={i} className={`load-segment ${fillClass}`}></div>;
                        })}
                    </div>
                </div>

                {visions.length > 0 && (
                    <div className="visions-scroll-track">
                        {visions.map(v => {
                            const linkedGoals = goals.filter(g => g.visionId == v.id);
                            const totalStreak = linkedGoals.reduce((sum, g) => sum + (g.streak || 0), 0);
                            let totalDone = 0; linkedGoals.forEach(g => { if(g.history) totalDone += Object.keys(g.history).length; });
                            const isActive = activeVisionId === v.id;
                            return (
                                <div key={v.id} className={`vision-card ${isActive ? 'active' : ''}`} onTouchStart={() => handleVisionTouchStart(v)} onTouchMove={handleCardTouchEnd} onTouchEnd={handleCardTouchEnd} onMouseDown={() => handleVisionTouchStart(v)} onMouseUp={handleCardTouchEnd} onClick={() => handleVisionClick(v)}>
                                    <div className="vision-card-header"><div className="vision-emoji-large">{v.emoji}</div>{isActive && <div className="vision-active-badge">Выбрано</div>}</div>
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
                        <button className="date-nav-btn" onClick={() => animateToDate(-1)}><Icons.ChevronLeft /></button><button className="date-nav-btn" onClick={() => animateToDate(1)}><Icons.ChevronRight /></button>
                    </div>
                    <div className="cards-track" style={{ transform: `translateX(calc(-100vw + ${offsetPx}px))`, transition: (isTransitioning && !isDragging.current) ? 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)' : 'none' }}>
                        {[-1, 0, 1].map(shift => {
                            const rD = Utils.dates.getOffsetDate(currentDate, shift);
                            return <div className="cards-pane" key={rD.toDateString()}><div className="date-display-row">{rD.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</div>{renderDayCards(rD)}</div>;
                        })}
                    </div>
                </div>
            </React.Fragment>
        );
    };

    const renderProgressTab = () => (
        <div className="timer-panel">
            <h3 style={{ textAlign: 'center', margin: '0 0 5px 0', fontSize: '20px' }}>Комната исполнения</h3>
            <div className="focus-goal-label">{activeFocusGoal ? activeFocusGoal.title : "Свободный фокус"}</div>
            {activeFocusGoal && activeFocusGoal.description && (
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '20px', lineHeight: '1.4', width: '100%', background: 'var(--bg-input)', padding: '15px', borderRadius: '16px', border: '1px solid var(--border-input)', boxSizing: 'border-box', maxHeight: '150px', overflowY: 'auto' }} className="custom-scrollbar">
                    {activeFocusGoal.description}
                </div>
            )}
            <div className="timer-display">{String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}</div>
            <div className="timer-controls">
                <button className="btn-timer-reset" onClick={() => { 
                    const iGT = activeFocusGoal && activeFocusGoal.focusTime ? (activeFocusGoal.focusTime * 60) : (25 * 60);
                    if (timeLeft < iGT && timeLeft > 0) { setIsTimerRunning(false); setShowGiveUpModal(true); Utils.haptic('heavy'); } else { resetTimer(); }
                }}><Icons.Refresh /></button>
                <button className="btn-timer-main" onClick={() => { 
                    if (isTimerRunning) { setIsTimerRunning(false); setShowGiveUpModal(true); Utils.haptic('heavy'); } else { setIsTimerRunning(true); Utils.haptic('light'); }
                }}>{isTimerRunning ? <Icons.Pause /> : <Icons.Play style={{marginLeft: '4px'}} />}</button>
                <div style={{ width: '48px' }}></div> 
            </div>
        </div>
    );

    const renderSocialTab = () => (
        <div className="stats-wrapper">
            <div className="stats-row-cards">
                <div className="stat-card"><div className="stat-value">{statsData.totalDone}</div><div className="stat-label">Задач завершено</div></div>
                <div className="stat-card"><div className="stat-value">{statsData.bestStreak} <span style={{fontSize:'18px'}}>🔥</span></div><div className="stat-label">Лучший стрик</div></div>
            </div>
            <div className="card" style={{ display: 'block', maxWidth: '360px', margin: '0 auto 12px auto' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '16px' }}>Активность за 7 дней</h3>
                <div className="bar-chart">
                    {statsData.last7Days.map(day => (
                        <div key={day.iso} className="bar-col"><div className="bar-track"><div className="bar-fill" style={{ height: `${(day.count / statsData.maxDaily) * 100}%` }}></div></div><div className="bar-label">{day.day}</div></div>
                    ))}
                </div>
            </div>
            <div className="card" style={{ display: 'block', maxWidth: '360px', margin: '0 auto 12px auto', padding: '20px' }} onClick={() => {Utils.haptic('light'); setIsHeatmapExpanded(!isHeatmapExpanded)}}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', textAlign: 'center' }}>Пульс ({isHeatmapExpanded ? '365' : '90'} дней)</h3>
                <div style={{ display: 'grid', gridTemplateRows: isHeatmapExpanded ? '1fr' : '0fr', transition: 'grid-template-rows 0.7s cubic-bezier(0.25, 1, 0.5, 1)' }}>
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-start', width: '100%', marginBottom: '6px' }}>
                            {statsData.heatmapDays.slice(0, -90).map(d => ( <div key={d.iso} className={`heatmap-cell level-${d.level}`} style={{ width: '13px', height: '13px', borderRadius: '50%', flexShrink: 0 }}></div> ))}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-start', width: '100%' }}>
                    {statsData.heatmapDays.slice(-90).map(d => ( <div key={d.iso} className={`heatmap-cell level-${d.level}`} style={{ width: '13px', height: '13px', borderRadius: '50%', flexShrink: 0 }}></div> ))}
                </div>
            </div>
        </div>
    );

    const renderSettingsTab = () => (
        <div className="card" style={{ display: 'block', maxWidth: '360px', margin: '0 auto' }}>
            <h3 style={{ textAlign: 'center', margin: '0 0 20px 0' }}>Настройки</h3>
            <div className="setting-row" style={{marginBottom: '20px'}}><span style={{fontWeight: 'bold', fontSize: '16px'}}>Тема</span><button className="theme-toggle-btn" onClick={toggleTheme}>{isLightTheme ? <Icons.Moon /> : <Icons.Sun />}</button></div>
            <hr className="divider" />
            <div className="setting-row" style={{marginBottom: '20px', cursor: 'pointer'}} onClick={() => { Utils.haptic('light'); setShowRulesModal(true); }}>
                <span style={{fontWeight: 'bold', fontSize: '16px', color: 'var(--accent)'}}>Кодекс Системы</span><Icons.Info style={{width: '24px', height: '24px', stroke: 'var(--accent)'}} />
            </div>
            <hr className="divider" />
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', margin: '15px 0 8px 0' }}>Тон ИИ:</label>
            <select className="custom-select dark-input" value={motivationTone} onChange={e => setMotivationTone(e.target.value)} style={{marginBottom: 0}}>
                <option value="stoic">Стоик</option><option value="toxic">Сержант</option>
            </select>
        </div>
    );

    // === ГЛАВНЫЙ РЕНДЕР ===
    if (!hasSignedContract) return <Onboarding onAccept={() => { Utils.storage.set('motivateMe_v20_contract', 'true'); setHasSignedContract(true); }} />;

    return (
        <React.Fragment>
            {showSplash && <div className="simple-splash-overlay"><img src="image_0.png" className="splash-logo" /><h1 className="splash-title">MotivateMe</h1></div>}
            
            <div className="container">
                {/* Все модалки */}
                {isModalOpen && <div className="glass-backdrop" onClick={closeCreateModal}></div>}
                {showRulesModal && <RulesModal onClose={() => setShowRulesModal(false)} />}
                
                {showRageQuitAlert && (
                    <div className="glass-overlay-centered" style={{ zIndex: 10000 }}>
                        <div className="give-up-modal" style={{ border: '1px solid #ff3b30', boxShadow: '0 10px 40px rgba(255, 59, 48, 0.3)' }}>
                            <h2 className="give-up-title" style={{ color: '#ff3b30' }}>Побег зафиксирован</h2>
                            <p className="give-up-text">Вы прервали сессию, закрыв приложение. Это дезертирство.</p>
                            <div style={{ fontSize: '28px', fontWeight: '800', color: '#ff3b30', marginBottom: '25px' }}>-15% Рейтинга</div>
                            <button className="btn-continue-pulsing" onClick={() => { setShowRageQuitAlert(false); Utils.haptic('heavy'); }} style={{ background: '#ff3b30', boxShadow: 'none' }}>Я принимаю последствия</button>
                        </div>
                    </div>
                )}

                {showLowTrustAlert && (
                    <div className="glass-overlay-centered" style={{ zIndex: 10000 }}>
                        <div className="give-up-modal" style={{ border: '1px solid #ff3b30', boxShadow: '0 10px 40px rgba(255, 59, 48, 0.3)' }}>
                            <h2 className="give-up-title" style={{ color: '#ff3b30' }}>Доступ закрыт</h2>
                            <p className="give-up-text">Твой Кредит Доверия упал ниже 50%. Ты потерял право редактировать цели.</p>
                            <button className="btn-continue-pulsing" onClick={() => { setShowLowTrustAlert(false); Utils.haptic('light'); }} style={{ background: '#ff3b30', boxShadow: 'none' }}>Понял</button>
                        </div>
                    </div>
                )}

                {showGiveUpModal && (
                    <div className="glass-overlay-centered" style={{ zIndex: 9999 }}>
                        <div className="give-up-modal">
                            <h2 className="give-up-title">Решил сдаться?</h2>
                            <p className="give-up-text">Цели сами себя не достигнут.</p>
                            <div className="give-up-actions">
                                <button className="btn-continue-pulsing" onClick={() => { setShowGiveUpModal(false); setIsTimerRunning(true); Utils.haptic('success'); }}>Продолжить</button>
                                <button className="btn-give-up-weak" onClick={() => { setShowGiveUpModal(false); setPenaltyInput(''); setShowPenaltyModal(true); Utils.haptic('light'); }}>Сдаюсь (-5%)</button>
                            </div>
                        </div>
                    </div>
                )}

                {showPenaltyModal && (
                    <div className="glass-overlay-centered" style={{ zIndex: 9999 }}>
                        <div className="penalty-modal">
                            <h2 className="penalty-title">Цена слабости</h2>
                            <p className="penalty-text">Введи фразу вручную (копипаст отключен).</p>
                            <div className="penalty-phrase-box">{PENALTY_PHRASE}</div>
                            <textarea className="dark-input penalty-textarea custom-scrollbar" value={penaltyInput} onChange={(e) => setPenaltyInput(e.target.value)} onPaste={(e) => { e.preventDefault(); Utils.haptic('error'); }} placeholder="Писать тут..." autoComplete="off" spellCheck="false" />
                            <div className="penalty-actions">
                                <button className={`btn-confirm-penalty ${penaltyInput === PENALTY_PHRASE ? 'active' : 'disabled'}`} onClick={() => { 
                                    if (penaltyInput === PENALTY_PHRASE) { Utils.storage.remove('motivateMe_v20_rageQuit'); setShowPenaltyModal(false); resetTimer(); setTrustScore(prev => Math.max(0, prev - 5)); Utils.haptic('heavy'); } else { Utils.haptic('error'); }
                                }}>Подтвердить (-5%)</button>
                                <button className="btn-return-task" onClick={() => { setShowPenaltyModal(false); setIsTimerRunning(true); Utils.haptic('success'); }}>Вернуться</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Меню действий */}
                {actionMenuGoal && (
                    <div className="glass-overlay-centered" onClick={() => setActionMenuGoal(null)}>
                        <div className="action-buttons-container" onClick={e => e.stopPropagation()}>
                            <button className="glass-btn-circle edit" onClick={() => { 
                                if (trustScore < 50) { setActionMenuGoal(null); setShowLowTrustAlert(true); Utils.haptic('error'); } 
                                else { setForm({...actionMenuGoal}); setEditingId(actionMenuGoal.id); setCreateMode('micro'); setActionMenuGoal(null); setCreateStep('text'); setIsModalOpen(true); }
                            }}><Icons.Pencil /></button>
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

                {/* Панель создания */}
                {isModalOpen && (
                    <div className="create-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                        {!editingId && createStep === 'text' && (
                            <div className="mode-switcher">
                                <div className={`mode-btn ${createMode === 'micro' ? 'active' : ''}`} onClick={() => {Utils.haptic('light'); setCreateMode('micro');}}>Задача</div>
                                <div className={`mode-btn ${createMode === 'macro' ? 'active' : ''}`} onClick={() => {Utils.haptic('light'); setCreateMode('macro');}}>Видение</div>
                            </div>
                        )}
                        <h3 style={{margin: '0 0 15px 0', textAlign: 'center', fontSize: '18px'}}>{editingId ? 'Редактировать' : (createMode === 'macro' ? 'Новое Видение' : 'Новая цель')}</h3>
                        {createMode === 'macro' ? (
                            <div className="panel-step">
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input type="text" maxLength="2" value={visionForm.emoji} onChange={e => setVisionForm({...visionForm, emoji: e.target.value})} className="dark-input" style={{ width: '60px', textAlign: 'center', fontSize: '20px', padding: '14px 0' }} />
                                    <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                                        <input placeholder="Глобальная цель" value={visionForm.title} onChange={e => setVisionForm({...visionForm, title: e.target.value})} className="dark-input" style={{ width: '100%', marginBottom: 0, paddingRight: visionForm.title.trim() ? '45px' : '14px' }} />
                                        {visionForm.title.trim() && !editingId && (
                                            <div onClick={generateVisionDetailsWithAI} style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', opacity: isGeneratingVision ? 0.5 : 1}}>
                                                {isGeneratingVision ? <div className="scan-line" style={{width: '20px'}}></div> : <Icons.Sparkles style={{width: '20px', height: '20px', stroke: 'var(--accent)'}} />}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <textarea placeholder="Почему для тебя это важно?" value={visionForm.description} onChange={e => setVisionForm({...visionForm, description: e.target.value})} className="dark-input custom-scrollbar" style={{ minHeight: '80px', resize: 'none', marginTop: '15px' }} />
                            </div>
                        ) : (
                            <React.Fragment>
                                {createStep === 'text' && (
                                    <div className="panel-step">
                                        <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                                            <input placeholder="Название (кратко)" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="dark-input" style={{paddingRight: form.title.trim() ? '45px' : '14px'}} />
                                            {form.title.trim() && (
                                                <div onClick={generateGoalDetailsWithAI} style={{position: 'absolute', right: '10px', top: '12px', cursor: 'pointer', opacity: isGeneratingGoal ? 0.5 : 1}}>
                                                    {isGeneratingGoal ? <div className="scan-line" style={{width: '20px'}}></div> : <Icons.Sparkles style={{width: '20px', height: '20px', stroke: 'var(--accent)'}} />}
                                                </div>
                                            )}
                                        </div>
                                        {visions.length > 0 && (
                                            <select className="custom-select dark-input" value={form.visionId || ''} onChange={e => setForm({...form, visionId: e.target.value})}>
                                                <option value="">Без глобальной цели</option>
                                                {visions.map(v => <option key={v.id} value={v.id}>{v.emoji} {v.title}</option>)}
                                            </select>
                                        )}
                                        <textarea placeholder="Опиши суть..." value={form.description} onChange={e => { setForm({...form, description: e.target.value}); e.target.style.height='auto'; e.target.style.height=Math.min(e.target.scrollHeight, 140)+'px';}} className="dark-input custom-scrollbar" style={{ minHeight: '60px', maxHeight: '140px', resize: 'none' }} />
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', margin: '15px 0 0 0', width: '100%', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', boxSizing: 'border-box' }}>
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 12px 0', lineHeight: '1.4', textAlign: 'left', width: '100%' }}>Отметка тапом отключена. Засчитывается только после таймера.</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                <span style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--text-main)' }}>Требует фокуса</span>
                                                <label className="ios-switch" style={{ flexShrink: 0, margin: 0 }}><input type="checkbox" checked={form.controlMethod === 'timer'} onChange={e => setForm({...form, controlMethod: e.target.checked ? 'timer' : 'check'})} /><span className="slider"></span></label>
                                            </div>
                                            {form.controlMethod === 'timer' && (
                                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-input)', animation: 'fadeIn 0.3s' }}>
                                                    <div style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 'bold', marginBottom: '12px', textAlign: 'left' }}>Время (минут):</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px', width: '100%' }}>
                                                        <button className="glass-btn-circle" style={{ width: '48px', height: '48px', minWidth: '48px', margin: 0 }} onClick={(e) => adjustFocusTime(-5, e)}><Icons.Minus style={{ stroke: 'var(--text-main)' }} /></button>
                                                        <input type="number" className="dark-input" style={{ flex: 1, margin: 0, textAlign: 'center', fontSize: '24px', fontWeight: '800', padding: '12px', letterSpacing: '1px' }} value={form.focusTime === '' ? '' : form.focusTime} onFocus={() => setForm({...form, focusTime: ''})} onBlur={() => { if (form.focusTime === '' || form.focusTime <= 0) setForm({...form, focusTime: 25}); }} onChange={e => setForm({...form, focusTime: parseInt(e.target.value) || ''})} />
                                                        <button className="glass-btn-circle" style={{ width: '48px', height: '48px', minWidth: '48px', margin: 0 }} onClick={(e) => adjustFocusTime(5, e)}><Icons.Plus style={{ stroke: 'var(--text-main)' }} /></button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {createStep === 'time' && (
                                    <div className="panel-step">
                                        <div className="radio-group">
                                            <div className={`radio-btn ${(form.type || 'habit') === 'once' ? 'active' : ''}`} onClick={() => {Utils.haptic('light'); setForm({...form, type: 'once'})}}><Icons.Target active={(form.type || 'once') === 'once'} /></div>
                                            <div className={`radio-btn ${(form.type || 'habit') === 'habit' ? 'active' : ''}`} onClick={() => {Utils.haptic('light'); setForm({...form, type: 'habit'})}}><Icons.Infinity active={(form.type || 'habit') === 'habit'} /></div>
                                            <div className={`radio-btn ${(form.type || 'habit') === 'sprint' ? 'active' : ''}`} onClick={() => {Utils.haptic('light'); setForm({...form, type: 'sprint'})}}><Icons.Sprint active={(form.type || 'sprint') === 'sprint'} /></div>
                                        </div>
                                        <div className="info-box"><div className="info-title">{Utils.typeInfo[form.type || 'habit'].title}</div><div className="info-desc">{Utils.typeInfo[form.type || 'habit'].desc}</div></div>
                                        {(form.type || 'habit') === 'habit' && (
                                            <div style={{marginBottom: '20px'}}>
                                                <div className="weekdays-selector">
                                                    {Utils.weekDaysArr.map(d => ( <div key={d.val} className={`weekday-btn ${form.weekDays && form.weekDays.includes(d.val) ? 'active' : ''}`} onClick={() => toggleWeekDay(d.val)}>{d.label}</div> ))}
                                                </div>
                                            </div>
                                        )}
                                        {(form.type || 'habit') === 'sprint' && (<input type="number" placeholder="Дней соблюдать?" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="dark-input" style={{textAlign: 'center'}} />)}
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
                                                    <TimeWheel items={Utils.monthNames} value={startMonth} onChange={setStartMonth} width="85px" />
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
                                                <label className="ios-switch"><input type="checkbox" checked={form.notifications !== false} onChange={e => setForm({...form, notifications: e.target.checked})} /><span className="slider"></span></label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        )}
                    </div>
                )}

                {/* Шапка */}
                <div className="header-notcoin-style">
                    <div className="header-left"><img src="image_0.png" className="m-logo-small" /><h1 className="main-title-small">MotivateMe</h1></div>
                    <div className={`trust-badge ${trustScore < 50 ? 'danger' : trustScore < 80 ? 'warning' : 'safe'}`}>
                        <Icons.Shield style={{width: '16px', marginRight: '4px'}} />{trustScore.toFixed(0)}%
                    </div>
                </div>

                {/* Вкладки */}
                {activeTab === 'home' && renderHomeTab()}
                {activeTab === 'progress' && renderProgressTab()}
                {activeTab === 'social' && renderSocialTab()}
                {activeTab === 'settings' && renderSettingsTab()}

                {/* Нижний бар */}
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
