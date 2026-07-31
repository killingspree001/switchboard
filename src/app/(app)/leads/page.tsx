import { PageHeader } from "@/components/ui";
import LeadsClient from "./leads-client";

export default function LeadsPage() {
  return (
    <>
      <PageHeader
        title="Leads"
        subtitle="Everyone the AI has talked to, tagged by how warm they are."
        demo
      />
      <LeadsClient />
    </>
  );
}
