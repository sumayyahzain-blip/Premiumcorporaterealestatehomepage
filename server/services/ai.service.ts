
import { ChatMessageDto } from '../dtos/chat-message.dto';

export class AiService {

    /**
     * Process a user message and return an AI response
     */
    async processMessage(userId: string, userMessage: string, context?: any): Promise<ChatMessageDto> {
        // Implement AI logic here (Integration with Gemini/OpenAI would go here)

        // For now, simple rule-based response
        let responseText = "I'm here to help with your real estate journey.";

        if (userMessage.toLowerCase().includes('price')) {
            responseText = "Our properties range from affordable starter homes to luxury estates. Could you specify your budget?";
        } else if (userMessage.toLowerCase().includes('sell')) {
            responseText = "Selling with Grade A Realty is easy. You can list your property from the dashboard.";
        } else if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
            responseText = "Hello! How can I assist you today?";
        }

        // Save to DB (Fire and forget, or await if critical)
        try {
            if (userId !== 'guest') {
                // We need to import pool essentially or move this to a repository. 
                // For simplicity in Phase 2, we can import pool directly.
                const { default: pool } = await import('../db');
                await pool.query(
                    'INSERT INTO chat_history (user_id, message, response) VALUES ($1, $2, $3)',
                    [userId, userMessage, responseText]
                );
            }
        } catch (dbError) {
            console.error('Failed to save chat history:', dbError);
        }

        return {
            senderInfo: { role: 'assistant' },
            content: responseText,
            timestamp: new Date().toISOString()
        };
    }
}

export const aiService = new AiService();
