import { NextRequest, NextResponse } from 'next/server';
import { twiml } from 'twilio';
import pool from '@/lib/db';

const { VoiceResponse } = twiml;

export async function POST(request: NextRequest) {
    const url = new URL(request.url);
    const step = url.searchParams.get('step') || 'welcome';
    const id = url.searchParams.get('id');

    let formData;
    try {
        formData = await request.formData();
    } catch (e) {
        formData = new FormData(); // Fallback
    }

    const speechResult = await formData.get('SpeechResult') as string | null;
    const digits = await formData.get('Digits') as string | null;

    const vr = new VoiceResponse();

    try {
        if (step === 'welcome') {
            vr.say('Welcome to the Ice Prisoner Search. Please say your First Name, then spell it.');
            vr.gather({
                input: ['speech'],
                action: `/api/twilio/webhook?step=save_first_name`,
                timeout: 5
            });
        }
        else if (step === 'save_first_name') {
            if (!speechResult) {
                vr.say('I did not hear anything.');
                vr.redirect('/api/twilio/webhook?step=welcome');
            } else {
                const client = await pool.connect();
                // Initialize with temporary placeholders for required fields
                const res = await client.query(
                    `INSERT INTO detainees (first_name, last_name, ice_a_number, source_type) VALUES ($1, 'Pending', 'Pending', 'hotline') RETURNING id`,
                    [speechResult]
                );
                client.release();
                const newId = res.rows[0].id;

                vr.say('Thank you. Now, please say your Middle Name, then spell it. If none, say "No Middle Name".');
                vr.gather({
                    input: ['speech'],
                    action: `/api/twilio/webhook?step=save_middle_name&id=${newId}`,
                    timeout: 5
                });
            }
        }
        else if (step === 'save_middle_name') {
            if (speechResult) {
                await pool.query(`UPDATE detainees SET middle_name = $1 WHERE id = $2`, [speechResult, id]);
            }
            vr.say('Please say your Last Name, then spell it.');
            vr.gather({
                input: ['speech'],
                action: `/api/twilio/webhook?step=save_last_name&id=${id}`,
                timeout: 5
            });
        }
        else if (step === 'save_last_name') {
            if (speechResult) {
                await pool.query(`UPDATE detainees SET last_name = $1 WHERE id = $2`, [speechResult, id]);
            }
            vr.say('Please say your A-Number, digit by digit.');
            vr.gather({
                input: ['speech', 'dtmf'],
                action: `/api/twilio/webhook?step=save_a_number&id=${id}`,
                timeout: 10
            });
        }
        else if (step === 'save_a_number') {
            // Support both speech and DTMF (keypad)
            const aNum = await formData.get('Digits') || speechResult;
            if (aNum) {
                await pool.query(`UPDATE detainees SET ice_a_number = $1 WHERE id = $2`, [aNum.toString(), id]);
            }
            vr.say('Finally, say the name of your facility.');
            vr.gather({
                input: ['speech'],
                action: `/api/twilio/webhook?step=save_facility&id=${id}`,
                timeout: 5
            });
        }
        else if (step === 'save_facility') {
            if (speechResult) {
                // Also could infer state? For now just save name.
                await pool.query(`UPDATE detainees SET facility_name = $1 WHERE id = $2`, [speechResult, id]);
            }
            vr.say('Thank you. Your information has been recorded. Goodbye.');
            vr.hangup();
        }

        return new NextResponse(vr.toString(), {
            headers: { 'Content-Type': 'text/xml' }
        });

    } catch (err) {
        console.error('Twilio Webhook Error:', err);
        const errVr = new VoiceResponse();
        errVr.say('An error occurred. Please try again later.');
        return new NextResponse(errVr.toString(), { headers: { 'Content-Type': 'text/xml' } });
    }
}
