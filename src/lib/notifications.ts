import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';


export async function createNotification({
  userId,
  title,
  message,
  type,
  referenceId
}: {
  userId: string;
  title: string;
  message: string;
  type: 'report_update' | 'chat_message' | 'system';
  referenceId?: string;
}) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title,
      message,
      type,
      reference_id: referenceId
    })
    .select()
    .single();

  return { data, error };
}