import AssistantChat from '@/pages/common/AssistantChat';

export default function AIStudyAssistant() {
  return (
    <AssistantChat
      title="Study Helper"
      subtitle="Ask questions about your courses."
      greeting="Hi {name}! I'm your LearnIx study helper. Ask me anything about your courses."
      suggestions={['Summarize my courses', 'Quiz me', 'Explain a hard concept', 'Plan my week']}
    />
  );
}