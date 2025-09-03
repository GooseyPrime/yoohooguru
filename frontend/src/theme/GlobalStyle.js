import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Inter var';
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
    src: url('/fonts/Inter-Variable.woff2') format('woff2');
  }

  :root {
    --bg: ${({ theme }) => theme.colors.bg};
    --surface: ${({ theme }) => theme.colors.surface};
    --elev: ${({ theme }) => theme.colors.elev};
    --text: ${({ theme }) => theme.colors.text};
    --muted: ${({ theme }) => theme.colors.muted};
    --border: ${({ theme }) => theme.colors.border};
    --pri: ${({ theme }) => theme.colors.pri};
    --succ: ${({ theme }) => theme.colors.succ};
    --warn: ${({ theme }) => theme.colors.warn};
    --err: ${({ theme }) => theme.colors.err};

    --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-xl: 24px;
    --t-fast: 140ms; --t-med: 200ms; --t-slow: 260ms;
  }

  html, body, #root { height: 100%; }
  body {
    margin: 0; background: var(--bg); color: var(--text);
    font-family: ${({ theme }) => theme.fonts.sans};
    -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  }
  * { box-sizing: border-box; }
  a { color: inherit; text-decoration: none; }
  .text-muted { color: var(--muted); }
  .hairline { border: 1px solid var(--border); }

  /* Typography scale with clamp for responsive sizing */
  h1 { 
    font-size: clamp(2.5rem, 5vw, 3.5rem); 
    font-weight: 700; 
    line-height: 1.2; 
    letter-spacing: -0.025em;
    margin-bottom: 1.5rem;
  }
  h2 { 
    font-size: clamp(1.75rem, 4vw, 2.25rem); 
    font-weight: 600; 
    line-height: 1.25; 
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
  }
  h3 { 
    font-size: clamp(1.375rem, 3vw, 1.625rem); 
    font-weight: 600; 
    line-height: 1.3; 
    letter-spacing: -0.015em;
    margin-bottom: 0.75rem;
  }
  
  p, body { 
    font-size: clamp(1rem, 2vw, 1.125rem); 
    line-height: 1.6;
  }
  
  .text-small { 
    font-size: clamp(0.8125rem, 1.5vw, 0.875rem); 
    line-height: 1.5;
  }

  /* Focus styles for accessibility */
  *:focus-visible {
    outline: 2px solid var(--pri);
    outline-offset: 2px;
    border-radius: calc(var(--r-md) + 2px);
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export default GlobalStyle;