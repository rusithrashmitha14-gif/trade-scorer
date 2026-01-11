'use client';

import { useParams } from 'next/navigation';
import ScoringView from '@/components/scoring/ScoringView';
import { useEffect, useState } from 'react';
import { Strategy } from '@/types';
import { supabase } from '@/utils/supabase/client';

export default function ScorePage() {
    const params = useParams();
    const [strategy, setStrategy] = useState<Strategy | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStrategy = async () => {
            try {
                const { data, error } = await supabase
                    .from('strategies')
                    .select(`
                        *,
                        sections:strategy_sections(
                            *,
                            items:strategy_items(*)
                        )
                    `)
                    .eq('id', params.id)
                    .single();

                if (error) throw error;
                setStrategy(data);
            } catch (error) {
                console.error('Error fetching strategy:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchStrategy();
        }
    }, [params.id]);

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    if (!strategy) return <div className="flex items-center justify-center min-h-screen">Strategy not found</div>;

    return <ScoringView strategy={strategy} />;
}
