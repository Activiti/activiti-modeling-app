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

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DownloadResourceService {
    downloadResource(name: string, data: Blob, extension: string) {
        const link = document.createElement('a');
        link.style.display = 'none';
        link.download = name + extension;
        document.body.appendChild(link);

        const url = window.URL.createObjectURL(data);

        link.href = url;
        link.click();
        window.URL.revokeObjectURL(url);
    }

    downloadResourceWithFilename(filename: string, data: Blob) {
        const link = document.createElement('a');
        link.style.display = 'none';
        link.download = filename;
        document.body.appendChild(link);

        const url = window.URL.createObjectURL(data);

        link.href = url;
        link.click();
        window.URL.revokeObjectURL(url);
    }

    downloadUrl(url: string, fileName?: string) {
        if (url) {
            const link = document.createElement('a');

            link.style.display = 'none';
            link.href = url;
            if (fileName) {
                link.download = fileName;
            }

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
