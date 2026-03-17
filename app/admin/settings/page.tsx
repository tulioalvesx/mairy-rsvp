import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSettingsClient from "./AdminSettingsClient";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", "mairy-pain-80")
    .single();

  return <AdminSettingsClient event={event} />;
}