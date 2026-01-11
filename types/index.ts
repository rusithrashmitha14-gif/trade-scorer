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
// This only counts POSITIVE points towards the 100% baseline.
// Negative points are treated as penalties during live scoring.
export const calculateMaxScore = (sections: StrategySection[]): number => {
    return sections.reduce((total, section) => {
        return total + section.items.reduce((secTotal, item) => {
            if (item.type === 'checkbox') {
                // Sum only if points > 0
                return secTotal + (item.points > 0 ? item.points : 0);
            } else if (item.type === 'radio' && item.options) {
                // Take the maximum POSITIVE option score
                const maxOption = item.options.reduce((max, opt) => Math.max(max, opt.points), 0);
                return secTotal + (maxOption > 0 ? maxOption : 0);
            }
            return secTotal;
        }, 0);
    }, 0);
};
