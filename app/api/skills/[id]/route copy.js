import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { checkAuth, unauthorizedResponse } from '@/lib/auth-middleware'

// GET - Public
export async function GET(request, { params }) {
  const { data, error } = await supabase
    .from('technical_skills')
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
    .from('technical_skills')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json(data)
}

// DELETE - Protected
export async function DELETE(request, { params }) {
  const { authenticated } = await checkAuth(request)
  
  if (!authenticated) {
    return unauthorizedResponse()
  }

  const { error } = await supabase
    .from('technical_skills')
    .delete()
    .eq('id', params.id)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json({ message: 'Deleted successfully' })
}