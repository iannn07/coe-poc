import { getNotifications } from './actions'
import { NotificationsClient } from './components/notifications-client'

export default async function NotificationsPage() {
  const { sent, received } = await getNotifications()

  return <NotificationsClient sent={sent} received={received} />
}