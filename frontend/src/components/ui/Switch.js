import React from 'react';
import styled from 'styled-components';

const Track = styled.button`
  width: 44px; 
  height: 26px; 
  border-radius: 999px; 
  position: relative;
  background: ${({ checked }) => checked ? 'rgba(124,140,255,.22)' : 'var(--surface)'};
  border: 1px solid var(--border); 
  transition: background var(--t-fast) ease;
`;

const Thumb = styled.span`
  position: absolute; 
  top: 2px; 
  left: ${({ checked }) => checked ? '22px' : '2px'};
  width: 22px; 
  height: 22px; 
  border-radius: 999px; 
  background: #DDE2FF;
  transition: left var(--t-fast) ease;
`;

export default function Switch({ checked, onChange, ...rest }) {
  return (
    <Track 
      role="switch" 
      aria-checked={checked} 
      onClick={() => onChange?.(!checked)} 
      checked={checked} 
      {...rest}
    >
      <Thumb checked={checked} />
    </Track>
  );
}