import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Send, RefreshCcw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { askAssistant, type ChatTurn } from '@/services/ai';

interface Message extends ChatTurn {
  id: string;
}

interface AssistantChatProps {
  title: string;
  subtitle: string;
  greeting: string;
  suggestions: string[];
}

export default function AssistantChat({ title, subtitle, greeting, suggestions }: AssistantChatProps) {
  const { profile } = useAuth();
  const firstName = (profile?.full_name || '').split(' ')[0];
  const intro: Message = {
    id: 'm0',
    role: 'assistant',
    text: greeting.replace('{name}', firstName || 'there'),
  };

  const [messages, setMessages] = useState<Message[]>([intro]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = async (text: string) => {
    const clean = text.trim();
    if (!clean || typing) return;

    const next: Message[] = [...messages, { id: `u${Date.now()}`, role: 'user', text: clean }];
    setMessages(next);
    setInput('');
    setError('');
    setTyping(true);

    try {
      // The greeting is not sent to the model; only the real conversation.
      const history = next.slice(1).map(({ role, text: t }) => ({ role, text: t }));
      const reply = await askAssistant(history);
      setMessages((m) => [...m, { id: `a${Date.now()}`, role: 'assistant', text: reply }]);
    } catch (e: any) {
      setError(e?.message ?? 'Could not reach the assistant.');
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <button
            className="btn-secondary"
            onClick={() => {
              setMessages([intro]);
              setError('');
            }}
          >
            <RefreshCcw size={15} /> New chat
          </button>
        }
      />

      <div
        className="flex h-[calc(100vh-14rem)] min-h-[440px] flex-col overflow-hidden rounded-2xl border bg-card"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  m.role === 'assistant' ? 'bg-primary text-white' : 'bg-soft text-muted'
                }`}
              >
                {m.role === 'assistant' ? 'Ix' : 'You'}
              </span>
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'assistant' ? 'bg-soft text-ink' : 'bg-primary text-white'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                Ix
              </span>
              <div className="flex items-center gap-1.5 rounded-2xl bg-soft px-4 py-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 animate-bounce rounded-full bg-muted"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
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
                disabled={typing}
                className="rounded-full border px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
                style={{ borderColor: 'var(--border)' }}
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input flex-1"
              placeholder="Ask anything..."
              disabled={typing}
            />
            <button type="submit" className="btn-primary h-11 w-11 !px-0" aria-label="Send message" disabled={typing}>
              <Send size={17} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}