import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CardItemTypeService, CardViewUpdateService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { ProcessEditorState } from '../../../store/process-editor.state';
import { ImplementationItemModel } from './implementation-item.model';
import { selectProcessMappingsFor } from '../../../store/process-editor.selectors';
import { UpdateServiceParametersAction } from '../../../store/process-editor.actions';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'ama-process-implementation',
    templateUrl: './implementation-item.component.html',
    providers: [CardItemTypeService]
})
export class CardViewImplementationItemComponent implements OnInit, OnDestroy {
    @Input() property: ImplementationItemModel;

    implementation: string;
    input: string;
    output: string;
    onDestroy$: Subject<void> = new Subject();

    constructor(
        private cardViewUpdateService: CardViewUpdateService,
        private store: Store<ProcessEditorState>
    ) {}

    ngOnInit() {
        this.implementation = this.property.value;
        this.store.select(selectProcessMappingsFor(this.elementId)).pipe(
            takeUntil(this.onDestroy$)
        ).subscribe(variablesMapping => {
            this.input = <any>(variablesMapping.input);
            this.output = <any>(variablesMapping.output);
        });
    }

    ngOnDestroy() {
        this.onDestroy$.complete();
    }

    changeImplementation(): void {
        this.cardViewUpdateService.update(this.property, this.implementation);
    }

    changeVariablesMapping(): void {
        this.store.dispatch(new UpdateServiceParametersAction(this.elementId, {
            input: <any>this.input,
            output: <any>this.output
        }));
    }

    private get elementId() {
        return this.property.data.id;
    }
}
