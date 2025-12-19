import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { ChatMessage } from "../types";

let chatSession: Chat | null = null;

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("ERRO CRÍTICO: Variável de ambiente API_KEY não encontrada no sistema.");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = (): Chat => {
  const ai = getAiClient();
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
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
        throw new Error("Não foi possível iniciar a sessão de chat.");
    }

    const response = await chatSession.sendMessage({ message });
    return response.text || "Desculpe, não consegui processar essa informação.";
  } catch (error) {
    console.error("Erro na comunicação com Gemini:", error);
    // Tenta reinicializar em caso de erro de sessão expirada ou nula
    try {
      chatSession = null;
      return "Tive um pequeno soluço na conexão, mas estou de volta. Pode repetir?";
    } catch {
      return "Estou temporariamente indisponível. Verifique se a API_KEY está configurada no servidor.";
    }
  }
};

export const summarizeConversation = async (history: ChatMessage[]): Promise<string> => {
  try {
    const ai = getAiClient();
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
        model: 'gemini-3-flash-preview',
        contents: prompt
    });

    return response.text || "Resumo não disponível.";
  } catch (error) {
    console.error("Erro ao gerar resumo:", error);
    return "Erro ao processar resumo automático.";
  }
};