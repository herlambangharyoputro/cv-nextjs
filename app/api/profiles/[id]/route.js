import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET single profile
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

// PUT - update profile
export async function PUT(request, { params }) {
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

// DELETE - hapus profile
export async function DELETE(request, { params }) {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', params.id)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json({ message: 'Deleted successfully' })
}