import { getBods, getHolidays } from './actions'
import { BodTable } from './components/bod-table'
import { HolidayTable } from './components/holiday-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function MasterDataPage() {
  const [bods, holidays] = await Promise.all([getBods(), getHolidays()])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar BOD</CardTitle>
        </CardHeader>
        <CardContent>
          <BodTable initialBods={bods} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hari Libur Nasional</CardTitle>
        </CardHeader>
        <CardContent>
          <HolidayTable initialHolidays={holidays} />
        </CardContent>
      </Card>
    </div>
  )
}