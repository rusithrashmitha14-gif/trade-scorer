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
        <div className="pb-32 font-sans bg-white min-h-screen text-black">
            {/* Header */}
            <div className="pt-8 pb-6 mb-4 px-6">
                <div className="flex items-center justify-between mb-4">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full bg-white border border-zinc-200 shadow-sm hover:shadow-md hover:bg-zinc-50 flex items-center justify-center p-0 transition-all">
                            <ArrowLeft className="w-5 h-5 text-black" />
                        </Button>
                    </Link>
                    <div className="flex-1 text-center px-4">
                        <h1 className="font-bold text-3xl tracking-tight text-black">{strategy.name}</h1>
                    </div>
                    <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full bg-white border border-zinc-200 shadow-sm hover:shadow-md hover:bg-zinc-50 flex items-center justify-center p-0 transition-all text-black hover:text-black" onClick={() => setSelections({})}>
                        <RotateCcw className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-12 px-2">
                {strategy.sections.map(section => (
                    <div key={section.id} className="space-y-6">
                        <h3 className="text-3xl font-bold text-black tracking-tight flex items-center gap-4">
                            {section.title}
                            <div className="h-px bg-zinc-200 flex-1"></div>
                        </h3>
                        <div className="space-y-4">
                            {section.items.map(item => (
                                <div key={item.id}>
                                    {item.type === 'checkbox' ? (
                                        <label
                                            className="flex items-start gap-4 cursor-pointer group select-none p-4 rounded-xl hover:bg-zinc-50 transition-all active:scale-[0.99]"
                                        >
                                            <div className="relative flex items-center justify-center w-6 h-6 mt-0.5">
                                                <input
                                                    type="checkbox"
                                                    className="peer appearance-none w-6 h-6 border-2 border-zinc-300 rounded-full bg-transparent checked:bg-black checked:border-black transition-all"
                                                    checked={!!selections[item.id]}
                                                    onChange={() => handleToggle(item.id)}
                                                />
                                                <Check className="w-4 h-4 text-white absolute opacity-0 peer-checked:opacity-100 peer-checked:scale-100 scale-50 transition-all duration-200 pointer-events-none" />
                                            </div>
                                            <div className="flex-1 pt-0.5">
                                                <span className={cn(
                                                    "text-lg font-medium transition-colors duration-200",
                                                    selections[item.id] ? "text-black" : "text-zinc-600 group-hover:text-black"
                                                )}>
                                                    {item.label}
                                                </span>
                                            </div>
                                        </label>
                                    ) : (
                                        <div className="space-y-3 p-4">
                                            <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-widest pl-1">{item.label}</h4>
                                            <div className="grid gap-2">
                                                {item.options?.map((option, optIndex) => (
                                                    <label
                                                        key={optIndex}
                                                        className={cn(
                                                            "flex items-center gap-4 cursor-pointer group select-none p-4 rounded-xl border transition-all active:scale-[0.99]",
                                                            selections[item.id] === option.label
                                                                ? "bg-black text-white border-black"
                                                                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:text-black"
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

                    <div className="h-16 px-4 bg-zinc-900/80 backdrop-blur-sm rounded-full flex items-center gap-4 border border-zinc-800 shadow-xl">
                        {/* Donut Chart */}
                        <div className="relative w-10 h-10">
                            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                                {/* Track */}
                                <path
                                    className="text-zinc-800"
                                    d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                {/* Progress */}
                                <path
                                    className="text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]"
                                    strokeDasharray={`${Math.max(0, Math.min(100, score))}, 100`}
                                    d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        {/* Text Info */}
                        <div className="flex flex-col justify-center pr-2">
                            <span className="text-xl font-bold text-white leading-none tabular-nums">{Math.max(0, score)}%</span>
                            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-0.5">Score</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
