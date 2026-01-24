import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MessageCircle, Send, ArrowLeft, Home, User, Clock, Inbox } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { messageService, ConversationResponse, MessageResponse } from '../services/messageService';
import { useConfigStore } from '../stores/configStore';
import toast from 'react-hot-toast';

const MessagesPage: React.FC = () => {
    const navigate = useNavigate();
    const backend = useConfigStore((state) => state.backend);
    const isJavaBackend = backend === 'java';

    const [conversations, setConversations] = useState<ConversationResponse[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<ConversationResponse | null>(null);
    const [messages, setMessages] = useState<MessageResponse[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const selectedConversationRef = useRef<ConversationResponse | null>(null);

    // Keep ref in sync with state for polling
    useEffect(() => {
        selectedConversationRef.current = selectedConversation;
    }, [selectedConversation]);

    useEffect(() => {
        if (!isJavaBackend) {
            setIsLoading(false);
            return;
        }
        loadConversations();

        // Polling for new messages every 3 seconds
        const pollInterval = setInterval(() => {
            if (selectedConversationRef.current) {
                messageService.getMessages(selectedConversationRef.current.id)
                    .then(data => setMessages(data))
                    .catch(() => { }); // Silent fail for polling
            }
            // Also refresh conversations list
            messageService.getMyConversations()
                .then(data => setConversations(data))
                .catch(() => { });
        }, 3000);

        return () => clearInterval(pollInterval);
    }, [isJavaBackend]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const loadConversations = async () => {
        try {
            setIsLoading(true);
            const data = await messageService.getMyConversations();
            setConversations(data);
        } catch (error) {
            console.error('Failed to load conversations', error);
            toast.error('Nie udało się załadować konwersacji');
        } finally {
            setIsLoading(false);
        }
    };

    const loadMessages = async (conversation: ConversationResponse) => {
        try {
            setSelectedConversation(conversation);
            const data = await messageService.getMessages(conversation.id);
            setMessages(data);

            // Mark messages as read and refresh conversations list
            await messageService.markAsRead(conversation.id);
            const updatedConversations = await messageService.getMyConversations();
            setConversations(updatedConversations);
        } catch (error) {
            console.error('Failed to load messages', error);
            toast.error('Nie udało się załadować wiadomości');
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        setIsSending(true);
        try {
            const sent = await messageService.sendMessage(selectedConversation.id, newMessage);
            setMessages([...messages, sent]);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message', error);
            toast.error('Nie udało się wysłać wiadomości');
        } finally {
            setIsSending(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Wczoraj';
        } else if (diffDays < 7) {
            return `${diffDays} dni temu`;
        }
        return date.toLocaleDateString('pl-PL');
    };

    // PHP backend - show info message
    if (!isJavaBackend) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
                        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                            <MessageCircle size={40} className="text-amber-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-secondary mb-4">Wiadomości niedostępne</h1>
                        <p className="text-slate-600 mb-6">
                            System wiadomości jest dostępny tylko przy użyciu Java backend.
                            Przełącz backend w menu na górze strony, aby korzystać z tej funkcji.
                        </p>
                        <Button onClick={() => navigate('/')}>
                            Powrót do strony głównej
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Ładowanie wiadomości...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <MessageCircle size={28} className="text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-secondary">Wiadomości</h1>
                            <p className="text-slate-500">Twoje konwersacje z agentami i klientami</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden min-h-[600px]">
                    <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                        {/* Conversations List */}
                        <div className={`border-r border-slate-200 ${selectedConversation ? 'hidden md:block' : ''}`}>
                            <div className="p-4 border-b border-slate-100 bg-slate-50">
                                <h2 className="font-semibold text-secondary flex items-center gap-2">
                                    <Inbox size={18} />
                                    Skrzynka odbiorcza
                                </h2>
                            </div>

                            {conversations.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    <MessageCircle size={48} className="mx-auto mb-4 text-slate-300" />
                                    <p className="font-medium">Brak konwersacji</p>
                                    <p className="text-sm mt-1">
                                        Wyślij wiadomość z poziomu ogłoszenia, aby rozpocząć konwersację.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 max-h-[540px] overflow-y-auto">
                                    {conversations.map((conv) => (
                                        <button
                                            key={conv.id}
                                            onClick={() => loadMessages(conv)}
                                            className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${selectedConversation?.id === conv.id ? 'bg-primary/5 border-l-4 border-primary' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                    {conv.otherParticipant.avatarUrl ? (
                                                        <img src={conv.otherParticipant.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User size={18} className="text-slate-500" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-semibold text-secondary truncate">
                                                            {conv.otherParticipant.firstName} {conv.otherParticipant.lastName}
                                                        </span>
                                                        {conv.hasUnreadMessages && (
                                                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-600 truncate flex items-center gap-1">
                                                        <Home size={12} />
                                                        {conv.listingTitle}
                                                    </p>
                                                    {conv.lastMessage && (
                                                        <p className="text-xs text-slate-400 truncate mt-1">
                                                            {conv.lastMessage}
                                                        </p>
                                                    )}
                                                    {conv.lastMessageAt && (
                                                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                            <Clock size={10} />
                                                            {formatDate(conv.lastMessageAt)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Messages View */}
                        <div className="md:col-span-2 flex flex-col h-[600px]">
                            {selectedConversation ? (
                                <>
                                    {/* Conversation Header */}
                                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
                                        <button
                                            onClick={() => setSelectedConversation(null)}
                                            className="md:hidden p-2 hover:bg-slate-200 rounded-lg transition-colors"
                                        >
                                            <ArrowLeft size={20} />
                                        </button>
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                            {selectedConversation.otherParticipant.avatarUrl ? (
                                                <img src={selectedConversation.otherParticipant.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={18} className="text-slate-500" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-secondary">
                                                {selectedConversation.otherParticipant.firstName} {selectedConversation.otherParticipant.lastName}
                                            </h3>
                                            <Link
                                                to={`/listings/${selectedConversation.listingId}`}
                                                className="text-sm text-primary hover:underline flex items-center gap-1"
                                            >
                                                <Home size={12} />
                                                {selectedConversation.listingTitle}
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {messages.length === 0 ? (
                                            <div className="text-center text-slate-400 py-8">
                                                <p>Brak wiadomości w tej konwersacji</p>
                                            </div>
                                        ) : (
                                            messages.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.isMine
                                                            ? 'bg-primary text-white rounded-br-md'
                                                            : 'bg-slate-100 text-secondary rounded-bl-md'
                                                            }`}
                                                    >
                                                        <p className="text-sm">{msg.content}</p>
                                                        <p className={`text-xs mt-1 ${msg.isMine
                                                            ? 'text-white/70'
                                                            : 'text-slate-400'
                                                            }`}>
                                                            {formatDate(msg.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Message Input */}
                                    <div className="p-4 border-t border-slate-100 bg-white">
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                placeholder="Napisz wiadomość..."
                                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                            />
                                            <Button
                                                onClick={handleSendMessage}
                                                disabled={isSending || !newMessage.trim()}
                                                className="px-6"
                                            >
                                                <Send size={18} />
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-slate-400">
                                    <div className="text-center">
                                        <MessageCircle size={64} className="mx-auto mb-4 text-slate-200" />
                                        <p className="font-medium">Wybierz konwersację</p>
                                        <p className="text-sm">aby zobaczyć wiadomości</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
