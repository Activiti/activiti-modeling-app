/*!
 * @license
 * Alfresco Example Modeling Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Modeling Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Modeling Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Modeling Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ArtifactTypeFilter } from '../application-tree.helper';
import { ARTIFACT_TYPE } from 'ama-sdk';

@Component({
    selector: 'ama-application-tree-filter',
    templateUrl: './application-tree-filter.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationTreeFilterComponent implements OnInit {
    @Input() applicationId: string;
    @Input() filter: ArtifactTypeFilter;
    @Input() contents: any[];
    @Input() loading: boolean;
    @Input() expanded: boolean;
    @Output() opened = new EventEmitter<{ applicationId: string; type: string, loadData: boolean }>();
    @Output() closed = new EventEmitter<{ type: string }>();

    ignoreOpenEmit = false;

    ngOnInit() {
        if (this.expanded) {
            this.ignoreOpenEmit = true;
        }
    }

    contentHasBeenLoaded() {
        return !this.loading;
    }

    contentsAreEmpty() {
        return !(this.contents && this.contents.length);
    }

    filterClosed(type: ARTIFACT_TYPE): void {
        this.closed.emit({ type });
    }

    filterOpened(type: ARTIFACT_TYPE): void {
        this.opened.emit({ applicationId: this.applicationId, type, loadData: !this.ignoreOpenEmit });
        if (!this.ignoreOpenEmit) {
            this.ignoreOpenEmit = false;
        }
    }
}
