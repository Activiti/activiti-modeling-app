import { NgModule } from '@angular/core';

import { CoreModule, AppConfigService, DebugAppConfigService, TRANSLATION_PROVIDER } from '@alfresco/adf-core';

@NgModule({
    imports: [
        CoreModule
    ],
    exports: [CoreModule],
    providers: [
        { provide: AppConfigService, useClass: DebugAppConfigService },
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'app',
                source: 'resources'
            }
        },
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'lazy-loading',
                source: 'resources/lazy-loading'
            }
        }
    ]
})
export class AdfModule {}
