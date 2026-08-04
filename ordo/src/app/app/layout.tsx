import { DayProvider } from "@/providers/day-provider";
import { AuthGate } from "@/components/auth/auth-gate";
import { ToastProvider } from "@/components/ui/toast";
import { OnboardingGate } from "@/components/app/onboarding";
import { ActivityProvider } from "@/providers/activity-provider";
import { InboxProvider } from "@/providers/inbox-provider";
import { SyncProvider } from "@/providers/sync-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <OnboardingGate>
        <DayProvider>
          <ToastProvider>
            <ActivityProvider>
              <InboxProvider>
                <SyncProvider>{children}</SyncProvider>
              </InboxProvider>
            </ActivityProvider>
          </ToastProvider>
        </DayProvider>
      </OnboardingGate>
    </AuthGate>
  );
}
