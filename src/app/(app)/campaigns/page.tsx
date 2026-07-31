import { PageHeader } from "@/components/ui";
import CampaignsClient from "./campaigns-client";

export default function CampaignsPage() {
  return (
    <>
      <PageHeader
        title="Campaigns"
        subtitle="Upload a lead list and let the AI work through it."
        demo
      />
      <CampaignsClient />
    </>
  );
}
