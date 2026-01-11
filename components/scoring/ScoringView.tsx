'use client';

import { useState, useMemo } from 'react';
import { Strategy } from '@/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { RotateCcw, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

interface ScoringViewProps {
    strategy: Strategy;
}

export default function ScoringView({ strategy }: ScoringViewProps) {
    const [selections, setSelections] = useState<Record<string, boolean | string>>({});

    const handleToggle = (itemId: string) => {
        setSelections(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    // Calculate Score
    const { score } = useMemo(() => {
        let current = 0;

        strategy.sections.forEach(section => {
            section.items.forEach(item => {
                if (item.type === 'checkbox') {
                    if (selections[item.id]) {
                        current += item.points;
                    }
                }
            });
        });

        return { score: current };
    }, [strategy, selections]);

    // Calculate Grade
    const grade = useMemo(() => {
        const t = strategy.grade_thresholds;
        if (score >= t["A+"]) return "A+";
        if (score >= t["A"]) return "A";
        if (score >= t["B"]) return "B";
        if (score >= t["C"]) return "C";
        return "NO TRADE";
    }, [score, strategy]);

    return (
        <div className="pb-32 font-sans">
            {/* Header */}
            <div className="sticky top-0 z-20 glass-card rounded-b-2xl rounded-t-none -mx-4 px-6 pt-12 pb-6 mb-8 border-t-0 border-x-0">
                <div className="flex items-center justify-between mb-4">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent text-zinc-400 hover:text-white">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <h1 className="font-bold text-xl tracking-wide">{strategy.name}</h1>
                    <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent text-zinc-400 hover:text-white" onClick={() => setSelections({})}>
                        <RotateCcw className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-10 px-2">
                {strategy.sections.map(section => (
                    <div key={section.id} className="space-y-4">
                        <h3 className="font-handwriting text-2xl font-bold text-white tracking-wide relative inline-block">
                            {section.title}
                            <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-indigo-500 rounded-full opacity-60"></span>
                        </h3>
                        <div className="space-y-3">
                            {section.items.map(item => (
                                <label
                                    key={item.id}
                                    className="flex items-start gap-4 cursor-pointer group select-none"
                                >
                                    <div className="relative flex items-center justify-center w-6 h-6 mt-0.5">
                                        <input
                                            type="checkbox"
                                            className="peer appearance-none w-6 h-6 border-2 border-zinc-600 rounded-md bg-transparent checked:bg-indigo-600 checked:border-indigo-600 transition-all"
                                            checked={!!selections[item.id]}
                                            onChange={() => handleToggle(item.id)}
                                        />
                                        <Check className="w-4 h-4 text-white absolute opacity-0 peer-checked:opacity-100 peer-checked:scale-100 scale-50 transition-all duration-200 pointer-events-none" />
                                    </div>
                                    <div className="flex-1 pt-0.5">
                                        <span className={cn(
                                            "text-base font-medium transition-colors duration-200",
                                            selections[item.id] ? "text-zinc-100" : "text-zinc-400 group-hover:text-zinc-300"
                                        )}>
                                            {item.label}
                                        </span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Sticky Grade Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-6 glass border-t border-white/10 z-50">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Current Grade</span>
                        <span className="text-3xl font-black italic tracking-tighter text-white">
                            {grade} <span className="text-lg font-normal text-zinc-500 not-italic">setup</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-12 w-24 bg-zinc-800/50 rounded-full flex items-center justify-center border border-white/10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-indigo-600/20" style={{ width: `${Math.min(100, Math.max(0, score))}%` }}></div>
                            <span className="relative z-10 font-mono text-xl font-bold text-white">{score}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
