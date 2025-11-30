import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { checkAuth, unauthorizedResponse } from '@/lib/auth-middleware'

// GET - Public
export async function GET(request, { params }) {
  const { data, error } = await supabase
    .from('work_experiences')
    .select(`
      *,
      work_achievements (*),
      technologies_used (*)
    `)
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
  const { achievements, technologies, ...experienceData } = body
  
  // Update experience
  const { data: experience, error: expError } = await supabase
    .from('work_experiences')
    .update(experienceData)
    .eq('id', params.id)
    .select()
    .single()
  
  if (expError) {
    return NextResponse.json({ error: expError.message }, { status: 400 })
  }

  // Delete old achievements and insert new ones
  if (achievements !== undefined) {
    await supabase.from('work_achievements').delete().eq('work_experience_id', params.id)
    
    if (achievements.length > 0) {
      const achievementsData = achievements.map(ach => ({
        work_experience_id: params.id,
        achievement: ach.achievement,
        category: ach.category,
        order_position: ach.order_position
      }))
      await supabase.from('work_achievements').insert(achievementsData)
    }
  }

  // Update technologies
  if (technologies !== undefined) {
    await supabase.from('technologies_used').delete().eq('work_experience_id', params.id)
    
    if (technologies.length > 0) {
      await supabase.from('technologies_used').insert([{
        work_experience_id: params.id,
        technologies: technologies
      }])
    }
  }
  
  return NextResponse.json(experience)
}

// DELETE - Protected
export async function DELETE(request, { params }) {
  const { authenticated } = await checkAuth(request)
  
  if (!authenticated) {
    return unauthorizedResponse()
  }

  // Cascade delete handled by database foreign keys
  const { error } = await supabase
    .from('work_experiences')
    .delete()
    .eq('id', params.id)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json({ message: 'Deleted successfully' })
}