import { getUsers } from './actions'
import { UserTable } from './components/user-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function UserManagementPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  const users = await getUsers()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar User</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable initialUsers={users} currentUserId={user!.id} />
        </CardContent>
      </Card>
    </div>
  )
}