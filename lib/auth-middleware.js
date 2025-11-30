import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function checkAuth(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  // Get auth token from header
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return { authenticated: false, user: null }
  }

  const token = authHeader.replace('Bearer ', '')
  
  const { data: { user }, error } = await supabase.auth.getUser(token)
  
  if (error || !user) {
    return { authenticated: false, user: null }
  }
  
  return { authenticated: true, user }
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized. Please login.' },
    { status: 401 }
  )
}