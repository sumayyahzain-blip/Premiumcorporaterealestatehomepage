
export interface ChatMessageDto {
    senderInfo: {
        role: 'user' | 'system' | 'assistant';
        userId?: string;
    };
    content: string;
    timestamp: string;
    context?: {
        pageUrl?: string;
        selectedPropertyId?: string;
    };
}

export interface SendMessageDto {
    message: string;
    context?: any;
}
