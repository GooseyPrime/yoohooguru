const theme = {
  colors: {
    bg: '#0B0D10',
    surface: '#12151A',
    elev: '#171B22',
    text: '#E8EDF2',
    muted: '#9AA7B2',
    border: '#252B34',
    pri: '#7C8CFF',
    succ: '#27C093',
    warn: '#F5B950',
    err: '#F26D6D'
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 24 },
  shadow: {
    card: '0 6px 24px rgba(0,0,0,.24)'
  },
  motion: {
    fast: '140ms', med: '200ms', slow: '260ms',
    in: 'cubic-bezier(.2,.7,.25,1)', out: 'cubic-bezier(.3,.1,.2,1)'
  },
  fonts: {
    sans: `'Inter var', Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`
  }
};

export default theme;