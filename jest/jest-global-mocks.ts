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

Object.defineProperty(window, 'matchMedia', { value: () => ({ matches: true }) });
Object.defineProperty(window, 'CSS', { value: '' });

// fix https://github.com/Alfresco/alfresco-ng2-components/blob/development/lib/core/services/alfresco-api.service.ts#L124
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
