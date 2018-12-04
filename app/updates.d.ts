declare namespace __esri {
  interface Portal extends Accessor, Loadable {
    staticImagesUrl?: string;
  }
  type BackwardsCompatibleFirst = boolean;
  type DateFormat = {
    properties: string[];
    formatter: string;
  };

  type SubstituteOptions = {
    first?: boolean;
    dateFormat?: DateFormat;
    numberFormat?: string;
  };
  interface lang {
    substitute(
      data: HashMap<any>,
      template: string,
      options?: SubstituteOptions | BackwardsCompatibleFirst
    ): string;
  }

}
