import { supabase } from './supabase'

export async function getProfileId() {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
    .single()
  
  return data?.id || null
}