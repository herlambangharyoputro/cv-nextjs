import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// Get today's date string (YYYY-MM-DD)
function getTodayDate() {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

// GET - Retrieve visitor statistics
export async function GET() {
  try {
    const today = getTodayDate()
    
    // Get all stats
    const { data: allStats, error: allError } = await supabase
      .from('visitor_stats')
      .select('*')
      .order('visit_date', { ascending: false })
    
    if (allError) throw allError
    
    // Calculate totals
    const totalVisits = allStats.reduce((sum, stat) => sum + stat.total_visits, 0)
    const totalUnique = allStats.reduce((sum, stat) => sum + stat.unique_visitors, 0)
    
    // Get today's stats
    const todayStats = allStats.find(stat => stat.visit_date === today) || {
      total_visits: 0,
      unique_visitors: 0
    }
    
    // Build daily stats object
    const dailyStats = {}
    allStats.forEach(stat => {
      dailyStats[stat.visit_date] = {
        visits: stat.total_visits,
        unique: stat.unique_visitors
      }
    })
    
    return NextResponse.json({
      totalVisits,
      uniqueVisitors: totalUnique,
      todayVisits: todayStats.total_visits,
      todayUnique: todayStats.unique_visitors,
      dailyStats,
      lastUpdated: allStats[0]?.updated_at || new Date().toISOString()
    })
  } catch (error) {
    console.error('Error getting visitor stats:', error)
    return NextResponse.json(
      { error: 'Failed to get visitor stats' },
      { status: 500 }
    )
  }
}

// POST - Record a new visit
export async function POST(request) {
  try {
    const body = await request.json()
    const { sessionId } = body
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }
    
    const today = getTodayDate()
    
    // Get or create today's record
    let { data: todayRecord, error: fetchError } = await supabase
      .from('visitor_stats')
      .select('*')
      .eq('visit_date', today)
      .single()
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine
      throw fetchError
    }
    
    // If no record exists for today, create one
    if (!todayRecord) {
      const { data: newRecord, error: insertError } = await supabase
        .from('visitor_stats')
        .insert({
          visit_date: today,
          total_visits: 1,
          unique_visitors: 1,
          session_ids: [sessionId]
        })
        .select()
        .single()
      
      if (insertError) throw insertError
      
      // Get total stats
      const { data: allStats } = await supabase
        .from('visitor_stats')
        .select('total_visits, unique_visitors')
      
      const totalVisits = allStats.reduce((sum, stat) => sum + stat.total_visits, 0)
      const totalUnique = allStats.reduce((sum, stat) => sum + stat.unique_visitors, 0)
      
      return NextResponse.json({
        success: true,
        totalVisits,
        uniqueVisitors: totalUnique,
        todayVisits: 1,
        todayUnique: 1,
        isNewVisitor: true
      })
    }
    
    // Check if this session has already visited today
    const sessionIds = todayRecord.session_ids || []
    const isNewVisitor = !sessionIds.includes(sessionId)
    
    // Update the record
    const newSessionIds = isNewVisitor 
      ? [...sessionIds, sessionId]
      : sessionIds
    
    const { data: updatedRecord, error: updateError } = await supabase
      .from('visitor_stats')
      .update({
        total_visits: todayRecord.total_visits + 1,
        unique_visitors: isNewVisitor 
          ? todayRecord.unique_visitors + 1 
          : todayRecord.unique_visitors,
        session_ids: newSessionIds
      })
      .eq('visit_date', today)
      .select()
      .single()
    
    if (updateError) throw updateError
    
    // Get total stats
    const { data: allStats } = await supabase
      .from('visitor_stats')
      .select('total_visits, unique_visitors')
    
    const totalVisits = allStats.reduce((sum, stat) => sum + stat.total_visits, 0)
    const totalUnique = allStats.reduce((sum, stat) => sum + stat.unique_visitors, 0)
    
    return NextResponse.json({
      success: true,
      totalVisits,
      uniqueVisitors: totalUnique,
      todayVisits: updatedRecord.total_visits,
      todayUnique: updatedRecord.unique_visitors,
      isNewVisitor
    })
  } catch (error) {
    console.error('Error recording visit:', error)
    return NextResponse.json(
      { error: 'Failed to record visit' },
      { status: 500 }
    )
  }
}