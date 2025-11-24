import { marked } from "marked";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import type { Message } from "./interface";
import { handleSend, initiateChat } from "./api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const GREETING_PLACEHOLDER = "Hello, please provide a greeting.";

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGreeting = async () => {
      setIsLoading(true);
      try {
        const response = await initiateChat();
        setMessages(response.history);
      } catch (error) {
        console.log("Error initiating chat:", error);
        const errorMessage: Message = {
          role: "model",
          parts: [
            {
              text: "Sorry, I couldn't start the conversation. Please try refreshing the page.",
            },
          ],
        };
        setMessages([errorMessage]);
      } finally {
        setIsLoading(false); // Stop loading indicator
      }
    };

    fetchGreeting();
  }, []); // The empty dependency array [] ensures this runs only ONCE on mount.

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    await handleSend(input, messages, setMessages).finally(() => {
      setIsLoading(false);
    });
  };

  const handleSaveChat = useCallback(async () => {
    console.log("handleSaveChat called");
    const chatElement = chatWindowRef.current;
    if (!chatElement) return;

    const originalHeight = chatElement.style.height;
    const originalOverflow = chatElement.style.overflow;

    try {
      chatElement.style.height = "auto";
      chatElement.style.overflow = "visible";
      chatElement.classList.add("preparing-for-save");

      const canvas = await html2canvas(chatElement, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / pdfWidth;
      const imgHeight = canvasHeight / ratio;

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = -pdfHeight * (pdf.internal.pages.length - 1);
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const date = new Date().toISOString().slice(0, 10);
      pdf.save(`chat-log-${date}.pdf`);
    } catch (error) {
      console.error("Failed to save chat as PDF:", error);
    } finally {
      chatElement.style.height = originalHeight;
      chatElement.style.overflow = originalOverflow;
      chatElement.classList.remove("preparing-for-save");
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "p") {
        event.preventDefault();
        handleSaveChat();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSaveChat]);

  return (
    <div className="chat-container">
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => {
          const messageText = msg.parts[0]?.text;
          if (!messageText) return null;

          if (msg.role === "user" && messageText === GREETING_PLACEHOLDER) {
            return null;
          } else {
            return (
              <div key={index} className={`chat-bubble ${msg.role}`}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(messageText),
                  }}
                />
              </div>
            );
          }
        })}
        {isLoading && (
          <div className="chat-bubble model">
            <div className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      {/* <div className="sample_questions">
        <div
          className="question_bubble"
          onClick={() => {
            setInput(q1);
          }}
        >
          {q1}
        </div>
        <div
          className="question_bubble"
          onClick={() => {
            setInput(q2);
          }}
        >
          {q2}
        </div>
      </div> */}
      <form className="chat-input-form" onSubmit={handleSendHandler}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the IFM Dashboard..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
}
