import React, { useState, useRef, useEffect } from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { apiClient } from '../services/apiClient';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { Send, Sparkles, Trash2, Bot, User, RefreshCw, Heart, Activity, Thermometer } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIAssistantPage: React.FC = () => {
  const { latestReading } = useHealthData();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const heartRate = latestReading?.heartRate ?? 76;
  const spo2 = latestReading?.spo2 ?? 98;
  const temperature = latestReading?.temperature ?? 36.6;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'ai',
      text: `Hello! I am your interactive AI Health Assistant powered by Google Gemini. I am currently monitoring your telemetry context: Heart Rate ${heartRate} BPM, SpO2 ${spo2}%, Temp ${temperature}°C. Ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    'Explain my current vitals.',
    'Is my oxygen level good?',
    'Why does heart rate rise during stress?',
    'What is a normal body temperature?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage.trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const res = await apiClient.chatAssistant({
        message: query,
        heartRate,
        spo2,
        temperature
      });
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        text: 'Sorry, I ran into an issue communicating with the AI service. Please check backend status.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'init_reset',
        sender: 'ai',
        text: 'Chat history cleared. How can I assist you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white font-outfit">Interactive AI Health Assistant</h1>
          <p className="text-xs text-slate-400">Contextualized Gemini AI assistant connected to live vitals</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Telemetry Context Badge */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <span className="flex items-center gap-1 text-rose-400 font-bold">
              <Heart className="w-3.5 h-3.5" /> {heartRate}
            </span>
            <span className="flex items-center gap-1 text-teal-400 font-bold">
              <Activity className="w-3.5 h-3.5" /> {spo2}%
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Thermometer className="w-3.5 h-3.5" /> {temperature}°C
            </span>
          </div>

          <button
            type="button"
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Prompts:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 text-xs text-teal-300 transition-all active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Interactive Chat Stream Feed */}
      <div className="flex-1 glass-card p-4 sm:p-6 rounded-2xl border border-slate-800 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`p-2 rounded-xl shrink-0 ${
                msg.sender === 'user' ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20' : 'bg-slate-800 text-teal-400 border border-slate-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-teal-500/10 border border-teal-500/30 text-white rounded-tr-none'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
              }`}
            >
              <p>{msg.text}</p>
              <span className="text-[10px] text-slate-500 block mt-2 text-right font-mono">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800 text-teal-400 border border-slate-700">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-slate-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-400" />
              <span>Gemini AI is reflecting on your vitals & response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask AI Assistant about your telemetry, health metrics, or symptom context..."
          className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-bold flex items-center justify-center transition-all shadow-md shadow-teal-500/20 active:scale-95"
        >
          <Send className="w-4 h-4 text-slate-950" />
        </button>
      </form>
    </div>
  );
};
