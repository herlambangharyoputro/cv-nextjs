import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { checkAuth, unauthorizedResponse } from '@/lib/auth-middleware'

// GET - Public
export async function GET(request, { params }) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json(data)
}

// PUT - Protected
export async function PUT(request, { params }) {
  const { authenticated } = await checkAuth(request)
  
  if (!authenticated) {
    return unauthorizedResponse()
  }

  const body = await request.json()
  
  const { data, error } = await supabase
    .from('profiles')
    .update(body)
    .eq('id', params.id)
    .select()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json(data[0])
}

// DELETE - Protected
export async function DELETE(request, { params }) {
  const { authenticated } = await checkAuth(request)
  
  if (!authenticated) {
    return unauthorizedResponse()
  }

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', params.id)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json({ message: 'Deleted successfully' })
}