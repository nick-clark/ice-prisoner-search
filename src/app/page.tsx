import { Search } from 'lucide-react';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-slate-100">
            <div className="w-full max-w-2xl space-y-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-blue-500">
                    Ice Prisoner Search
                </h1>
                <p className="text-lg text-slate-400">
                    Find your loved one's A-Number. Reconnect families.
                </p>

                <form action="/search" method="GET" className="relative mt-8">
                    <input
                        type="text"
                        name="q"
                        placeholder="Search by Name (e.g., Robert Smith)"
                        className="w-full rounded-full border border-slate-700 bg-slate-900 py-4 pl-14 pr-6 text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <Search className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-500" />
                    <button
                        type="submit"
                        className="mt-4 w-full rounded-full bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500 sm:mt-8 sm:w-auto sm:px-8"
                    >
                        Search Database
                    </button>
                </form>

                <div className="mt-16 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
                        <h3 className="text-lg font-semibold text-slate-200">How it works</h3>
                        <p className="mt-2 text-sm text-slate-400">1. Search for a name.<br />2. Find their A-Number.<br />3. Use official channels to contact them.</p>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
                        <h3 className="text-lg font-semibold text-slate-200">Add a Record</h3>
                        <p className="mt-2 text-sm text-slate-400">
                            Know someone inside? Add them manually to help others find them.
                        </p>
                        <a href="/submit" className="mt-2 inline-block text-sm font-medium text-blue-400 hover:text-blue-300">
                            Submit a record &rarr;
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
