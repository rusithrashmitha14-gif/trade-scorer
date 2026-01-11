'use client';

import { useParams } from 'next/navigation';
import StrategyForm from '@/components/strategies/StrategyForm';
import { useEffect, useState } from 'react';
import { Strategy } from '@/types';

export default function EditStrategyPage() {
    const params = useParams();
    const [strategy, setStrategy] = useState<Strategy | null>(null);

    useEffect(() => {
        // Fetch logic here
        // const { id } = params;
        // setStrategy(...)
    }, [params]);

    if (!strategy) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-xl font-bold mb-6">Edit Strategy</h1>
            <StrategyForm initialData={strategy} />
        </div>
    );
}
