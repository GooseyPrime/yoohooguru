import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface BookingAssistantProps {
  guruName: string;
  skill: string;
  price: number;
}

export default function BookingAssistant({ guruName, skill, price }: BookingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = `Hi! 👋 I'm here to help you book a session with ${guruName}.\n\nYou're booking:\n• Skill: ${skill}\n• Price: $${price}/hour\n\nI can help with:\n• Choosing the right session time\n• Answering questions about the guru's expertise\n• Understanding the booking process\n• Payment and cancellation policies\n\nWhat would you like to know?`;

      setMessages([
        {
          role: 'assistant',
          content: greeting,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length, guruName, skill, price]);

  const handleSendMessage = async () => {
    const text = inputValue.trim();
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
      // For now, provide mock responses
      // In a real implementation, this would call an AI API endpoint
      const response = generateMockResponse(text, guruName, skill, price);

      // Add assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm sorry, I encountered an error. Please try again or contact support.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 text-white rounded-full shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 flex items-center justify-center group hover:scale-110 z-50"
          aria-label="Open booking assistant"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          {/* Notification dot */}
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl shadow-2xl border border-purple-500/30 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="text-white font-semibold">Booking Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              aria-label="Close chat"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white'
                      : 'bg-white/10 text-white border border-white/20'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-60 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl px-4 py-2 border border-white/20">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-black/20 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Send message"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Mock response generator - in production, this would call an AI API
function generateMockResponse(userMessage: string, guruName: string, skill: string, price: number): string {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('time') || lowerMessage.includes('when') || lowerMessage.includes('schedule')) {
    return `${guruName} typically offers flexible scheduling! You can choose your preferred date and time in the booking form above. Sessions are usually available:\n\n• Weekdays: 9am - 8pm\n• Weekends: 10am - 6pm\n\nThe calendar will show their real-time availability.`;
  }

  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('payment')) {
    return `The session rate is $${price}/hour. This includes:\n\n• One-on-one instruction\n• Personalized learning materials\n• Post-session support\n\nPayment is secure through our platform. We accept credit cards, PayPal, and more.`;
  }

  if (lowerMessage.includes('cancel') || lowerMessage.includes('refund')) {
    return `Our cancellation policy:\n\n✅ Full refund: Cancel 24+ hours before\n⚠️ 50% refund: Cancel within 24 hours\n❌ No refund: No-show\n\nYou can cancel or reschedule from your dashboard anytime.`;
  }

  if (lowerMessage.includes('experience') || lowerMessage.includes('expertise') || lowerMessage.includes('qualified')) {
    return `${guruName} is a verified ${skill} expert on YooHoo.Guru. All our gurus:\n\n• Pass rigorous vetting\n• Have proven track records\n• Maintain 4+ star ratings\n• Are background-checked\n\nCheck their full profile for reviews and credentials!`;
  }

  if (lowerMessage.includes('video') || lowerMessage.includes('in-person') || lowerMessage.includes('online')) {
    return `You can choose your preferred session format:\n\n📹 Video Conference: Meet virtually from anywhere\n🤝 In-Person: Meet at a location you both agree on\n\nSelect your preference in the booking form above!`;
  }

  // Default response
  return `I'm here to help with your booking! I can answer questions about:\n\n• Scheduling and availability\n• Pricing and payments\n• ${guruName}'s expertise in ${skill}\n• Cancellation policies\n• Session formats (video vs in-person)\n\nWhat would you like to know?`;
}
