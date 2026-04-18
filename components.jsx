// ==========================================
// ФАЙЛ: components.jsx
// ==========================================
const { EntityIcon } = window;
const { useEffect, useRef } = React;

window.Onboarding = ({ onAccept }) => {
    return (
        <div className="onboarding-screen">
            <EntityIcon />
            <div className="onboarding-content">
                <div className="onboarding-title">Система инициализирована</div>
                <div className="onboarding-text">
                    Я не буду тебя мотивировать. Я не буду в тебя верить. Мне плевать на твои оправдания. Я здесь только для того, чтобы вести счет.
                </div>
                <ul className="onboarding-list">
                    <li><strong>Кредит доверия:</strong> 100%. Выполняешь — растет.</li>
                    <li><strong>Цена слабости:</strong> Сдался во время таймера? Штраф -5%.</li>
                    <li><strong>Дезертирство:</strong> Закрыл приложение во время работы таймера? Штраф -15%.</li>
                    <li><strong>Блокировка:</strong> Уронишь рейтинг ниже 50% — я заблокирую тебе управление целями.</li>
                </ul>
                <div className="onboarding-text" style={{ fontStyle: 'italic', opacity: 0.8, fontSize: '13px', textAlign: 'center' }}>
                    Твой провал не расстроит меня. Твой успех не сделает меня счастливым. Выбор за тобой.
                </div>
                <button className="btn-continue-pulsing" onClick={() => {
                    if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
                    onAccept();
                }}>
                    Я принимаю условия
                </button>
            </div>
        </div>
    );
};

window.RulesModal = ({ onClose }) => {
    return (
        <div className="glass-overlay-centered" style={{ zIndex: 9999 }}>
            <div className="give-up-modal" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <h2 className="give-up-title" style={{color: 'var(--accent)'}}>Кодекс Системы</h2>
                <div className="onboarding-text" style={{textAlign: 'left', marginTop: '15px'}}>
                    <p>Система не прощает слабость. Каждое твое действие имеет цену.</p>
                    <ul className="onboarding-list" style={{borderLeftColor: 'var(--border-color)', margin: '15px 0'}}>
                        <li><strong>Кредит доверия:</strong> Начинается со 100%. Выполняешь задачи в срок — получаешь +1%.</li>
                        <li><strong>Сдача:</strong> Отмена идущего таймера фокуса снимает -5%.</li>
                        <li><strong>Дезертирство:</strong> Закрытие приложения во время таймера расценивается как побег. Штраф -15%.</li>
                        <li><strong>Штраф за ложь:</strong> Игнорирование задачи в течение дня снижает доверие на -1%.</li>
                        <li><strong>Локаут:</strong> Если Кредит Доверия падает ниже 50%, ты теряешь право редактировать или удалять свои цели.</li>
                    </ul>
                </div>
                <button className="btn-continue-pulsing" onClick={() => { 
                    if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                    onClose(); 
                }}>
                    Понятно
                </button>
            </div>
        </div>
    );
};

window.TimeWheel = ({ items, value, onChange, width }) => {
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
            {items.map(item => (
                <div key={item} className={`wheel-item ${item === value ? 'selected' : ''}`}>
                    <span>{item}</span>
                </div>
            ))}
            <div className="wheel-spacer"></div>
        </div>
    );
};
