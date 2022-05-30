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

export const NAME_REGEXP = /^([A-Za-z0-9\-_]+)?$/;
export const COLOR_HEX_REGEXP = /^#([a-z0-9]{3}|[a-z0-9]{4}|[a-z0-9]{6})$/i;
export const URL_REGEXP = /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/;
export const EXTERNAL_URL_REGEXP = /^(http|https):\/\/.*[^/]$/;
export const CONTENT_MODEL_PREFIX_PROPERTY_REGEXP = /^[a-z]([a-zA-Z0-9]{0,25})?$/;
export const HTML_REGEXP = /<\/?[a-z][\s\S]*>/;
export const MODELINGSDK_ALLOWED_CHARACTERS_REGEXP = /^[a-z]([-a-z0-9]{0,24}[-a-z0-9])?$/;
