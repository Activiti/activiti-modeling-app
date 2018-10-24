import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class ProcessVariablesService {
    @Output() variablesData: EventEmitter<any> = new EventEmitter<any>();
    constructor() {}

    sendData(data: string, error: string) {
        this.variablesData.emit({ data: data, error: error });
    }

}
