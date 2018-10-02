import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable()
export class AmaTitleService {
    title: string;

    constructor(private titleService: Title) {
        this.title = this.titleService.getTitle();
    }

    setUnsavedTitle() {
        const tempTitle = '* ' + this.title;
        this.titleService.setTitle(tempTitle);
    }

    setSavedTitle() {
        this.titleService.setTitle(this.title);
    }
}
