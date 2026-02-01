import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser, getMessages, sendMessage, getUserProfile } from '../lib/api';
import { UserProfile, Message } from '../lib/types';
import { Send, User, ChevronLeft } from 'lucide-react';

export function Chat() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [otherUser, setOtherUser] = useState<UserProfile | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Load
    useEffect(() => {
        async function init() {
            const user = await getCurrentUser();
            if (!user) {
                navigate('/login');
                return;
            }
            setCurrentUser(user);

            if (userId) {
                const profile = await getUserProfile(userId);
                setOtherUser(profile);
            }
        }
        init();
    }, [userId, navigate]);

    // Poll for messages (Simplest way without setting up Realtime subscriptions in this environment)
    useEffect(() => {
        if (!currentUser || !userId) return;

        let interval: any;

        const fetchMessages = async () => {
            const msgs = await getMessages(currentUser.id, userId);
            setMessages(msgs);
            setLoading(false);
        };

        fetchMessages();
        interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [currentUser, userId]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser || !userId) return;

        const content = newMessage;
        setNewMessage(''); // Clear immediately

        // Optimistic update
        const tempMsg: Message = {
            id: 'temp-' + Date.now(),
            sender_id: currentUser.id,
            receiver_id: userId,
            content: content,
            created_at: new Date().toISOString(),
            read: false
        };
        setMessages(prev => [...prev, tempMsg]);

        // Send to API
        await sendMessage(currentUser.id, userId, content);
        
        // Refetch to confirm
        const msgs = await getMessages(currentUser.id, userId);
        setMessages(msgs);
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Loading chat...</div>;

    if (!otherUser) return <div className="p-8">User not found</div>;

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] p-4 flex flex-col">
             {/* Header */}
            <div className="bg-white p-4 rounded-t-xl shadow-sm border-b flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="mr-4 text-gray-500 hover:text-gray-700">
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                        {otherUser.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-800">{otherUser.name}</h2>
                        <span className="text-xs text-green-500 flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span> Online
                        </span>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 bg-gray-50 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10">
                        <p>No messages yet.</p>
                        <p className="text-sm">Say hello to {otherUser.name}!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === currentUser.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                    isMe 
                                    ? 'bg-blue-600 text-white rounded-tr-none' 
                                    : 'bg-white text-gray-800 shadow-sm rounded-tl-none'
                                }`}>
                                    <p>{msg.content}</p>
                                    <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-4 rounded-b-xl shadow-sm border-t">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-gray-50"
                    />
                    <button 
                        type="submit" 
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full disabled:opacity-50 transition-colors"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
