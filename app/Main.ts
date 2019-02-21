/*
  Copyright 2017 Esri
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

import ApplicationBase = require("ApplicationBase/ApplicationBase");

import i18n = require("dojo/i18n!./nls/resources");

const CSS = {
  loading: "configurable-application--loading"
};
import Expand = require("esri/widgets/Expand");
import {
  createMapFromItem,
  createView,
  getConfigViewProperties,
  findQuery,
  goToMarker
} from "ApplicationBase/support/itemUtils";

import {
  setPageLocale,
  setPageDirection,
  setPageTitle
} from "ApplicationBase/support/domHelper";

import SplitViews from "./SplitViews";

class CompareApp {
  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  ApplicationBase
  //----------------------------------
  base: ApplicationBase = null;
  header = null;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  public init(base: ApplicationBase): void {
    if (!base) {
      this._reportError("Unable to load application");
      console.error("ApplicationBase is not defined");
      return;
    }
    this._applySharedTheme(base);
    setPageLocale(base.locale);
    setPageDirection(base.direction);

    this.base = base;

    const { config, results } = base;

    const { webMapItems, webSceneItems } = results;

    // We only support two views
    const allItems = webMapItems.concat(webSceneItems).slice(0, 2).map(item => { return item; });
    let validWebMapItems = [];
    allItems.forEach(response => {
      if (response && response.error) { return; }
      validWebMapItems.push(response.value);
    });
    const firstItem = validWebMapItems[0];
    if (validWebMapItems.length < 2) {
      // add error to console but don't display since app has at least one map
      console.log("Application only has one valid map or scene to display");
    }

    if (!firstItem) {
      this._reportError("Unable to load webmap or web scene");
      console.error("Unable to load webmap or web scene");
      return;
    }
    if (!config.title) {
      // get default from localized strings
      config.title = i18n.appTitle;
    }
    setPageTitle(config.title);

    const viewContainerNode = document.getElementById("viewContainer");
    viewContainerNode.classList.add(`direction-${config.splitDirection}`);

    // Add header if header property isn't enabled
    if (config.header) {
      this._addHeader(viewContainerNode, config);
    }

    const portalItem: __esri.PortalItem = this.base.results.applicationItem.value;
    const appProxies =
      portalItem && portalItem.applicationProxies
        ? portalItem.applicationProxies
        : null;

    const defaultViewProperties = getConfigViewProperties(config);
    const viewResults = Promise.all(validWebMapItems.map(async (item, index) => {

      const container = document.createElement("div");
      container.id = `map_${index}`;

      viewContainerNode.appendChild(container);

      const mapContainer = {
        container
      };
      const viewProperties = {
        ...defaultViewProperties,
        ...mapContainer
      };

      const useCustomExtent = (index === 0) ? this.base.config.useCustomExtentWebMap : this.base.config.useCustomExtentWebScene;
      // Use custom extent if it's defined
      if (useCustomExtent) {
        const { level, coords } = (index === 0) ? this.base.config.customExtentWebMap : this.base.config.customExtentWebScene;
        if (level) {
          viewProperties.level = level;
        }
        if (coords && coords.latitude && coords.longitude) {
          viewProperties.center = [coords.latitude, coords.longitude];
        }
      }
      // Change 3d background color
      if (item && item.type === "Web Scene" && base.config.sceneBackgroundColor) {
        viewProperties.alphaCompositingEnabled = true;
        viewProperties.environment = {
          background: {
            type: "color",
            color: base.config.sceneBackgroundColor
          },
          starsEnabled: false,
          atmosphereEnabled: false
        };
      }
      if (item && item.type === "Web Map" && (base.config.minZoom || base.config.maxZoom)) {
        viewProperties.constraints = {
          minZoom: base.config.minZoom,
          maxZoom: base.config.maxZoom
        }
      }
      if (item && item.type === "Web Map" && (base.config.minScale || base.config.maxScale)) {
        viewProperties.constraints = {
          minScale: base.config.minScale,
          maxScale: base.config.maxScale
        }
      }
      return await createMapFromItem({ item, appProxies }).then(map => {
        return createView({
          ...viewProperties,
          map
        }).then((view) => {
          return view.when();
        });
      });
    }));
    document.body.classList.remove(CSS.loading);
    viewResults.then((views) => this.setupViews(views));

  }
  async _addSplash(view, config) {
    const Splash = await import("./components/Splash");
    if (Splash !== null) {
      const splash = new Splash.default({
        config,
        container: document.createElement("div")
      });
      document.body.appendChild(splash.container as HTMLElement);
      const splashToggle = splash.createToolbarButton();
      if (!config.header) {
        view.ui.add(splashToggle, "top-right");
      } else {
        // This toolbar is created as part of header
        const toolbar = this.header && this.header.getToolbar();
        if (toolbar) {
          toolbar.appendChild(splashToggle);
        }
      }
      splash.showSplash();
    }
  }
  async _addHeader(viewContainerNode, config) {
    //Add header if specified
    const Header = await import("./components/Header");
    if (Header !== null) {
      this.header = new Header.default({
        config,
        container: document.createElement("div")
      });
      // position at top or bottom of app
      const headerContainer = this.header.container as HTMLElement;
      config.headerPosition === "top" ? document.body.insertBefore(headerContainer, viewContainerNode) : document.body.appendChild(headerContainer);
    }
  }
  public setupViews(views) {
    if (this.base.config.splash) {
      this._addSplash(views[0], this.base.config);
    }
    this._createDetailPanel(views);
    // Setup the splitter
    new SplitViews({
      views: views.slice(0, 2).map(item => { return item; }),
      config: this.base.config,
      splitContainer: document.getElementById("viewContainer")
    });

    // Setup syncing
    if (this.base.config.syncViews) {
      this._setupSync(views);
    }
    this._updateMultipleViews(views);
    this._addHome(views);
    this._addScalebar(views);
    this._addSearch(views);
    this._addLegend(views);
    this._addBookmarks(views);
    this._addMeasure(views);
    this._addBasemapToggle(views);
    this._addShare(views);

  }
  _applySharedTheme(base) {
    const { config } = base;
    // Build and insert style
    const styles = [];
    styles.push(config.bodyBackground ? `.app-body{background:${config.bodyBackground};}` : null);
    styles.push(config.panelColor ? `.app-body{color:${config.panelColor};}` : null);
    styles.push(config.headerBackground ? `.app-header{background:${config.headerBackground};}` : null);
    styles.push(config.headerColor ? `.app-header a{color:${config.headerColor};}.app-header{color:${config.headerColor};}.toolbar-buttons{color:${config.headerColor}}` : null);
    styles.push(config.buttonBackground ? `.app-button{background:${config.buttonBackground};}` : null);
    styles.push(config.buttonColor ? `.app-button{color:${config.buttonColor};}` : null);

    const style = document.createElement("style");
    style.appendChild(document.createTextNode(styles.join("")));
    document.getElementsByTagName("head")[0].appendChild(style);

  }
  async _createDetailPanel(views) {

    // Add a panel with title and details for the maps
    views.forEach((view, index) => {
      let desc = null, openAtStart = false, expand = false;
      if (index === 0) {
        desc = this.base.config.webmapDesc;
        openAtStart = this.base.config.webmapDescOpenAtStart;
        expand = this.base.config.webmapDescExpand;
      } else if (index === 1) {
        desc = this.base.config.websceneDesc;
        openAtStart = this.base.config.websceneDescOpenAtStart;
        expand = this.base.config.websceneDescExpand;
      }
      if (desc) {
        const panel = document.createElement("div");
        panel.className = "panel panel-no-border panel-white app-body";
        panel.innerHTML = desc;

        if (expand) {
          const expandWidget = new Expand({
            view,
            content: panel
          });
          view.ui.add(expandWidget, this.base.config.descPosition);
          if (openAtStart) {
            expandWidget.expand();
          }
        } else {
          view.ui.add(panel, this.base.config.descPosition);
        }

      }
    });
  }
  async _addBasemapToggle(views) {
    if (!this.base.config.basemapToggle && !this.base.config.basemapToggle2) {
      return;
    }
    const BasemapToggle = await import("esri/widgets/BasemapToggle");
    if (BasemapToggle) {
      if (this.base.config.basemapToggle && views[0]) {
        const view = views[0];
        view.ui.add(new BasemapToggle({ view, nextBasemap: this.base.config.basemapToggleNext }), this.base.config.basemapTogglePosition);
      }
      if (this.base.config.basemapToggle2 && views[1]) {
        const view = views[1];
        view.ui.add(new BasemapToggle({ view, nextBasemap: this.base.config.basemapToggleNext2 }), this.base.config.basemapTogglePosition2);
      }
    }
  }
  async _addBookmarks(views) {
    if (!this.base.config.bookmark) {
      return;
    }

    const [Bookmarks, Slides] = await Promise.all([import("esri/widgets/Bookmarks"), import("./components/Slides")]);
    if (Bookmarks && Slides) {
      views.some((view) => {
        // create slides or bookmark
        const hasBookmarks = view.type === "3d" ? view.map.presentation && view.map.presentation.slides && view.map.presentation.slides.length : view.map.bookmarks && view.map.bookmarks.length;

        if (hasBookmarks > 0) {
          const bm = view.type === "3d" ? new Slides({ view }) : new Bookmarks({ view });
          const expand = new Expand({
            view,
            group: this.base.config.bookmarkPosition,
            content: bm,
            expandTooltip: bm.label ? bm.label : this.base.config.i18n.tools.bookmarks.label
          });

          view.ui.add(expand, this.base.config.bookmarkPosition);
        }
        // If views are the same and not the defaults then short-circut the loop
        return this.base.config.webmap !== "default" && this.base.config.webscene !== "default" && (this.base.config.webmap === this.base.config.webscene);
      });
    }
  }
  async _addHome(views) {
    if (!this.base.config.home) {
      return;
    }
    const Home = await import("esri/widgets/Home");
    if (Home) {
      views.forEach((view) => {
        const home = new Home({ view });
        view.ui.add(home, this.base.config.homePosition);
      });
    }
  }
  async _addLegend(views) {
    if (!this.base.config.legend) {
      return;
    }

    const [Legend] = await Promise.all([import("esri/widgets/Legend")]);

    if (Legend) {
      views.some((view) => {
        const legend = new Legend({ view });
        const expand = new Expand({
          content: legend,
          view,
          group: this.base.config.legendPosition,
          expandTooltip: legend.label,
          container: document.createElement("div")
        });

        view.ui.add(expand, this.base.config.legendPosition);

        // If views are the same and not the defaults then short-circut the loop
        return this.base.config.webmap !== "default" && this.base.config.webscene !== "default" && (this.base.config.webmap === this.base.config.webscene);
      });
    }

  }
  async _addMeasure(views) {
    if (!this.base.config.measure) {
      return;
    }
    const [AreaMeasurement3D, DirectLineMeasurement3D, AreaMeasurement2D, DistanceMeasurement2D, Slice] = await Promise.all([import("esri/widgets/AreaMeasurement3D"), import("esri/widgets/DirectLineMeasurement3D"), import("esri/widgets/AreaMeasurement2D"), import("esri/widgets/DistanceMeasurement2D"), import("esri/widgets/Slice")]);
    if (AreaMeasurement3D && DirectLineMeasurement3D && AreaMeasurement2D && DistanceMeasurement2D && Slice) {
      views.forEach(view => {
        let measureTool = null;
        let buttons = [];
        const nav = document.createElement("nav");
        nav.className = "leader-1";
        // Add one or both buttons to the nav
        if (this.base.config.measureOptions === "area" || this.base.config.measureOptions === "both") {
          buttons.push(this._createMeasureButton("area"));
        }
        if (this.base.config.measureOptions === "line" || this.base.config.measureOptions === "both") {
          buttons.push(this._createMeasureButton("line"));
        }
        if (this.base.config.slice && view.type === "3d") {
          buttons.push(this._createMeasureButton("slice"));
        }
        buttons.forEach(button => nav.appendChild(button));
        nav.addEventListener("click", e => {
          const activeButton = e.target as HTMLButtonElement;

          const isActive = activeButton.classList.contains("active");

          // Deactivate all buttons
          buttons.forEach(button => button.classList.remove("active"));
          this._destroyMeasureButton(view, measureTool);
          // Activate just the active one
          if (!isActive) {
            activeButton.classList.add("active");
            const buttonType = activeButton.dataset.type;
            if (view.type === "3d") {
              if (buttonType === "area") {
                measureTool = new AreaMeasurement3D({ view });
                measureTool.viewModel.newMeasurement();
              } else if (buttonType === "line") {
                measureTool = new DirectLineMeasurement3D({ view });
                measureTool.viewModel.newMeasurement();
              } else if (buttonType === "slice") {
                measureTool = new Slice({ view });
              }
            } else { // 2d
              if (buttonType === "area") {
                measureTool = new AreaMeasurement2D({ view });
              } else {
                measureTool = new DistanceMeasurement2D({ view })
              }
              measureTool.viewModel.newMeasurement();
            }
            view.ui.add(measureTool, this.base.config.measurePosition);
          }
        });
        view.ui.add(nav, this.base.config.measurePosition);
      });
    }
  }
  _destroyMeasureButton(view, tool) {
    if (!tool) {
      return;
    }
    view.ui.remove(tool);
    tool.destroy();
    tool = null;
  }
  _createMeasureButton(type) {
    const button = document.createElement("button");
    let icon, label;
    if (type === "area") {
      icon = "esri-icon-polygon";
      label = i18n.tools.measureArea;
    } else if (type === "line") {
      icon = "esri-icon-minus";
      label = i18n.tools.measureLine;
    } else if (type === "slice") {
      icon = "esri-icon-hollow-eye";
      label = i18n.tools.slice; // hard-code name for testing
    }
    button.dataset.type = type;
    button.classList.add(...["esri-widget--button", "esri-widget", "btn", "btn-white", "btn-grouped", icon]);
    button.title = label;
    button.setAttribute("aria-label", label);
    return button;
  }
  async _addScalebar(views) {
    if (!this.base.config.scalebar) {
      return;
    }
    const Scalebar = await import("esri/widgets/ScaleBar");
    if (Scalebar) {
      views.some(view => {
        if (view.type === "2d") {
          view.ui.add(new Scalebar({ view }), this.base.config.scalebarPosition);
        }
        // short circut if sync'd
        return this.base.config.syncViews;
      });
    }

  }
  async _addSearch(views) {
    if (!this.base.config.search) {
      return;
    }
    const [Search] = await Promise.all([import("esri/widgets/Search")]);

    if (Search) {
      const synced = this.base.config.syncViews;
      views.some((view) => {
        const container = document.createElement("div");
        //container.classList.add(...["search-top-nav", "toolbar-buttons"]);
        const search = new Search({ view });
        const expand = new Expand({
          content: search,
          view,
          expandTooltip: search.label,
          container
        });
        // place in header if available and if sync
        if (this.header && synced) {
          const toolbar = this.header.getToolbar();
          container.classList.add(...["search-top-nav", "toolbar-buttons"]);
          toolbar && toolbar.appendChild(expand.container);
        } else {
          expand.mode = "floating";
          view.ui.add(expand, this.base.config.searchPosition);
          expand.group = this.base.config.searchPosition;
        }
        // If views are synced then short-circut the loop
        return synced;
      });
    }
  }
  async _addShare(views) {
    if (!this.base.config.share) {
      return;
    }
    const [Share, ShareFeatures] = await Promise.all([import("./components/Share/ShareWidget"), import("./components/Share/Share/ShareFeatures")]);
    if (Share && ShareFeatures) {
      // add share css
      const link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("type", "text/css");
      link.setAttribute("href", "./app/components/Share/css/Share.css");
      document.getElementsByTagName("head")[0].appendChild(link);
      views.some((view) => {
        const properties = {
          view,
          container: document.createElement('div'),
          shareFeatures: new ShareFeatures({
            copyToClipboard: this.base.config.shareIncludeCopy,
            shareServices: this.base.config.shareIncludeServices,
            embedMap: false,
          })
        };
        view.ui.add(new Share(properties), this.base.config.sharePosition);
        // If views are synced then short-circut the loop
        return this.base.config.syncViews;;
      });
    }
  }
  async _setupSync(views) {
    // Synchronize the views
    const Sync = await import("./SyncViews");
    if (Sync !== null) {
      Sync.syncViews(views);
      if (this.base.config.syncPopup) {
        Sync.syncPopups(views);
      }

    }
  }
  _updateMultipleViews(views) {
    // Behaviors that work on multiple views
    const { find, marker } = this.base.config;
    views.forEach((view) => {
      // Url Params
      findQuery(find, view).then(() => goToMarker(marker, view));
      // Popup Dock Behaviors
      if (this.base.config.autoDockPopup === false || this.base.config.autoDockPopup === "false") {
        view.popup.set("dockEnabled", true);
        view.popup.set("dockOptions", {
          breakpoint: false,
          buttonEnabled: this.base.config.dockButton,
          position: this.base.config.dockPosition
        });
      }
    });
  }
  _reportError(error) {
    document.body.classList.remove(CSS.loading);
    document.getElementById("viewContainer").innerHTML = error;
    console.log("Error", error);
  }
}
export = CompareApp;
