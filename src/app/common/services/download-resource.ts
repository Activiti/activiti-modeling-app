import { Injectable } from '@angular/core';


@Injectable()
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

}
