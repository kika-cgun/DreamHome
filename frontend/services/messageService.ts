import api from './api';

export interface MessageRequest {
    content: string;
    listingId?: number;
}

export interface ConversationResponse {
    id: number;
    listingId: number;
    listingTitle: string;
    participantName: string;
    lastMessage?: string;
    lastMessageAt?: string;
    unreadCount: number;
}

export interface MessageResponse {
    id: number;
    content: string;
    senderId: number;
    senderName: string;
    createdAt: string;
    isRead: boolean;
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
}

export const messageService = new MessageService();
