// ==========================================
// ФАЙЛ: utils.js
// Описание: Глобальные константы, хранилище, даты и API ИИ
// ==========================================

window.Utils = {
    // 1. Константы
    monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    weekDaysArr: [ { val: 1, label: 'Пн' }, { val: 2, label: 'Вт' }, { val: 3, label: 'Ср' }, { val: 4, label: 'Чт' }, { val: 5, label: 'Пт' }, { val: 6, label: 'Сб' }, { val: 0, label: 'Вс' } ],
    typeInfo: { 
        once: { title: "Разовая", desc: "Сделать один раз." }, 
        habit: { title: "Привычка", desc: "Регулярная задача." }, 
        sprint: { title: "Спринт", desc: "Держись без срывов." } 
    },

    // 2. Безопасная работа с LocalStorage
    storage: {
        get: (key, defaultValue) => {
            try {
                const saved = localStorage.getItem(key);
                if (saved !== null) {
                    if (saved === 'true') return true;
                    if (saved === 'false') return false;
                    if (!isNaN(saved) && !saved.startsWith('{') && !saved.startsWith('[')) return parseFloat(saved);
                    return JSON.parse(saved);
                }
                return defaultValue;
            } catch (e) {
                console.warn(`Storage read error [${key}]:`, e);
                return defaultValue;
            }
        },
        set: (key, value) => {
            try {
                const toSave = typeof value === 'object' ? JSON.stringify(value) : String(value);
                localStorage.setItem(key, toSave);
            } catch (e) {
                console.warn(`Storage write error [${key}]:`, e);
            }
        },
        remove: (key) => {
            try { localStorage.removeItem(key); } catch (e) {}
        }
    },

    // 3. Вычисления дат и разрешений
    dates: {
        getOffsetDate: (baseDate, days) => { 
            const d = new Date(baseDate); 
            d.setDate(d.getDate() + days); 
            return d; 
        },
        checkPermissions: (goal, checkDate, nowTime) => {
            try {
                const viewD = new Date(checkDate); viewD.setHours(0, 0, 0, 0); 
                const today = new Date(nowTime); today.setHours(0, 0, 0, 0);
                const isPast = viewD < today; 
                const isToday = viewD.getTime() === today.getTime(); 
                let isDeadlinePassed = isPast;
                
                if (isToday) { 
                    const [h, m] = (goal.deadline || '23:59').split(':'); 
                    const limit = new Date(nowTime); limit.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0); 
                    if (nowTime > limit) isDeadlinePassed = true; 
                }
                return { canToggle: isToday && !isDeadlinePassed, canEdit: !isPast && !isDeadlinePassed };
            } catch(e) { return { canToggle: false, canEdit: false }; }
        },
        getTimerData: (goal, isDone, checkDate, nowTime) => {
            try {
                const view = new Date(checkDate); view.setHours(0, 0, 0, 0); 
                const today = new Date(nowTime); today.setHours(0, 0, 0, 0);
                const sd = goal.deadline || '23:59';
                
                if (view > today) return { text: `до ${sd}`, className: 'badge', style: {color: 'var(--text-main)'} };
                if (view < today) return { text: "00:00:00", className: 'badge failed-timer', style: {} };
                
                const [h, m] = sd.split(':'); 
                const limit = new Date(nowTime); limit.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0); 
                const diff = limit - nowTime; 
                
                if (diff <= 0) return { text: "00:00:00", className: 'badge failed-timer', style: {} };
                return { 
                    text: `${String(Math.floor(diff/3600000)).padStart(2,'0')}:${String(Math.floor((diff%3600000)/60000)).padStart(2,'0')}:${String(Math.floor((diff%60000)/1000)).padStart(2,'0')}`, 
                    className: `badge ${!isDone && diff < 3600000 ? 'urgent-timer' : ''}`, style: {} 
                };
            } catch(e) { return { text: "00:00", className: 'badge failed-timer', style: {} }; }
        }
    },

// 4. API Gemini
    ai: {
        API_KEY_PART_1: 'AQ.Ab8RN6LcNaOh3uvU83',
        API_KEY_PART_2: 'tg9LAp1oCGl0zfhC4H8-yao9HPhx1SPg',
        async fetchJSON(promptText, systemPrompt, temp = 0.2) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.API_KEY_PART_1}${this.API_KEY_PART_2}`;
            const response = await fetch(url, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ 
                    contents: [{ parts: [{ text: promptText }] }], 
                    systemInstruction: { parts: [{ text: systemPrompt }] }, 
                    generationConfig: { temperature: temp } 
                }) 
            });
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            return JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim());
        }
    },

    // 5. Виброотклик (Haptic Feedback)
    haptic: (type) => {
        try {
            if (window.Telegram?.WebApp?.HapticFeedback) {
                if (type === 'success') { 
                    window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy'); 
                    setTimeout(() => window.Telegram.WebApp.HapticFeedback.impactOccurred('rigid'), 150); 
                }
                else if (type === 'error') { 
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('error'); 
                    setTimeout(() => window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy'), 50); 
                }
                else window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
            }
        } catch(e) {}
    }
};
