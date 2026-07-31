import { PageHeader } from "@/components/ui";
import KnowledgeClient from "./knowledge-client";

export default function KnowledgePage() {
  return (
    <>
      <PageHeader
        title="Knowledge"
        subtitle="Teach the AI your business so it answers like your best rep."
        demo
      />
      <KnowledgeClient />
    </>
  );
}
