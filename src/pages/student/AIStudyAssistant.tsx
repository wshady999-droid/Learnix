import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Send, RefreshCcw } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const suggestions = [
  'Summarize my last lesson',
  'Quiz me',
  'Explain a hard concept',
  'Plan my week',
];

const cannedReplies = [
  "Key idea: hooks let components remember things between renders. Only call them at the top level. Want a quick quiz on this?",
  "Sure — here are 3 practice questions. Take your time, and I'll check your answers.",
  "Based on your progress, focus on 'Building a Custom Hook' next. It connects directly to your upcoming quiz.",
];

let replyIndex = 0;

export default function AIStudyAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm0',
      role: 'assistant',
      text: "Hi Liam! I'm your LearnIx study helper. Ask me anything about your courses.",
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
    }, 1000);
  };

  return (
    <>
      <PageHeader
        title="Study Helper"
        subtitle="Ask questions about your courses."
        actions={<button className="btn-secondary" onClick={() => { setMessages(messages.slice(0, 1)); replyIndex = 0; }}><RefreshCcw size={15} /> New chat</button>}
      />

      <div className="flex h-[calc(100vh-14rem)] min-h-[440px] flex-col overflow-hidden rounded-2xl border bg-card" style={{ borderColor: 'var(--border)' }}>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${m.role === 'assistant' ? 'bg-primary text-white' : 'bg-soft text-muted'}`}>
                {m.role === 'assistant' ? 'Ix' : 'You'}
              </span>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === 'assistant' ? 'bg-soft text-ink' : 'bg-primary text-white'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">Ix</span>
              <div className="flex items-center gap-1.5 rounded-2xl bg-soft px-4 py-4">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t p-4" style={{ borderColor: 'var(--border)' }}>
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-primary hover:text-primary"
                style={{ borderColor: 'var(--border)' }}
              >
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input flex-1"
              placeholder="Ask anything..."
            />
            <button type="submit" className="btn-primary h-11 w-11 !px-0" aria-label="Send message">
              <Send size={17} />
            </button>
          </form>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-muted">
        Preview only — connects to a real AI service in the next phase.
      </p>
    </>
  );
}
