import { getDashboardData } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, AlertTriangle, Users, Clock } from 'lucide-react'
import { MiniCalendar } from '@/components/mini-calendar'

export default async function DashboardPage() {
  const {
    totalEvents,
    totalConflicts,
    recentActivity,
    currentMonthEvents,
    eventPerBod,
  } = await getDashboardData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Ringkasan kalender COE</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Event
            </CardTitle>
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalEvents}</p>
            <p className="text-xs text-muted-foreground mt-1">Semua event terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Event Bentrok
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{totalConflicts}</p>
            <p className="text-xs text-muted-foreground mt-1">Terdeteksi bentrok jadwal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Event per BOD
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-1">
            {eventPerBod.length === 0 && (
              <p className="text-sm text-muted-foreground">Belum ada data</p>
            )}
            {eventPerBod.slice(0, 3).map((bod) => (
              <div key={bod.name} className="flex items-center justify-between">
                <span className="text-sm truncate">{bod.name}</span>
                <Badge variant="secondary">{bod.count}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.length === 0 && (
              <p className="text-sm text-muted-foreground">Belum ada aktivitas</p>
            )}
            {// eslint-disable-next-line @typescript-eslint/no-explicit-any
            recentActivity.map((event: any) => (

              <div key={event.id} className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{event.title}</p>
                  <p className="text-muted-foreground text-xs">
                    {event.profiles?.full_name ?? 'Unknown'} ·{' '}
                    {new Date(event.updated_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <Badge
                  variant={event.status === 'approved' ? 'default' : 'secondary'}
                  className="shrink-0"
                >
                  {event.status === 'approved' ? 'Approved' : 'Need Review'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mini Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MiniCalendar events={currentMonthEvents} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}