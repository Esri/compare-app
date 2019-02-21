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

    const titleLink = this.config.titleLink ? <span><a target="_blank" rel="noopener" href={this.config.titleLink}>{this.config.title}</a></span> : <span>{this.config.title}</span>
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
