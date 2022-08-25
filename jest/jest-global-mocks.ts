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

const mock = () => {
    let storage: { [key: string]: any } = {};
    return {
        getItem: (key: string) => (key in storage ? storage[key] : null),
        setItem: (key: string, value: any) => (storage[key] = value || ''),
        removeItem: (key: string) => delete storage[key],
        clear: () => (storage = {})
    };
};

Object.defineProperty(window, 'localStorage', { value: mock() });
Object.defineProperty(window, 'sessionStorage', { value: mock() });
Object.defineProperty(document, 'doctype', { value: '<!DOCTYPE html>' });
Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({ display: 'none', appearance: ['-webkit-appearance'], getPropertyValue: () => '' })
});

Object.defineProperty(window, 'matchMedia', { value: () => ({ matches: true, addListener: jest.fn(), removeListener: jest.fn() }) });
Object.defineProperty(window, 'CSS', { value: '' });

// fix https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/core/services/alfresco-api.service.ts#L124
Object.defineProperty(window, 'location', { value: { origin: ''} });

/**
 * JSDOM missing transform property when using Angular Material, there is a workaround for it
 * https://github.com/thymikee/jest-preset-angular#the-animation-trigger-transformmenu-has-failed
 */
Object.defineProperty(document.body.style, 'transform', {
    value: () => {
        return {
            enumerable: true,
            configurable: true
        };
    }
});
