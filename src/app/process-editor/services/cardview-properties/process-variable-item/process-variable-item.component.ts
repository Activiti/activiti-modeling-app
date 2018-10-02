import { Component } from '@angular/core';
import { OpenVariablesDialogAction } from '../../../store/process-variables.actions';
import { Store } from '@ngrx/store';
import { ProcessEditorState } from '../../../store/process-editor.state';
import { CardItemTypeService } from '@alfresco/adf-core';

@Component({
    selector: 'ama-processvariables',
    templateUrl: './process-variable-item.component.html',
    providers: [CardItemTypeService]
})

export class CardViewProcessVariablesItemComponent {
    constructor(private store: Store<ProcessEditorState>) {
    }

    openVariablesDialog(): void {
        this.store.dispatch(new OpenVariablesDialogAction());
    }
}
