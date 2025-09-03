import React from 'react';
import styled from 'styled-components';

const Bar = styled.div`
  display: flex; 
  gap: 6px; 
  border-bottom: 1px solid var(--border);
`;

const Tab = styled.button`
  padding: .5rem .75rem; 
  border-radius: var(--r-sm) var(--r-sm) 0 0; 
  border: 1px solid transparent;
  
  &.active { 
    border-color: var(--border); 
    border-bottom-color: var(--elev); 
    background: var(--surface); 
  }
`;

export default function Tabs({ value, onChange, items = [] }) {
  return (
    <>
      <Bar>
        {items.map(it => (
          <Tab 
            key={it.value} 
            className={value === it.value ? 'active' : ''} 
            onClick={() => onChange?.(it.value)}
          >
            {it.label}
          </Tab>
        ))}
      </Bar>
      {items.find(i => i.value === value)?.children}
    </>
  );
}