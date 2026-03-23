'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  CalendarCheck,
  Bell,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/ThemeProvider';
import Image from 'next/image';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Patients', href: '/patients', icon: Users },
  { label: 'Doctors', href: '/doctors', icon: UserSquare2 },
  { label: 'Appointments', href: '/appointments', icon: CalendarCheck },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { tenant } = useTheme();

  return (
    <aside className="hidden md:flex flex-col w-[var(--sidebar-width,260px)] min-h-screen bg-card border-r border-border shrink-0">
      {/* Brand */}
      <div className="flex items-center justify-center h-16 border-b border-border px-4">
        {tenant?.logo_url ? (
          <Image src={tenant.logo_url} alt={tenant.name} width={120} height={36} className="object-contain max-h-9" />
        ) : (
          <span className="text-lg font-bold text-primary truncate">
            {tenant?.name ?? 'Clinic SaaS'}
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
