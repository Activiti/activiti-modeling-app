import { Injectable } from '@angular/core';
import { APPLICATION, Application, Process, PROCESS, CONNECTOR, Connector } from '../../api/types';
import { BackendApplication, BackendProcess, BackendConnector } from './backend-types';

@Injectable()
export class EntityFactory {
    createApplication(backendApplication: BackendApplication): Application {
        const type = APPLICATION,
            description = '',
            version = '0.0.1';

        return {
            type,
            ...backendApplication,
            description,
            version
        };
    }

    createProcess({ modelType, ...backendProcess }: BackendProcess): Process {
        const type = PROCESS,
            description = '',
            version = '0.0.1',
            parentId = '';

        return {
            type,
            ...backendProcess,
            description,
            version,
            parentId
        };
    }

    createConnector({ modelType, ...backendConnector }: BackendConnector, appId: string): Connector {
        const type = CONNECTOR,
            description = '',
            applicationId = appId;

        return {
            type,
            ...backendConnector,
            description,
            applicationId
        };
    }


}
