import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Sparkles, Send, Bot, User, RefreshCcw } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const suggestions = [
  'Summarize my last lesson on useEffect',
  'Quiz me on React basics',
  'Explain conditional types simply',
  'Create a study plan for this week',
];

const cannedReplies = [
  "Here's the key idea: hooks let function components keep state between renders. The two rules are — only call hooks at the top level, and only from React functions. Want a quick quiz on this?",
  "Good question! Think of conditional types as 'if/else for types': Given<T> checks T and picks a branch. I can generate 3 practice exercises if you'd like.",
  "Sure! Based on your current progress, I'd focus on 'Building a Custom Hook' next — it's your closest uncompleted lesson and connects directly to your upcoming quiz.",
];

let replyIndex = 0;

export default function AIStudyAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm0',
      role: 'assistant',
      text: "Hi Liam! I'm your BrainUp study assistant. I can summarize lessons, quiz you, explain tricky concepts, or build a study plan. What would you like to work on?",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { id: `m${Date.now()}`, role: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: `m${Date.now()}`, role: 'assistant', text: cannedReplies[replyIndex % cannedReplies.length] },
      ]);
      replyIndex += 1;
    }, 1100);
  };

  return (
    <>
      <PageHeader
        title="AI Study Assistant"
        subtitle="Your personal learning companion, powered by AI."
        actions={<button className="btn-secondary" onClick={() => { setMessages(messages.slice(0, 1)); replyIndex = 0; }}><RefreshCcw size={15} /> New chat</button>}
      />

      <div className="flex h-[calc(100vh-14rem)] min-h-[480px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                m.role === 'assistant' ? 'bg-gradient-to-br from-primary-600 to-secondary text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {m.role === 'assistant' ? <Sparkles size={16} /> : <User size={16} />}
              </span>
              <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === 'assistant' ? 'rounded-tl-md bg-gray-50 text-ink' : 'rounded-tr-md bg-primary-600 text-white'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary text-white"><Bot size={16} /></span>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-gray-50 px-4 py-4">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-gray-100 p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input flex-1"
              placeholder="Ask anything about your courses..."
            />
            <button type="submit" className="btn-primary h-11 w-11 !px-0" aria-label="Send message">
              <Send size={17} />
            </button>
          </form>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-gray-400">
        Preview only — the assistant will connect to a real AI service in the next development phase.
      </p>
    </>
  );
}
