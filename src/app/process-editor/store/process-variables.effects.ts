import { OpenVariablesDialogAction, OPEN_VARIABLES_DIALOG, UpdateProcessVariablesAction, UPDATE_PROCESS_VARIABLES } from './process-variables.actions';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { switchMap, tap, take, map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BaseEffects } from '../../common/helpers/base.effects';
import { DialogService } from '../../common/services/dialog.service';
import { LogService } from '@alfresco/adf-core';
import { Router } from '@angular/router';
import { ProcessModelerService } from '../services/process-modeler.service';
import { of } from 'rxjs';
import { selectProcess } from './process-editor.selectors';
import { AmaState } from 'ama-sdk';
import { Store } from '@ngrx/store';
import { ProcessProperties } from 'ama-sdk';
import { Subject } from 'rxjs';
import { ProcessVariablesComponent } from '../../process-variables/process-variables.component';
import { SetAppDirtyStateAction } from '../../store/actions/ui';

@Injectable()
export class VariablesEffects extends BaseEffects {
    constructor(
        private actions$: Actions,
        protected logService: LogService,
        protected router: Router,
        private dialogService: DialogService,
        private modelerService: ProcessModelerService,
        private store: Store<AmaState>
    ) {
        super(router, logService);
    }

    @Effect({ dispatch: false })
    openVariablesDialogEffect = this.actions$.pipe(
        ofType<OpenVariablesDialogAction>(OPEN_VARIABLES_DIALOG),
        switchMap(() => this.store.select(selectProcess).pipe(take(1))),
        tap((process) => this.openVariablesDialog(process.extensions.properties)
    ));


    @Effect()
    updateProcessVariablesEffect = this.actions$.pipe(
        ofType<UpdateProcessVariablesAction>(UPDATE_PROCESS_VARIABLES),
        map(action => {
            const shapeId = this.modelerService.getRootProcessElement().id;
            this.modelerService.updateElementProperty(shapeId, 'properties', action.properties);
        }),
        mergeMap(() => of(new SetAppDirtyStateAction(true)))
    );

    private openVariablesDialog(properties: ProcessProperties) {
        const propertiesUpdate$ = new Subject<ProcessProperties>();

        this.dialogService.openDialog(ProcessVariablesComponent, {
            disableClose: true,
            height: '480px',
            width: '1000px',
            data: { properties, propertiesUpdate$ }
        });

        propertiesUpdate$.subscribe(data => {
            this.store.dispatch(new UpdateProcessVariablesAction(data));
         });
    }
}
