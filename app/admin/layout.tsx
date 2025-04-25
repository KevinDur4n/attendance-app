import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }
  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-black to-amber-900/40 p-4">
      {children}
    </section>
  );
}
