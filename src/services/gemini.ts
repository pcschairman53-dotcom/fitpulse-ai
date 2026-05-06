import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are an AI Fitness Sales Assistant for FitPulse AI. Your goal is to guide users toward gym conversion using the existing system buttons and features.

IMPORTANT RULES:
1. Greet users with high energy: "Hey! Ready to transform your body? 💪🔥"
2. Your primary mission is to collect:
   - User's Name
   - Fitness Goal (Weight loss / Muscle gain / General Fitness)
3. Provide short motivating replies (1-2 lines MAX).
4. Add urgency to your responses: "Limited slots available this week ⏳. Let's lock your spot!"
5. ALWAYS guide the user toward the external conversion points at the end of EVERY message:
   👉 "Click on 'Book Free Trial' to get started"
   👉 "Or tap 'WhatsApp Now' for instant support"
6. Ask engaging follow-up questions: "Are you a beginner or looking to level up?" or "Do you want a personal training session?"
7. TONALITY: Friendly, elite coach vibe, sales-focused, and very brief.
8. DO NOT try to trigger WhatsApp or forms yourself. Just guide the user to the UI components.
9. NEVER change button actions or break existing workflows.
`;

export async function getChatResponse(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "I'm sorry, I'm having trouble connecting right now. How else can I help you today?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having a technical moment. Let's talk about your fitness goals again in a second!";
  }
}
