/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/watchUtils", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/core/Handles", "esri/widgets/support/widget", "./Slides/SlideViewModel", "dojo/i18n!./../nls/resources"], function (require, exports, __extends, __decorate, watchUtils, decorators_1, Widget, HandleRegistry, widget_1, SlideViewModel, i18n) {
    "use strict";
    var CSS = {
        base: "app-bookmarks",
        title: "app-bookmarks-title",
        loading: "app-bookmarks__loading",
        loadingIcon: "esri-icon-loading-indicator esri-rotating",
        fadeIn: "app-bookmarks--fade-in",
        iconClass: "esri-icon-labels",
        bookmarkList: "app-bookmarks__list",
        bookmarkItem: "app-bookmarks__item",
        bookmarkItemIcon: "app-bookmarks__item-icon",
        bookmarkItemName: "app-bookmarks__item-name",
        bookmarkItemActive: "app-bookmarks__item--active"
    };
    var Slides = /** @class */ (function (_super) {
        __extends(Slides, _super);
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        function Slides(params) {
            var _this = _super.call(this) || this;
            //--------------------------------------------------------------------------
            //
            //  Variables
            //
            //--------------------------------------------------------------------------
            _this._handles = new HandleRegistry();
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            //----------------------------------
            //  iconClass
            //----------------------------------
            _this.iconClass = CSS.iconClass;
            //----------------------------------
            //  label
            //----------------------------------
            _this.containerTitle = null;
            //----------------------------------
            //  label
            //----------------------------------
            _this.label = i18n.tools.bookmarks.label;
            //----------------------------------
            //  view
            //----------------------------------
            _this.view = null;
            //----------------------------------
            //  viewModel
            //----------------------------------
            _this.viewModel = new SlideViewModel();
            return _this;
        }
        Slides.prototype.postInitialize = function () {
            var _this = this;
            this.own(watchUtils.on(this, "viewModel.bookmarkItems", "change", function () { return _this._bookmarkItemsChanged(); }));
            this._bookmarkItemsChanged();
        };
        Slides.prototype.destroy = function () {
            this._handles.destroy();
            this._handles = null;
        };
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        Slides.prototype.render = function () {
            var bookmarkNodes = this._renderBookmarks();
            var state = this.viewModel.state;
            var containerTitle = this.containerTitle || this.label;
            var bookmarkListNode = state === "ready" && bookmarkNodes.length ? [
                widget_1.tsx("ul", { "aria-label": this.label, class: CSS.bookmarkList }, bookmarkNodes)
            ] :
                state === "loading";
            null;
            return (widget_1.tsx("div", { class: CSS.base },
                widget_1.tsx("div", { class: CSS.title }, containerTitle),
                bookmarkListNode));
        };
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        Slides.prototype._renderBookmarks = function () {
            var _this = this;
            var bookmarkItems = this.viewModel.bookmarkItems;
            return bookmarkItems.toArray().map(function (bookmarkItem) { return _this._renderBookmark(bookmarkItem); });
        };
        Slides.prototype._renderBookmark = function (bookmarkItem) {
            var _a;
            var active = bookmarkItem.active, name = bookmarkItem.name;
            var bookmarkItemClasses = (_a = {},
                _a[CSS.bookmarkItemActive] = active,
                _a);
            var title = i18n.tools.bookmarks.goToBookmark + " " + name;
            return (widget_1.tsx("li", { bind: this, "data-bookmark-item": bookmarkItem, class: this.classes(CSS.bookmarkItem, bookmarkItemClasses), onclick: this._goToBookmark, onkeydown: this._goToBookmark, tabIndex: 0, role: "button", title: title, "aria-label": name },
                widget_1.tsx("img", { class: this.classes(CSS.iconClass, CSS.bookmarkItemIcon), src: bookmarkItem.slide.thumbnail.url, alt: name }),
                widget_1.tsx("span", { class: CSS.bookmarkItemName }, name)));
        };
        Slides.prototype._bookmarkItemsChanged = function () {
            var _this = this;
            var itemsKey = "items";
            var bookmarkItems = this.viewModel.bookmarkItems;
            var _handles = this._handles;
            _handles.remove(itemsKey);
            var handles = bookmarkItems.map(function (bookmarkItem) {
                return watchUtils.watch(bookmarkItem, [
                    "active",
                    "name"
                ], function () { return _this.scheduleRender(); });
            });
            _handles.add(handles, itemsKey);
            this.scheduleRender();
        };
        Slides.prototype._goToBookmark = function (event) {
            var node = event.currentTarget;
            var bookmarkItem = node["data-bookmark-item"];
            this.viewModel.goTo(bookmarkItem);
        };
        __decorate([
            decorators_1.property()
        ], Slides.prototype, "iconClass", void 0);
        __decorate([
            decorators_1.property()
        ], Slides.prototype, "containerTitle", void 0);
        __decorate([
            decorators_1.property()
        ], Slides.prototype, "label", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.view")
        ], Slides.prototype, "view", void 0);
        __decorate([
            decorators_1.property({
                type: SlideViewModel
            }),
            widget_1.renderable([
                "state"
            ])
        ], Slides.prototype, "viewModel", void 0);
        __decorate([
            widget_1.accessibleHandler()
        ], Slides.prototype, "_goToBookmark", null);
        Slides = __decorate([
            decorators_1.subclass("app.Slides")
        ], Slides);
        return Slides;
    }(decorators_1.declared(Widget)));
    return Slides;
});
//# sourceMappingURL=Slides.js.map