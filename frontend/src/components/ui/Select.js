import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Box = styled.button`
  width: 100%; 
  text-align: left; 
  padding: 12px; 
  border: 1px solid var(--border);
  background: var(--surface); 
  border-radius: var(--r-md); 
  color: var(--text);
`;

const List = styled.ul`
  position: absolute; 
  z-index: 40; 
  margin-top: 6px; 
  width: 100%; 
  list-style: none; 
  padding: 6px;
  background: var(--elev); 
  border: 1px solid var(--border); 
  border-radius: var(--r-md);
`;

export default function Select({ value, onChange, options = [], placeholder = 'Select…' }) {
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
    <div ref={ref} style={{ position: 'relative' }}>
      <Box aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(v => !v)}>
        {value ? options.find(o => o.value === value)?.label : placeholder}
      </Box>
      {open && (
        <List role="listbox">
          {options.map(opt => (
            <li 
              key={opt.value} 
              role="option" 
              aria-selected={opt.value === value}
              onClick={() => { onChange?.(opt.value); setOpen(false); }}
              style={{ 
                padding: '8px 10px', 
                borderRadius: 8, 
                cursor: 'pointer', 
                background: opt.value === value ? 'rgba(124,140,255,.10)' : 'transparent' 
              }}
            >
              {opt.label}
            </li>
          ))}
        </List>
      )}
    </div>
  );
}