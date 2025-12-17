import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { ChatMessage } from "../types";

let chatSession: Chat | null = null;

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing!");
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const initializeChat = (): Chat => {
  const ai = getAiClient();
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    if (!chatSession) {
      initializeChat();
    }
    
    if (!chatSession) {
        throw new Error("Failed to initialize chat session");
    }

    const response = await chatSession.sendMessage({ message });
    return response.text || "Desculpe, tive um problema ao processar sua resposta.";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    return "Desculpe, estou fora do ar momentaneamente. Tente novamente em instantes.";
  }
};

export const summarizeConversation = async (history: ChatMessage[]): Promise<string> => {
  try {
    const ai = getAiClient();
    // Convertemos o histórico para texto simples
    const conversationText = history
      .map(msg => `${msg.role === 'user' ? 'Cliente' : 'Bot'}: ${msg.text}`)
      .join('\n');

    const prompt = `
      Atue como um secretário de uma loja de impressão 3D.
      Analise a seguinte conversa entre um cliente e o chatbot.
      Crie um resumo curto e direto (máximo 3 linhas) para o dono da loja.
      
      Destaque:
      1. Qual produto o cliente quer?
      2. Ele mencionou arquivos customizados (STL/OBJ)?
      3. Alguma dúvida técnica ou urgência?
      
      Conversa:
      ${conversationText}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text || "Não foi possível gerar um resumo.";
  } catch (error) {
    console.error("Erro ao resumir conversa:", error);
    return "Erro ao processar resumo automático.";
  }
};