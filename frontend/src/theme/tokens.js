const theme = {
  colors: {
    // Premium deep indigo dark theme palette - sophisticated and professional
    bg: '#0F0A1E',          // Deep indigo background - darker and more premium
    surface: '#1A1530',     // Elevated surface with rich indigo undertone
    elev: '#252142',        // Higher elevation surfaces with subtle indigo
    text: '#F8FAFC',        // High contrast white text for maximum readability
    muted: '#B4C6E7',       // Refined muted text with indigo tint
    border: '#2D2754',      // Sophisticated border color maintaining indigo theme
    pri: '#6366F1',         // Premium indigo primary color - professional and modern
    succ: '#10B981',        // Success green that complements indigo palette
    warn: '#F59E0B',        // Warning amber that works well with dark theme
    err: '#EF4444',         // Error red with good contrast
    accent: '#8B5CF6'       // Purple accent that harmonizes with indigo theme
  },
  radius: { sm: 6, md: 8, lg: 12, xl: 16 },
  shadow: {
    // Enhanced shadows for premium look on dark background
    card: '0 4px 20px rgba(15,10,30,0.4)',
    lg: '0 8px 32px rgba(15,10,30,0.5)',
    xl: '0 12px 48px rgba(15,10,30,0.6)'
  },
  motion: {
    fast: '120ms', med: '180ms', slow: '240ms',
    in: 'cubic-bezier(.2,.7,.25,1)', out: 'cubic-bezier(.3,.1,.2,1)'
  },
  fonts: {
    sans: `'Inter var', Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`
  }
};

export default theme;