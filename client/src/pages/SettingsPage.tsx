import { LogOut01 } from '@untitledui/icons';
import { PageHeader } from '@/components/PageHeader';
import { Panel } from '@/components/Panel';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/AuthContext';
import { useSignOut } from '@/features/auth/useSignOut';
import { AppearanceSettings } from '@/features/settings/AppearanceSettings';
import { ProfileForm } from '@/features/settings/ProfileForm';

export default function SettingsPage() {
  const { user } = useAuth();
  const signOut = useSignOut();
  if (!user) return null; // ProtectedRoute guarantees a user; this narrows the type

  return (
    <>
      <PageHeader title="Settings" description="Your profile and how Retain looks." />
      <div className="flex flex-col gap-6">
        <ProfileForm user={user} />
        <AppearanceSettings />
        <Panel
          title="Sign out"
          description="End your session on this device."
          actions={
            <Button variant="secondary" onClick={signOut}>
              <LogOut01 aria-hidden />
              Sign out
            </Button>
          }
        />
      </div>
    </>
  );
}
