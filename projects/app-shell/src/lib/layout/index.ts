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

import { AppLayoutV1Module } from './v1/app-layout-v1.module';
import { AppLayoutV1Component } from './v1/components/app-layout/app-layout-v1.component';

import { AppLayoutV2Module } from './v2/app-layout-v2.module';
import { AppLayoutV2Component } from './v2/components/app-layout/app-layout-v2.component';

let version: string;
version = 'v1'; // This should come from an environment variable

export const AppLayoutModule = (version === 'v1') ? AppLayoutV1Module : AppLayoutV2Module;
export const AppLayoutComponent = (version === 'v1') ? AppLayoutV1Component : AppLayoutV2Component;
