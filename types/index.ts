export type GradeThresholds = {
    "A+": number;
    "A": number;
    "B": number;
    "C": number;
}

export type GradeMessages = {
    "A+": string;
    "A": string;
    "B": string;
    "C": string;
    "NO TRADE": string;
}

export type StrategyItemType = 'checkbox' | 'radio';

export interface StrategyOption {
    label: string;
    points: number;
}

export interface StrategyItem {
    id: string; // uuid
    section_id?: string;
    type: StrategyItemType;
    label: string;
    points: number; // For checkboxes
    options?: StrategyOption[]; // For radio
    order: number;
}

export interface StrategySection {
    id: string; // uuid
    strategy_id?: string;
    title: string;
    order: number;
    items: StrategyItem[];
}

export interface Strategy {
    id: string; // uuid
    name: string;
    description?: string;
    grade_thresholds: GradeThresholds;
    grade_messages: GradeMessages;
    created_at?: string;
    sections: StrategySection[];
}

// Helper to calculate total max score (must be 100)
export const calculateMaxScore = (sections: StrategySection[]): number => {
    return sections.reduce((total, section) => {
        return total + section.items.reduce((secTotal, item) => {
            if (item.type === 'checkbox') {
                // Checkboxes add to max score if points > 0
                return secTotal + (item.points > 0 ? item.points : 0);
                // Wait, "positive or negative". Usually max score implies the perfect setup.
                // So we assume perfect setup = all positive checkboxes checked + max option of radios.
            } else if (item.type === 'radio') {
                const maxOption = item.options?.reduce((max, opt) => Math.max(max, opt.points), 0) || 0;
                return secTotal + maxOption;
            }
            return secTotal;
        }, 0);
    }, 0);
};
