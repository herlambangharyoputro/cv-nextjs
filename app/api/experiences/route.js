import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { checkAuth, unauthorizedResponse } from '@/lib/auth-middleware'

// GET - Public
export async function GET() {
  const { data, error } = await supabase
    .from('work_experiences')
    .select(`
      *,
      work_achievements (*),
      technologies_used (*)
    `)
    .order('start_date', { ascending: false })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json(data)
}

// POST - Protected
export async function POST(request) {
  const { authenticated } = await checkAuth(request)
  
  if (!authenticated) {
    return unauthorizedResponse()
  }

  const body = await request.json()
  const { achievements, technologies, ...experienceData } = body
  
  // Insert experience
  const { data: experience, error: expError } = await supabase
    .from('work_experiences')
    .insert([experienceData])
    .select()
    .single()
  
  if (expError) {
    return NextResponse.json({ error: expError.message }, { status: 400 })
  }

  // Insert achievements if provided
  if (achievements && achievements.length > 0) {
    const achievementsData = achievements.map(ach => ({
      work_experience_id: experience.id,
      achievement: ach.achievement,
      category: ach.category,
      order_position: ach.order_position
    }))
    
    await supabase.from('work_achievements').insert(achievementsData)
  }

  // Insert technologies if provided
  if (technologies && technologies.length > 0) {
    await supabase.from('technologies_used').insert([{
      work_experience_id: experience.id,
      technologies: technologies
    }])
  }
  
  return NextResponse.json(experience, { status: 201 })
}