import axios from "axios";
import type { Message } from "../interface";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

if (!baseUrl) {
  throw new Error("VITE_API_BASE_URL is not defined in your .env file.");
}

/**
 * Calls the /initiate endpoint to get the AI's opening message.
 * @returns A promise containing the initial reply and conversation history.
 */
const initiateChat = async () => {
  try {
    const response = await axios.get<{ reply: string; history: Message[] }>(
      `${baseUrl}/mcp/initiate`
    );
    return response.data;
  } catch (error) {
    console.error("Error initiating chat:", error);
    // Re-throw the error so the component can handle UI updates (e.g., show an error message)
    throw error;
  }
};

const handleSend = async (
  input: string,
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  try {
    const email = localStorage.getItem("email") ?? "";
    const response = await axios.post<{ reply: string; history: Message[] }>(
      `${baseUrl}/mcp/chat`,
      {
        message: input,
        conversationHistory: messages,
        email,
      }
    );

    setMessages(response.data.history);
  } catch (error) {
    console.error("Error communicating with the AI agent:", error);
    const errorMessage: Message = {
      role: "model",
      parts: [
        {
          text: "Sorry, I'm having trouble connecting to my brain right now.",
        },
      ],
    };
    setMessages((prev) => [...prev, errorMessage]);
  }
};

export { initiateChat, handleSend };
