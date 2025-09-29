# URGENT FIX: Test Command Syntax Error

**Issue:** Backend tests failing due to incorrect command syntax
```
error: unknown option '--detectOpenHandles'
```

## Root Cause
Jest options `--detectOpenHandles` and `--verbose` are outside the quoted command string, causing Firebase CLI to interpret them instead of Jest.

## Fix: Update Backend Test Script

**File:** `backend/package.json`

**Current (broken):**
```json
"test": "firebase emulators:exec --project=demo-yoohooguru-test --only firestore,auth 'jest --forceExit --runInBand' --detectOpenHandles --verbose"
```

**Fixed:**
```json
"test": "firebase emulators:exec --project=demo-yoohooguru-test --only firestore,auth 'jest --forceExit --runInBand --detectOpenHandles --verbose'"
```

**Key change:** Move `--detectOpenHandles --verbose` INSIDE the single quotes so they're passed to Jest, not firebase-tools.

---

## Still Remaining: Button Component DOM Props

Frontend tests show warnings about non-boolean DOM attributes. Fix with transient props:

**File:** `frontend/src/components/Button.js`

**Find and replace:**

```javascript
// OLD - Line ~15-30
const StyledButton = styled.button`
  ${props => props.primary && css`
    background-color: ${props => props.theme.colors.primary};
  `}
  ${props => props.secondary && css`
    background-color: ${props => props.theme.colors.secondary};
  `}
`;

// Around line ~120
return (
  <StyledButton 
    primary={primary} 
    secondary={secondary}
    {...props}
  >
```

**NEW - Replace entire file:**

```javascript
import React from 'react';
import styled, { css } from 'styled-components';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  
  ${props => props.$primary && css`
    background-color: ${props => props.theme.colors.primary};
    color: white;
    
    &:hover {
      background-color: ${props => props.theme.colors.primaryDark || props.theme.colors.primary};
      transform: translateY(-2px);
    }
    
    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
      transform: none;
    }
  `}
  
  ${props => props.$secondary && css`
    background-color: transparent;
    color: ${props => props.theme.colors.primary};
    border: 2px solid ${props => props.theme.colors.primary};
    
    &:hover {
      background-color: ${props => props.theme.colors.primary};
      color: white;
    }
    
    &:disabled {
      border-color: #ccc;
      color: #ccc;
      cursor: not-allowed;
    }
  `}
  
  ${props => props.$fullWidth && css`
    width: 100%;
  `}
  
  ${props => props.$small && css`
    padding: 8px 16px;
    font-size: 14px;
  `}
  
  ${props => props.$large && css`
    padding: 16px 32px;
    font-size: 18px;
  `}
`;

const Button = ({ 
  children, 
  variant = 'primary',
  fullWidth = false,
  size = 'medium',
  disabled = false,
  type = 'button',
  onClick,
  ...props 
}) => {
  // Convert to transient props (prefixed with $)
  const $primary = variant === 'primary';
  const $secondary = variant === 'secondary';
  const $fullWidth = fullWidth;
  const $small = size === 'small';
  const $large = size === 'large';
  
  return (
    <StyledButton 
      $primary={$primary} 
      $secondary={$secondary}
      $fullWidth={$fullWidth}
      $small={$small}
      $large={$large}
      disabled={disabled}
      type={type}
      onClick={onClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
```

---

## Implementation Order

1. **Fix backend/package.json test script** (5 seconds)
2. **Replace frontend/src/components/Button.js** (30 seconds)
3. **Commit and push**
4. **CI should pass**

---

## Expected Results After Fix

✅ Node 20.x running  
✅ Frontend tests pass (no prop warnings)  
✅ Backend linting passes  
✅ Firebase emulator starts  
✅ Backend tests run (may have other issues but command will work)  
✅ Build completes  

The Button fix removes ALL warnings about `primary` and `secondary` props in test output.
