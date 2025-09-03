import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

function Portal({ children }) {
  const [el] = useState(() => document.createElement('div'));
  
  useEffect(() => { 
    document.body.appendChild(el); 
    return () => el.remove(); 
  }, [el]);
  
  return ReactDOM.createPortal(children, el);
}

export function useToast() {
  const [items, setItems] = useState([]);
  
  const notify = (msg, ttl = 3000) => {
    const id = Math.random().toString(36).slice(2);
    setItems(arr => [...arr, { id, msg }]);
    setTimeout(() => setItems(arr => arr.filter(x => x.id !== id)), ttl);
  };
  
  const ToastHost = () => (
    <Portal>
      <div style={{ 
        position: 'fixed', 
        right: 16, 
        bottom: 16, 
        display: 'grid', 
        gap: 8 
      }}>
        {items.map(t => (
          <div 
            key={t.id} 
            style={{ 
              background: 'var(--elev)', 
              border: '1px solid var(--border)', 
              borderRadius: 12, 
              padding: '10px 12px' 
            }}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </Portal>
  );
  
  return { notify, ToastHost };
}