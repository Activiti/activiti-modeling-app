import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plugin, PluginContent } from './types';

@Injectable()
export abstract class PluginApi {
    public abstract getForApplication(appId: string): Observable<Plugin[]>;
    public abstract create(form: Partial<Plugin>, applicationId: string): Observable<Plugin>;
    public abstract retrieve(formId: string): Observable<Plugin>;
    public abstract update(formId: string, content: PluginContent): Observable<Plugin>;
    public abstract delete(formId: string): Observable<void>;
    public abstract getContent(formId: string): Observable<PluginContent>;
    public abstract upload(file: File, applicationId: string): Observable<Plugin>;
}
