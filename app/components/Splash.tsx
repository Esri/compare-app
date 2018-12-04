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
import i18n = require("dojo/i18n!./../nls/resources");
import { subclass, declared, property } from "esri/core/accessorSupport/decorators";
import Widget = require("esri/widgets/Widget");

import {
  ApplicationConfig
} from "ApplicationBase/interfaces";
import { renderable, tsx } from "esri/widgets/support/widget";
declare var calcite: any;
@subclass("app.Splash")
class Splash extends declared(Widget) {
  constructor(params) {
    super(params);
    this.config = params.config;
  }
  @property()
  @renderable()
  config: ApplicationConfig;

  @property()
  @renderable()
  modalId: string = "splash";

  render() {
    calcite.init();
    const description = this.config.splashDesc ? (<span innerHTML={this.config.splashDesc}></span>) : null;
    const splashContent = <div class="js-modal modal-overlay modifier-class" data-modal={this.modalId}>
      <div class="modal-content column-12 app-body" role="dialog" aria-labelledby="modal">
        <h3 class='trailer-half'>{this.config.splashTitle}</h3>
        <p>{description}</p>
        <div class="text-right">
          <button class="btn btn-clear js-modal-toggle app-button">{this.config.splashButtonLabel}</button>
        </div>
      </div>
    </div>;

    return (
      <div>
        {splashContent}
      </div>
    );
  }

  public createToolbarButton(): HTMLButtonElement {
    // add a button to the app that toggles the splash
    // when no header exists add to the view
    const splashButton = document.createElement("button");
    splashButton.setAttribute("data-modal", this.modalId);
    const headerButtonClasses = ["js-modal-toggle", "search-top-nav", "toolbar-buttons", "icon-ui-description"];
    const viewButtonClasses = ["esri-widget--button", "icon-ui-flush"];
    splashButton.classList.add(...headerButtonClasses);
    if (!this.config.header) {
      // add esri button class
      splashButton.classList.add(...viewButtonClasses);
    }
    return splashButton
  }

  public showSplash() {
    if (this.config.splashOnStart) {
      // enable splash screen when app loads then
      // set info in session storage when its closed
      // so we don't open again this session.
      if (!sessionStorage.getItem("disableSplash")) {
        calcite.bus.emit("modal:open", { id: this.modalId });
      }
      sessionStorage.setItem("disableSplash", "true");
    }
  }
}

export default Splash;
