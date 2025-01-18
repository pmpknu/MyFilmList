export type Operation = 'cn' | 'nc' | 'eq' | 'ne' | 'be'
               | 'af' | 'bw' | 'bn' | 'sc' | 'sd'
               | 'se' | 'sn' | 'ew' | 'en' | 'nu'
               | 'nn' | 'gt' | 'ge' | 'lt' | 'le';

export interface SearchCriteria {
    filterKey: string;
    operation: Operation;
    value: any;
}