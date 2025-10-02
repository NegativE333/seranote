import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usePusher } from '@/lib/pusher-provider';
import { useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  readAt?: string;
  sender: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface UseMessagesProps {
  seranoteId: string;
  userEmail: string;
}

export function useMessages({ seranoteId, userEmail }: UseMessagesProps) {
  const queryClient = useQueryClient();
  const pusher = usePusher();

  // Fetch messages
  const {
    data: messages = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['messages', seranoteId],
    queryFn: async (): Promise<Message[]> => {
      const response = await fetch(`/api/seranotes/${seranoteId}/messages`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      return response.json();
    },
    staleTime: 0, // Always fetch fresh data
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/seranotes/${seranoteId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return response.json();
    },
  });

  // Mark messages as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/seranotes/${seranoteId}/messages`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to mark messages as read');
      }

      return response.json();
    },
    onSuccess: () => {
      // Update all messages to read status
      queryClient.setQueryData(['messages', seranoteId], (old: Message[] = []) =>
        old.map((message) => ({
          ...message,
          isRead: message.sender.email !== userEmail ? true : message.isRead,
          readAt: message.sender.email !== userEmail ? new Date().toISOString() : message.readAt,
        }))
      );
    },
  });

  // Set up Pusher event listeners
  useEffect(() => {
    if (!pusher || !seranoteId) return;

    const channel = pusher.subscribe(`seranote-${seranoteId}`);

    // Listen for new messages
    channel.bind('new-message', (data: { message: Message; unreadCount: number }) => {
      queryClient.setQueryData(['messages', seranoteId], (old: Message[] = []) => {
        // Check if message already exists (avoid duplicates)
        const exists = old.some(msg => msg.id === data.message.id);
        if (exists) return old;
        
        return [...old, data.message];
      });
    });

    // Listen for messages read events
    channel.bind('messages-read', (data: { userEmail: string; unreadCount: number }) => {
      if (data.userEmail !== userEmail) {
        // Someone else marked messages as read
        queryClient.setQueryData(['messages', seranoteId], (old: Message[] = []) =>
          old.map((message) => ({
            ...message,
            isRead: message.sender.email !== data.userEmail ? true : message.isRead,
            readAt: message.sender.email !== data.userEmail ? new Date().toISOString() : message.readAt,
          }))
        );
      }
    });

    return () => {
      pusher.unsubscribe(`seranote-${seranoteId}`);
    };
  }, [pusher, seranoteId, userEmail, queryClient]);

  // Calculate unread count
  const unreadCount = messages.filter(
    (message) => !message.isRead && message.sender.email !== userEmail
  ).length;

  return {
    messages,
    isLoading,
    error,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    markAsRead: markAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    unreadCount,
  };
}
