import React, { useState } from 'react';
import styled from 'styled-components';

const Wrap = styled.span`
  position: relative; 
  display: inline-block;
`;

const Bubble = styled.span`
  position: absolute; 
  bottom: calc(100% + 8px); 
  left: 50%; 
  transform: translateX(-50%);
  background: #0D1117; 
  color: #E8EDF2; 
  border: 1px solid #30363D; 
  border-radius: 8px; 
  padding: 6px 8px; 
  white-space: nowrap; 
  z-index: 70;
`;

export default function Tooltip({ content, children }) {
  const [open, setOpen] = useState(false);
  
  return (
    <Wrap onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
      {open && <Bubble role="tooltip">{content}</Bubble>}
    </Wrap>
  );
}