'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, GripVertical, Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Strategy, StrategySection, StrategyItem, calculateMaxScore } from '@/types';
import { cn } from '@/lib/utils';
// import { supabase } from '@/utils/supabase/client';

interface StrategyFormProps {
    initialData?: Strategy;
}

const EMPTY_STRATEGY: Strategy = {
    id: '',
    name: '',
    description: '',
    grade_thresholds: { "A+": 90, "A": 80, "B": 70, "C": 60 },
    grade_messages: { "A+": "Perfect!", "A": "Great", "B": "Good", "C": "Mediocre", "NO TRADE": "Avoid" },
    sections: [
        {
            id: crypto.randomUUID(),
            title: 'General',
            order: 0,
            items: []
        }
    ]
};

export default function StrategyForm({ initialData }: StrategyFormProps) {
    const router = useRouter();
    const [strategy, setStrategy] = useState<Strategy>(initialData || EMPTY_STRATEGY);
    const [loading, setLoading] = useState(false);

    const currentScore = calculateMaxScore(strategy.sections);
    const isValid = currentScore === 100 && strategy.name.trim().length > 0;

    const addSection = () => {
        setStrategy(prev => ({
            ...prev,
            sections: [
                ...prev.sections,
                {
                    id: crypto.randomUUID(),
                    title: 'New Section',
                    order: prev.sections.length,
                    items: []
                }
            ]
        }));
    };

    const updateSection = (index: number, updates: Partial<StrategySection>) => {
        const newSections = [...strategy.sections];
        newSections[index] = { ...newSections[index], ...updates };
        setStrategy({ ...strategy, sections: newSections });
    };

    const deleteSection = (index: number) => {
        const newSections = strategy.sections.filter((_, i) => i !== index);
        setStrategy({ ...strategy, sections: newSections });
    };

    const addItem = (sectionIndex: number, type: 'checkbox' | 'radio') => {
        const newSections = [...strategy.sections];
        const newItem: StrategyItem = {
            id: crypto.randomUUID(),
            type,
            label: type === 'radio' ? 'New Radio Group' : 'New Checkbox',
            points: 10,
            options: type === 'radio' ? [{ label: 'Option 1', points: 10 }, { label: 'Option 2', points: 0 }] : undefined,
            order: newSections[sectionIndex].items.length
        };
        newSections[sectionIndex].items.push(newItem);
        setStrategy({ ...strategy, sections: newSections });
    };

    const updateItem = (sectionIndex: number, itemIndex: number, updates: Partial<StrategyItem>) => {
        const newSections = [...strategy.sections];
        newSections[sectionIndex].items[itemIndex] = { ...newSections[sectionIndex].items[itemIndex], ...updates };
        setStrategy({ ...strategy, sections: newSections });
    };

    const updateOption = (sectionIndex: number, itemIndex: number, optionIndex: number, updates: Partial<{ label: string, points: number }>) => {
        const newSections = [...strategy.sections];
        const item = newSections[sectionIndex].items[itemIndex];
        if (item.options) {
            item.options[optionIndex] = { ...item.options[optionIndex], ...updates };
        }
        setStrategy({ ...strategy, sections: newSections });
    };

    const addOption = (sectionIndex: number, itemIndex: number) => {
        const newSections = [...strategy.sections];
        const item = newSections[sectionIndex].items[itemIndex];
        if (item.options) {
            item.options.push({ label: 'New Option', points: 0 });
        }
        setStrategy({ ...strategy, sections: newSections });
    };

    const removeOption = (sectionIndex: number, itemIndex: number, optionIndex: number) => {
        const newSections = [...strategy.sections];
        const item = newSections[sectionIndex].items[itemIndex];
        if (item.options && item.options.length > 1) { // Prevent deleting last option
            item.options = item.options.filter((_, i) => i !== optionIndex);
        }
        setStrategy({ ...strategy, sections: newSections });
    };

    const deleteItem = (sectionIndex: number, itemIndex: number) => {
        const newSections = [...strategy.sections];
        newSections[sectionIndex].items = newSections[sectionIndex].items.filter((_, i) => i !== itemIndex);
        setStrategy({ ...strategy, sections: newSections });
    };

    const handleSave = async () => {
        if (!isValid) return;
        setLoading(true);
        // Supabase Save Logic Here
        console.log('Saving strategy:', strategy);
        // await new Promise(r => setTimeout(r, 1000));
        router.push('/');
        setLoading(false);
    };

    return (
        <div className="space-y-8 pb-32">
            {/* Sticky Header */}
            <div className="sticky top-0 z-30 bg-white/50 dark:bg-black/50 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 -mx-4 px-6 py-4 flex justify-between items-center transition-all">
                <div>
                    <h2 className="text-xl font-bold dark:text-white text-black">Strategy Editor</h2>
                    <div className={cn("text-sm font-mono mt-1", currentScore === 100 ? "text-green-500" : "text-yellow-500")}>
                        Total Points: {currentScore}/100
                    </div>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={!isValid || loading}
                    className={cn(
                        "rounded-full px-6 transition-all",
                        isValid
                            ? "bg-black text-white dark:bg-white dark:text-black hover:scale-105"
                            : "bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
                    )}
                >
                    {loading ? 'Saving...' : 'Save'}
                </Button>
            </div>

            {/* Basic Info */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-500">Strategy Name</label>
                    <Input
                        value={strategy.name}
                        onChange={e => setStrategy({ ...strategy, name: e.target.value })}
                        className="bg-transparent border-t-0 border-x-0 border-b-2 border-zinc-200 dark:border-zinc-800 rounded-none px-0 text-xl font-bold focus:ring-0 focus:border-black dark:focus:border-white transition-all placeholder:text-zinc-700"
                        placeholder="e.g. ICT Silver Bullet"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-500">Description</label>
                    <Input
                        value={strategy.description}
                        onChange={e => setStrategy({ ...strategy, description: e.target.value })}
                        className="bg-transparent border-t-0 border-x-0 border-b-2 border-zinc-200 dark:border-zinc-800 rounded-none px-0 text-base focus:ring-0 focus:border-black dark:focus:border-white transition-all"
                        placeholder="Optional description..."
                    />
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
                {strategy.sections.map((section, sIndex) => (
                    <div key={section.id} className="group relative pl-4 border-l-2 border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white transition-colors">

                        {/* Section Header */}
                        <div className="flex items-center gap-4 mb-4">
                            <Input
                                value={section.title}
                                onChange={e => updateSection(sIndex, { title: e.target.value })}
                                className="font-bold text-lg bg-transparent border-none p-0 focus:ring-0 w-auto"
                            />
                            <button onClick={() => deleteSection(sIndex)} className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-500">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="space-y-3">
                            {section.items.map((item, iIndex) => (
                                <div key={item.id} className="bg-black text-white p-4 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-all shadow-sm">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1 space-y-3">
                                            {/* Item Label & Points */}
                                            <div className="flex gap-4">
                                                <Input
                                                    value={item.label}
                                                    onChange={e => updateItem(sIndex, iIndex, { label: e.target.value })}
                                                    className="bg-transparent border-none p-0 h-auto font-medium focus:ring-0 text-base text-white placeholder:text-zinc-500"
                                                    placeholder={item.type === 'radio' ? "Group Name..." : "Condition..."}
                                                />
                                                {item.type === 'checkbox' && (
                                                    <Input
                                                        type="number"
                                                        value={item.points}
                                                        onChange={e => updateItem(sIndex, iIndex, { points: parseInt(e.target.value) || 0 })}
                                                        className="w-16 h-8 text-right font-mono text-sm bg-zinc-900 text-white border border-zinc-700 rounded px-2 focus:border-white transition-colors placeholder:text-zinc-600"
                                                        placeholder="Pts"
                                                    />
                                                )}
                                            </div>

                                            {/* Radio Options */}
                                            {item.type === 'radio' && item.options && (
                                                <div className="pl-4 space-y-2 border-l border-zinc-800">
                                                    {item.options.map((opt, oIndex) => (
                                                        <div key={oIndex} className="flex gap-2 items-center">
                                                            <div className="w-3 h-3 rounded-full border-2 border-zinc-600"></div>
                                                            <Input
                                                                value={opt.label}
                                                                onChange={e => updateOption(sIndex, iIndex, oIndex, { label: e.target.value })}
                                                                className="bg-transparent border-none p-0 h-auto text-sm focus:ring-0 flex-1 text-zinc-300 focus:text-white transition-colors"
                                                            />
                                                            <Input
                                                                type="number"
                                                                value={opt.points}
                                                                onChange={e => updateOption(sIndex, iIndex, oIndex, { points: parseInt(e.target.value) || 0 })}
                                                                className="w-14 h-6 text-right font-mono text-xs bg-zinc-900 border-b border-zinc-700 rounded-none px-0 text-white focus:border-white"
                                                            />
                                                            <button onClick={() => removeOption(sIndex, iIndex, oIndex)} className="text-zinc-500 hover:text-red-500">
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <Button size="sm" variant="ghost" onClick={() => addOption(sIndex, iIndex)} className="text-xs h-6 px-0 text-indigo-400 hover:text-indigo-300">
                                                        + Add Option
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <button onClick={() => deleteItem(sIndex, iIndex)} className="text-zinc-500 hover:text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="flex gap-3 pt-2">
                                <Button onClick={() => addItem(sIndex, 'checkbox')} className="text-xs h-8 bg-zinc-200 text-black hover:bg-zinc-300 border-none dark:bg-white dark:text-black">
                                    + Checkbox
                                </Button>
                                <Button onClick={() => addItem(sIndex, 'radio')} className="text-xs h-8 bg-zinc-800 text-white hover:bg-zinc-700 border-none">
                                    + Radio Group
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                <Button variant="outline" className="w-full border-dashed border-zinc-300 dark:border-zinc-700 h-12 hover:bg-zinc-100 dark:hover:bg-zinc-900" onClick={addSection}>
                    + Add New Section
                </Button>
            </div>

            {/* Minimal Grade Config */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
                <h3 className="font-bold mb-4">Grade Thresholds</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Object.entries(strategy.grade_thresholds).map(([grade, val]) => (
                        <div key={grade} className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-xl text-center">
                            <div className="text-xs text-zinc-500 font-bold mb-1">{grade}</div>
                            <Input
                                type="number"
                                value={val}
                                onChange={e => setStrategy({
                                    ...strategy,
                                    grade_thresholds: {
                                        ...strategy.grade_thresholds,
                                        [grade]: parseInt(e.target.value)
                                    }
                                })}
                                className="text-center font-mono bg-transparent border-none text-xl p-0 focus:ring-0 w-full"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
