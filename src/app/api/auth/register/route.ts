import { NextRequest, NextResponse } from 'next/server';
import db, { initializeDatabase } from '@/lib/db';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const { username, password, displayName } = await request.json();

    // Validate input
    if (!username || !password || !displayName) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'El nombre de usuario debe tener al menos 3 caracteres' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Check if username exists
    const existingUser = await db.execute({
      sql: 'SELECT id FROM users WHERE username = ?',
      args: [username.toLowerCase()],
    });

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Este nombre de usuario ya existe' },
        { status: 400 }
      );
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const result = await db.execute({
      sql: 'INSERT INTO users (username, password_hash, display_name) VALUES (?, ?, ?)',
      args: [username.toLowerCase(), passwordHash, displayName],
    });

    const userId = Number(result.lastInsertRowid);

    // Generate token
    const token = generateToken({
      userId,
      username: username.toLowerCase(),
      displayName,
    });

    // Set cookie
    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: userId,
        username: username.toLowerCase(),
        displayName,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Error al crear la cuenta' },
      { status: 500 }
    );
  }
}
