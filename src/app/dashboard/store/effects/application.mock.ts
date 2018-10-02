import { Application, APPLICATION } from 'ama-sdk';

export const mockApplication: Application = {
    id: 'app-id',
    name: 'app-name',
    description: 'description',
    version: '0.0.1',
    type: APPLICATION,
    createdBy: 'user',
    creationDate: new Date(),
    lastModifiedBy: 'user',
    lastModifiedDate: new Date()
};
