export function GrcNetworkDiagram() {
  return (
    <svg
      viewBox="0 0 720 420"
      role="img"
      aria-label="Animated GRC service network connecting governance, risk, compliance, and assurance"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="360" cy="210" r="175" fill="#1b201e" />
      <circle cx="360" cy="210" r="145" fill="none" stroke="#526257" strokeOpacity=".5" strokeDasharray="2 9" />
      <circle cx="360" cy="210" r="112" fill="none" stroke="#48564d" strokeOpacity=".34" />

      <g fill="none" stroke="#596b5d" strokeOpacity=".72" strokeWidth="1.5">
        <path d="M178 91 C248 91 257 154 303 183" />
        <path d="M542 91 C472 91 463 154 417 183" />
        <path d="M178 329 C248 329 257 266 303 237" />
        <path d="M542 329 C472 329 463 266 417 237" />
      </g>
      <g fill="#b2c2a9">
        <circle r="3"><animateMotion dur="3.5s" repeatCount="indefinite" path="M178 91 C248 91 257 154 303 183" /></circle>
        <circle r="3"><animateMotion dur="4.1s" repeatCount="indefinite" path="M542 91 C472 91 463 154 417 183" /></circle>
        <circle r="3"><animateMotion dur="4.6s" repeatCount="indefinite" path="M178 329 C248 329 257 266 303 237" /></circle>
        <circle r="3"><animateMotion dur="3.9s" repeatCount="indefinite" path="M542 329 C472 329 463 266 417 237" /></circle>
      </g>

      <g>
        <circle cx="360" cy="210" r="67" fill="#242a26" stroke="#889f8e" strokeOpacity=".78" />
        <circle cx="360" cy="210" r="78" fill="none" stroke="#889f8e" strokeOpacity=".34">
          <animate attributeName="r" values="74;82;74" dur="4s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values=".32;.08;.32" dur="4s" repeatCount="indefinite" />
        </circle>
        <path d="M360 165 393 178v27c0 24-14 39-33 49-19-10-33-25-33-49v-27l33-13Z" fill="#272d29" stroke="#a8b7a2" strokeWidth="1.5" />
        <path d="m346 207 10 10 20-23" fill="none" stroke="#bac8b2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <text x="360" y="277" fill="#dfe7df" textAnchor="middle" fontSize="11" fontWeight="700" letterSpacing="2">AEGIS GRC</text>
      </g>

      <g fontFamily="Inter, ui-sans-serif, system-ui, sans-serif">
        <g transform="translate(40 56)">
          <rect width="156" height="70" rx="14" fill="#202522" stroke="#39413d" />
          <circle cx="24" cy="25" r="11" fill="#2b352f" /><path d="M24 18v14m-6-7h12" stroke="#afc2b4" strokeWidth="1.5" />
          <text x="44" y="27" fill="#e6e2d7" fontSize="12" fontWeight="650">Governance</text>
          <text x="44" y="45" fill="#a49f91" fontSize="9">Policies · obligations · owners</text>
          <circle cx="140" cy="55" r="2.5" fill="#a7aa8f"><animate attributeName="opacity" values="1;.35;1" dur="2s" repeatCount="indefinite" /></circle>
        </g>
        <g transform="translate(524 56)">
          <rect width="156" height="70" rx="14" fill="#202522" stroke="#39413d" />
          <circle cx="24" cy="25" r="11" fill="#2b352f" /><path d="M24 17 31 20v6c0 5-3 8-7 10-4-2-7-5-7-10v-6l7-3Z" fill="none" stroke="#a8b7a2" strokeWidth="1.4" />
          <text x="44" y="27" fill="#e6e2d7" fontSize="12" fontWeight="650">Risk</text>
          <text x="44" y="45" fill="#a49f91" fontSize="9">Assess · treat · monitor</text>
          <circle cx="140" cy="55" r="2.5" fill="#a8b7a2"><animate attributeName="opacity" values="1;.35;1" dur="2.4s" repeatCount="indefinite" /></circle>
        </g>
        <g transform="translate(40 294)">
          <rect width="156" height="70" rx="14" fill="#202522" stroke="#39413d" />
          <circle cx="24" cy="25" r="11" fill="#29342d" /><path d="m18 25 4 4 8-9" fill="none" stroke="#a7aa8f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <text x="44" y="27" fill="#e6e2d7" fontSize="12" fontWeight="650">Compliance</text>
          <text x="44" y="45" fill="#a49f91" fontSize="9">Frameworks · controls · tests</text>
          <circle cx="140" cy="55" r="2.5" fill="#a7aa8f"><animate attributeName="opacity" values="1;.35;1" dur="2.8s" repeatCount="indefinite" /></circle>
        </g>
        <g transform="translate(524 294)">
          <rect width="156" height="70" rx="14" fill="#202522" stroke="#39413d" />
          <circle cx="24" cy="25" r="11" fill="#29342d" /><path d="M18 31V20h12v11M21 24h6m-6 3h6" fill="none" stroke="#a9b7a2" strokeWidth="1.4" />
          <text x="44" y="27" fill="#e6e2d7" fontSize="12" fontWeight="650">Assurance</text>
          <text x="44" y="45" fill="#a49f91" fontSize="9">Audits · evidence · actions</text>
          <circle cx="140" cy="55" r="2.5" fill="#a9b7a2"><animate attributeName="opacity" values="1;.35;1" dur="2.2s" repeatCount="indefinite" /></circle>
        </g>
      </g>
    </svg>
  );
}
