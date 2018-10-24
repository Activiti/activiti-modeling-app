import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { SetMenuAction } from '../../../../store/actions';
import { ArtifactTypeFilter, ApplicationTreeHelper } from '../application-tree.helper';
import { ARTIFACT_TYPE } from 'ama-sdk';
import { OpenFilterAction } from '../../../store/actions/application';
import { AmaState } from 'ama-sdk';

@Component({
    selector: 'ama-application-tree-icons',
    templateUrl: './application-tree-icons.component.html',
    styleUrls: ['./application-tree-icons.component.scss']
})
export class ApplicationTreeIconsComponent {
    filters: ArtifactTypeFilter[];

    @Input() applicationId: string;

    constructor(private store: Store<AmaState>, private applicationTreeHelper: ApplicationTreeHelper) {
        this.filters = this.applicationTreeHelper.getFilters();
    }

    onFilterIconClicked(filterType: ARTIFACT_TYPE): void {
        this.store.dispatch(new SetMenuAction(true));
        this.store.dispatch(new OpenFilterAction(filterType));
        this.applicationTreeHelper.getDataAdapter(filterType).load(this.applicationId);
    }
}
