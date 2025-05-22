import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function subscribeToChats(reportId: string, callback: (payload: any) => void) {
  const supabase = createClientComponentClient();
  
  return supabase
    .channel(`report-${reportId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chats',
      filter: `report_id=eq.${reportId}`
    }, callback)
    .subscribe();
}