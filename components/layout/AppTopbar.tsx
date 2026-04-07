'use client';

import { useRouter } from 'next/navigation';
import { LogOut, Bell, User, Search, Settings, Calendar, Users, Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/hooks/useAuthStore';
import { ThemeToggle } from './ThemeToggle';
import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '@/lib/api/notifications';
import { formatClinicDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { AISearchBar } from '@/features/ai';
import { useCommunications } from '@/features/ops-intelligence/api';

export function AppTopbar() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [searchFocused, setSearchFocused] = useState(false);

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(5),
  });

  const { data: communications } = useCommunications();
  const unreadMessagesCount = communications?.filter(c => c.status === 'unread').length || 0;

  const unreadCount = notifications?.filter(n => n.status !== 'read').length || 0;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border/60 bg-background/80 backdrop-blur-xl px-6 lg:px-8 transition-all duration-300">
      {/* Search Bar Area */}
      <div className="flex-1 max-w-xl pr-8">
        <AISearchBar />
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        {/* Unified Inbox Icon */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/operations?tab=inbox')}
          className={cn(
            "relative text-muted-foreground hover:text-foreground h-10 w-10 rounded-2xl bg-muted/30 group transition-all active:scale-95",
            unreadMessagesCount > 0 && "text-foreground"
          )}
        >
          <MessageSquare className="h-5.5 w-5.5 group-hover:-rotate-6 transition-transform" />
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-4 ring-background shadow-lg shadow-primary/20 animate-in zoom-in duration-300">
              {unreadMessagesCount}
            </span>
          )}
        </Button>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative text-muted-foreground hover:text-foreground h-10 w-10 rounded-2xl bg-muted/30 group transition-all active:scale-95",
                unreadCount > 0 && "text-foreground"
              )}
            >
              <Bell className="h-5.5 w-5.5 group-hover:rotate-12 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-primary rounded-full ring-4 ring-background animate-pulse" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 rounded-3xl overflow-hidden border-border/60 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-muted/40 p-4 border-b border-border/50">
               <div className="flex items-center justify-between">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Recent Alerts</h3>
                 <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{unreadCount} New</span>
               </div>
            </div>
            <div className="max-h-[350px] overflow-y-auto">
              {notifications && notifications.length > 0 ? (
                <div className="divide-y divide-border/40">
                  {notifications.map((n) => (
                    <DropdownMenuItem 
                      key={n.id} 
                      className="p-4 focus:bg-muted/40 cursor-pointer transition-colors flex flex-col items-start gap-1"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          n.status !== 'read' ? "bg-primary animate-pulse" : "bg-muted-foreground/30"
                        )} />
                        <span className="text-sm font-bold truncate flex-1">{n.title}</span>
                        <span className="text-[10px] font-medium text-muted-foreground opacity-50 whitespace-nowrap">
                          {formatClinicDate(n.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 pl-4 leading-relaxed opacity-70">
                        {n.message}
                      </p>
                    </DropdownMenuItem>
                  ))}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground italic">
                  <Bell className="h-10 w-10 mb-2 opacity-10" />
                  <p className="text-sm">No new notifications</p>
                </div>
              )}
            </div>
            <div className="p-3 bg-muted/20 text-center border-t border-border/40">
               <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest text-primary h-8" onClick={() => router.push('/notifications')}>
                 See all notifications
               </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-3 h-12 pl-3 pr-4 rounded-2xl bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border/40 transition-all duration-300 active:scale-95">
              <Avatar className="h-8 w-8 rounded-xl shadow-sm border border-background">
                <AvatarFallback className="text-[10px] font-bold bg-primary text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start gap-0.5 text-left">
                <span className="text-xs font-extrabold tracking-tight leading-none">{user?.name}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary leading-none opacity-80">{user?.role}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 p-2 rounded-3xl overflow-hidden border-border/60 shadow-2xl animate-in slide-in-from-top-2 duration-300">
            <DropdownMenuLabel className="px-3 py-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-extrabold tracking-tight">{user?.name}</span>
                <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase truncate">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/40 mx-2" />
            <div className="p-1 space-y-1">
              <DropdownMenuItem onClick={() => router.push('/settings')} className="rounded-xl gap-3 p-2.5">
                <User className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl gap-3 p-2.5">
                <Settings className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium">Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl gap-3 p-2.5">
                <Calendar className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Availability</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="bg-border/40 mx-2" />
            <div className="p-1">
              <DropdownMenuItem onClick={handleLogout} className="rounded-xl gap-3 p-2.5 text-destructive focus:text-destructive focus:bg-destructive/10">
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
