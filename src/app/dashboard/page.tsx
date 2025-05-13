import { type Metadata } from 'next';
import { Account } from '@/src/components/Pages';
import { createClient } from '@/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard | Your Account',
  description: 'Your account dashboard',
};

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  let profile = null;

  if (user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    profile = profileData ?? null;
  }

  return <Account profile={profile} />;
}
