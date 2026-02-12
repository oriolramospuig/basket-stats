import { NextResponse } from 'next/server';
import db, { initializeDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initializeDatabase();

    const result = await db.execute(
      'SELECT id, username, display_name, created_at FROM users ORDER BY display_name'
    );

    return NextResponse.json({ users: result.rows });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}
