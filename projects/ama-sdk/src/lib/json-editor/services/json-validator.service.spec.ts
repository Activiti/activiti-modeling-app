import { TestBed } from '@angular/core/testing';
import { JsonValidatorService, AjvInjectionToken } from './json-validator.service';

describe('JsonValidatorService', () => {
    const dummySchema = {
        '$schema': 'http://json-schema.org/schema',
        'type': 'object',
        'properties': {
            'food': {
                'type': 'string'
            }
        },
        'required': [ 'food' ]
    };

    let service: JsonValidatorService, ajv;

    beforeEach(() => {
        ajv = { validate: jest.fn().mockReturnValue(false) };
        TestBed.configureTestingModule({
            providers: [{ provide: AjvInjectionToken, useValue: ajv }, JsonValidatorService]
        });

        service = TestBed.get(JsonValidatorService);
    });

    it('should return proper erratic validation response when SYNTACTICALLY WRONG json is present', () => {
        const jsonString = '{ "mistyped": json ';

        const validationResponse = service.validate(jsonString, dummySchema);

        expect(validationResponse.json).toBe(null);
        expect(validationResponse.valid).toBe(false);
        expect(validationResponse.error).toBe('APP.GENERAL.ERRORS.NOT_VALID_JSON');
    });

    it('should return proper erratic validation response when schemantically INVALID json is present', () => {
        const json = { foodx: 'potato' };
        const validationResponse = service.validate(JSON.stringify(json), dummySchema);

        expect(validationResponse.json).toBe(null);
        expect(validationResponse.valid).toBe(false);
        expect(validationResponse.error).toBe('APP.GENERAL.ERRORS.NOT_VALID_SCHEMA');
    });

    it('should return proper successful validation response when schemantically VALID json is present', () => {
        const json = { food: 'potato' };
        ajv.validate.mockReturnValue(true);
        const validationResponse = service.validate(JSON.stringify(json), dummySchema);
        expect(validationResponse.json).toEqual({ food: 'potato' });
        expect(validationResponse.valid).toBe(true);
        expect(validationResponse.error).toBe(null);
    });
});
