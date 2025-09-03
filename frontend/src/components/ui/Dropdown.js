import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

const Btn = styled.button`
  padding: .5rem .75rem; 
  border: 1px solid var(--border); 
  background: var(--surface); 
  border-radius: var(--r-sm);
`;

const Menu = styled.div`
  position: absolute; 
  z-index: 50; 
  margin-top: 6px; 
  min-width: 180px; 
  background: var(--elev); 
  border: 1px solid var(--border); 
  border-radius: var(--r-md); 
  padding: 6px;
`;

export default function Dropdown({ button, items = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const onDoc = (e) => { 
      if (open && ref.current && !ref.current.contains(e.target)) setOpen(false); 
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <Btn onClick={() => setOpen(v => !v)} aria-haspopup="menu" aria-expanded={open}>
        {button}
      </Btn>
      {open && (
        <Menu role="menu">
          {items.map((it, i) => (
            <button 
              key={i} 
              role="menuitem" 
              onClick={() => { it.onSelect?.(); setOpen(false); }}
              style={{ 
                display: 'block', 
                width: '100%', 
                textAlign: 'left', 
                padding: '8px 10px', 
                borderRadius: 8, 
                background: 'transparent' 
              }}
            >
              {it.label}
            </button>
          ))}
        </Menu>
      )}
    </div>
  );
}