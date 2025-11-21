'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ConversationSidebar } from '@/components/chat/ConversationSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { chatApi, Message, Conversation } from '@/lib/api/chat';
import { ApiError } from '@/lib/api/client';

function ChatPageContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setConversations([]);
      setCurrentConversationId(undefined);
      setMessages([]);
      return;
    }
    setCurrentConversationId(undefined);
    setMessages([]);
    setError('');
    loadConversations();
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (currentConversationId) {
      loadConversationHistory(currentConversationId);
    } else {
      setMessages([]);
    }
  }, [currentConversationId, user]);

  const loadConversations = async () => {
    try {
      const data = await chatApi.getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  const loadConversationHistory = async (conversationId: string) => {
    try {
      const data = await chatApi.getConversationHistory(conversationId);
      setMessages(data.messages);
    } catch (err) {
      console.error('Failed to load conversation history:', err);
      setError('Failed to load conversation');
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!user) {
      setError('You must be logged in to send a message.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await chatApi.sendMessage({
        message: messageText,
        conversationId: currentConversationId,
      });

      // Add user message
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        content: messageText,
        role: 'user',
        timestamp: new Date().toISOString(),
        conversationId: response.conversationId,
      };
      setMessages((prev) => [...prev, userMessage]);

      // Update conversation ID if it's a new conversation
      if (!currentConversationId) {
        setCurrentConversationId(response.conversationId);
        await loadConversations();
      }

      // Add assistant response
      setMessages((prev) => [...prev, response.message]);

      // Reload conversations to update the list
      await loadConversations();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Failed to send message');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  const handleNewConversation = () => {
    setCurrentConversationId(undefined);
    setMessages([]);
    setError('');
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await chatApi.deleteConversation(conversationId);
      if (currentConversationId === conversationId) {
        setCurrentConversationId(undefined);
        setMessages([]);
      }
      await loadConversations();
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Opportunity Center Chat
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.name || user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/settings')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Settings"
              >
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              {user?.role === 'admin' && (
                <button
                  onClick={() => router.push('/admin')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Admin
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-6 py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Chat Window */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            conversationId={currentConversationId}
          />
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatPageContent />
    </ProtectedRoute>
  );
}
