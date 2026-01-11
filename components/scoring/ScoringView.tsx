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

    const handleRadioSelect = (itemId: string, optionLabel: string) => {
        setSelections(prev => ({
            ...prev,
            [itemId]: optionLabel
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
                } else if (item.type === 'radio' && item.options) {
                    const selectedOptionLabel = selections[item.id];
                    if (selectedOptionLabel) {
                        const option = item.options.find(opt => opt.label === selectedOptionLabel);
                        if (option) {
                            current += option.points;
                        }
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
        <div className="pb-32 font-sans bg-black min-h-screen text-white">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-zinc-900 -mx-4 px-6 pt-12 pb-4 mb-8">
                <div className="flex items-center justify-between mb-2">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent text-zinc-500 hover:text-white transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <h1 className="font-bold text-xl tracking-wide">{strategy.name}</h1>
                    <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent text-zinc-500 hover:text-white transition-colors" onClick={() => setSelections({})}>
                        <RotateCcw className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-12 px-2">
                {strategy.sections.map(section => (
                    <div key={section.id} className="space-y-6">
                        <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-4">
                            {section.title}
                            <div className="h-px bg-zinc-900 flex-1"></div>
                        </h3>
                        <div className="space-y-4">
                            {section.items.map(item => (
                                <div key={item.id}>
                                    {item.type === 'checkbox' ? (
                                        <label
                                            className="flex items-start gap-4 cursor-pointer group select-none p-4 rounded-xl border border-zinc-900 bg-zinc-950 hover:border-zinc-800 transition-all active:scale-[0.99]"
                                        >
                                            <div className="relative flex items-center justify-center w-6 h-6 mt-0.5">
                                                <input
                                                    type="checkbox"
                                                    className="peer appearance-none w-6 h-6 border-2 border-zinc-700 rounded-full bg-transparent checked:bg-white checked:border-white transition-all"
                                                    checked={!!selections[item.id]}
                                                    onChange={() => handleToggle(item.id)}
                                                />
                                                <Check className="w-4 h-4 text-black absolute opacity-0 peer-checked:opacity-100 peer-checked:scale-100 scale-50 transition-all duration-200 pointer-events-none" />
                                            </div>
                                            <div className="flex-1 pt-0.5">
                                                <span className={cn(
                                                    "text-lg font-medium transition-colors duration-200",
                                                    selections[item.id] ? "text-white" : "text-zinc-500 group-hover:text-zinc-400"
                                                )}>
                                                    {item.label}
                                                </span>
                                            </div>
                                        </label>
                                    ) : (
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-widest pl-1">{item.label}</h4>
                                            <div className="grid gap-2">
                                                {item.options?.map((option, optIndex) => (
                                                    <label
                                                        key={optIndex}
                                                        className={cn(
                                                            "flex items-center gap-4 cursor-pointer group select-none p-4 rounded-xl border transition-all active:scale-[0.99]",
                                                            selections[item.id] === option.label
                                                                ? "bg-white text-black border-white"
                                                                : "bg-zinc-950 text-zinc-500 border-zinc-900 hover:border-zinc-800 hover:text-zinc-400"
                                                        )}
                                                    >
                                                        <input
                                                            type="radio"
                                                            className="hidden"
                                                            name={item.id}
                                                            checked={selections[item.id] === option.label}
                                                            onChange={() => handleRadioSelect(item.id, option.label)}
                                                        />
                                                        <span className="text-lg font-medium">{option.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Sticky Grade Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-black/90 backdrop-blur-xl border-t border-zinc-900 z-50">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Current Grade</span>
                        <span className={cn(
                            "text-4xl font-black italic tracking-tighter transition-colors",
                            grade === "A+" ? "text-white" : "text-zinc-300"
                        )}>
                            {grade}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-14 w-28 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white" style={{ width: `${Math.min(100, Math.max(0, score))}%`, opacity: 0.1 }}></div>
                            <span className="relative z-10 font-mono text-2xl font-bold text-white tracking-widest">{score}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
