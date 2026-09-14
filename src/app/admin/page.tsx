import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import AdminDashboard from "@/components/AdminDashboard";

export default async function AdminPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}
