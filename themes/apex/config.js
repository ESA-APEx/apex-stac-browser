module.exports = {
  catalogUrl: null,
  catalogTitle: "STAC Browser",
  supportedCatalogues: [
    {
      "id": 1,
      "url": "https://openeo.dataspace.copernicus.eu/openeo/1.2",
      "title": "Copernicus Data Space Ecosystem (openEO)",
      "summary": "This openEO service runs on the [Copernicus Data Space Ecosystem](https://dataspace.copernicus.eu/)\nand offers data access and processing on full archives of Copernicus data, such as the Sentinels.",
    },
    {
      "id": 2,
      "url": "https://openeocloud.vito.be/openeo/1.0.0/",
      "title": "openEO Platform",
      "summary": "openEO platform provides intuitive programming libraries to process a wide variety of earth observation datasets. This large-scale data access and processing is performed on multiple infrastructures, which all support the openEO and STAC API.",
    },
    {
      "id": 3,
      "url": "https://eoresults.esa.int/stac",
      "title": "ESA Project Results Repository",
      "summary": "ESA Project Results Repository (PRR) hosting the results of the ESA Scientific Projects",
    },
    {
      "id": 4,
      "url": "https://cds.climate.copernicus.eu/api/catalogue/v1/",
      "title": "Climate Data Store",
      "summary": "The CADS catalogue API is a STAC compliant API to access the CADS catalogues.The implementation is based on [Standalone Collections](https://github.com/radiantearth/stac-spec/blob/master/collection-spec/collection-spec.md#standalone-collections) while a custom extension is present to provide datasets search capabilities.",
    }
  ],
  allowExternalAccess: true, // Must be true if catalogUrl is not given
  allowedDomains: [],
  detectLocaleFromBrowser: true,
  storeLocale: true,
  locale: "en",
  fallbackLocale: "en",
  supportedLocales: [
    "de",
//      "de-CH",
    "es",
    "en",
//      "en-GB",
//      "en-US",
    "fr",
//      "fr-CA",
//      "fr-CH",
    "it",
//      "it-CH",
    "ro",
    "ja",
    "pt",
//      "pt-BR"
  ],
  apiCatalogPriority: null,
  useTileLayerAsFallback: true,
  displayGeoTiffByDefault: false,
  buildTileUrlTemplate: ({
                           href,
                           asset
                         }) => "https://tiles.rdnt.io/tiles/{z}/{x}/{y}@2x?url=" + encodeURIComponent(asset.href.startsWith("/vsi") ? asset.href : href),
  stacProxyUrl: null,
  pathPrefix: "/",
  historyMode: "history",
  cardViewMode: "cards",
  cardViewSort: "asc",
  showKeywordsInItemCards: false,
  showKeywordsInCatalogCards: false,
  showThumbnailsAsAssets: false,
  geoTiffResolution: 128,
  redirectLegacyUrls: false,
  itemsPerPage: 12,
  defaultThumbnailSize: null,
  maxPreviewsOnMap: 50,
  crossOriginMedia: null,
  requestHeaders: {},
  requestQueryParameters: {},
  preprocessSTAC: null,
  authConfig: {
    type: 'openIdConnect',
    openIdConnectUrl: 'https://auth.apex.esa.int/realms/apex/.well-known/openid-configuration',
    oidcConfig: {
      client_id: 'apex-catalogue-dev-browser'
    }
  }
};
