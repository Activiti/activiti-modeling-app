import { Injectable } from '@angular/core';
const uuidv4 = require('uuid/v4');

@Injectable()
export class UuidService {
    generate(): string {
        return uuidv4();
    }
}
