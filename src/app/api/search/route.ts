import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q');

    if (!q || q.length < 2) {
        return NextResponse.json({ results: [] });
    }

    // Basic partial match on First OR Last name
    // Using ILIKE for case-insensitive matching
    // We split by space to try to find "First Last"
    const parts = q.trim().split(/\s+/);

    let queryText = '';
    let queryParams: string[] = [];

    if (parts.length === 1) {
        // Single word search: match against first OR last
        queryText = `
      SELECT * FROM detainees 
      WHERE first_name ILIKE $1 OR last_name ILIKE $1
      ORDER BY last_name, first_name
      LIMIT 50
    `;
        queryParams = [`%${parts[0]}%`];
    } else {
        // Multi word search: Assume "First Last" or "Last First" logic ??
        // Simplest: Match ANY part against name fields?
        // Or strict: First word ~ first_name, Last word ~ last_name

        // Let's try to find records where EITHER (first matches part 0 AND last matches part 1)
        queryText = `
      SELECT * FROM detainees 
      WHERE (first_name ILIKE $1 AND last_name ILIKE $2)
      ORDER BY last_name, first_name
      LIMIT 50
    `;
        queryParams = [`%${parts[0]}%`, `%${parts[parts.length - 1]}%`];
    }

    try {
        const client = await pool.connect();
        const result = await client.query(queryText, queryParams);
        client.release();
        return NextResponse.json({ results: result.rows });
    } catch (err) {
        console.error('Search error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
