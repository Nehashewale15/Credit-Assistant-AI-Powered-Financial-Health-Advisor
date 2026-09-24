import React, { useState } from 'react';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

const PRESET_QUESTIONS = [
  'What does credit utilization mean?',
  'Why is my DTI high?',
  'How can I reduce my debt?',
  'Why is paying on time important?',
  'What should I monitor every month?'
];

export const AIChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Hello! I am Credit Assistant. Ask me any follow-up question about your credit utilization, DTI, or debt reduction strategies.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || loading) return;

    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: q }]);
    setLoading(true);

    try {
      const res = await api.askAIChat(q);
      setMessages(prev => [...prev, { sender: 'assistant', text: res.answer }]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { sender: 'assistant', text: `Sorry, I encountered an issue: ${err.message}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[500px]">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-indigo-600 text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Ask Credit Assistant</h3>
            <span className="text-[10px] text-indigo-300 font-medium block">
              Powered by Google Gemini AI
            </span>
          </div>
        </div>
        <span className="text-[10px] font-semibold bg-indigo-900 text-indigo-200 border border-indigo-700 px-2 py-0.5 rounded-full">
          Educational Q&A
        </span>
      </div>

      {/* Preset Buttons */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto flex space-x-2 scrollbar-none">
        {PRESET_QUESTIONS.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pq)}
            disabled={loading}
            className="text-[11px] font-medium text-indigo-700 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0"
          >
            💬 {pq}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2.5 ${
              m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-white'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-xs'
                  : 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-tl-xs'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Credit Assistant is thinking...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question about your financial profile..."
          className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-colors cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
