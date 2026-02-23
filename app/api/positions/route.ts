import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Avoid throwing at module import time. Create the server client lazily
// inside each handler so the route always returns JSON errors instead
// of an HTML 500 page when env vars are missing.
const createSupabaseServer = () => {
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;
  return createClient(supabaseUrl, supabaseServiceRoleKey);
};

export async function POST(request: Request) {
  try {
    const supabaseServer = createSupabaseServer();
    if (!supabaseServer) {
      return NextResponse.json(
        {
          error:
            'Server Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
        },
        { status: 500 }
      );
    }
    const body = await request.json();
    if (!body || !body.label || !body.form_url) {
      return NextResponse.json(
        { error: 'label and form_url are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('positions')
      .insert([body])
      .select();
    console.log('inserting from backend api route');
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabaseServer = createSupabaseServer();
    if (!supabaseServer) {
      return NextResponse.json(
        {
          error:
            'Server Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
        },
        { status: 500 }
      );
    }
    const body = await request.json();
    const { id, ...update } = body;
    if (!id) {
      return NextResponse.json({ error: 'id is required for update' }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from('positions')
      .update(update)
      .eq('id', id)
      .select();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
