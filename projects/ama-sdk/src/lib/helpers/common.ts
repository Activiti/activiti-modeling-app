export interface EntityDialogForm {
    id?: string;
    name: string;
    description?: string;
    applicationId?: string;
}

export interface BreadcrumbItem {
    name?: string;
    url?: string;
}

export interface UploadFileAttemptPayload {
    file: File;
    applicationId: string;
}

export interface EntityDialogPayload {
    title: string;
    nameField: string;
    descriptionField: string;
    values?: EntityDialogForm;
    action: any;
}
