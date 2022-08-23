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

import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Collaborator } from '../../api/types';
import { AmaState } from '../../store/app.state';
import { selectProjectCollaborators } from '../../store/project.selectors';

@Component({
    selector: 'modelingsdk-project-collaborators',
    templateUrl: './project-collaborators.component.html',
    styleUrls: [ './project-collaborators.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class ProjectCollaboratorsComponent implements OnInit, OnDestroy {
    @Input()
    projectId;

    @Input()
    overlapCollaborators = false;

    collaborators$: Observable<Collaborator[]>;
    onDestroy$ = new Subject<boolean>();
    collaboratorsToolTip: string;

    constructor(private store: Store<AmaState>) {}

    ngOnInit() {
        this.collaborators$ = this.store.select(selectProjectCollaborators(this.projectId))
            .pipe(filter(collaborators => !!collaborators), map(collaborators => collaborators.sort(this.sortByName)));
        this.collaborators$.pipe(takeUntil(this.onDestroy$)).subscribe(collaborators => {
            if (collaborators?.length > 3) {
                this.collaboratorsToolTip = collaborators.slice(3).map(collaborator => collaborator.username).join(', ');
            }
        });
    }

    private sortByName(a: Collaborator, b: Collaborator): number {
        return (a.username > b.username) ? 1 : -1;
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
