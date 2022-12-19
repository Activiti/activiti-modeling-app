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

import { ModelApi, ModelApiVariation } from './model-api';
import { of } from 'rxjs';
import { Model } from '../../api/types';
import { RequestApiHelper } from './request-api.helper';

describe('ModelApi', () => {
    let modelApi: ModelApi<Model, any>;

    const mockModelVariation = {
        contentType: 'testContentType',
        patchModel: jest.fn().mockImplementation(() => {}),
        createInitialContent: jest.fn().mockImplementation(() => {}),
        createInitialMetadata: jest.fn().mockImplementation(() => {}),
        getFileToUpload: jest.fn().mockImplementation(() => new Blob()),
        getModelFileName: jest.fn().mockImplementation(() => ''),
        serialize: jest.fn().mockImplementation(() => ''),
        createSummaryPatch: jest
            .fn()
            .mockImplementation(() => ({ name: 'test-name' })),
    } as unknown as ModelApiVariation<Model, any>;

    describe('getList', () => {
        const mockGetResponse = {
            list: { entries: [{ entry: {} }, { entry: {} }] },
        };
        const mockRequestApiHelper = {
            get: jest.fn().mockImplementation(() => of(mockGetResponse)),
        } as unknown as RequestApiHelper;

        beforeEach(() => {
            modelApi = new ModelApi(mockModelVariation, mockRequestApiHelper);
        });

        it('should call get on modeling service', () => {
            const getSpy = jest.spyOn(mockRequestApiHelper, 'get');
            const testContainerId = 'container-id';

            modelApi.getList(testContainerId);

            expect(getSpy).toHaveBeenCalledWith(
                '/modeling-service/v1/projects/container-id/models',
                {
                    queryParams: { type: 'testContentType', maxItems: 1000 },
                }
            );
        });

        it('should patch model for every entry', async () => {
            const patchModelSpy = jest.spyOn(mockModelVariation, 'patchModel');
            await modelApi.getList('testId').toPromise();

            expect(patchModelSpy).toHaveBeenCalledTimes(2);
        });
    });

    describe('create', () => {
        const mockRequestApiHelper = {
            post: jest
                .fn()
                .mockImplementation(() => of({ entry: { id: 'test-id' } })),
            put: jest.fn().mockImplementation(() => of(null)),
        } as unknown as RequestApiHelper;

        beforeEach(() => {
            modelApi = new ModelApi(mockModelVariation, mockRequestApiHelper);
        });

        it('should call post on modeling service', () => {
            const postSpy = jest.spyOn(mockRequestApiHelper, 'post');
            const testContainerId = 'container-id';

            modelApi.create({}, testContainerId);

            expect(postSpy).toHaveBeenCalledWith(
                '/modeling-service/v1/projects/container-id/models',
                { bodyParam: expect.any(Object) }
            );
        });

        it('should update content with put', async () => {
            const putSpy = jest.spyOn(mockRequestApiHelper, 'put');
            const testContainerId = 'container-id';
            const testModel = { name: 'test-name' };

            await modelApi.create(testModel, testContainerId).toPromise();

            expect(putSpy).toHaveBeenCalledWith(
                '/modeling-service/v1/models/test-id/content',
                expect.anything()
            );
        });
    });

    describe('retrieve', () => {
        const mockEntity = { id: 'test-id', name: 'test-name' };
        const mockGetResponse = { entry: mockEntity };
        const mockRequestApiHelper = {
            get: jest.fn().mockImplementation(() => of(mockGetResponse)),
        } as unknown as RequestApiHelper;

        beforeEach(() => {
            modelApi = new ModelApi(mockModelVariation, mockRequestApiHelper);
        });

        it('should call get on modeling service', () => {
            const getSpy = jest.spyOn(mockRequestApiHelper, 'get');
            modelApi.retrieve('test-id', 'container-id', { test: 'test' });
            expect(getSpy).toHaveBeenCalledWith(
                '/modeling-service/v1/models/test-id',
                { queryParams: { test: 'test' } }
            );
        });

        it('should patch model', async () => {
            const patchModelSpy = jest.spyOn(mockModelVariation, 'patchModel');
            await modelApi
                .retrieve('test-id', 'container-id', { test: 'test' })
                .toPromise();
            expect(patchModelSpy).toHaveBeenCalledWith(mockEntity);
        });
    });

    describe('update', () => {
        const mockEntity = { id: 'test-id', name: 'test-name' };
        const mockPutResponse = { entry: mockEntity };
        const mockRequestApiHelper = {
            put: jest.fn().mockImplementation(() => of(mockPutResponse)),
        } as unknown as RequestApiHelper;

        beforeEach(() => {
            modelApi = new ModelApi(mockModelVariation, mockRequestApiHelper);
        });

        it('should call put on modeling service', () => {
            const putSpy = jest.spyOn(mockRequestApiHelper, 'put');
            modelApi.update('test-id', {}, {}, 'container-id');

            expect(putSpy).toHaveBeenCalledWith(
                '/modeling-service/v1/models/test-id',
                { bodyParam: { name: 'test-name' } }
            );
        });

        it('should update content', async () => {
            await modelApi
                .update('test-id', {}, {}, 'container-id', false)
                .toPromise();

            const putSpy = jest.spyOn(mockRequestApiHelper, 'put');
            expect(putSpy).toHaveBeenCalledWith(
                '/modeling-service/v1/models/test-id/content',
                expect.any(Object)
            );
        });

        it('should patch model', async () => {
            const patchModelSpy = jest.spyOn(mockModelVariation, 'patchModel');
            await modelApi
                .update('test-id', {}, {}, 'container-id')
                .toPromise();

            expect(patchModelSpy).toHaveBeenCalledWith(mockEntity);
        });
    });

    describe('delete', () => {
        const mockRequestApiHelper = {
            delete: jest.fn(),
        } as unknown as RequestApiHelper;

        beforeEach(() => {
            modelApi = new ModelApi(mockModelVariation, mockRequestApiHelper);
        });

        it('should call delete on modeling service', () => {
            const deleteSpy = jest.spyOn(mockRequestApiHelper, 'delete');
            modelApi.delete('test-id');

            expect(deleteSpy).toHaveBeenCalledWith(
                '/modeling-service/v1/models/test-id'
            );
        });
    });

    describe('validate', () => {
        const mockRequestApiHelper = {
            post: jest.fn().mockImplementation(() => of({})),
        } as unknown as RequestApiHelper;

        beforeEach(() => {
            modelApi = new ModelApi(mockModelVariation, mockRequestApiHelper);
        });

        it('should call post on modeling service', () => {
            const postSpy = jest.spyOn(mockRequestApiHelper, 'post');
            modelApi.validate('test-id', {}, 'container-id');

            expect(postSpy).toHaveBeenCalledWith(
                '/modeling-service/v1/models/test-id/validate',
                expect.any(Object)
            );
        });

        it('should validate model extensions', () => {
            const postSpy = jest.spyOn(mockRequestApiHelper, 'post');
            modelApi
                .validate('test-id', {}, 'container-id', { extensions: 'test' })
                .toPromise();

            expect(postSpy).toHaveBeenCalledWith(
                '/modeling-service/v1/models/test-id/validate/extensions',
                expect.any(Object)
            );
        });
    });

    describe('import', () => {
        const mockEntity = { id: 'test-id', name: 'test-name' };
        const mockPostResponse = { entry: mockEntity };
        const mockRequestApiHelper = {
            post: jest.fn().mockImplementation(() => of(mockPostResponse)),
        } as unknown as RequestApiHelper;

        beforeEach(() => {
            modelApi = new ModelApi(mockModelVariation, mockRequestApiHelper);
        });

        it('should call post on modeling service', () => {
            const postSpy = jest.spyOn(mockRequestApiHelper, 'post');
            modelApi.import(new File([], 'file-name'), 'container-id');

            expect(postSpy).toHaveBeenCalledWith(
                `/modeling-service/v1/projects/container-id/models/import`,
                expect.any(Object)
            );
        });

        it('should patch model', async () => {
            const patchModelSpy = jest.spyOn(mockModelVariation, 'patchModel');
            await modelApi
                .import(new File([], 'file-name'), 'container-id')
                .toPromise();

            expect(patchModelSpy).toHaveBeenCalledWith(mockEntity);
        });
    });

    describe('export', () => {
        const mockRequestApiHelper = {
            get: jest.fn().mockImplementation(() => of({})),
        } as unknown as RequestApiHelper;

        beforeEach(() => {
            modelApi = new ModelApi(mockModelVariation, mockRequestApiHelper);
        });

        it('should call get on modeling service', () => {
            const getSpy = jest.spyOn(mockRequestApiHelper, 'get');
            modelApi.export('test-id', 'arraybuffer');

            expect(getSpy).toHaveBeenCalledWith(
                `/modeling-service/v1/models/test-id/content`,
                { responseType: 'arraybuffer' }
            );
        });
    });
});
