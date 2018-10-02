import { Observable } from 'rxjs';
import { FilterType } from 'ama-sdk';

export interface FilterDataAdaper {
    expanded: Observable<boolean>;
    contents: Observable<Partial<FilterType>[]>;
    loading: Observable<boolean>;
    load(applicationId: string): void;
}
