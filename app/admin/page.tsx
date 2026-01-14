

import { getIsAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { AdminClient } from "./admin-client";

const AdminPage = async () => {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) {
    redirect("/");
  }

  return <AdminClient />
};

export default AdminPage;
