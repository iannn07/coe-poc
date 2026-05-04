'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Master Data', href: '/system-config/master-data' },
  { label: 'User Management', href: '/system-config/user-management' },
  { label: 'Audit Trail', href: '/system-config/audit-trail' },
  { label: 'Event Log', href: '/system-config/event-log' },
]

export function SystemConfigNav() {
  const pathname = usePathname()

  return (
    <div className="flex gap-1 border-b">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
            pathname === item.href
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}