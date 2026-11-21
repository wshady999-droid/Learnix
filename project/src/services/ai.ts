import { supabase } from '@/services/supabase';

export type ChatTurn = { role: 'user' | 'assistant'; text: string };

export async function askAssistant(messages: ChatTurn[]): Promise<string> {
  const { data, error } = await supabase.functions.invoke('ai-assistant', {
    body: { messages },
  });

  if (error) {
    let detail = '';
    try {
      const body = await (error as any).context?.json?.();
      detail = body?.error ?? '';
    } catch {
      // keep the generic message
    }
    throw new Error(detail || error.message || 'The assistant is not available right now.');
  }

  if (data?.error) throw new Error(data.error);
  return data?.reply ?? '';
}