// ==========================================
// ФАЙЛ: icons.jsx
// ==========================================

window.EntityIcon = (props) => (
    <svg viewBox="0 0 200 200" className="entity-svg" {...props}>
        <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 12" className="entity-ring-slow" />
        <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        <path d="M 60,100 L 140,100" stroke="var(--accent)" strokeWidth="4" className="entity-eye" />
        <path d="M 80,110 L 100,140 L 120,110" fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.6" />
        <circle cx="100" cy="100" r="40" fill="none" stroke="var(--accent)" strokeWidth="1" strokeDasharray="10 5" className="entity-ring-fast" />
        <line x1="100" y1="0" x2="100" y2="15" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        <line x1="100" y1="185" x2="100" y2="200" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        <line x1="0" y1="100" x2="15" y2="100" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
        <line x1="185" y1="100" x2="200" y2="100" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
    </svg>
);

window.Icons = {
    Goals: (props) => ( <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} {...props}><circle cx="12" cy="12" r="9" /><line x1="12" y1="2" x2="12" y2="5" strokeLinecap="round"/><line x1="12" y1="19" x2="12" y2="22" strokeLinecap="round"/><line x1="2" y1="12" x2="5" y2="12" strokeLinecap="round"/><line x1="19" y1="12" x2="22" y2="12" strokeLinecap="round"/><circle cx="12" cy="12" r="0.5" fill={props.active ? "var(--accent)" : "var(--icon-color)"} /></svg> ),
    Focus: (props) => ( <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} {...props}><path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" /></svg> ),
    Add: (props) => ( <svg viewBox="0 0 24 24" className="tab-add-icon" {...props}><line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" /><line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" /></svg> ),
    Stats: (props) => ( <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} {...props}><circle cx="4" cy="17" r="1.5" fill={props.active ? "var(--accent)" : "var(--icon-color)"} /><circle cx="12" cy="7" r="1.5" fill={props.active ? "var(--accent)" : "var(--icon-color)"} /><circle cx="20" cy="14" r="1.5" fill={props.active ? "var(--accent)" : "var(--icon-color)"} /><path d="M5.5 16l5-7.5M13.5 8l5 4.5" strokeLinecap="round" /></svg> ),
    Settings: (props) => ( <svg viewBox="0 0 24 24" className="tab-icon" fill="none" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> ),
    ChevronLeft: () => <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>,
    ChevronRight: () => <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>,
    Sun: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    Save: (props) => <svg viewBox="0 0 24 24" className="tab-icon" stroke="#000" {...props}><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Target: (props) => <svg viewBox="0 0 24 24" fill="none" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill={props.active ? "var(--accent)" : "var(--icon-color)"}/></svg>,
    Infinity: (props) => <svg viewBox="0 0 24 24" fill="none" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4z"/></svg>,
    Sprint: (props) => <svg viewBox="0 0 24 24" fill="none" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    Play: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    Pause: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
    Refresh: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>,
    Pencil: () => <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
    Trash: () => <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
    Check: () => <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>,
    Close: () => <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    Text: (props) => <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} {...props}><line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round"/><line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round"/><line x1="4" y1="18" x2="14" y2="18" strokeLinecap="round"/></svg>,
    Clock: (props) => <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Bell: (props) => <svg viewBox="0 0 24 24" className="tab-icon" stroke={props.active ? "var(--accent)" : "var(--icon-color)"} {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Plus: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    Minus: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    Shield: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    Cpu: (props) => ( <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg> ),
    Info: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    Sparkles: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3v3m0 12v3M3 12h3m12 0h3M6.3 6.3l2.1 2.1m7.2 7.2l2.1 2.1M6.3 17.7l2.1-2.1m7.2-7.2l2.1-2.1" /><circle cx="12" cy="12" r="3" /></svg>
};
