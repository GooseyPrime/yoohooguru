# Authentication & Onboarding UX Testing Guide

## Overview
This document provides comprehensive testing instructions for the upgraded authentication and onboarding experience, which now supports dual roles (users can be both teachers and learners).

## Key Changes to Test

### 1. Dual-Role Selection
- Users are no longer forced to choose between being a teacher OR a learner
- Users can select both "Teach & Share Skills" and "Learn & Find Services"
- At least one option must be selected to proceed

### 2. Enhanced UX Features
- Password strength indicator with real-time feedback
- Social proof messaging
- Benefits list
- Improved error messages
- Hover animations and visual feedback

## Test Scenarios

### Scenario 1: Email Sign-Up Flow (Dual Role)

**Steps:**
1. Navigate to `/signup`
2. Verify social proof banner is displayed ("Join thousands of community members")
3. Select BOTH role options:
   - Click "Teach & Share Skills" card
   - Click "Learn & Find Services" card
   - Verify both cards show checkmarks and are highlighted
4. Fill in personal information:
   - First Name: "John"
   - Last Name: "Doe"
   - Email: "john.doe+test@example.com"
5. Create password and observe strength indicator:
   - Type "weak" → Should show "Weak" in red
   - Type "weak123" → Should show "Fair" in orange
   - Type "Weak123!" → Should show "Good" or "Strong" in green
6. Confirm password matches
7. Accept Terms and Privacy Policy checkboxes
8. Click "Create Account"
9. Verify success message and redirection to `/onboarding/profile`

**Expected Results:**
- User profile created with `wantsToTeach: true` and `wantsToLearn: true`
- Password strength indicator provides real-time feedback
- All validation messages are clear and helpful
- User is redirected to guru onboarding (since they selected teaching)

### Scenario 2: Email Sign-Up Flow (Learner Only)

**Steps:**
1. Navigate to `/signup`
2. Select ONLY "Learn & Find Services"
3. Complete the form with valid information
4. Submit

