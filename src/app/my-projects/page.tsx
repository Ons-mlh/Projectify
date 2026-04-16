import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from "@/lib/auth";

export default async function MyProjectsPage() {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/api/auth/signin')

  return (
    <main>
      <h1>My Projects</h1>
      <p>Welcome {session.user?.name}</p>
    </main>
  )
}