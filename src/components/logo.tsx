interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizeMap = {
  sm: { icon: 'w-8 h-8', text: 'text-lg', ai: 'text-xs' },
  md: { icon: 'w-10 h-10', text: 'text-xl', ai: 'text-sm' },
  lg: { icon: 'w-12 h-12', text: 'text-2xl', ai: 'text-base' },
};

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const s = sizeMap[size];

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${s.icon} rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25`}
      >
        <span className="text-white font-bold text-lg">F</span>
      </div>
      {showText && (
        <div className="flex items-baseline">
          <span className={`${s.text} font-bold text-white tracking-tight`}>
            FINMARK
          </span>
          <span className={`${s.ai} font-semibold text-purple-400 ml-0.5`}>
            .AI
          </span>
        </div>
      )}
    </div>
  );
}
