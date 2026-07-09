import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'board.json');

async function ensureDirAndFile() {
  const dir = path.dirname(DATA_FILE);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    // Ignore if directory exists
  }
  
  try {
    await fs.access(DATA_FILE);
  } catch (e) {
    // Create empty file if not exists
    await fs.writeFile(DATA_FILE, JSON.stringify([]), 'utf-8');
  }
}

async function readPosts() {
  await ensureDirAndFile();
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writePosts(posts: any[]) {
  await ensureDirAndFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const posts = await readPosts();
    // Sort by latest first
    const sorted = [...posts].sort((a: any, b: any) => b.createdAt - a.createdAt);
    return NextResponse.json(sorted);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nickname, password, content } = body;

    if (!nickname || !password || !content) {
      return NextResponse.json({ error: 'Missing nickname, password, or content' }, { status: 400 });
    }

    if (nickname.trim().length > 30 || content.trim().length > 1000) {
      return NextResponse.json({ error: 'Content size exceeded limit' }, { status: 400 });
    }

    const posts = await readPosts();
    const newPost = {
      id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
      nickname: nickname.trim(),
      password, // In a real app this should be hashed, but simple plaintext check is fine for a basic free board
      content: content.trim(),
      createdAt: Date.now()
    };

    posts.push(newPost);
    await writePosts(posts);

    // Don't return password to client
    const { password: _, ...safePost } = newPost;
    return NextResponse.json(safePost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id, password } = body;

    if (!id || !password) {
      return NextResponse.json({ error: 'Missing post ID or password' }, { status: 400 });
    }

    const posts = await readPosts();
    const postIndex = posts.findIndex((p: any) => p.id === id);

    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const MASTER_PASSWORD = process.env.ADMIN_PASSWORD || 'admin1234';

    // Allow deletion if the password matches either the post's password OR the admin master password
    if (posts[postIndex].password !== password && password !== MASTER_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 403 });
    }

    posts.splice(postIndex, 1);
    await writePosts(posts);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
