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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "dojo/i18n!./nls/resources", "esri/widgets/Expand", "ApplicationBase/support/itemUtils", "ApplicationBase/support/domHelper", "./SplitViews"], function (require, exports, i18n, Expand, itemUtils_1, domHelper_1, SplitViews_1) {
    "use strict";
    var CSS = {
        loading: "configurable-application--loading"
    };
    var CompareApp = /** @class */ (function () {
        function CompareApp() {
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            //----------------------------------
            //  ApplicationBase
            //----------------------------------
            this.base = null;
            this.header = null;
        }
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        CompareApp.prototype.init = function (base) {
            var _this = this;
            if (!base) {
                this._reportError("Unable to load application");
                console.error("ApplicationBase is not defined");
                return;
            }
            this._applySharedTheme(base);
            domHelper_1.setPageLocale(base.locale);
            domHelper_1.setPageDirection(base.direction);
            this.base = base;
            var config = base.config, results = base.results;
            var webMapItems = results.webMapItems, webSceneItems = results.webSceneItems;
            // We only support two views
            var allItems = webMapItems.concat(webSceneItems).slice(0, 2).map(function (item) { return item; });
            var validWebMapItems = [];
            allItems.forEach(function (response) {
                if (response && response.error) {
                    return;
                }
                validWebMapItems.push(response.value);
            });
            var firstItem = validWebMapItems[0];
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
            domHelper_1.setPageTitle(config.title);
            var viewContainerNode = document.getElementById("viewContainer");
            viewContainerNode.classList.add("direction-" + config.splitDirection);
            // Add header if header property isn't enabled
            if (config.header) {
                this._addHeader(viewContainerNode, config);
            }
            var portalItem = this.base.results.applicationItem.value;
            var appProxies = portalItem && portalItem.applicationProxies
                ? portalItem.applicationProxies
                : null;
            var defaultViewProperties = itemUtils_1.getConfigViewProperties(config);
            var viewResults = Promise.all(validWebMapItems.map(function (item, index) { return __awaiter(_this, void 0, void 0, function () {
                var container, mapContainer, viewProperties, useCustomExtent, _a, level, coords;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            container = document.createElement("div");
                            container.id = "map_" + index;
                            viewContainerNode.appendChild(container);
                            mapContainer = {
                                container: container
                            };
                            viewProperties = __assign({}, defaultViewProperties, mapContainer);
                            useCustomExtent = (index === 0) ? this.base.config.useCustomExtentWebMap : this.base.config.useCustomExtentWebScene;
                            // Use custom extent if it's defined
                            if (useCustomExtent) {
                                _a = (index === 0) ? this.base.config.customExtentWebMap : this.base.config.customExtentWebScene, level = _a.level, coords = _a.coords;
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
                                };
                            }
                            if (item && item.type === "Web Map" && (base.config.minScale || base.config.maxScale)) {
                                viewProperties.constraints = {
                                    minScale: base.config.minScale,
                                    maxScale: base.config.maxScale
                                };
                            }
                            return [4 /*yield*/, itemUtils_1.createMapFromItem({ item: item, appProxies: appProxies }).then(function (map) {
                                    return itemUtils_1.createView(__assign({}, viewProperties, { map: map })).then(function (view) {
                                        return view.when();
                                    });
                                })];
                        case 1: return [2 /*return*/, _b.sent()];
                    }
                });
            }); }));
            document.body.classList.remove(CSS.loading);
            viewResults.then(function (views) { return _this.setupViews(views); });
        };
        CompareApp.prototype._addSplash = function (view, config) {
            return __awaiter(this, void 0, void 0, function () {
                var Splash, splash, splashToggle, toolbar_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, new Promise(function (resolve_1, reject_1) { require(["./components/Splash"], resolve_1, reject_1); })];
                        case 1:
                            Splash = _a.sent();
                            if (Splash !== null) {
                                splash = new Splash.default({
                                    config: config,
                                    container: document.createElement("div")
                                });
                                document.body.appendChild(splash.container);
                                splashToggle = splash.createToolbarButton();
                                if (!config.header) {
                                    view.ui.add(splashToggle, "top-right");
                                }
                                else {
                                    toolbar_1 = this.header && this.header.getToolbar();
                                    if (toolbar_1) {
                                        toolbar_1.appendChild(splashToggle);
                                    }
                                }
                                splash.showSplash();
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        CompareApp.prototype._addHeader = function (viewContainerNode, config) {
            return __awaiter(this, void 0, void 0, function () {
                var Header, headerContainer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, new Promise(function (resolve_2, reject_2) { require(["./components/Header"], resolve_2, reject_2); })];
                        case 1:
                            Header = _a.sent();
                            if (Header !== null) {
                                this.header = new Header.default({
                                    config: config,
                                    container: document.createElement("div")
                                });
                                headerContainer = this.header.container;
                                config.headerPosition === "top" ? document.body.insertBefore(headerContainer, viewContainerNode) : document.body.appendChild(headerContainer);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        CompareApp.prototype.setupViews = function (views) {
            if (this.base.config.splash) {
                this._addSplash(views[0], this.base.config);
            }
            this._createDetailPanel(views);
            // Setup the splitter
            new SplitViews_1.default({
                views: views.slice(0, 2).map(function (item) { return item; }),
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
        };
        CompareApp.prototype._applySharedTheme = function (base) {
            var config = base.config;
            // Build and insert style
            var styles = [];
            styles.push(config.bodyBackground ? ".app-body{background:" + config.bodyBackground + ";}" : null);
            styles.push(config.panelColor ? ".app-body{color:" + config.panelColor + ";}" : null);
            styles.push(config.headerBackground ? ".app-header{background:" + config.headerBackground + ";}" : null);
            styles.push(config.headerColor ? ".app-header a{color:" + config.headerColor + ";}.app-header{color:" + config.headerColor + ";}.toolbar-buttons{color:" + config.headerColor + "}" : null);
            styles.push(config.buttonBackground ? ".app-button{background:" + config.buttonBackground + ";}" : null);
            styles.push(config.buttonColor ? ".app-button{color:" + config.buttonColor + ";}" : null);
            var style = document.createElement("style");
            style.appendChild(document.createTextNode(styles.join("")));
            document.getElementsByTagName("head")[0].appendChild(style);
        };
        CompareApp.prototype._createDetailPanel = function (views) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    // Add a panel with title and details for the maps
                    views.forEach(function (view, index) {
                        var desc = null, openAtStart = false, expand = false;
                        if (index === 0) {
                            desc = _this.base.config.webmapDesc;
                            openAtStart = _this.base.config.webmapDescOpenAtStart;
                            expand = _this.base.config.webmapDescExpand;
                        }
                        else if (index === 1) {
                            desc = _this.base.config.websceneDesc;
                            openAtStart = _this.base.config.websceneDescOpenAtStart;
                            expand = _this.base.config.websceneDescExpand;
                        }
                        if (desc) {
                            var panel = document.createElement("div");
                            panel.className = "panel panel-no-border panel-white app-body";
                            panel.innerHTML = desc;
                            if (expand) {
                                var expandWidget = new Expand({
                                    view: view,
                                    content: panel
                                });
                                view.ui.add(expandWidget, _this.base.config.descPosition);
                                if (openAtStart) {
                                    expandWidget.expand();
                                }
                            }
                            else {
                                view.ui.add(panel, _this.base.config.descPosition);
                            }
                        }
                    });
                    return [2 /*return*/];
                });
            });
        };
        CompareApp.prototype._addBasemapToggle = function (views) {
            return __awaiter(this, void 0, void 0, function () {
                var BasemapToggle, view, view;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.base.config.basemapToggle && !this.base.config.basemapToggle2) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, new Promise(function (resolve_3, reject_3) { require(["esri/widgets/BasemapToggle"], resolve_3, reject_3); })];
                        case 1:
                            BasemapToggle = _a.sent();
                            if (BasemapToggle) {
                                if (this.base.config.basemapToggle && views[0]) {
                                    view = views[0];
                                    view.ui.add(new BasemapToggle({ view: view, nextBasemap: this.base.config.basemapToggleNext }), this.base.config.basemapTogglePosition);
                                }
                                if (this.base.config.basemapToggle2 && views[1]) {
                                    view = views[1];
                                    view.ui.add(new BasemapToggle({ view: view, nextBasemap: this.base.config.basemapToggleNext2 }), this.base.config.basemapTogglePosition2);
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        CompareApp.prototype._addBookmarks = function (views) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, Bookmarks, Slides;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.base.config.bookmark) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, Promise.all([new Promise(function (resolve_4, reject_4) { require(["esri/widgets/Bookmarks"], resolve_4, reject_4); }), new Promise(function (resolve_5, reject_5) { require(["./components/Slides"], resolve_5, reject_5); })])];
                        case 1:
                            _a = _b.sent(), Bookmarks = _a[0], Slides = _a[1];
                            if (Bookmarks && Slides) {
                                views.some(function (view) {
                                    // create slides or bookmark
                                    var hasBookmarks = view.type === "3d" ? view.map.presentation && view.map.presentation.slides && view.map.presentation.slides.length : view.map.bookmarks && view.map.bookmarks.length;
                                    if (hasBookmarks > 0) {
                                        var bm = view.type === "3d" ? new Slides({ view: view }) : new Bookmarks({ view: view });
                                        var expand = new Expand({
                                            view: view,
                                            group: _this.base.config.bookmarkPosition,
                                            content: bm,
                                            expandTooltip: bm.label ? bm.label : _this.base.config.i18n.tools.bookmarks.label
                                        });
                                        view.ui.add(expand, _this.base.config.bookmarkPosition);
                                    }
                                    // If views are the same and not the defaults then short-circut the loop
                                    return _this.base.config.webmap !== "default" && _this.base.config.webscene !== "default" && (_this.base.config.webmap === _this.base.config.webscene);
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        CompareApp.prototype._addHome = function (views) {
            return __awaiter(this, void 0, void 0, function () {
                var Home;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.base.config.home) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, new Promise(function (resolve_6, reject_6) { require(["esri/widgets/Home"], resolve_6, reject_6); })];
                        case 1:
                            Home = _a.sent();
                            if (Home) {
                                views.forEach(function (view) {
                                    var home = new Home({ view: view });
                                    view.ui.add(home, _this.base.config.homePosition);
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        CompareApp.prototype._addLegend = function (views) {
            return __awaiter(this, void 0, void 0, function () {
                var Legend;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.base.config.legend) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, Promise.all([new Promise(function (resolve_7, reject_7) { require(["esri/widgets/Legend"], resolve_7, reject_7); })])];
                        case 1:
                            Legend = (_a.sent())[0];
                            if (Legend) {
                                views.some(function (view) {
                                    var legend = new Legend({ view: view });
                                    var expand = new Expand({
                                        content: legend,
                                        view: view,
                                        group: _this.base.config.legendPosition,
                                        expandTooltip: legend.label,
                                        container: document.createElement("div")
                                    });
                                    view.ui.add(expand, _this.base.config.legendPosition);
                                    // If views are the same and not the defaults then short-circut the loop
                                    return _this.base.config.webmap !== "default" && _this.base.config.webscene !== "default" && (_this.base.config.webmap === _this.base.config.webscene);
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        CompareApp.prototype._addMeasure = function (views) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, AreaMeasurement3D, DirectLineMeasurement3D, AreaMeasurement2D, DistanceMeasurement2D, Slice;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.base.config.measure) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, Promise.all([new Promise(function (resolve_8, reject_8) { require(["esri/widgets/AreaMeasurement3D"], resolve_8, reject_8); }), new Promise(function (resolve_9, reject_9) { require(["esri/widgets/DirectLineMeasurement3D"], resolve_9, reject_9); }), new Promise(function (resolve_10, reject_10) { require(["esri/widgets/AreaMeasurement2D"], resolve_10, reject_10); }), new Promise(function (resolve_11, reject_11) { require(["esri/widgets/DistanceMeasurement2D"], resolve_11, reject_11); }), new Promise(function (resolve_12, reject_12) { require(["esri/widgets/Slice"], resolve_12, reject_12); })])];
                        case 1:
                            _a = _b.sent(), AreaMeasurement3D = _a[0], DirectLineMeasurement3D = _a[1], AreaMeasurement2D = _a[2], DistanceMeasurement2D = _a[3], Slice = _a[4];
                            if (AreaMeasurement3D && DirectLineMeasurement3D && AreaMeasurement2D && DistanceMeasurement2D && Slice) {
                                views.forEach(function (view) {
                                    var measureTool = null;
                                    var buttons = [];
                                    var nav = document.createElement("nav");
                                    nav.className = "leader-1";
                                    // Add one or both buttons to the nav
                                    if (_this.base.config.measureOptions === "area" || _this.base.config.measureOptions === "both") {
                                        buttons.push(_this._createMeasureButton("area"));
                                    }
                                    if (_this.base.config.measureOptions === "line" || _this.base.config.measureOptions === "both") {
                                        buttons.push(_this._createMeasureButton("line"));
                                    }
                                    if (_this.base.config.slice && view.type === "3d") {
                                        buttons.push(_this._createMeasureButton("slice"));
                                    }
                                    buttons.forEach(function (button) { return nav.appendChild(button); });
                                    nav.addEventListener("click", function (e) {
                                        var activeButton = e.target;
                                        var isActive = activeButton.classList.contains("active");
                                        // Deactivate all buttons
                                        buttons.forEach(function (button) { return button.classList.remove("active"); });
                                        _this._destroyMeasureButton(view, measureTool);
                                        // Activate just the active one
                                        if (!isActive) {
                                            activeButton.classList.add("active");
                                            var buttonType = activeButton.dataset.type;
                                            if (view.type === "3d") {
                                                if (buttonType === "area") {
                                                    measureTool = new AreaMeasurement3D({ view: view });
                                                    measureTool.viewModel.newMeasurement();
                                                }
                                                else if (buttonType === "line") {
                                                    measureTool = new DirectLineMeasurement3D({ view: view });
                                                    measureTool.viewModel.newMeasurement();
                                                }
                                                else if (buttonType === "slice") {
                                                    measureTool = new Slice({ view: view });
                                                }
                                            }
                                            else { // 2d
                                                if (buttonType === "area") {
                                                    measureTool = new AreaMeasurement2D({ view: view });
                                                }
                                                else {
                                                    measureTool = new DistanceMeasurement2D({ view: view });
                                                }
                                                measureTool.viewModel.newMeasurement();
                                            }
                                            view.ui.add(measureTool, _this.base.config.measurePosition);
                                        }
                                    });
                                    view.ui.add(nav, _this.base.config.measurePosition);
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        CompareApp.prototype._destroyMeasureButton = function (view, tool) {
            if (!tool) {
                return;
            }
            view.ui.remove(tool);
            tool.destroy();
            tool = null;
        };
        CompareApp.prototype._createMeasureButton = function (type) {
            var _a;
            var button = document.createElement("button");
            var icon, label;
            if (type === "area") {
                icon = "esri-icon-polygon";
                label = i18n.tools.measureArea;
            }
            else if (type === "line") {
                icon = "esri-icon-minus";
                label = i18n.tools.measureLine;
            }
            else if (type === "slice") {
                icon = "esri-icon-hollow-eye";
                label = i18n.tools.slice; // hard-code name for testing
            }
            button.dataset.type = type;
            (_a = button.classList).add.apply(_a, ["esri-widget--button", "esri-widget", "btn", "btn-white", "btn-grouped", icon]);
            button.title = label;
            button.setAttribute("aria-label", label);
            return button;
        };
        CompareApp.prototype._addScalebar = function (views) {
            return __awaiter(this, void 0, void 0, function () {
                var Scalebar;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.base.config.scalebar) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, new Promise(function (resolve_13, reject_13) { require(["esri/widgets/ScaleBar"], resolve_13, reject_13); })];
                        case 1:
                            Scalebar = _a.sent();
                            if (Scalebar) {
                                views.some(function (view) {
                                    if (view.type === "2d") {
                                        view.ui.add(new Scalebar({ view: view }), _this.base.config.scalebarPosition);
                                    }
                                    // short circut if sync'd
                                    return _this.base.config.syncViews;
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        CompareApp.prototype._addSearch = function (views) {
            return __awaiter(this, void 0, void 0, function () {
                var Search, synced_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.base.config.search) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, Promise.all([new Promise(function (resolve_14, reject_14) { require(["esri/widgets/Search"], resolve_14, reject_14); })])];
                        case 1:
                            Search = (_a.sent())[0];
                            if (Search) {
                                synced_1 = this.base.config.syncViews;
                                views.some(function (view) {
                                    var _a;
                                    var container = document.createElement("div");
                                    //container.classList.add(...["search-top-nav", "toolbar-buttons"]);
                                    var search = new Search({ view: view });
                                    var expand = new Expand({
                                        content: search,
                                        view: view,
                                        expandTooltip: search.label,
                                        container: container
                                    });
                                    // place in header if available and if sync
                                    if (_this.header && synced_1) {
                                        var toolbar_2 = _this.header.getToolbar();
                                        (_a = container.classList).add.apply(_a, ["search-top-nav", "toolbar-buttons"]);
                                        toolbar_2 && toolbar_2.appendChild(expand.container);
                                    }
                                    else {
                                        expand.mode = "floating";
                                        view.ui.add(expand, _this.base.config.searchPosition);
                                        expand.group = _this.base.config.searchPosition;
                                    }
                                    // If views are synced then short-circut the loop
                                    return synced_1;
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        CompareApp.prototype._addShare = function (views) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, Share, ShareFeatures, link;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.base.config.share) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, Promise.all([new Promise(function (resolve_15, reject_15) { require(["./components/Share/ShareWidget"], resolve_15, reject_15); }), new Promise(function (resolve_16, reject_16) { require(["./components/Share/Share/ShareFeatures"], resolve_16, reject_16); })])];
                        case 1:
                            _a = _b.sent(), Share = _a[0], ShareFeatures = _a[1];
                            if (Share && ShareFeatures) {
                                link = document.createElement("link");
                                link.setAttribute("rel", "stylesheet");
                                link.setAttribute("type", "text/css");
                                link.setAttribute("href", "./app/components/Share/css/Share.css");
                                document.getElementsByTagName("head")[0].appendChild(link);
                                views.some(function (view) {
                                    var properties = {
                                        view: view,
                                        container: document.createElement('div'),
                                        shareFeatures: new ShareFeatures({
                                            copyToClipboard: _this.base.config.shareIncludeCopy,
                                            shareServices: _this.base.config.shareIncludeServices,
                                            embedMap: false,
                                        })
                                    };
                                    view.ui.add(new Share(properties), _this.base.config.sharePosition);
                                    // If views are synced then short-circut the loop
                                    return _this.base.config.syncViews;
                                    ;
                                });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        CompareApp.prototype._setupSync = function (views) {
            return __awaiter(this, void 0, void 0, function () {
                var Sync;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, new Promise(function (resolve_17, reject_17) { require(["./SyncViews"], resolve_17, reject_17); })];
                        case 1:
                            Sync = _a.sent();
                            if (Sync !== null) {
                                Sync.syncViews(views);
                                if (this.base.config.syncPopup) {
                                    Sync.syncPopups(views);
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        CompareApp.prototype._updateMultipleViews = function (views) {
            var _this = this;
            // Behaviors that work on multiple views
            var _a = this.base.config, find = _a.find, marker = _a.marker;
            views.forEach(function (view) {
                // Url Params
                itemUtils_1.findQuery(find, view).then(function () { return itemUtils_1.goToMarker(marker, view); });
                // Popup Dock Behaviors
                if (_this.base.config.autoDockPopup === false || _this.base.config.autoDockPopup === "false") {
                    view.popup.set("dockEnabled", true);
                    view.popup.set("dockOptions", {
                        breakpoint: false,
                        buttonEnabled: _this.base.config.dockButton,
                        position: _this.base.config.dockPosition
                    });
                }
            });
        };
        CompareApp.prototype._reportError = function (error) {
            document.body.classList.remove(CSS.loading);
            document.getElementById("viewContainer").innerHTML = error;
            console.log("Error", error);
        };
        return CompareApp;
    }());
    return CompareApp;
});
//# sourceMappingURL=Main.js.map