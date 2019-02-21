
import i18n = require("dojo/i18n!./nls/resources");

import {
  ApplicationConfig
} from "ApplicationBase/interfaces";

import Split from "./Splitter";


const CSS = {
  expandOpen: "esri-icon-zoom-out-fixed",
  expandClose: "esri-icon-zoom-in-fixed",
  button: "esri-widget--button",
  inset: "inset-map"
}


class SplitViews {

  insetView: __esri.MapView | __esri.SceneView;
  mainView: __esri.MapView | __esri.SceneView;
  splitter: any;

  splitContainer: HTMLDivElement;
  config: ApplicationConfig;
  constructor(params) {

    this.config = params.config;
    this.splitContainer = params.splitContainer;
    const { views } = params;
    this._getViews(views);
  }
  _getViews(views) {
    if (views && views.length && views.length > 1) {

      this.mainView = views[0];
      this.insetView = views[1];
      this._createSplitter(views);
      if (this.config.expand) {
        this._addExpandButtons(views);
      }/*else {
        this._createSplitter(views);
      }*/


    }
  }

  _addExpandButtons(views) {
    // Add an expand button to each view

    views.forEach((view, index) => {
      const expandButton = document.createElement("button");
      expandButton.classList.add(CSS.button, CSS.expandOpen);
      expandButton.title = i18n.tools.expand;
      expandButton.setAttribute("aria-label", i18n.tools.expand);
      view.ui.add(expandButton, this.config.expandPosition);
      expandButton.addEventListener("click", () => {
        if (expandButton.classList.contains(CSS.expandOpen)) {
          // collapse the other view
          index === 0 ? this.splitter.collapse(1) : this.splitter.collapse(0);
          expandButton.title = i18n.tools.collapse;
        } else {
          // reset views
          this.splitter.setSizes([50, 50]);
          expandButton.title = i18n.tools.expand;
        }
        expandButton.classList.toggle(CSS.expandOpen);
        expandButton.classList.toggle(CSS.expandClose);
      });

    });
  }
  _createSplitter(views) {
    let splitterOptions: any = {
      minSize: 0,
      gutterSize: 20
    };
    if (this.config.splitDirection === "vertical") {
      // stack maps on top of each other
      splitterOptions.direction = "vertical";
    } else {
      splitterOptions.sizes = [50, 50];
    }
    this.splitter = Split([`#${views[0].container.id}`, `#${views[1].container.id}`], splitterOptions);
  }
}
export default SplitViews;
