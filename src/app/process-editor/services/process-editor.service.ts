import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Process } from 'ama-sdk';
import { DownloadResourceService } from '../../common/services/download-resource';
import { AmaApi } from 'ama-sdk';
import { PROCESS_FILE_FORMAT } from '../../common/helpers/create-entries-names';

@Injectable()
export class ProcessEditorService {
    constructor(
        private amaApi: AmaApi,
        private downloadService: DownloadResourceService
    ) {}

    updateProcess(processId: string, process: Process): Observable<Partial<Process>> {
        return this.amaApi.Process.update(processId, process);
    }

    saveProcessDiagram(processId: string, diagramData: string) {
        return this.amaApi.Process.saveDiagram(processId, diagramData);
    }

    getProcessDetails(processId: string) {
        return this.amaApi.Process.retrieve(processId, true);
    }

    getProcessDiagram(processId: string) {
        return this.amaApi.Process.getDiagram(processId);
    }

    downloadProcessDiagram(processName: string, processData: string) {
        const blob = new Blob([processData], { type: 'octet/stream' });
        this.downloadService.downloadResource(processName, blob, PROCESS_FILE_FORMAT);
    }
}
