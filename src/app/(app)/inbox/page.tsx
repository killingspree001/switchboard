import { PageHeader } from "@/components/ui";
import InboxClient from "./inbox-client";

export default function InboxPage() {
  return (
    <>
      <PageHeader
        title="Inbox"
        subtitle="Calls, WhatsApp and Instagram in one stream."
        demo
      />
      <InboxClient />
    </>
  );
}
