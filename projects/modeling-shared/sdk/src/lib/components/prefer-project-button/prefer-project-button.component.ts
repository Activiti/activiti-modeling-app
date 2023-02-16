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

import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { AmaState } from '../../store/app.state';
import { AddToFavoritesProjectAttemptAction, RemoveFromFavoritesProjectAttemptAction } from '../../store/project.actions';

@Component({
    selector: 'modelingsdk-prefer-project-button',
    templateUrl: './prefer-project-button.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PreferProjectButtonComponent implements OnChanges {

    @Input()
    projectId: string;

    @Input()
    isPreferred = false;

    icon = 'star_border';

    constructor(private store: Store<AmaState>) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.icon = changes?.isPreferred?.currentValue ? 'star' : 'star_border';
    }

    togglePreferredProject() {
        if (this.isPreferred) {
            this.store.dispatch(new RemoveFromFavoritesProjectAttemptAction(this.projectId));
        } else {
            this.store.dispatch(new AddToFavoritesProjectAttemptAction(this.projectId));
        }
    }

}
