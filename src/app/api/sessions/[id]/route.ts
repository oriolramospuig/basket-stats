import { NextRequest, NextResponse } from 'next/server';
import db, { initializeDatabase } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// DELETE a session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await db.execute({
      sql: 'DELETE FROM shooting_sessions WHERE id = ?',
      args: [parseInt(id)],
    });

    return NextResponse.json({ message: 'Sesión eliminada' });
  } catch (error) {
    console.error('Delete session error:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la sesión' },
      { status: 500 }
    );
  }
}

// PUT update a session
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializeDatabase();

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const data = await request.json();

    const {
      session_date,
      free_throws_made,
      free_throws_attempted,
      three_pointers_made,
      three_pointers_attempted,
      notes,
    } = data;

    await db.execute({
      sql: `
        UPDATE shooting_sessions 
        SET session_date = ?, 
            free_throws_made = ?, 
            free_throws_attempted = ?,
            three_pointers_made = ?, 
            three_pointers_attempted = ?,
            notes = ?
        WHERE id = ?
      `,
      args: [
        session_date,
        free_throws_made || 0,
        free_throws_attempted || 0,
        three_pointers_made || 0,
        three_pointers_attempted || 0,
        notes || null,
        parseInt(id),
      ],
    });

    return NextResponse.json({ message: 'Sesión actualizada' });
  } catch (error) {
    console.error('Update session error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la sesión' },
      { status: 500 }
    );
  }
}
