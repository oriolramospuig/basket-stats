import { NextRequest, NextResponse } from 'next/server';
import db, { initializeDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    const { searchParams } = new URL(request.url);
    const userIds = searchParams.get('userIds'); // comma-separated user IDs
    const period = searchParams.get('period') || 'all';

    if (!userIds) {
      return NextResponse.json(
        { error: 'Se requieren IDs de usuarios para comparar' },
        { status: 400 }
      );
    }

    const userIdArray = userIds.split(',').map((id) => parseInt(id.trim()));

    // Build date filter based on period
    let dateFilter = '';
    switch (period) {
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

    const comparisons = await Promise.all(
      userIdArray.map(async (userId) => {
        const result = await db.execute(`
          SELECT 
            u.id as user_id,
            u.display_name,
            COUNT(s.id) as total_sessions,
            COALESCE(SUM(s.free_throws_made), 0) as total_free_throws_made,
            COALESCE(SUM(s.free_throws_attempted), 0) as total_free_throws_attempted,
            COALESCE(SUM(s.three_pointers_made), 0) as total_three_pointers_made,
            COALESCE(SUM(s.three_pointers_attempted), 0) as total_three_pointers_attempted
          FROM users u
          LEFT JOIN shooting_sessions s ON u.id = s.user_id ${dateFilter ? dateFilter.replace('AND', 'AND') : ''}
          WHERE u.id = ?
          GROUP BY u.id, u.display_name
        `, { args: [userId] });

        if (result.rows.length === 0) {
          return null;
        }

        const row = result.rows[0];
        const ftMade = Number(row.total_free_throws_made) || 0;
        const ftAttempted = Number(row.total_free_throws_attempted) || 0;
        const tpMade = Number(row.total_three_pointers_made) || 0;
        const tpAttempted = Number(row.total_three_pointers_attempted) || 0;

        return {
          user_id: row.user_id,
          display_name: row.display_name,
          total_sessions: Number(row.total_sessions) || 0,
          total_free_throws_made: ftMade,
          total_free_throws_attempted: ftAttempted,
          total_three_pointers_made: tpMade,
          total_three_pointers_attempted: tpAttempted,
          free_throw_percentage: ftAttempted > 0 ? Math.round((ftMade / ftAttempted) * 1000) / 10 : 0,
          three_pointer_percentage: tpAttempted > 0 ? Math.round((tpMade / tpAttempted) * 1000) / 10 : 0,
          overall_percentage: (ftAttempted + tpAttempted) > 0 
            ? Math.round(((ftMade + tpMade) / (ftAttempted + tpAttempted)) * 1000) / 10 
            : 0,
        };
      })
    );

    return NextResponse.json({
      comparisons: comparisons.filter(Boolean),
    });
  } catch (error) {
    console.error('Compare stats error:', error);
    return NextResponse.json(
      { error: 'Error al comparar estadísticas' },
      { status: 500 }
    );
  }
}
