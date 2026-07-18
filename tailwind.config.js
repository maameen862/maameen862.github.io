/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        'primary-glow': 'hsl(var(--primary-glow))',
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        sans: ['"Work Sans"', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', '"Times New Roman"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        'about-display': ['"Libre Baskerville"', '"Times New Roman"', 'serif'],
        'about-sans': ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
      boxShadow: {
        glow: '0 0 80px hsl(244 76% 59% / 0.28)',
        elevated: '0 30px 80px -20px hsl(240 80% 4% / 0.8)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, hsl(244 76% 59%), hsl(248 90% 72%))',
        'gradient-radial': 'radial-gradient(ellipse at top, hsl(244 76% 59% / 0.18), transparent 60%)',
        'gradient-grid': 'linear-gradient(hsl(240 51% 40% / 0.06) 1px, transparent 1px), linear-gradient(90deg, hsl(240 51% 40% / 0.06) 1px, transparent 1px)',
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.65, 0, 0.35, 1) both',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        ticker: 'ticker 40s linear infinite',
        'grow-bar': 'grow-bar 1.4s cubic-bezier(0.65, 0, 0.35, 1) both',
      },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'pulse-glow': { '0%, 100%': { boxShadow: '0 0 20px hsl(244 76% 59% / 0.3)' }, '50%': { boxShadow: '0 0 40px hsl(244 76% 59% / 0.6)' } },
        ticker: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'grow-bar': { from: { width: '0' } },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
