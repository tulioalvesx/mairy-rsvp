import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import ConfirmPageClient from "./ConfirmPageClient";

export default async function ConfirmPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !event) {
    notFound();
  }

  return <ConfirmPageClient event={event} />;
}