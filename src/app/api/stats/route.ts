import { NextRequest, NextResponse } from 'next/server';
import db, { initializeDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const period = searchParams.get('period') || 'all'; // daily, weekly, monthly, yearly, all
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build date filter based on period
    let dateFilter = '';
    const now = new Date();
    
    if (startDate && endDate) {
      dateFilter = `AND session_date BETWEEN '${startDate}' AND '${endDate}'`;
    } else {
      switch (period) {
        case 'daily':
          dateFilter = `AND session_date = date('now')`;
          break;
        case 'weekly':
          dateFilter = `AND session_date >= date('now', '-7 days')`;
          break;
        case 'monthly':
          dateFilter = `AND session_date >= date('now', '-30 days')`;
          break;
        case 'yearly':
          dateFilter = `AND session_date >= date('now', '-365 days')`;
          break;
      }
    }

    const userFilter = userId ? `AND user_id = ${parseInt(userId)}` : '';

    // Aggregate stats
    const statsResult = await db.execute(`
      SELECT 
        COUNT(*) as total_sessions,
        COALESCE(SUM(free_throws_made), 0) as total_free_throws_made,
        COALESCE(SUM(free_throws_attempted), 0) as total_free_throws_attempted,
        COALESCE(SUM(three_pointers_made), 0) as total_three_pointers_made,
        COALESCE(SUM(three_pointers_attempted), 0) as total_three_pointers_attempted
      FROM shooting_sessions
      WHERE 1=1 ${userFilter} ${dateFilter}
    `);

    const stats = statsResult.rows[0];
    
    const ftMade = Number(stats.total_free_throws_made) || 0;
    const ftAttempted = Number(stats.total_free_throws_attempted) || 0;
    const tpMade = Number(stats.total_three_pointers_made) || 0;
    const tpAttempted = Number(stats.total_three_pointers_attempted) || 0;

    const freeThrowPercentage = ftAttempted > 0 ? (ftMade / ftAttempted) * 100 : 0;
    const threePointerPercentage = tpAttempted > 0 ? (tpMade / tpAttempted) * 100 : 0;
    const totalMade = ftMade + tpMade;
    const totalAttempted = ftAttempted + tpAttempted;
    const overallPercentage = totalAttempted > 0 ? (totalMade / totalAttempted) * 100 : 0;

    // Daily breakdown for charts
    const dailyResult = await db.execute(`
      SELECT 
        session_date as date,
        SUM(free_throws_made) as free_throws_made,
        SUM(free_throws_attempted) as free_throws_attempted,
        SUM(three_pointers_made) as three_pointers_made,
        SUM(three_pointers_attempted) as three_pointers_attempted
      FROM shooting_sessions
      WHERE 1=1 ${userFilter} ${dateFilter}
      GROUP BY session_date
      ORDER BY session_date ASC
    `);

    const dailyStats = dailyResult.rows.map((row) => {
      const ftM = Number(row.free_throws_made) || 0;
      const ftA = Number(row.free_throws_attempted) || 0;
      const tpM = Number(row.three_pointers_made) || 0;
      const tpA = Number(row.three_pointers_attempted) || 0;
      
      return {
        date: row.date,
        free_throws_made: ftM,
        free_throws_attempted: ftA,
        three_pointers_made: tpM,
        three_pointers_attempted: tpA,
        free_throw_percentage: ftA > 0 ? (ftM / ftA) * 100 : 0,
        three_pointer_percentage: tpA > 0 ? (tpM / tpA) * 100 : 0,
        overall_percentage: (ftA + tpA) > 0 ? ((ftM + tpM) / (ftA + tpA)) * 100 : 0,
      };
    });

    return NextResponse.json({
      stats: {
        total_sessions: Number(stats.total_sessions),
        total_free_throws_made: ftMade,
        total_free_throws_attempted: ftAttempted,
        total_three_pointers_made: tpMade,
        total_three_pointers_attempted: tpAttempted,
        free_throw_percentage: Math.round(freeThrowPercentage * 10) / 10,
        three_pointer_percentage: Math.round(threePointerPercentage * 10) / 10,
        overall_percentage: Math.round(overallPercentage * 10) / 10,
      },
      daily: dailyStats,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}
