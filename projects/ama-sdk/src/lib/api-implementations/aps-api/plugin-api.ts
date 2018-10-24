import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Plugin, PluginContent } from '../../api/types';
import { PluginApi } from '../../api/plugin-api.interface';

@Injectable()
export class APSPluginApi implements PluginApi {
    constructor() {}

    public getForApplication(applicationId: string): Observable<Plugin[]> {
        return of([]);
    }

    public create(plugin: Partial<Plugin>, pluginId: string): Observable<Plugin> {
        return <Observable<Plugin>>{};
    }

    public retrieve(pluginId: string): Observable<Plugin> {
        return <Observable<Plugin>>{};
    }

    public update(pluginId: string, content: PluginContent): Observable<Plugin> {
        return <Observable<Plugin>>{};
    }

    public delete(pluginId: string): Observable<void> {
        return <Observable<void>>{};
    }

    public getContent(pluginId: string): Observable<PluginContent> {
        return <Observable<PluginContent>>{};
    }

    public upload(file: File, applicationId: string): Observable<Plugin> {
        return <Observable<Plugin>>{};
    }
}
