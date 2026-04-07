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
  Activity,
  Package,
  FlaskConical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/ThemeProvider';
import Image from 'next/image';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Patients', href: '/patients', icon: Users },
  { label: 'Doctors', href: '/doctors', icon: UserSquare2 },
  { label: 'Appointments', href: '/appointments', icon: CalendarCheck },
  { label: 'Operations', href: '/operations', icon: Activity },
  { label: 'Inventory', href: '/inventory', icon: Package },
  { label: 'Procedures', href: '/procedures', icon: FlaskConical },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { tenant } = useTheme();

  return (
    <aside className="hidden md:flex flex-col w-[var(--sidebar-width,260px)] min-h-screen bg-card border-r border-border/60 shrink-0 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
      {/* Brand */}
      <div className="flex items-center px-6 h-20 border-b border-border/40">
        <div className="bg-primary/5 p-2 rounded-xl border border-primary/10">
          {tenant?.logo_url ? (
            <Image src={tenant.logo_url} alt={tenant.name} width={100} height={30} className="object-contain max-h-8" />
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg modern-gradient-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <CalendarCheck className="h-4.5 w-4.5" />
              </div>
              <span className="text-base font-bold tracking-tight text-foreground truncate">
                {tenant?.name ?? 'Clinic SaaS'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto pt-8 px-4 space-y-2 custom-scrollbar">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative overflow-hidden',
                isActive
                  ? 'bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.05)] border border-primary/10'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
              )}
              <Icon className={cn(
                "h-4.5 w-4.5 shrink-0 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
