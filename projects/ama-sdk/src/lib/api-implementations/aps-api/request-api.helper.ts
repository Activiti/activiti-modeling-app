import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { AppConfigService, AlfrescoApiService } from '@alfresco/adf-core';

export interface RequestApiHelperOptions {
    pathParams?: { [key: string]: any} ;
    queryParams?: { [key: string]: any} ;
    headerParams?: { [key: string]: any} ;
    formParams?: { [key: string]: any} ;
    bodyParam?: { [key: string]: any} ;
    authNames?: string[];
    contentTypes?: string[];
    accepts?: string[];
    returnType?: any;
    contextRoot?: string;
    responseType?: 'arraybuffer'|'blob'|'document'|'json'|'text';
}

function getDefaultOptions(): RequestApiHelperOptions {
    return {
        pathParams: {},
        queryParams: {},
        headerParams: {},
        formParams: {},
        bodyParam: {},
        authNames: [],
        contentTypes: ['application/json'],
        accepts: ['application/json'],
        returnType: {'String': 'String'}
    };
}

@Injectable()
export class RequestApiHelper {

    constructor(private appConfig: AppConfigService, private alfrescoApiService: AlfrescoApiService) {}

    private get api() {
        return this.alfrescoApiService.getInstance().oauth2Auth;
    }

    private buildUrl(endPoint: string): string {
        const trimSlash = (str: string) => str.replace(/^\/|\/$/g, '');

        const host = trimSlash(this.appConfig.get('backend')),
            pathPrefix = trimSlash(this.appConfig.get('pathPrefix') || ''),
            prefix = (pathPrefix.length ) ? '/' + pathPrefix : '',
            path = '/' + trimSlash(endPoint);

        return `${host}${prefix}${path}`;
    }

    public get<T>(endPoint: string, overriddenOptions?: RequestApiHelperOptions): Observable<T> {
        return this.request.apply(this, ['GET', endPoint, overriddenOptions]);
    }

    public post(endPoint: string, overriddenOptions?: RequestApiHelperOptions) {
        return this.request.apply(this, ['POST', endPoint, overriddenOptions]);
    }

    public put(endPoint: string, overriddenOptions?: RequestApiHelperOptions) {
        return this.request.apply(this, ['PUT', endPoint, overriddenOptions]);
    }

    public delete(endPoint: string, overriddenOptions?: RequestApiHelperOptions) {
        return this.request.apply(this, ['DELETE', endPoint, overriddenOptions]);
    }

    private request<T>(httpMethod: string, endPoint: string, overriddenOptions?: RequestApiHelperOptions): Observable<T> {

        const options = {
            ...getDefaultOptions(),
            ...overriddenOptions
        };

        const {
            pathParams,
            queryParams,
            headerParams,
            formParams,
            bodyParam,
            authNames,
            contentTypes,
            accepts,
            returnType,
            contextRoot,
            responseType
        } = options;

        return from(this.api.callCustomApi(
            this.buildUrl(endPoint),
            httpMethod,
            pathParams,
            queryParams,
            headerParams,
            formParams,
            bodyParam,
            authNames,
            contentTypes,
            accepts,
            returnType,
            contextRoot,
            responseType
        ));
    }
}
