/*!
 * @license
 * Copyright 2019 Alfresco, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { selectAppDirtyState } from '../../../store/app.selectors';
import { AmaState } from '../../../store/app.state';
import { BasicModelCommands } from '../../commands/commands.interface';
import { ButtonType, ShowCommandButton } from '../../services/command.model';
import { ModelCommandsService } from '../../services/model-commands.service';
import { MODEL_COMMAND_SERVICE_TOKEN } from '../model-editor/model-editors.token';

@Component({
    /* cspell: disable-next-line */
    selector: 'modelingsdk-model-header',
    templateUrl: './model-header.component.html',
    styleUrls: [ './model-header.component.scss' ],
    encapsulation: ViewEncapsulation.None,
})
export class ModelHeaderComponent implements OnInit, OnDestroy {

    @Input()
    modelName: string;

    onDestroy$: Subject<void> = new Subject<void>();
    standardButtons: ShowCommandButton[];
    menuButtons: ShowCommandButton[];

    constructor(@Inject(MODEL_COMMAND_SERVICE_TOKEN)
        private modelCommands: ModelCommandsService,
        private store: Store<AmaState>
    ) { }

    ngOnInit() {
        this.standardButtons = this.modelCommands.getCommandButtons(ButtonType.STANDARD);
        this.menuButtons = this.modelCommands.getCommandButtons(ButtonType.MENU);
        this.updateIconOnDirtyState(); // to be removed once dirty state for each model is updated
    }

    showMenu(commandName): Observable<boolean> {
        const menuButton = this.menuButtons.find(button => button.commandName === commandName);
        const buttonsVisible$ = menuButton.createdMenuItems.map(button => button.visible$);
        return combineLatest(buttonsVisible$).pipe(map(buttonsVisible => buttonsVisible.some(isVisible => isVisible)));
    }

    updateIconOnDirtyState() {
        this.store.select(selectAppDirtyState).pipe(takeUntil(this.onDestroy$)).subscribe(isDirty => {
            if (isDirty) {
                this.modelCommands.updateIcon(BasicModelCommands.save, 'cloud_upload');
                this.modelCommands.setDisable(BasicModelCommands.save, false);
            } else {
                this.modelCommands.updateIcon(BasicModelCommands.save, 'cloud_done');
                this.modelCommands.setDisable(BasicModelCommands.save, true);
            }
        });
    }

    onClick(commandName: BasicModelCommands) {
        this.modelCommands.dispatchEvent(commandName);
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
