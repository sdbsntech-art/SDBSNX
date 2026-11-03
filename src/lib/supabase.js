const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

let clientPromise;

export async function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.');
  }

  let endpoint;
  try {
    endpoint = new URL(supabaseUrl);
  } catch {
    throw new Error('VITE_SUPABASE_URL must be a valid Supabase project URL.');
  }
  if (
    endpoint.protocol !== 'https:'
    || !endpoint.hostname.endsWith('.supabase.co')
    || endpoint.pathname !== '/'
    || endpoint.search
    || endpoint.hash
  ) {
    throw new Error('VITE_SUPABASE_URL must be the new project URL, without /rest/v1 or other paths.');
  }
  if (!supabaseAnonKey.startsWith('sb_publishable_')) {
    throw new Error('VITE_SUPABASE_ANON_KEY must contain the new project publishable key.');
  }

  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js')
      .then(({ createClient }) => createClient(supabaseUrl, supabaseAnonKey))
      .catch((error) => {
        clientPromise = undefined;
        throw error;
      });
  }

  return clientPromise;
}
