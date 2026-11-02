/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx,vue}',
    './components/**/*.{ts,tsx,vue}',
    './app/**/*.{ts,tsx,vue}',
    './src/**/*.{ts,tsx,vue}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        success: {
          DEFAULT: 'var(--success)',
          foreground: 'var(--success-foreground)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          foreground: 'var(--warning-foreground)',
        },
        info: {
          DEFAULT: 'var(--info)',
          foreground: 'var(--info-foreground)',
        },
        brand: {
          DEFAULT: 'var(--brand)',
          foreground: 'var(--brand-foreground)',
          secondary: 'var(--brand-secondary)',
        },
        rail: {
          DEFAULT: 'var(--rail)',
          foreground: 'var(--rail-foreground)',
          muted: 'var(--rail-muted-foreground)',
          border: 'var(--rail-border)',
          active: 'var(--rail-active)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
        tag: {
          1: { DEFAULT: 'var(--tag-1)', foreground: 'var(--tag-1-foreground)' },
          2: { DEFAULT: 'var(--tag-2)', foreground: 'var(--tag-2-foreground)' },
          3: { DEFAULT: 'var(--tag-3)', foreground: 'var(--tag-3-foreground)' },
          4: { DEFAULT: 'var(--tag-4)', foreground: 'var(--tag-4-foreground)' },
          5: { DEFAULT: 'var(--tag-5)', foreground: 'var(--tag-5-foreground)' },
          6: { DEFAULT: 'var(--tag-6)', foreground: 'var(--tag-6-foreground)' },
        },
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        DEFAULT: 'var(--rks-shadow)',
        sm: 'var(--rks-shadow-sm)',
        md: 'var(--rks-shadow-md)',
        lg: 'var(--rks-shadow-lg)',
        xl: 'var(--rks-shadow-xl)',
        '2xl': 'var(--rks-shadow-2xl)',
        '3xl': 'var(--rks-shadow-3xl)',
        inner: 'var(--rks-shadow-inner)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
