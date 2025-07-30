export default function Loading() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        background: "rgba(255,255,255,0.35)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        // fallback for browsers that don't support backdrop-filter
        // backgroundColor: "rgba(255,255,255,0.7)",
      }}
    >
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Spinning colored rings */}
        <div className="absolute inset-0 animate-spin-slow">
          <svg className="w-full h-full" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#FF9800"
              strokeWidth="8"
              strokeDasharray="60 200"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="absolute inset-0 animate-spin-reverse">
          <svg className="w-full h-full" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="44"
              fill="none"
              stroke="#1976D2"
              strokeWidth="6"
              strokeDasharray="40 180"
              strokeLinecap="round"
            />
          </svg>
        </div>
        {/* Pulsing dot in the center with fitted logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-400 to-blue-600 animate-pulse-shadow flex items-center justify-center">
            <img
              src="/LogoPNG.png"
              className="w-18 h-18 object-contain"
              alt="logo"
              style={{ display: "block" }}
            />
          </div>
        </div>
      </div>
      <style>{`
        .animate-spin-slow {
          animation: spin 2s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 3s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          100% { transform: rotate(-360deg); }
        }
        .animate-pulse-shadow {
          animation: pulse-shadow 1.2s infinite;
        }
        @keyframes pulse-shadow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255,152,0,0.7), 0 0 0 0 rgba(25,118,210,0.7);
          }
          50% {
            box-shadow: 0 0 24px 12px rgba(255,152,0,0.3), 0 0 24px 12px rgba(25,118,210,0.3);
          }
        }
      `}</style>
    </div>
  );
}
