import { DashboardShell } from '@/components/layout/DashboardShell';

import { AIAgentLauncher } from '@/features/ai-agent/AIAgentLauncher';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardShell>{children}</DashboardShell>
      <AIAgentLauncher />
    </>
  );
}
