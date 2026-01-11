'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, ArrowRight, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
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

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                        My Strategies
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Select a strategy to begin scoring</p>
                </div>
                <Link href="/strategies/new">
                    <Button size="sm" className="rounded-full w-10 h-10 p-0 shadow-[0_0_20px_rgba(79,70,229,0.3)] bg-gradient-to-tr from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 border border-white/10">
                        <Plus className="w-5 h-5 text-white" />
                    </Button>
                </Link>
            </div>

            <div className="grid gap-5">
                {strategies.map((strategy) => (
                    <Card key={strategy.id} className="group relative overflow-hidden border-zinc-500/10 hover:border-zinc-500/30 hover:bg-white/10">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <TrendingUp className="w-24 h-24" />
                        </div>

                        <div className="relative z-10">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl">{strategy.name}</CardTitle>
                                {strategy.description && (
                                    <CardDescription className="text-zinc-400 font-light">{strategy.description}</CardDescription>
                                )}
                            </CardHeader>
                            <CardFooter className="flex justify-between pt-4">
                                <Link href={`/strategies/${strategy.id}/edit`} className="text-xs text-zinc-500 hover:text-white transition-colors">
                                    Edit Configuration
                                </Link>
                                <Link href={`/strategies/${strategy.id}/score`}>
                                    <Button size="sm" className="rounded-full px-6 bg-white/10 hover:bg-white/20 border border-white/5 backdrop-blur-md text-white font-medium group-hover:bg-indigo-500/20 group-hover:text-indigo-200 transition-all">
                                        Start Scoring <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </div>
                    </Card>
                ))}
            </div>

            {strategies.length === 0 && (
                <div className="text-center py-20 rounded-3xl border border-dashed border-zinc-800 bg-black/20">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-zinc-600" />
                    </div>
                    <p className="text-zinc-500 font-medium">No strategies yet</p>
                    <p className="text-zinc-600 text-sm mt-1">Create one to get started</p>
                </div>
            )}
        </div>
    );
}
