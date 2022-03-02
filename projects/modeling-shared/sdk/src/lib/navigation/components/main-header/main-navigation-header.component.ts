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

import { Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { navigationData } from '../main-navigation/main-navigation.component';

@Component({
  templateUrl: './main-navigation-header.component.html',
  styleUrls: ['./main-navigation-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainNavigationHeaderComponent implements OnInit {

  headerLabel = '';
  constructor(private router: Router) { }

  ngOnInit() {
    const url = this.router.url;
    Object.values(navigationData).find(data => {
      const navigationDetails = data.find(nav => url.includes(nav.route.url));
      if (navigationDetails) {
        this.headerLabel = navigationDetails.header_label;
      }
    });
  }
}
