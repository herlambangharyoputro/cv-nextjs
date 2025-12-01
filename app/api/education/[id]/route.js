import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { checkAuth, unauthorizedResponse } from '@/lib/auth-middleware'

// GET - Public
export async function GET(request, context) {
  const params = await context.params
  const id = parseInt(params.id)
  
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('education')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json(data)
}

// PUT - Protected
export async function PUT(request, context) {
  const { authenticated } = await checkAuth(request)
  
  if (!authenticated) {
    return unauthorizedResponse()
  }

  try {
    const params = await context.params
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const body = await request.json()
    const { profile_id, ...updateData } = body
    
    const { data, error } = await supabase
      .from('education')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Protected
export async function DELETE(request, context) {
  const { authenticated } = await checkAuth(request)
  
  if (!authenticated) {
    return unauthorizedResponse()
  }

  const params = await context.params
  const id = parseInt(params.id)
  
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', id)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json({ message: 'Deleted successfully' })
}