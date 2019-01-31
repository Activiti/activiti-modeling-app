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

import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogService, AppConfigService } from '@alfresco/adf-core';
import { Validators } from '@angular/forms';

@Component({
    templateUrl: './app-login.component.html'
})
export class AppLoginComponent implements OnInit {
    @ViewChild('amalogin') amalogin: any;

    customValidation: any;
    customMinLength = 2;
    form: any;

    get provider() {
        return this.appConfig.get<string>('providers');
    }

    constructor(
        private router: Router,
        private logService: LogService,
        private appConfig: AppConfigService
    ) {
        this.customValidation = {
            username: ['', Validators.compose([Validators.required, Validators.minLength(this.customMinLength)])],
            password: ['', Validators.required]
        };

        this.form = {
            username: '',
            password: ''
        };
    }

    ngOnInit() {
        this.amalogin.addCustomValidationError('username', 'required', 'LOGIN.MESSAGES.USERNAME-REQUIRED');
        this.amalogin.addCustomValidationError('username', 'minlength', 'LOGIN.MESSAGES.USERNAME-MIN', {
            minLength: this.customMinLength
        });
        this.amalogin.addCustomValidationError('password', 'required', 'LOGIN.MESSAGES.PASSWORD-REQUIRED');
    }

    onLogin($event) {
        this.router.navigate(['/home']);
    }

    onError($event) {
        this.logService.error($event);
    }
}
