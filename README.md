# compare-app
Compare is a configurable app template that supports the a side-by-side or stacked comparison of two maps or scenes. It can be configured to compare two scenes, two maps, or one of each. the two views can be linked or unlinked depending on if you want to show the same location or not.

**Use Cases**
* Support presentations of different urban development scenarios for one location or to compare the landscape in two locations.
* Present the results from a variety of different analytic methods.
* Show the difference between household income in multiple places, or the difference between household income and home values in a single location.

## Supported Devices
This application is responsively designed to support use in browsers on desktops and tablets.

## Data Requirements
This application has no data requirements.

## Instructions

1. Download and unzip the .zip file or clone the repository.
2. Web-enable the directory.
3. Access the .html page to test.
4. Install node and npm then run npm install via the command line.
5. Run npm start to generate js and css files from sass and typescript.
5. Start customizing the app code.

[New to Github? Get started here.](https://github.com/)

## Deploying

1. To deploy this application, download the template from Portal/ArcGIS Online and unzip it.
2. Install npm and run npm install via command line then run npm run build.
3. Copy the unzipped folder containing the web app template files, such as index.html, to your web server. You can rename the folder to change the URL through which users will access the application. By default the URL to the app will be `http://<Your Web Server>/<app folder name>/index.html`
4. Change the sharing host, found in defaults.js inside the config folder for the application, to the sharing URL for ArcGIS Online or Portal. For ArcGIS Online users, keep the default value of www.arcgis.com or specify the name of your organization.
  - ArcGIS Online Example:  `"sharinghost": location.protocol + "//" + “<your organization name>.maps.arcgis.com`
  - Portal Example where `arcgis` is the name of the Web Adaptor: `"sharinghost": location.protocol + "//" + "webadaptor.domain.com/arcgis"`
5. If you are using Portal or a local install of the ArcGIS API for JavaScript, change all references to the ArcGIS API for JavaScript in index.html to refer to your local copy of the API. Search for the references containing `"//js.arcgis.com/3.13"` and replace this portion of the reference with the url to your local install.
  - For example: `"//webadaptor.domain.com/arcgis/jsapi/jsapi"` where `arcgis` is the name of your Web Adaptor.
6. Copy a map or group ID from Portal/ArcGIS Online and replace the default web map ID in the application’s default.js file. You can now run the application on your web server or customize the application further.



## App Configuration
* **appid**: Application id that contains configured app properties

## View comparision options
* **webmap**: Web map or scene for first map panel
* **webscene**: Web map or scene for second map panel
* **useCustomExtentWebMap**: When true a user defined custom extent can be specified for map 1.
* **customExtentWebMap**: Specify a custom zoom level and center point that will be used to define the custom extent for map 1. ```{
   "level":4,
   "coords": {
     "latitude": 15,
     "longitude": 65
   }
 }```

* **usecustomExtentWebScene**: When true a user defined custom extent can be specified for map 2.
* **customExtentWebScene**: Specify a custom zoom level and center point that will be used to define the custom extent for map 2. ```{
   "level":4,
   "coords": {
     "latitude": 15,
     "longitude": 65
   }
 }```
* **webmapDesc**: Title and/or small amount of descriptive text for map1.
* **websceneDesc**: Title and/or small amount of descirptive text for map2
* **descPosition"**: Valid values are *top-left|top-right|bottom-left|bottom-right*. The location on the map where the descriptive text displays
* **splitDirection**: *horizontal|vertical*  Horizontal displays maps side by side. Vertical stacks maps.
* **expand**: Add an expand button to each map so users can quickly expand/collapse the map to view it full size.
* **expandPosition**: Valid values are *top-left|top-right|bottom-left|bottom-right*.  The location on the map where the expand button is added. The default value is bottom-right.
* **minZoom**: Optionally set a minimum zoom level for 2d maps. This level applies to both map views. This value is only available to set via url parameter and may overwrite a custom extent if one was set.
* **maxZoom**: Optionally set a maximum zoom level for 2d maps. this level applies to both map views. This value is only available to set via url parameter and may overwrite a custom extent if one was set.
* **minScale**: Optionally set the minimum scale the user is allowed to zoom to for 2d maps. This scale value applies to both map views. This value is only available to set via url parameter and may overwrite a custom extent if one was set.
* **maxScale**: Optionally set the maximum scale the user is allowed to zoom to for 2d maps. This scale value applies to both map views. This value is only available to set via url parameter and may overwrite a custom extent if one was set.

## Title and Toolbar options
* **title**: Main title for the app
* **titlelink**: Url if you want the title to be a clickable link that navigates to the specified site.
* **headerPosition**: *top|bottom* Determines the positioning of the title and toolbar content.
* **header**: *true|false* When true the header area is hidden and any header tools that have been enabled are added to the app

## Splash or Info panel
Use these options to add a modal with descriptive info and/or a button with info to the app. The info/splash button is added to the title area of the app unless **header** is false. If header is false the button is added to the top-right corner of the first view.
* **splash**: Add info button to the app
* **splashOnStart**: Display the information as a splash screen when the app loads. Once the user closes the splash screen we write a property to session storage so the modal isn't displayed again during that session.  When false the modal doesn't display and the info content is added as a button.
* **splashDesc**: Content that displays in the description area of the info panel.
* **splashTitle**: Title for the info panel
* **splashButtonLabel**: Text that displays on the info panel. The default value is ok.

## Popup Settings

* **autoDockPopup**: When false the default responsive behavior of the popup is disabled and the popup will display docked in the specified location.
* **dockPosition**: Specify the docked location of the popup. Only valid when **autoDockPopup** is set to false. Default location is bottom-center. Valid values are *top-left|top-center|top-right|bottom-left|bottom-center|bottom-right*
* **dockButton**: When false the dock button is disabled on the popup so user's can't dock/undock the popup window.


## 3d View Settings
 * **sceneBackgroundColor**: Specify a hex color value for the scene background. When set the atmosphere and stars are turned off so the background of the scene will be drawn in the specified color.

## Synchronize Views
* **syncViews**: Default value is true. When true the maps are synchronized. When false maps work independently.
* **syncPopup**: Default value is true. When true the popups are synchronized between maps.

## Theme
* **bodyBackground**: Default value is empty. If a shared theme is set in the organization the body.background color will be used. Users can specify a color via the configuration process. This color will be used for the splash and description panel background color.
* **bodyColor**: Default value is empty. If a shared theme is set in the organization the body.text color will be used. Users can specify a color via the configuration process. This color will be used for the splash and description panel text color.
* **headerBackground**: Default value is white (#fff). If a shared theme is set in the organization the header.background color will be used. Users can specify a color via the configuration process. This color will be used for the header/footer background color.
* **headerColor**: Default value is dark gray (#4c4c4c). If a shared theme is set in the organization the header.text color will be used. Users can specify a color via the configuration process. This color will be used for the header/footer text color and the color of any tools that are displayed in the header/footer area.
* **buttonBackground**: Default value is empty. If a shared theme is set in the organization the button.background color will be used. Users can specify a color via the configuration process. This color will be used for the splash screen button background color. Note: This value is not applied to map buttons.
* **buttonColor**: Default value is empty. If a shared theme is set in the organization the button.text color will be used. Users can specify a color via the configuration process. This color will be used for the splash screen button text color. Note: this value is not applied to map buttons.

## Tools
* **search**: Default value is false.  If the maps are sync'd and the header is displayed we'll just add one search widget to the header area that will allow searching of both maps. If maps are not sync'd then we'll add a search widget to each map.
* **searchPosition**: Location on the map where the search button is displayed. Only applies if its not in the header. Valid values are *top-left|top-center|top-right|bottom-left|bottom-center|bottom-right*
* **legend**: Default value is false. When true a legend button is added to each view unless the views are pointing to the same map/scene.
* **legendPosition**: Location on the map where the legend button is displayed. Valid values are *top-left|top-center|top-right|bottom-left|bottom-center|bottom-right*
* **bookmark**: Default value is false. When true displays bookmarks for the 2d map and slides for the 3d map. If no slides or bookmarks are present in the map then the tool isn't added to the map.
* **bookmarkPosition**: Location on the  map where the bookmark or slide tool is placed. Valid values are *top-left|top-center|top-right|bottom-left|bottom-center|bottom-right*
* **home**: Default value is false. When true a home button is added to the maps.
* **homePosition**: Location on the map where the home tool is placed.  Valid values are *top-left|top-center|top-right|bottom-left|bottom-center|bottom-right*
* **measure**: Default value is false. When true the measure button is added for 3d and 2d maps.
* **measurePosition**:Location on the map where the measure tool is placed.  Valid values are *top-left|top-center|top-right|bottom-left|bottom-center|bottom-right*
* **measureOptions**: Valid values are *both|line|area*. Allows users to display just the line and area tools or add both.
* **scalebar**: Default value is false. When true a scalebar is added to 2d maps. If both maps are 2d and view is synced only add scalebar to first map.
* **scalebarPosition**:Location on the map where the scalebar is placed.  Valid values are *top-left|top-center|top-right|bottom-left|bottom-center|bottom-right*
* **share**: Default value is false. When true a share button is added to the maps. If the maps are synced only add the share button to the first map.
* **sharePosition**:Location on the map where the share button is placed.  Valid values are *top-left|top-center|top-right|bottom-left|bottom-center|bottom-right*
* **shareIncludeServices**: Default value is false. When true social media sharing (Twitter, FB etc) is enabled.
* **shareIncludeCopy**: Default value is true. When true share dialog contains a link to the share url and a copy button.

## Resources

* [Community](https://developers.arcgis.com/en/javascript/jshelp/community.html)
* [ArcGIS for JavaScript API Resource Center](http://help.arcgis.com/en/webapi/javascript/arcgis/index.html)
* [ArcGIS Blog](http://blogs.esri.com/esri/arcgis/)
* [twitter@esri](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing
Copyright 2017 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license](LICENSE) file.
