import { supabase } from '@/services/supabase';

export type MyProfile = {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
};

export async function fetchMyProfile(userId: string): Promise<MyProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, email, phone, institution')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const p: any = data;
  return {
    fullName: p.full_name ?? '',
    email: p.email ?? '',
    phone: p.phone ?? '',
    institution: p.institution ?? '',
  };
}

export async function updateMyProfile(
  userId: string,
  input: { fullName: string; phone: string; institution: string }
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: input.fullName,
      phone: input.phone || null,
      institution: input.institution || null,
    })
    .eq('id', userId);

  if (error) throw error;
}