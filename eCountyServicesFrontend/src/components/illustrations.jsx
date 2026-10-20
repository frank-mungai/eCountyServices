export function HeroIllustration({ className = "w-full h-auto" }) {
  return (
    <svg viewBox="0 0 560 420" className={className} role="img" aria-label="Illustration of a county street with a town hall, water tower, streetlights and a garbage truck">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3f4e6"/>
          <stop offset="1" stopColor="#fff6df"/>
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd54a" stopOpacity="0.85"/>
          <stop offset="1" stopColor="#ffd54a" stopOpacity="0"/>
        </radialGradient>
        <clipPath id="heroClip"><rect width="560" height="420" rx="28"/></clipPath>
      </defs>
      <g clipPath="url(#heroClip)">
        <rect width="560" height="420" fill="url(#sky)"/>
        <circle cx="455" cy="85" r="64" fill="#ffd54a" opacity="0.22"/>
        <circle cx="455" cy="85" r="42" fill="#ffd54a" opacity="0.9"/>
        <g fill="#ffffff" opacity="0.9">
          <ellipse cx="120" cy="82" rx="42" ry="13"/>
          <ellipse cx="148" cy="72" rx="28" ry="13"/>
          <ellipse cx="300" cy="56" rx="36" ry="11"/>
          <ellipse cx="322" cy="48" rx="20" ry="9"/>
        </g>
        <path d="M0 262 C90 205 170 228 250 252 C330 276 410 196 560 246 L560 420 L0 420Z" fill="#a5d6a7"/>
        <path d="M0 300 C110 255 200 285 290 296 C380 306 470 262 560 292 L560 420 L0 420Z" fill="#66bb6a"/>

    
        <rect x="52" y="336" width="186" height="8" fill="#d9d9d0"/>
        <rect x="60" y="238" width="170" height="100" fill="#f7f7f2"/>
        <polygon points="50,238 145,188 240,238" fill="#e6e6df"/>
        <circle cx="145" cy="220" r="9" fill="#006600"/>
        <rect x="72" y="244" width="10" height="92" fill="#ffffff" stroke="#d9d9d0"/>
        <rect x="100" y="244" width="10" height="92" fill="#ffffff" stroke="#d9d9d0"/>
        <rect x="180" y="244" width="10" height="92" fill="#ffffff" stroke="#d9d9d0"/>
        <rect x="208" y="244" width="10" height="92" fill="#ffffff" stroke="#d9d9d0"/>
        <rect x="127" y="278" width="36" height="58" rx="3" fill="#006600"/>
        <rect x="143" y="280" width="2" height="56" fill="#004d00"/>
        <line x1="145" y1="188" x2="145" y2="148" stroke="#555555" strokeWidth="2"/>
        <rect x="145" y="148" width="32" height="5" fill="#111111"/>
        <rect x="145" y="153" width="32" height="5" fill="#bb0000"/>
        <rect x="145" y="158" width="32" height="5" fill="#006600"/>

    
        <path d="M292 252 L284 342 M338 252 L346 342 M298 292 L342 332 M334 292 L290 332" stroke="#5f6b73" strokeWidth="3" fill="none"/>
        <rect x="278" y="205" width="66" height="50" rx="12" fill="#4fc3f7"/>
        <path d="M274 208 L311 184 L348 208Z" fill="#0288d1"/>
        <path d="M311 214 C311 214 321 225 321 232 A10 10 0 0 1 301 232 C301 225 311 214 311 214 Z" fill="#ffffff"/>

    
        <path d="M416 167 L396 336 L462 336 L442 167Z" fill="#ffd54a" opacity="0.14"/>
        <circle cx="429" cy="172" r="54" fill="url(#glow)"/>
        <rect x="376" y="170" width="8" height="172" rx="3" fill="#3d3d3d"/>
        <path d="M380 176 Q380 160 400 160 L426 160" stroke="#3d3d3d" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <rect x="416" y="158" width="26" height="9" rx="4" fill="#ffd54a"/>

    
        <rect x="505" y="192" width="8" height="150" rx="3" fill="#3d3d3d"/>
        <path d="M509 196 Q509 183 491 183 L472 183" stroke="#3d3d3d" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <rect x="460" y="181" width="26" height="9" rx="4" fill="#9e9e9e"/>
        <path d="M473 162 C473 162 489 146 489 136 A16 16 0 0 0 457 136 C457 146 473 162 473 162Z" fill="#bb0000"/>
        <rect x="471.5" y="127" width="3" height="11" rx="1.5" fill="#ffffff"/>
        <circle cx="473" cy="143" r="2" fill="#ffffff"/>

    
        <g fill="#388e3c">
          <circle cx="22" cy="318" r="16"/><circle cx="40" cy="324" r="12"/>
          <circle cx="262" cy="326" r="11"/><circle cx="545" cy="322" r="15"/>
        </g>

    
        <rect y="342" width="560" height="78" fill="#2b2b2b"/>
        <rect y="334" width="560" height="9" fill="#cfd8dc"/>
        <line x1="0" y1="408" x2="560" y2="408" stroke="#ffffff" strokeWidth="4" strokeDasharray="26 18" opacity="0.85"/>

    
        <rect x="296" y="352" width="74" height="34" rx="5" fill="#006600"/>
        <rect x="302" y="358" width="62" height="5" rx="2" fill="#004d00"/>
        <path d="M370 362 L392 362 L404 374 L404 386 L370 386Z" fill="#bb0000"/>
        <path d="M384 366 L392 366 L398 374 L384 374Z" fill="#b3e5fc"/>
        <circle cx="318" cy="388" r="9" fill="#111111"/><circle cx="318" cy="388" r="4" fill="#bdbdbd"/>
        <circle cx="388" cy="388" r="9" fill="#111111"/><circle cx="388" cy="388" r="4" fill="#bdbdbd"/>
      </g>
    </svg>
  );
}

const paths = {
  STREETLIGHT: (
    <>
      <path d="M9 21h6M12 21V7a3 3 0 0 1 3-3h3" />
      <path d="M16 8h4l-1 3h-2z" />
    </>
  ),
  WATER_ISSUE: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />,
  GARBAGE_COLLECTION: <path d="M4 7h16M10 7V4h4v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />,
  ROAD_DAMAGE: <path d="M8 3 4 21M16 3l4 18M12 4v3M12 10v4M12 17v3" />,
  SEWAGE: <path d="M4 8h16M4 12h16M4 16h16M8 8v8M16 8v8" />,
  OTHER: (
    <>
      <circle cx="6" cy="12" r="1.4" fill="currentColor" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      <circle cx="18" cy="12" r="1.4" fill="currentColor" />
    </>
  ),
  PIN: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  CLOCK: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  CHECK: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 3 3 5-6" />
    </>
  ),
  ARROW: <path d="M5 12h14M13 6l6 6-6 6" />,
};

export function Icon({ name, className = "h-6 w-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export function FlagStripe({ className = "h-1.5 w-40" }) {
  return (
    <div className={`flex overflow-hidden rounded-full ${className}`}>
      <span className="flex-1 bg-black" />
      <span className="flex-1 bg-flag-red" />
      <span className="flex-1 bg-brand" />
    </div>
  );
}