**Expected Results:**
- User profile created with `wantsToTeach: false` and `wantsToLearn: true`
- User is redirected to `/dashboard` (not onboarding, since they're not teaching)

### Scenario 3: Email Sign-Up Flow (Teacher Only)

**Steps:**
1. Navigate to `/signup`
2. Select ONLY "Teach & Share Skills"
3. Complete the form with valid information
4. Submit

**Expected Results:**
- User profile created with `wantsToTeach: true` and `wantsToLearn: false`
- User is redirected to `/onboarding/profile` to complete guru setup

### Scenario 4: Google OAuth Sign-Up (Dual Role)

**Steps:**
1. Navigate to `/signup`
2. Accept Terms and Privacy Policy
3. Click "Continue with Google"
4. Complete Google OAuth flow
5. Should be redirected to `/onboarding?type=select`
6. See three options:
   - "👨‍🏫 Teach & Share Skills"
   - "🎓 Learn & Find Services"
   - "🌟 Both Teacher & Learner" (highlighted with "MOST POPULAR" badge)
7. Click "Both Teacher & Learner"

**Expected Results:**
- User profile created via Google OAuth
- Onboarding selection screen shows three clear options
- "Both" option is visually highlighted as most popular
- User is redirected to `/onboarding/profile` after selection

### Scenario 5: Validation Tests

**Test Invalid Inputs:**
1. Try to submit without selecting any role
   - Expected: "Please select at least one option for how you plan to use yoohoo.guru"
2. Enter weak password (e.g., "123")
   - Expected: Password strength shows "Weak" and validation prevents submission
3. Mismatched passwords
   - Expected: "Passwords do not match"
4. Invalid email format
   - Expected: "Please enter a valid email address"
5. Try to submit without accepting terms
   - Expected: "You must accept the Terms and Conditions to create an account"

### Scenario 6: Login Page Experience

**Steps:**
1. Navigate to `/login`
2. Scroll to bottom of page
3. Verify informational message is displayed:
   - "💡 Did you know? You can be both a teacher and a learner on yoohoo.guru!"

**Expected Results:**
- Login page educates users about dual-role capability
- Message is visually distinct and informative

### Scenario 7: Visual UX Elements

**Test Interactive Elements:**
1. Hover over role selection cards
   - Expected: Cards should elevate, border color changes, shadow appears
2. Select a role card
   - Expected: Border turns blue, background tints blue, checkmark appears
3. Type password
   - Expected: Strength bar animates, color changes based on strength
4. View benefits section
   - Expected: Green-tinted box displays four key benefits

## Database Verification

After completing sign-up flows, verify in Firestore:

```javascript
// User profile should contain:
{
  email: "user@example.com",
  displayName: "John Doe",
  wantsToTeach: true/false,
  wantsToLearn: true/false,
  // ... other fields
}
```

## API Endpoint Testing

### POST /auth/register

**Request:**
```json
{
  "email": "test@example.com",
  "password": "SecurePass123!",
  "displayName": "Test User",
  "wantsToTeach": true,
  "wantsToLearn": true
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "uid": "...",
    "email": "test@example.com",
    "displayName": "Test User",
    "tier": "Stone Dropper"
  }
}
```

### POST /onboarding/profile

**Request:**
```json
{
  "displayName": "John Doe",
  "wantsToTeach": true,
  "wantsToLearn": false,
  "city": "San Francisco",
  "zip": "94102",
  "bio": "Excited to teach!"
}
```

**Expected Response (200):**
```json
{
  "success": true
}
```

## Regression Testing

Ensure existing functionality still works:
1. Login with existing email/password accounts
2. Google OAuth login for existing users
3. Password reset flow
4. Profile updates
5. Account management features

## Accessibility Testing

1. **Keyboard Navigation:**
   - Tab through form fields
   - Space/Enter to select role cards
   - Checkbox navigation for terms acceptance

2. **Screen Reader:**
   - Verify ARIA labels on password toggle buttons
   - Verify error messages are announced
   - Verify form labels are properly associated

3. **Color Contrast:**
   - Password strength indicator colors are distinguishable
   - Error messages are readable
   - Selected states are clear

## Performance Testing

1. **Page Load:**
   - Signup page should load quickly
   - No JavaScript errors in console
   - Service worker caches assets

2. **Form Responsiveness:**
   - Password strength calculation should be instant
   - Role card selection should respond immediately
   - No lag in validation messages

## Mobile Testing

Test on various devices:
1. iPhone (iOS Safari)
2. Android (Chrome)
3. Tablet devices

**Mobile-Specific Checks:**
- Role cards stack vertically on narrow screens
- Form inputs are properly sized
- Buttons are easily tappable
- Password visibility toggle works
- Keyboard doesn't obscure form fields

## Browser Compatibility

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Common Issues to Watch For

1. **Google OAuth Popup Blocked:**
   - Ensure popup blockers don't interfere
   - Verify fallback messaging works

2. **Firebase Initialization:**
   - Verify Firebase config is loaded
   - Check for initialization errors in console

3. **CORS Issues:**
   - Verify backend API calls succeed
   - Check browser network tab for CORS errors

4. **State Management:**
   - Role selections persist during form filling
   - Password strength updates correctly
   - Error messages clear when fields are corrected

## Success Criteria

✅ All test scenarios pass without errors
✅ User experience is intuitive and clear
✅ Dual-role selection works correctly
✅ Password strength indicator provides helpful feedback
✅ Error messages are clear and actionable
✅ Google OAuth flow handles dual roles properly
✅ Backend correctly stores wantsToTeach and wantsToLearn
✅ No console errors or warnings
✅ Mobile experience is smooth
✅ All browsers render correctly

## Reporting Issues

If you encounter issues during testing, please report:
1. Browser and version
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots if applicable
5. Console errors if any

## Next Steps After Testing

Once all tests pass:
1. ✅ Mark testing checklist as complete
2. Deploy to staging for QA review
3. Gather user feedback
4. Monitor analytics for completion rates
5. Iterate based on feedback
