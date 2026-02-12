import { NextRequest, NextResponse } from 'next/server';
import db, { initializeDatabase } from '@/lib/db';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Find user
    const result = await db.execute({
      sql: 'SELECT id, username, password_hash, display_name FROM users WHERE username = ?',
      args: [username.toLowerCase()],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash as string);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: user.id as number,
      username: user.username as string,
      displayName: user.display_name as string,
    });

    // Set cookie
    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    );
  }
}
