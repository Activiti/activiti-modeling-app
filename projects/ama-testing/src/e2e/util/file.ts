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
const unzipper = require('unzipper');

// @dynamic
export class UtilFile {

    static async fileExists(filePath, waitTimeout: number = 10000) {
        return browser.wait(async () => {
                    return fs.existsSync(filePath);
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

    static async readFile(filePath: string): Promise<string> {
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

    static unzip(zipFilePath: string, destinationPath: string) {
        return fs.createReadStream(zipFilePath).pipe(unzipper.Extract({ path: destinationPath }));
    }

    static async fileNotExist(filePath, waitTimeout: number = 500): Promise<boolean> {
        try {
            await this.fileExists(filePath, waitTimeout);
            return false;
        } catch (error) {
            return true;
        }
    }
}
