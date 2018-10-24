import { Pipe, PipeTransform } from '@angular/core';
import { createProcessName } from '../create-entries-names';

@Pipe({ name: 'processName' })
export class ProcessNamePipe implements PipeTransform {
    transform(value: string, args: string[]): string {
        if (!value) {
            return value;
        }

        return createProcessName(value);
    }
}
