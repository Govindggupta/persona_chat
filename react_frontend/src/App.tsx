import {  useState } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const handleAsk = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://persona-chat.onrender.com/chat",
        {
          text: input,
        }
      );

      let raw = response?.data?.response;

      raw = raw.replace(/```json|```/g, "").trim();

      const parsed = JSON.parse(raw);

      setData(parsed);
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="bg-red-500">hello there everyone !!!</div>
      <input
        type="text"
        value={input}
        placeholder="type here"
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={() => {
          handleAsk();
        }}
      >
        Ask
      </button>
      {loading && <div>Loading...</div>}
      {!loading && data?.[0]?.content && <div>{data[0].content}</div>}
    </div>
  );
}

export default App;
