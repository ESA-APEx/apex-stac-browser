module.exports = {
  catalogUrl: null,
  catalogTitle: "STAC Browser",
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