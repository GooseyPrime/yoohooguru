# ContextNavigator Component

## Overview

The **ContextNavigator** is a highly specialized, embedded sidebar component that provides intelligent, context-aware navigation assistance across the YooHoo.Guru platform. It features a unique dual-zone interface designed to streamline user navigation and provide AI-powered guidance.

## Architecture

### Component Structure

```
┌─────────────────────────────────┐
│      CONTEXT NAVIGATOR          │
├─────────────────────────────────┤
│  ZONE 1: Quick-Route (40%)      │
│  ┌───────────┐ ┌───────────┐   │
│  │  📝 Edit  │ │  📅 Book  │   │
│  └───────────┘ └───────────┘   │
│  ┌───────────┐ ┌───────────┐   │
│  │  ⚙️ Setup │ │  💰 Bills │   │
│  └───────────┘ └───────────┘   │
├─────────────────────────────────┤
│  ZONE 2: AI Chat (60%)          │
│  ┌─────────────────────────┐   │
│  │ 👤 User: How do I...?   │   │
│  │                         │   │
│  │ 🤖 AI: Let me help...   │   │
│  │                         │   │
│  │ [Input field...]        │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

### Dual-Zone Interface

#### Zone 1: Quick-Route Interface (Top 40%)
- **Purpose**: Instant UI controls for navigation based on current location and user role
- **Visual Style**: Modern "Action Tiles" with icons (emoji-based)
- **Behavior**: Clicking executes immediate route change via Next.js Router
- **Logic**: Dynamic content based on:
  - Current page/pathname
  - User authentication status
  - User role (admin, guru, hero-guru, angel, gunu)

#### Zone 2: Contextual AI Chat (Bottom 60%)
- **Purpose**: AI-powered assistance with context-aware personality
- **Visual Style**: Standard chat interface (scrollable history + input)
- **System Prompt Injection**: AI personality shifts based on current URL
- **API**: `/api/ai/context-assistant` (uses OpenRouter with Claude 3.5 Sonnet)

## Files

### Core Files
1. **`/apps/main/components/ContextNavigator.tsx`**
   - Main React component
   - Handles UI rendering and state management
   - Integrates with Next.js Router and NextAuth

2. **`/apps/main/config/routeConfig.ts`**
   - Route configuration mapping
   - Defines quick actions and system prompts for each route
   - Filtering logic for auth/role-based actions

3. **`/apps/main/pages/api/ai/context-assistant.ts`**
   - API endpoint for AI chat
   - Integrates with OpenRouter
   - Injects context-aware system prompts

4. **`/apps/main/pages/_app.tsx`**
   - Global integration point
   - ContextNavigator rendered on every page

## Adding New Routes

When adding a new page to the platform, update `/apps/main/config/routeConfig.ts`:

```typescript
{
  path: '/your-new-page',
  quickActions: [
    { label: 'Action 1', route: '/target', icon: '🎯' },
    { label: 'Action 2', route: '/target2', icon: '📝', requiresAuth: true },
    { label: 'Action 3', route: '/target3', icon: '⚙️', allowedRoles: ['admin'] },
    { label: 'Dashboard', route: '/dashboard', icon: '🏠', requiresAuth: true }
  ],
  systemPrompt: `You are a [Role] Assistant. Help users with [specific task].
  
  Key capabilities:
  - [Capability 1]
  - [Capability 2]
  
  Be [personality traits] and provide [type of guidance].`
}
```

## Environment Variables

Required:
- `OPENROUTER_API_KEY` - API key for OpenRouter (AI service)
- `NEXTAUTH_URL` - Base URL for the application

## Current Route Coverage

The ContextNavigator supports **15+ route patterns** including:
- Home, Dashboard, Browse, Jobs, Skills, Profile, Settings
- Role-specific: Guru, Angel, Heroes, Admin
- AI tools: Matchmaking, Learning Style Assessment
- All 28 content hub subdomains

## User Roles

1. **Guest** - Unauthenticated users
2. **Gunu** - Default learner role
3. **Guru** - Teacher/coach
4. **Hero-Guru** - Accessible learning teacher
5. **Angel** - Service provider
6. **Admin** - Platform administrator

## Troubleshooting

### AI Chat Not Responding
- Verify `OPENROUTER_API_KEY` is set
- Check API endpoint logs
- Confirm network connectivity

### Wrong Actions Showing
- Check route matching in `getRouteConfig()`
- Verify pathname matches expected pattern
- Test authentication and role filtering

## Support

- **Related Components**: HomepageAssistant, Navigation
- **Dependencies**: Next.js, NextAuth, OpenRouter, Tailwind CSS
