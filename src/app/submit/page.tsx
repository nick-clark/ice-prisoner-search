import { submitRecord } from '../actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SubmitPage() {
    return (
        <div className="flex min-h-screen flex-col items-center bg-slate-950 px-4 py-12 text-slate-100">
            <div className="w-full max-w-lg">
                <Link href="/" className="mb-6 flex items-center text-sm text-slate-400 hover:text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>

                <h1 className="mb-2 text-3xl font-bold">Add a Detainee</h1>
                <p className="mb-8 text-slate-400">
                    Help families reconnect. Add details for someone you know is detained.
                </p>

                <form action={submitRecord} className="space-y-6 rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-lg">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">First Name <span className="text-red-500">*</span></label>
                            <input name="first_name" required className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Last Name <span className="text-red-500">*</span></label>
                            <input name="last_name" required className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Middle Name</label>
                        <input name="middle_name" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">ICE A-Number <span className="text-red-500">*</span></label>
                        <input name="ice_a_number" required placeholder="A-XXX-XXX-XXX" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none" />
                        <p className="text-xs text-slate-500">The 9-digit Alien Registration Number.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Facility Name</label>
                            <input name="facility_name" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">State</label>
                            <input name="facility_state" maxLength={2} placeholder="TX" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
                        </div>
                    </div>

                    <button type="submit" className="mt-4 w-full rounded-md bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500">
                        Submit Record
                    </button>
                </form>
            </div>
        </div>
    );
}
