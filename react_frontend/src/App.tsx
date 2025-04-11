import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleAsk = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://persona-chat.onrender.com/chat",
        { text: input }
      );

      let raw = response?.data?.response;
      raw = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(raw);

      setMessages((prev) => [...prev, parsed[0]]);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-4">
      {/* Header with adjusted spacing */}
      <div className="flex flex-col items-center mb-4 w-full max-w-2xl">
        <img
          src="https://avatars.githubusercontent.com/u/11613311?v=4"
          alt="Persona"
          className="w-23 h-23 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <h2 className="text-xl font-semibold mt-2">Chat with Hitesh Sir!!</h2>
        <p className="text-xs text-gray-400">Ask anything about Coding , AI to Sir </p>
      </div>

      {/* Chat Box with proper spacing */}
      <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-xl p-4 flex flex-col space-y-3 flex-1 max-h-[65vh] overflow-y-auto">
        <style >{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <AnimatePresence initial={false}>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-full text-gray-400 text-sm"
              >
                Start a conversation with Ada...
              </motion.div>
            )}

            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2`}
              >
                <div
                  className={`rounded-xl px-4 py-2 max-w-[80%] text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-100"
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {/* Typing animation */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex justify-start mb-2"
              >
                <div className="bg-gray-700 text-white px-4 py-2 rounded-xl max-w-[75%] text-sm flex space-x-1">
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:.1s]" />
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:.2s]" />
                  <span className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:.3s]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area with better proportions */}
      <div className="w-full max-w-2xl flex items-center mt-4 space-x-2">
        <input
          type="text"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          className="flex-1 px-4 py-2 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none text-sm"
        />
        <button
          onClick={handleAsk}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-white font-medium transition text-sm disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;