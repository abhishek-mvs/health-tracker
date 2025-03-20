import { redirect } from "next/navigation";

export default function ProtectedPage() {
  // Redirect to the dashboard/groups page
  redirect("/dashboard/groups");
}
