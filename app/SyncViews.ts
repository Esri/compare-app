
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
import watchUtils = require("esri/core/watchUtils");
import ScreenPoint = require("esri/geometry/ScreenPoint");
import esri = __esri;
export function syncPopups(views: (esri.MapView | esri.SceneView)[]): void {
  views.map((view, index) => {
    const others = views.concat();
    others.splice(index, 1)
    return _syncPopup(view, others);
  });
}
export function syncViews(views: (esri.MapView | esri.SceneView)[]): void {
  views.map((view, index) => {
    const others = views.concat();
    others.splice(index, 1)
    return _syncView(view, others);
  });
}
function _syncPopup(view: esri.MapView | esri.SceneView, others: (esri.MapView | esri.SceneView)[]) {
  // Perform hit test on other views and display popup for features if found
  view.on("click", async (e: __esri.MapViewClickEvent) => {
    view.popup.close();
    const screenPoint = new ScreenPoint({ x: e.x, y: e.y });
    const location = e.mapPoint;
    await view.hitTest(screenPoint);

    others.map(async other => {
      other.popup.close();
      const response = await other.hitTest(screenPoint);
      const features: any = response.results.map((result) => {
        return result.graphic;
      });

      // See note about VTL hit test results
      const filteredFeatures = features.filter(feature => {
        if (feature && feature.getEffectivePopupTemplate()) {
          return feature;
        }
      });

      if (filteredFeatures && filteredFeatures.length && filteredFeatures.length > 0 && location) {
        other.popup.open({
          features: filteredFeatures,
          location
        });
      }
    });

  });
}
function _syncView(view: esri.MapView | esri.SceneView, others: (esri.MapView | esri.SceneView)[]) {
  let viewpointWatchHandle;
  let viewStationaryHandle;
  let otherInteractHandlers;
  let scheduleId;

  const clear = function() {
    if (otherInteractHandlers) {
      otherInteractHandlers.forEach((handle) => {
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
  view.watch("interacting,animation", (newValue) => {
    if (!newValue || viewpointWatchHandle || scheduleId) {
      return;
    }
    // start updating the other views at the next frame
    scheduleId = setTimeout(function() {
      scheduleId = null;
      viewpointWatchHandle = view.watch("viewpoint",
        (newValue) => {
          others.forEach(function(otherView) {
            const view = otherView as esri.MapView | esri.SceneView;
            view.viewpoint = newValue;
          });
        });
    }, 0);

    // stop as soon as another view starts interacting, like if the user starts panning
    otherInteractHandlers = others.map((otherView) => {
      return watchUtils.watch(otherView, "interacting,animation", (value) => {
        if (value) {
          clear();
        }
      });
    });
    // or stop when the view is stationary again
    viewStationaryHandle = watchUtils.whenTrue(view, "stationary", clear);
  });
}

