import React from 'react';
import styled from 'styled-components';

const Wrap = styled.label`
  display: block; 
  position: relative; 
  margin: 0 0 16px;
`;

const Input = styled.input`
  width: 100%; 
  padding: 14px 12px 12px; 
  color: var(--text);
  background: var(--surface); 
  border: 1px solid var(--border); 
  border-radius: var(--r-md);
  transition: border-color var(--t-fast) ease;
  
  &:focus { 
    outline: none; 
    border-color: #2E3540; 
  }
  
  &:disabled { 
    opacity: .6; 
    cursor: not-allowed; 
  }
`;

const Label = styled.span`
  position: absolute; 
  left: 12px; 
  top: 12px; 
  color: var(--muted); 
  pointer-events: none;
  transition: transform var(--t-fast) ease, font-size var(--t-fast) ease, top var(--t-fast) ease;
  
  ${Input}:focus ~ &,
  ${Input}:not(:placeholder-shown) ~ & {
    top: 6px; 
    transform: translateY(-10px); 
    font-size: 12px; 
    color: #AEB8C4;
  }
`;

const Hint = styled.div`
  margin-top: 6px; 
  color: var(--muted); 
  font-size: 12px;
`;

const Error = styled.div`
  margin-top: 6px; 
  color: var(--err); 
  font-size: 12px;
`;

export default function TextField({ label, hint, error, ...props }) {
  return (
    <Wrap>
      <Input placeholder=" " aria-invalid={!!error} {...props} />
      <Label>{label}</Label>
      {error ? <Error role="alert">{error}</Error> : hint ? <Hint>{hint}</Hint> : null}
    </Wrap>
  );
}