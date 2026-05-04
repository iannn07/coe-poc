import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LogoutButton } from './components/logout-button'

const roleLabel: Record<string, string> = {
  super_admin: 'Super Admin',
  cms: 'CMS',
  cf: 'Corporate Function',
  sbu: 'SBU',
  view_only: 'View Only',
}

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-muted-foreground mt-1">Informasi akun kamu</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-xl">
                {profile?.full_name?.charAt(0) ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{profile?.full_name || 'User'}</CardTitle>
              <Badge variant="secondary" className="mt-1">
                {roleLabel[profile?.role] ?? profile?.role}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-sm font-medium">{profile?.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="text-sm font-medium">{roleLabel[profile?.role] ?? profile?.role}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Member sejak</p>
            <p className="text-sm font-medium">
              {new Date(profile?.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className="pt-2 border-t">
            <LogoutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}