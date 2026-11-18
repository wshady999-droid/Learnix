import { PageHeader } from '@/components/ui/PageHeader';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

export default function Lessons() {
  return (
    <>
      <PageHeader title="Lessons" subtitle="Your active lesson across all enrolled courses." />
      <PagePlaceholder label="Lesson Player" />
    </>
  );
}
