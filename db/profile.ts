import { Database } from '@/db/database.types'
import { SupabaseClient, User } from '@supabase/supabase-js'

export type Profile = Database['public']['Tables']['profiles']['Row']

export function isAdmin(user: User | null) {
  const ADMINS = ['rachel.weinberg12@gmail.com', 'akrolsmir@gmail.com']
  return ADMINS.includes(user?.email ?? '')
}

export async function getProfileById(
  supabase: SupabaseClient<Database>,
  id: string = ''
) {
  if (!id) {
    return { id, username: id }
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
  if (error) {
    throw error
  }
  return data[0] ? data[0] : { id, username: id }
}

export async function getProfileByUsername(
  supabase: SupabaseClient,
  username: string = ''
) {
  if (!username) {
    return { id: null, username }
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
  if (error) {
    throw error
  }
  return data[0] ? data[0] : { id: null, username }
}

export async function getUser(supabase: SupabaseClient<Database>) {
  const resp = await supabase.auth.getUser()
  return resp.data.user
}
