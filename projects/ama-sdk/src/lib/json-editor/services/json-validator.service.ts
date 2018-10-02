import { Injectable, InjectionToken, Inject } from '@angular/core';
/*
    Angular 6 --prod mode doesn't seem to work with the normal way of importing the ajv library.
    Modify this import with care, doublechecking the process editor works in --prod mode.
*/
import Ajv from 'ajv/dist/ajv.min';

export interface ValidationResponse<T> {
    json: T;
    valid: boolean;
    error: string | null;
}

export function ajvFactory() { return new Ajv(); }

export const AjvInjectionToken = new InjectionToken<string>('AjvInjectionToken', {
    providedIn: 'root',
    factory: ajvFactory
});

@Injectable({
    providedIn: 'root'
})
export class JsonValidatorService {

    constructor(@Inject(AjvInjectionToken) private ajv: Ajv) {}

    validate<T>(jsonString: string = '', schema: any): ValidationResponse<T> {
        let json,
            validationResponse: ValidationResponse<T>;

        try {
            json = JSON.parse(jsonString.trim());
            if (!this.ajv.validate(schema, json)) {
                validationResponse = { json: null, valid: false, error: 'APP.GENERAL.ERRORS.NOT_VALID_SCHEMA' };
            } else {
                validationResponse = { json, valid: true, error: null };
            }
        } catch {
            validationResponse = { json: null, valid: false, error: 'APP.GENERAL.ERRORS.NOT_VALID_JSON' };
        }

        return validationResponse;
    }
}
