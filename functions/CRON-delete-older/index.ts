import { createClient } from '@supabase/supabase-js';
//version before i realized there is a postgres plugin
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

export async function handler(req: Request) {
  const { error } = await supabase.rpc('archive_and_delete_old_orders');

  if (error) {
    return new Response(JSON.stringify({ error: 'Failed to archive and delete old orders' }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'Orders older than 1 week archived and deleted' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
