import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { LogService } from '@alfresco/adf-core';

@Injectable()
export abstract class BaseEffects {
    constructor(protected router: Router, protected logService: LogService) {}

    protected genericErrorHandler(specificErrorHandler, error, ...args) {
        this.logService.error(error);
        if (error.status === 401) {
            this.router.navigate(['login']);
            return of();
        }

        return specificErrorHandler(error, ...args);
    }
}
