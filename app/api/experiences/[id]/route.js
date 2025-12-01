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
    .from('work_experiences')
    .select(`
      *,
      work_achievements (*),
      technologies_used (*)
    `)
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
    const { achievements, technologies, profile_id, ...experienceData } = body
    
    // Update experience
    const { data: experience, error: expError } = await supabase
      .from('work_experiences')
      .update(experienceData)
      .eq('id', id)
      .select()
      .single()
    
    if (expError) {
      return NextResponse.json({ error: expError.message }, { status: 400 })
    }

    // Delete old achievements and insert new ones
    if (achievements !== undefined) {
      await supabase.from('work_achievements').delete().eq('work_experience_id', id)
      
      if (achievements.length > 0) {
        const achievementsData = achievements.map(ach => ({
          work_experience_id: id,
          achievement: ach.achievement,
          category: ach.category || null,
          order_position: ach.order_position || 0
        }))
        await supabase.from('work_achievements').insert(achievementsData)
      }
    }

    // Update technologies
    if (technologies !== undefined) {
      await supabase.from('technologies_used').delete().eq('work_experience_id', id)
      
      if (technologies.length > 0) {
        await supabase.from('technologies_used').insert([{
          work_experience_id: id,
          technologies: technologies
        }])
      }
    }
    
    return NextResponse.json(experience)
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
    .from('work_experiences')
    .delete()
    .eq('id', id)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json({ message: 'Deleted successfully' })
}