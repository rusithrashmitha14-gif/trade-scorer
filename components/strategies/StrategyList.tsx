'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Strategy } from '@/types';
// import { supabase } from '@/utils/supabase/client';

const MOCK_STRATEGIES: Strategy[] = [
    {
        id: '1',
        name: 'ICT Silver Bullet',
        description: 'Time based liquidity sweep setup',
        grade_thresholds: { "A+": 90, "A": 80, "B": 70, "C": 60 },
        grade_messages: { "A+": "Send it", "A": "Good", "B": "Ok", "C": "Risky", "NO TRADE": "Stop" },
        sections: []
    }
];

export default function StrategyList() {
    const [strategies, setStrategies] = useState<Strategy[]>(MOCK_STRATEGIES);
    const router = useRouter();

    const handleEdit = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/strategies/${id}/edit`);
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this strategy?')) {
            setStrategies(prev => prev.filter(s => s.id !== id));
        }
    };

    return (
        <div className="space-y-8 font-sans">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
                        My Strategies
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">Select a strategy to begin scoring</p>
                </div>
                <Link href="/strategies/new">
                    <Button size="sm" className="rounded-full w-12 h-12 p-0 bg-black text-white hover:bg-zinc-800 shadow-md flex items-center justify-center transition-transform hover:scale-105">
                        <Plus className="w-6 h-6" />
                    </Button>
                </Link>
            </div>

            <div className="grid gap-5">
                {strategies.map((strategy) => (
                    <Link key={strategy.id} href={`/strategies/${strategy.id}/score`} className="block group">
                        <Card className="relative overflow-hidden !bg-black text-white border border-zinc-900 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] rounded-2xl">
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                <TrendingUp className="w-32 h-32" />
                            </div>

                            <div className="relative z-10 p-6">
                                <div className="flex justify-between items-start">
                                    <div className="pr-16"> {/* Padding for icons */}
                                        <h3 className="text-2xl font-bold mb-2">{strategy.name}</h3>
                                        {strategy.description && (
                                            <p className="text-zinc-400 font-light text-sm">{strategy.description}</p>
                                        )}
                                    </div>

                                    {/* Action Icons */}
                                    <div className="absolute top-6 right-6 flex gap-3">
                                        <button
                                            onClick={(e) => handleEdit(e, strategy.id)}
                                            className="p-2 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(e, strategy.id)}
                                            className="p-2 rounded-full text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            {strategies.length === 0 && (
                <div className="text-center py-20 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800">
                    <p className="text-zinc-500 font-medium">No strategies yet</p>
                    <Link href="/strategies/new" className="text-black dark:text-white underline mt-2 inline-block">Create one</Link>
                </div>
            )}
        </div>
    );
}
