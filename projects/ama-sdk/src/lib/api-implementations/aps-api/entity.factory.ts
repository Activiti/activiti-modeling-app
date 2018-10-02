import { Injectable } from '@angular/core';
import { APPLICATION, Application, Process, PROCESS, ProcessExtensions } from '../../api/types';
import { BackendApplication, BackendProcess } from './backend-types';

@Injectable()
export class EntityFactory {
    createApplication(backendApplication: BackendApplication): Application {
        const type = APPLICATION,
            description = 'Still need to be implemented by APS2',
            version = 'Still need to be implemented by APS2';

        return {
            type,
            ...backendApplication,
            description,
            version
        };
    }

    createProcess({ modelType, ...backendProcess }: BackendProcess): Process {
        const type = PROCESS,
            description = 'Still need to be implemented by APS2',
            version = 'Still need to be implemented by APS2',
            parentId = 'Still need to be implemented by APS2',
            extensions = <ProcessExtensions>{}; // 'Still need to be implemented by APS2',

        return {
            type,
            ...backendProcess,
            description,
            version,
            parentId,
            extensions
        };
    }
}
