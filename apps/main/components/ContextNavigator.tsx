import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { getRouteConfig, filterQuickActions, QuickAction } from '../config/routeConfig';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * ContextNavigator Component
 * 
 * A specialized embedded sidebar with two zones:
 * 1. Quick-Route Zone (top 40%): Instant navigation via styled action tiles
 * 2. Contextual AI Chat (bottom 60%): Context-aware AI assistant
 * 
 * The component adapts based on:
 * - Current page/route
 * - User authentication status
 * - User role (admin, guru, angel, hero-guru, gunu)
 */
export default function ContextNavigator() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current route configuration
  const routeConfig = getRouteConfig(router.pathname);
  const isAuthenticated = status === 'authenticated';
  const userRole = session?.user?.role;

  // Filter quick actions based on auth and role
  const availableActions = filterQuickActions(
    routeConfig.quickActions,
    isAuthenticated,
    userRole
  );

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const userName = session?.user?.name ? ` ${session.user.name}` : '';
      const greeting = `Hi${userName}! 👋 I'm here to help you navigate this page. What would you like to do?`;

      setMessages([
        {
          role: 'assistant',
          content: greeting,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length, session]);

  // Reset messages when route changes to keep context fresh
  useEffect(() => {
    if (isOpen && messages.length >= 1) {
      // Clear messages when navigating to new page (even if only greeting exists)
      const userName = session?.user?.name ? ` ${session.user.name}` : '';
      const greeting = `Hi${userName}! 👋 I'm here to help you navigate this page. What would you like to do?`;
      
      setMessages([
        {
          role: 'assistant',
          content: greeting,
          timestamp: new Date()
        }
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]); // Only re-run when pathname changes

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isLoading) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call context-aware AI assistant API
      const response = await fetch('/api/ai/context-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: text }
          ],
          systemPrompt: routeConfig.systemPrompt,
          currentPath: router.pathname,
          userRole: userRole || 'guest'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Use the error message from the API if available
        const errorMessage = data.message || data.error || 'Failed to get response from AI assistant';
        throw new Error(errorMessage);
      }

      // Check if AI returned a navigation action
      if (data.action && data.action.type === 'navigate') {
        // Add assistant message with navigation info
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Perform navigation after a brief delay so user sees the message
        setTimeout(() => {
          router.push(data.action.route);
        }, 500);
      } else {
        // Add regular assistant message
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Extract error message from Error object
      const errorMessage = error instanceof Error 
        ? error.message 
        : "I'm sorry, I encountered an error. Please try again or use the quick navigation buttons above.";
      
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    // Handle special case for browser back navigation
    if (action.route === '__BACK__') {
      router.back();
    } else {
      router.push(action.route);
    }
    // No need to add message to chat - the route change effect will reset messages
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Toggle Button (when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 w-12 h-32 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-l-2xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 z-40 flex items-center justify-center group hover:w-14"
          aria-label="Open Context Navigator"
        >
          <div className="flex flex-col items-center space-y-2">
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs font-semibold">⚡</span>
          </div>
        </button>
      )}

      {/* Context Navigator Sidebar */}
      {isOpen && (
        <div className="fixed right-0 top-0 h-screen w-[420px] bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 shadow-2xl z-50 flex flex-col border-l border-white/10 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Context Navigator</h3>
                <p className="text-blue-400 text-xs">Smart guidance for this page</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              aria-label="Close navigator"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ZONE 1: Quick-Route Actions (Top 40%) */}
          <div className="p-4 border-b border-white/10 bg-gradient-to-b from-blue-900/10 to-transparent h-2/5 overflow-y-auto">
            <h4 className="text-white/80 text-xs font-semibold uppercase tracking-wide mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Actions
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              {availableActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="group relative overflow-hidden bg-gradient-to-br from-white/5 to-white/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-white/20 hover:border-blue-400/50 rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 text-left"
                >
                  {/* Icon */}
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  
                  {/* Label */}
                  <div className="text-white text-sm font-semibold leading-tight">
                    {action.label}
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:to-purple-400/10 transition-all duration-300 rounded-xl pointer-events-none" />
                </button>
              ))}
            </div>

            {/* Current Page Indicator */}
            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white/60 text-xs mb-1">Current Page</p>
              <p className="text-white text-sm font-mono">{router.pathname}</p>
            </div>
          </div>

          {/* ZONE 2: Contextual AI Chat (Bottom 60%) */}
          <div className="flex-1 flex flex-col h-3/5">
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-white/10">
              <h4 className="text-white/80 text-xs font-semibold uppercase tracking-wide flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                AI Assistant
              </h4>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : 'bg-white/10 text-white border border-white/20'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl px-4 py-3 border border-white/20">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-gradient-to-t from-slate-900/50 to-transparent">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about this page..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/50"
                  aria-label="Send message"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-white/40 mt-2 text-center">
                Context-aware AI • Press Enter to send
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
