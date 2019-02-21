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
define(["require", "exports", "esri/core/watchUtils"], function (require, exports, watchUtils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function syncPopups(views) {
        views.map(function (view, index) {
            var others = views.concat();
            others.splice(index, 1);
            return _syncPopup(view, others);
        });
    }
    exports.syncPopups = syncPopups;
    function syncViews(views) {
        views.map(function (view, index) {
            var others = views.concat();
            others.splice(index, 1);
            return _syncView(view, others);
        });
    }
    exports.syncViews = syncViews;
    function _syncPopup(view, others) {
        var _this = this;
        // Perform hit test on other views and display popup for features if found
        view.on("click", function (e) { return __awaiter(_this, void 0, void 0, function () {
            var location;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view.popup.close();
                        location = e.mapPoint;
                        return [4 /*yield*/, view.hitTest(e)];
                    case 1:
                        _a.sent();
                        others.map(function (other) { return __awaiter(_this, void 0, void 0, function () {
                            var response, features, filteredFeatures;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        other.popup.close();
                                        return [4 /*yield*/, other.hitTest(e)];
                                    case 1:
                                        response = _a.sent();
                                        features = response.results.map(function (result) {
                                            return result.graphic;
                                        });
                                        filteredFeatures = features.filter(function (feature) {
                                            if (feature && feature.getEffectivePopupTemplate()) {
                                                return feature;
                                            }
                                        });
                                        if (filteredFeatures && filteredFeatures.length && filteredFeatures.length > 0 && location) {
                                            other.popup.open({
                                                features: filteredFeatures,
                                                location: location
                                            });
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        }); });
    }
    function _syncView(view, others) {
        var viewpointWatchHandle;
        var viewStationaryHandle;
        var otherInteractHandlers;
        var scheduleId;
        var clear = function () {
            if (otherInteractHandlers) {
                otherInteractHandlers.forEach(function (handle) {
                    handle.remove();
                });
            }
            viewpointWatchHandle && viewpointWatchHandle.remove();
            viewStationaryHandle && viewStationaryHandle.remove();
            scheduleId && clearTimeout(scheduleId);
            otherInteractHandlers = viewpointWatchHandle =
                viewStationaryHandle = scheduleId = null;
        };
        //set initial viewpoint to match
        if (view && others && others.length && others.length > 0) {
            others[0].viewpoint = view.viewpoint;
        }
        view.watch("interacting,animation", function (newValue) {
            if (!newValue || viewpointWatchHandle || scheduleId) {
                return;
            }
            // start updating the other views at the next frame
            scheduleId = setTimeout(function () {
                scheduleId = null;
                viewpointWatchHandle = view.watch("viewpoint", function (newValue) {
                    others.forEach(function (otherView) {
                        var view = otherView;
                        view.viewpoint = newValue;
                    });
                });
            }, 0);
            // stop as soon as another view starts interacting, like if the user starts panning
            otherInteractHandlers = others.map(function (otherView) {
                return watchUtils.watch(otherView, "interacting,animation", function (value) {
                    if (value) {
                        clear();
                    }
                });
            });
            // or stop when the view is stationary again
            viewStationaryHandle = watchUtils.whenTrue(view, "stationary", clear);
        });
    }
});
//# sourceMappingURL=SyncViews.js.map