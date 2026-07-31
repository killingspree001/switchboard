import { redirect } from "next/navigation";

// the workspace is the whole app, so the root just goes to it
export default function Home() {
  redirect("/dashboard");
}
