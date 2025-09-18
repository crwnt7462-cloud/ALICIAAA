import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

class AIService {
	async chatAssistant(prompt: string): Promise<string> {
		const response = await client.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [{ role: "user", content: prompt }],
		});
		return response.choices?.[0]?.message?.content ?? "";
	}

	// ✅ alias attendu par d'autres fichiers
	async generateChat(prompt: string): Promise<string> {
		return this.chatAssistant(prompt);
	}

	// ✅ alias legacy (clientAnalyticsService ou autres)
	async getChatResponse(prompt: string): Promise<string> {
		return this.chatAssistant(prompt);
	}
}

export const aiService = new AIService();