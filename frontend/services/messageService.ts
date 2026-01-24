import api from './api';

export interface MessageRequest {
    content: string;
    listingId?: number;
}

export interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
}

export interface ConversationResponse {
    id: number;
    listingId: number;
    listingTitle: string;
    listingImage?: string;
    otherParticipant: UserResponse;
    lastMessage?: string;
    lastMessageAt?: string;
    hasUnreadMessages: boolean;
}

export interface MessageResponse {
    id: number;
    content: string;
    senderId: number;
    senderName: string;
    createdAt: string;
    isRead: boolean;
    isMine: boolean;
}

class MessageService {
    async startConversation(listingId: number, content: string): Promise<ConversationResponse> {
        const response = await api.post('/conversations', {
            listingId,
            content,
        });
        return response.data;
    }

    async getMyConversations(): Promise<ConversationResponse[]> {
        const response = await api.get('/conversations');
        return response.data;
    }

    async getMessages(conversationId: number): Promise<MessageResponse[]> {
        const response = await api.get(`/conversations/${conversationId}/messages`);
        return response.data;
    }

    async sendMessage(conversationId: number, content: string): Promise<MessageResponse> {
        const response = await api.post(`/conversations/${conversationId}/messages`, {
            content,
        });
        return response.data;
    }

    async markAsRead(conversationId: number): Promise<void> {
        await api.post(`/conversations/${conversationId}/read`);
    }
}

export const messageService = new MessageService();
