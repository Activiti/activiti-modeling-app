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

import { Logger } from '../util/logger';
import { browser } from 'protractor';

const fs = require('fs');
const path = require('path');
const convert = require('xml-js');
const unzipper = require('unzipper');

// @dynamic
export class UtilFile {

    static async fileExists(filePath, waitTimeout: number = 10000) {
        return await browser.wait(async () => {
                    return await fs.existsSync(filePath);
        }, waitTimeout, `File ${filePath} not found in ${waitTimeout} msec.`);
    }

    /**
     * Delete all files with a certain pattern in the name, from a directory
     *
     * @param dirPath - directory absolute path
     * @param pattern - file name pattern
     */
    static deleteFilesByPattern(dirPath, pattern) {
        // get all file names in the directory
        fs.readdir(dirPath, function (error, fileNames) {
            if (error) {
                Logger.error('Read directory failed.', error);
            }
            fileNames.forEach(function (file) {
                const match = file.match(new RegExp((pattern)));
                if (match !== null) {
                    const filePath = path.join(dirPath, file);
                    fs.unlink(filePath, function (err) {
                        if (err) {
                            Logger.error('Delete file failed.', error);
                        }
                    });
                }
            });
        });
    }

    static async readFile(filePath: string) {
        return new Promise((resolve, reject) => {
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
          });
        });
    }

    static async parseXML(xml, isFile: boolean = true) {
        let xmlContent;
        if ( isFile ) {
            xmlContent = await UtilFile.readFile(xml);
        } else {
            xmlContent = xml;
        }
        const result = convert.xml2json(xmlContent, {compact: true, spaces: 4});
        return result;
    }

    static getJSONItemValueByKey(json: Object, searchedKey: string) {
        const entriesMap = new Map(Object.entries(json));
        return entriesMap.get(searchedKey);
    }

    static unzip(zipFilePath: string, destionationPath: string) {
        return fs.createReadStream(zipFilePath).pipe(unzipper.Extract({ path: destionationPath }));
    }
}


