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
            label: 'New Item',
            points: 10,
            options: type === 'radio' ? [{ label: 'Option 1', points: 10 }] : undefined,
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
        // router.push('/');
        setLoading(false);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-4 sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md py-4 border-b border-zinc-800">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Strategy Editor</h2>
                    <Button onClick={handleSave} disabled={!isValid || loading} variant={isValid ? 'primary' : 'secondary'}>
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <div className={cn("font-mono", currentScore === 100 ? "text-green-400" : "text-yellow-400")}>
                        Total Points: {currentScore}/100
                    </div>
                </div>
                {!isValid && currentScore !== 100 && (
                    <div className="text-xs text-yellow-500 flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" />
                        Target 100 points
                    </div>
                )}
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
                <Input
                    label="Strategy Name"
                    value={strategy.name}
                    onChange={e => setStrategy({ ...strategy, name: e.target.value })}
                />
                <Input
                    label="Description (Optional)"
                    value={strategy.description}
                    onChange={e => setStrategy({ ...strategy, description: e.target.value })}
                />
            </div>

            {/* Sections */}
            <div className="space-y-6">
                {strategy.sections.map((section, sIndex) => (
                    <Card key={section.id} className="border-zinc-800/50 bg-zinc-900/30">
                        <CardHeader className="bg-zinc-900/50 pb-4">
                            <div className="flex items-center gap-2">
                                <Input
                                    value={section.title}
                                    onChange={e => updateSection(sIndex, { title: e.target.value })}
                                    className="font-bold border-transparent bg-transparent hover:bg-zinc-800/50 focus:bg-zinc-800"
                                />
                                <Button size="sm" variant="ghost" onClick={() => deleteSection(sIndex)}>
                                    <Trash2 className="w-4 h-4 text-zinc-500 hover:text-red-400" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                            {section.items.map((item, iIndex) => (
                                <div key={item.id} className="flex gap-2 items-start p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex gap-2">
                                            <Input
                                                value={item.label}
                                                onChange={e => updateItem(sIndex, iIndex, { label: e.target.value })}
                                                placeholder="Condition..."
                                                className="h-8 text-sm"
                                            />
                                            <Input
                                                type="number"
                                                value={item.points}
                                                onChange={e => updateItem(sIndex, iIndex, { points: parseInt(e.target.value) || 0 })}
                                                className="w-20 h-8 text-right font-mono"
                                            />
                                        </div>
                                    </div>
                                    <Button size="sm" variant="ghost" onClick={() => deleteItem(sIndex, iIndex)} className="h-8 w-8 p-0">
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            ))}

                            <div className="flex gap-2 pt-2">
                                <Button size="sm" variant="secondary" onClick={() => addItem(sIndex, 'checkbox')} className="text-xs h-8">
                                    + Checkbox
                                </Button>
                                {/* Radio support can be added later if needed */}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <Button variant="outline" className="w-full border-dashed" onClick={addSection}>
                    Add Section
                </Button>
            </div>

            {/* Grade Config - Simplified for MVP */}
            <Card>
                <CardHeader>
                    <CardTitle>Grade Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Simple threshold inputs */}
                        {Object.entries(strategy.grade_thresholds).map(([grade, val]) => (
                            <div key={grade}>
                                <label className="text-xs text-zinc-500">Min Score for {grade}</label>
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
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
