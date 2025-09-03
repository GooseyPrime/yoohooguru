import React, { useEffect } from 'react';
import styled from 'styled-components';

const Backdrop = styled.div`
  position: fixed; 
  inset: 0; 
  background: rgba(0,0,0,.45); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  z-index: 60;
`;

const Sheet = styled.div`
  width: min(640px, 92vw); 
  background: var(--elev); 
  border: 1px solid var(--border); 
  border-radius: var(--r-lg); 
  padding: 20px;
`;

export default function Modal({ open, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => { 
      if (e.key === 'Escape' && open) onClose?.(); 
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  
  if (!open) return null;
  
  return (
    <Backdrop onClick={onClose}>
      <Sheet role="dialog" aria-modal={true} onClick={(e) => e.stopPropagation()}>
        {children}
      </Sheet>
    </Backdrop>
  );
}