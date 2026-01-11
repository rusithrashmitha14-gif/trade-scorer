'use client';

import { useParams } from 'next/navigation';
import ScoringView from '@/components/scoring/ScoringView';
import { useEffect, useState } from 'react';
import { Strategy } from '@/types';

// MOCK for display until DB is ready
const MOCK_STRATEGY: Strategy = {
    id: '1',
    name: 'ICT Silver Bullet',
    description: '10am - 11am NY Time',
    grade_thresholds: { "A+": 90, "A": 80, "B": 70, "C": 60 },
    grade_messages: { "A+": "Full Size", "A": "Half Size", "B": "Quarter Size", "C": "Sit on hands", "NO TRADE": "NO" },
    sections: [
        {
            id: 's1',
            title: 'Bias & Time',
            order: 0,
            items: [
                { id: 'i1', section_id: 's1', type: 'checkbox', label: 'In Killzone (10-11)', points: 10, order: 0 },
                { id: 'i2', section_id: 's1', type: 'checkbox', label: 'HTF PD Array Supp/Res', points: 15, order: 1 },
            ]
        },
        {
            id: 's2',
            title: 'Entry Model',
            order: 1,
            items: [
                { id: 'i3', section_id: 's2', type: 'checkbox', label: 'Liquidity Sweep', points: 20, order: 0 },
                { id: 'i4', section_id: 's2', type: 'checkbox', label: 'MSS (Market Structure Shift)', points: 20, order: 1 },
                { id: 'i5', section_id: 's2', type: 'checkbox', label: 'FVG Entry', points: 20, order: 2 },
                { id: 'i6', section_id: 's2', type: 'checkbox', label: 'Risk Reward > 2R', points: 15, order: 3 },
            ]
        }
    ]
};

export default function ScorePage() {
    const params = useParams();
    const [strategy, setStrategy] = useState<Strategy | null>(MOCK_STRATEGY);

    // useEffect(() => {
    //     // Fetch logic here
    // }, [params]);

    if (!strategy) return <div>Loading...</div>;

    return <ScoringView strategy={strategy} />;
}
