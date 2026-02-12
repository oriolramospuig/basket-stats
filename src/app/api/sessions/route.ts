import { NextRequest, NextResponse } from 'next/server';
import db, { initializeDatabase } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// GET all sessions with optional filters
export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const period = searchParams.get('period');
    const limit = searchParams.get('limit') || '50';

    let sql = `
      SELECT s.*, u.display_name as user_display_name 
      FROM shooting_sessions s 
      JOIN users u ON s.user_id = u.id 
      WHERE 1=1
    `;
    const args: (string | number)[] = [];

    if (userId) {
      sql += ' AND s.user_id = ?';
      args.push(parseInt(userId));
    }

    if (startDate) {
      sql += ' AND s.session_date >= ?';
      args.push(startDate);
    }

    if (endDate) {
      sql += ' AND s.session_date <= ?';
      args.push(endDate);
    }

    // Add period filter
    if (period && !startDate && !endDate) {
      switch (period) {
        case 'daily':
          sql += ` AND s.session_date = date('now')`;
          break;
        case 'weekly':
          sql += ` AND s.session_date >= date('now', '-7 days')`;
          break;
        case 'monthly':
          sql += ` AND s.session_date >= date('now', '-30 days')`;
          break;
        case 'yearly':
          sql += ` AND s.session_date >= date('now', '-365 days')`;
          break;
      }
    }

    sql += ' ORDER BY s.session_date DESC, s.created_at DESC LIMIT ?';
    args.push(parseInt(limit));

    const result = await db.execute({ sql, args });

    return NextResponse.json({ sessions: result.rows });
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { error: 'Error al obtener sesiones' },
      { status: 500 }
    );
  }
}

// POST new session
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const {
      user_id,
      session_date,
      free_throws_made,
      free_throws_attempted,
      three_pointers_made,
      three_pointers_attempted,
      notes,
    } = data;

    // Validate required fields
    if (!user_id || !session_date) {
      return NextResponse.json(
        { error: 'Usuario y fecha son requeridos' },
        { status: 400 }
      );
    }

    // Validate numbers
    if (free_throws_made > free_throws_attempted || three_pointers_made > three_pointers_attempted) {
      return NextResponse.json(
        { error: 'Los tiros anotados no pueden ser mayores que los intentados' },
        { status: 400 }
      );
    }

    const result = await db.execute({
      sql: `
        INSERT INTO shooting_sessions 
        (user_id, session_date, free_throws_made, free_throws_attempted, 
         three_pointers_made, three_pointers_attempted, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        user_id,
        session_date,
        free_throws_made || 0,
        free_throws_attempted || 0,
        three_pointers_made || 0,
        three_pointers_attempted || 0,
        notes || null,
      ],
    });

    return NextResponse.json({
      id: Number(result.lastInsertRowid),
      message: 'Sesión guardada correctamente',
    });
  } catch (error) {
    console.error('Create session error:', error);
    return NextResponse.json(
      { error: 'Error al guardar la sesión' },
      { status: 500 }
    );
  }
}
