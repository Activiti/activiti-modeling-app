import { EntityFactory } from './entity.factory';
import { BackendApplication } from './backend-types';
import { APPLICATION } from '../../api/types';

describe('EntityFactory', () => {
    let entityFactory: EntityFactory;

    it('should create an application from backend application response', () => {
        entityFactory = new EntityFactory();

        const backendApplication: BackendApplication = {
            id: 'app-id',
            name: 'app-name',
            creationDate: new Date(),
            createdBy: 'username',
            lastModifiedDate: new Date(),
            lastModifiedBy: 'another-username'
        };

        const application = entityFactory.createApplication(backendApplication);

        expect(application).toEqual({
            type: APPLICATION,
            ...backendApplication,
            description: '',
            version: '0.0.1'
        });
    });
});
