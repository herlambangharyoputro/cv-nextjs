import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const DATA_DIR = path.join(process.cwd(), 'data', 'visitors');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

// Get current stats
async function getStats() {
  try {
    const data = await fs.readFile(STATS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, return initial structure
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      dailyStats: {},
      lastUpdated: new Date().toISOString()
    };
  }
}

// Save stats
async function saveStats(stats) {
  await ensureDataDir();
  await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2));
}

// Get today's date string (YYYY-MM-DD)
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// GET - Retrieve visitor statistics
export async function GET() {
  try {
    const stats = await getStats();
    const today = getTodayDate();
    
    return NextResponse.json({
      totalVisits: stats.totalVisits,
      uniqueVisitors: stats.uniqueVisitors,
      todayVisits: stats.dailyStats[today]?.visits || 0,
      todayUnique: stats.dailyStats[today]?.unique || 0,
      dailyStats: stats.dailyStats,
      lastUpdated: stats.lastUpdated
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get visitor stats' },
      { status: 500 }
    );
  }
}

// POST - Record a new visit
export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId } = body; // sessionId untuk tracking unique visitors
    
    const stats = await getStats();
    const today = getTodayDate();
    
    // Initialize today's stats if not exists
    if (!stats.dailyStats[today]) {
      stats.dailyStats[today] = {
        visits: 0,
        unique: 0,
        visitors: []
      };
    }
    
    // Increment total visits
    stats.totalVisits++;
    stats.dailyStats[today].visits++;
    
    // Check if this is a unique visitor for today
    const isNewVisitor = !stats.dailyStats[today].visitors.includes(sessionId);
    
    if (isNewVisitor) {
      stats.dailyStats[today].unique++;
      stats.dailyStats[today].visitors.push(sessionId);
      stats.uniqueVisitors++;
    }
    
    stats.lastUpdated = new Date().toISOString();
    
    await saveStats(stats);
    
    return NextResponse.json({
      success: true,
      totalVisits: stats.totalVisits,
      uniqueVisitors: stats.uniqueVisitors,
      todayVisits: stats.dailyStats[today].visits,
      todayUnique: stats.dailyStats[today].unique,
      isNewVisitor
    });
  } catch (error) {
    console.error('Error recording visit:', error);
    return NextResponse.json(
      { error: 'Failed to record visit' },
      { status: 500 }
    );
  }
}