{
    "$schema": "../node_modules/@alfresco/adf-core/app.config.schema.json",
    "authType": "${APP_CONFIG_AUTH_TYPE}",
    "providers": "BPM",
    "ecmHost": "${APP_CONFIG_ECM_HOST}",
    "bpmHost": "${APP_CONFIG_BPM_HOST}",
    "identityHost": "${APP_CONFIG_IDENTITY_HOST}",
    "loginRoute": "/login",
    "oauth2": {
        "host": "${APP_CONFIG_OAUTH2_HOST}",
        "authPath": "/protocol/openid-connect/token/",
        "clientId": "${APP_CONFIG_OAUTH2_CLIENTID}",
        "scope": "openid profile email",
        "secret": "",
        "implicitFlow": ${APP_CONFIG_OAUTH2_IMPLICIT_FLOW},
        "silentLogin": ${APP_CONFIG_OAUTH2_SILENT_LOGIN},
        "redirectSilentIframeUri": "${APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI}",
        "redirectUri": "${APP_CONFIG_OAUTH2_REDIRECT_LOGIN}",
        "redirectUriLogout": "${APP_CONFIG_OAUTH2_REDIRECT_LOGOUT}"
    },
    "notificationDefaultDuration": ${APP_CONFIG_NOTIFICATION_LAST},
    "showNotificationHistory": ${APP_CONFIG_SHOW_NOTIFICATION_HISTORY},
    "logLevel": "trace",
    "application": {
        "name": "Activiti Modeling Application"
    },
    "languagePicker": true,
    "locale": "en",
    "languages": [
        {
            "key": "en",
            "label": "English"
        },
        {
            "key": "ja",
            "label": "Japanese"
        }
    ],
    "process-modeler": {
        "priorities": [
            {
                "key": 0,
                "label": "PROCESS_EDITOR.PRIORITIES.NONE"
            },
            {
                "key": 1,
                "label": "PROCESS_EDITOR.PRIORITIES.LOW"
            },
            {
                "key": 2,
                "label": "PROCESS_EDITOR.PRIORITIES.MEDIUM"
            },
            {
                "key": 3,
                "label": "PROCESS_EDITOR.PRIORITIES.HIGH"
            }
        ],
        "timer-types": [
            {
                "key": "timeCycle",
                "label": "PROCESS_EDITOR.TIMER_TYPES.CYCLE"
            },
            {
                "key": "timeDuration",
                "label": "PROCESS_EDITOR.TIMER_TYPES.DURATION"
            },
            {
                "key": "timeDate",
                "label": "PROCESS_EDITOR.TIMER_TYPES.DATE"
            }
        ],
        "multi-instance-types": [
            {
                "key": "none",
                "label": "PROCESS_EDITOR.MULTI_INSTANCE_TYPES.NONE"
            },
            {
                "key": "parallel",
                "label": "PROCESS_EDITOR.MULTI_INSTANCE_TYPES.PARALLEL"
            },
            {
                "key": "sequence",
                "label": "PROCESS_EDITOR.MULTI_INSTANCE_TYPES.SEQUENCE"
            }
        ]
    },
    "navigation": {
        "main": [
            {
                "icon": "apps",
                "label": "DASHBOARD.NAVIGATION.PROJECTS.LABEL",
                "title": "DASHBOARD.NAVIGATION.PROJECTS.TOOLTIP",
                "disabled": false,
                "route": {
                    "url": "/dashboard/projects"
                }
            }
        ]
    },
    "create": [
        {
            "title": "DASHBOARD.NEW_MENU.MENU_ITEMS.CREATE_PROJECT",
            "icon": "create_new_folder",
            "handler": "CREATE_PROJECT_DIALOG"
        },
        {
            "title": "DASHBOARD.NEW_MENU.MENU_ITEMS.UPLOAD_PROJECT",
            "icon": "file_upload",
            "handler": "IMPORT_PROJECT_DIALOG"
        }
    ],
    "studioLayoutNavigationData": {
        "process": [
            {
                "label": "NEW_STUDIO_DASHBOARD.NAVIGATION.FAVORITE_PROJECTS.LABEL",
                "title": "DASHBOARD.NAVIGATION.FAVORITE_PROJECTS.TOOLTIP",
                "disabled": false,
                "showSearchBar": true,
                "route": {
                    "url": "/dashboard/favorite-projects"
                },
                "actions": [
                    {
                        "actionName": "upload",
                        "title": "NEW_STUDIO_DASHBOARD.NAVIGATION.ALL_PROJECTS.ACTIONS.UPLOAD",
                        "handler": "IMPORT_PROJECT_DIALOG",
                        "icon": "file_upload"
                    },
                    {
                        "actionName": "create",
                        "title": "NEW_STUDIO_DASHBOARD.NAVIGATION.ALL_PROJECTS.ACTIONS.CREATE",
                        "handler": "CREATE_PROJECT_DIALOG",
                        "icon": "add"
                    }
                ]
            },
            {
                "label": "NEW_STUDIO_DASHBOARD.NAVIGATION.ALL_PROJECTS.LABEL",
                "title": "DASHBOARD.NAVIGATION.ALL_PROJECTS.TOOLTIP",
                "disabled": false,
                "showSearchBar": true,
                "route": {
                    "url": "/dashboard/projects"
                },
                "actions": [
                    {
                        "actionName": "upload",
                        "title": "NEW_STUDIO_DASHBOARD.NAVIGATION.ALL_PROJECTS.ACTIONS.UPLOAD",
                        "handler": "IMPORT_PROJECT_DIALOG",
                        "icon": "file_upload"
                    },
                    {
                        "actionName": "create",
                        "title": "NEW_STUDIO_DASHBOARD.NAVIGATION.ALL_PROJECTS.ACTIONS.CREATE",
                        "handler": "CREATE_PROJECT_DIALOG",
                        "icon": "add"
                    }
                ]
            }
        ]
    }
}
