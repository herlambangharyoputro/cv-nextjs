import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET - ambil semua profiles
export async function GET() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json(data)
}

// POST - tambah profile baru
export async function POST(request) {
  const body = await request.json()
  
  const { data, error } = await supabase
    .from('profiles')
    .insert([body])
    .select()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json(data[0], { status: 201 })
}