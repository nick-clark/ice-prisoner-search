import pool from '@/lib/db';
import Link from 'next/link';
import { Search, MapPin, Hash, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q: string }>;
}) {
    const { q } = await searchParams;

    // Reusing logic from API, or better yet, just using DB directly here since it's a Server Component
    // We avoid the API hop.

    if (!q || q.length < 2) {
        return (
            <div className="flex min-h-screen flex-col items-center bg-slate-950 px-4 pt-20 text-slate-100">
                <p>Please enter a valid name to search.</p>
                <Link href="/" className="mt-4 text-blue-400 hover:underline">Back to Home</Link>
            </div>
        );
    }

    const parts = q.trim().split(/\s+/);
    let queryText = '';
    let queryParams: string[] = [];

    if (parts.length === 1) {
        queryText = `
      SELECT * FROM detainees 
      WHERE first_name ILIKE $1 OR last_name ILIKE $1
      ORDER BY last_name, first_name
      LIMIT 100
    `;
        queryParams = [`%${parts[0]}%`];
    } else {
        queryText = `
      SELECT * FROM detainees 
      WHERE (first_name ILIKE $1 AND last_name ILIKE $2)
      ORDER BY last_name, first_name
      LIMIT 100
    `;
        queryParams = [`%${parts[0]}%`, `%${parts[parts.length - 1]}%`];
    }

    let results = [];
    try {
        const client = await pool.connect();
        const res = await client.query(queryText, queryParams);
        client.release();
        results = res.rows;
    } catch (err) {
        console.error(err);
    }

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Search Results for "{q}"</h1>
                    <Link href="/" className="text-sm text-blue-400 hover:text-blue-300">
                        New Search
                    </Link>
                </div>

                {results.length === 0 ? (
                    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-12 text-center">
                        <p className="text-slate-400">No matching records found.</p>
                        <div className="mt-6">
                            <p className="text-sm text-slate-500">Know where they are? Add them manually.</p>
                            <Link href="/submit" className="mt-2 inline-block rounded-md bg-slate-800 px-4 py-2 text-sm font-medium hover:bg-slate-700">
                                Add a Record
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {results.map((row) => (
                            <div key={row.id} className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-sm transition hover:border-slate-700">
                                <div className="flex items-start justify-between">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900/30 text-blue-400">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <span className="rounded-full bg-slate-800 px-2 py-1 text-xs font-medium text-slate-400 uppercase tracking-wide">
                                        {row.source_type}
                                    </span>
                                </div>

                                <h2 className="mt-4 text-xl font-bold text-white">
                                    {row.first_name} {row.middle_name ? row.middle_name + ' ' : ''}{row.last_name}
                                </h2>

                                <div className="mt-4 space-y-3">
                                    <div className="flex items-center text-sm text-slate-400">
                                        <Hash className="mr-2 h-4 w-4 opacity-70" />
                                        <span className="font-mono text-blue-200">A-Number: {row.ice_a_number}</span>
                                    </div>
                                    {row.facility_name && (
                                        <div className="flex items-center text-sm text-slate-400">
                                            <MapPin className="mr-2 h-4 w-4 opacity-70" />
                                            <span>{row.facility_name} {row.facility_state ? `(${row.facility_state})` : ''}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
