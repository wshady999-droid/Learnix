import AssistantChat from '@/pages/common/AssistantChat';

export default function TeacherAssistant() {
  return (
    <AssistantChat
      title="Teaching Assistant"
      subtitle="Get help with quizzes, lessons and feedback."
      greeting="Hi {name}! I can help you write quiz questions, outline lessons and draft feedback."
      suggestions={[
        'Write 5 quiz questions',
        'Outline a lesson',
        'Assignment ideas',
        'Write feedback for a student',
      ]}
    />
  );
}