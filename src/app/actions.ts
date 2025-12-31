'use server';

import pool from '@/lib/db';
import { redirect } from 'next/navigation';

export async function submitRecord(formData: FormData) {
    const first_name = formData.get('first_name') as string;
    const last_name = formData.get('last_name') as string;
    const middle_name = formData.get('middle_name') as string;
    const ice_a_number = formData.get('ice_a_number') as string;
    const facility_name = formData.get('facility_name') as string;
    const facility_state = formData.get('facility_state') as string;

    if (!first_name || !last_name || !ice_a_number) {
        throw new Error("Missing required fields");
    }

    try {
        const client = await pool.connect();
        await client.query(
            `INSERT INTO detainees 
            (first_name, last_name, middle_name, ice_a_number, facility_name, facility_state, source_type) 
            VALUES ($1, $2, $3, $4, $5, $6, 'web')`,
            [first_name, last_name, middle_name || null, ice_a_number, facility_name || null, facility_state || null]
        );
        client.release();
    } catch (err) {
        console.error("Submission error", err);
        throw err;
    }

    redirect(`/search?q=${first_name} ${last_name}`);
}
