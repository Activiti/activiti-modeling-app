import { NgModule, ModuleWithProviders } from '@angular/core';
import { UuidService } from './uuid.service';
import { AmaTitleService } from './title.service';
import { DownloadResourceService } from './download-resource.service';

@NgModule()
export class AmaServicesModule {
    static forApplication(): ModuleWithProviders {
        return {
            ngModule: AmaServicesModule,
            providers: [
                UuidService,
                AmaTitleService,
                DownloadResourceService
            ]
        };
    }
}
