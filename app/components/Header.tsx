/*
  Copyright 2018 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.​
*/
/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import { subclass, declared, property } from "esri/core/accessorSupport/decorators";
import Widget = require("esri/widgets/Widget");

import {
  ApplicationConfig
} from "ApplicationBase/interfaces";
import { renderable, tsx } from "esri/widgets/support/widget";

const CSS = {
  footer: "footer top-nav",
  header: "top-nav fade-in",
  title: "top-nav-title phone-hide app-header"
};
const toolbarId: string = "toolContainer";

@subclass("app.Header")
class Header extends declared(Widget) {
  constructor(params) {
    super(params);
    this.config = params.config;
  }
  @property()
  @renderable()
  config: ApplicationConfig;


  render() {

    const titleLink = this.config.titleLink ? <span><a href={this.config.titleLink}>{this.config.title}</a></span> : <span>{this.config.title}</span>
    const titleContainer = <div class="column-24 app-header"><div><a class="skip-to-content" href="#skip-to-content">Skip To Content</a>
      <div class={CSS.title}>{titleLink}</div>
    </div>
      <div id={toolbarId} class="top-nav-list right"></div>
    </div>;
    const content = this.config.headerPosition === "top" ?
      <header>{titleContainer}</header>
      : <footer>{titleContainer}</footer>

    return (
      <div>
        {content}
      </div>
    );
  }
  getToolbar() {
    return document.getElementById(toolbarId);;
  }
}

export default Header;
