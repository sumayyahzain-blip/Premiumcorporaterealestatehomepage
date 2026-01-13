
import { Request, Response } from 'express';
import { aiService } from '../services/ai.service';
import { SendMessageDto } from '../dtos/chat-message.dto';

export class ChatController {

    /**
     * Handle incoming chat messages
     */
    async sendMessage(req: Request, res: Response) {
        try {
            const body = req.body as SendMessageDto;
            const userId = req.user?.id || 'guest';

            const response = await aiService.processMessage(userId, body.message, body.context);

            res.json({
                success: true,
                data: response
            });
        } catch (error) {
            console.error('Chat Error:', error);
            res.status(500).json({ success: false, message: 'Failed to process message' });
        }
    }
}

export const chatController = new ChatController();
