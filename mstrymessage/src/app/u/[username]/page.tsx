"use client";

import { useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function SendMessagePage() {
  const { username } = useParams();
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const fallback = [
    "What's something that made you smile recently?",
    "Is there a hobby or skill you're proud of?",
    "What's a small goal you're working on right now?",
  ];

  const sendMessage = async () => {
    try {
      const res = await axios.post("/api/send-message", {
        username,
        content: message,
      });

      setResponseMsg(res.data.message);
      setMessage("");
    } catch (error: any) {
      setResponseMsg(
        error?.response?.data?.message || "User is not accepting messages.",
      );
      return Response.json(
        {
          success: false,
          message: "user not accepting msg",
        },
        {
          status: 500,
        },
      );
    }
  };

  const generateSuggestions = async () => {
    setLoading(true);

    try {
      const res = await axios.post("/api/suggest-message");
      console.log("SUGGEST API RESPONSE:", res.data);

      // Check if response has message
      if (res.data.success && typeof res.data.message === "string") {
        const questions = res.data.message.split("||");
        setSuggestions(questions);
      } else {
        setSuggestions(fallback);
      }
    } catch (error: any) {
      console.error("SUGGEST ERROR:", error.response?.data || error.message);
      setSuggestions([]);
    }

    setLoading(false);
  };
  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        Send anonymous message to {username}
      </h1>

      {/* Message Input */}

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your anonymous message..."
        className="w-full border p-3 rounded-md"
      />

      <button
        onClick={sendMessage}
        className="w-full bg-black text-white py-2 rounded-md"
      >
        Send Message
      </button>

      {responseMsg && <p className="text-center text-sm">{responseMsg}</p>}

      {/* AI Suggestions */}

      <div className="border-t pt-6">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">AI Suggested Questions</h2>

          <button
            onClick={generateSuggestions}
            className="bg-gray-200 px-3 py-1 rounded-md"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="space-y-2 mt-4">
          {suggestions.map((q, index) => (
            <button
              key={index}
              onClick={() => setMessage(q)}
              className="block w-full text-left border p-3 rounded-md hover:bg-gray-100"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
