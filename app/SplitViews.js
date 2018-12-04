define(["require", "exports", "dojo/i18n!./nls/resources", "./Splitter"], function (require, exports, i18n, Splitter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CSS = {
        expandOpen: "esri-icon-zoom-out-fixed",
        expandClose: "esri-icon-zoom-in-fixed",
        button: "esri-widget--button",
        inset: "inset-map"
    };
    var SplitViews = /** @class */ (function () {
        function SplitViews(params) {
            this.config = params.config;
            this.splitContainer = params.splitContainer;
            var views = params.views;
            this._getViews(views);
        }
        SplitViews.prototype._getViews = function (views) {
            if (views && views.length && views.length > 1) {
                this.mainView = views[0];
                this.insetView = views[1];
                this._createSplitter(views);
                if (this.config.expand) {
                    this._addExpandButtons(views);
                } /*else {
                  this._createSplitter(views);
                }*/
            }
        };
        SplitViews.prototype._addExpandButtons = function (views) {
            // Add an expand button to each view
            var _this = this;
            views.forEach(function (view, index) {
                var expandButton = document.createElement("button");
                expandButton.classList.add(CSS.button, CSS.expandOpen);
                expandButton.title = i18n.tools.expand;
                expandButton.setAttribute("aria-label", i18n.tools.expand);
                view.ui.add(expandButton, _this.config.expandPosition);
                expandButton.addEventListener("click", function () {
                    if (expandButton.classList.contains(CSS.expandOpen)) {
                        // collapse the other view
                        index === 0 ? _this.splitter.collapse(1) : _this.splitter.collapse(0);
                        expandButton.title = i18n.tools.collapse;
                    }
                    else {
                        // reset views
                        _this.splitter.setSizes([50, 50]);
                        expandButton.title = i18n.tools.expand;
                    }
                    expandButton.classList.toggle(CSS.expandOpen);
                    expandButton.classList.toggle(CSS.expandClose);
                });
            });
        };
        SplitViews.prototype._createSplitter = function (views) {
            var splitterOptions = {
                minSize: 0,
                gutterSize: 20
            };
            if (this.config.splitDirection === "vertical") {
                // stack maps on top of each other
                splitterOptions.direction = "vertical";
            }
            else {
                splitterOptions.sizes = [50, 50];
            }
            this.splitter = Splitter_1.default(["#" + views[0].container.id, "#" + views[1].container.id], splitterOptions);
        };
        return SplitViews;
    }());
    exports.default = SplitViews;
});
//# sourceMappingURL=SplitViews.js.map