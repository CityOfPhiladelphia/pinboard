<template>
  <!-- <div class="cell medium-12 medium-cell-block-y mb-panel mb-panel-map map-height"> -->
  <div class="cell medium-12 medium-cell-block-y">

    <MglMap
      v-if="this.mapType === 'mapbox'"
      :accessToken="accessToken"
      :mapStyle.sync="this.$config.mbStyle"
      :zoom="this.$store.state.map.zoom"
      :center="this.$store.state.map.center"
      @moveend="this.handleMapMove"
      @load="this.onMapLoaded"
      @preload="this.onMapPreloaded"
    >

      <overlay-legend
        v-for="legendControl in Object.keys(legendControls)"
        :key="legendControl"
        :position="'bottomleft'"
        :options="legendControls[legendControl].options"
        :items="legendControls[legendControl].data"
      >
      </overlay-legend>

      <MglMarker
        v-for="(marker) in markersForAddress"
        :key="marker.key"
        :coordinates="[marker.latlng[1], marker.latlng[0]]"
        :color="marker.color"
        :icon="marker.icon"
        :anchor="'bottom'"
      />

      <MglFontAwesomeMarker
        v-if="markerType === 'pin-marker'"
        v-for="(marker) in currentMapData"
        :coordinates="[marker.latlng[1], marker.latlng[0]]"
        :key="marker._featureId"
        :size="marker.size"
        :icon="marker.icon"
        :markerId="marker._featureId"
        :color="marker.color"
        :anchor="'bottom'"
        :offset="marker.offset"
        @click="handleMarkerClick"
      >
        <MglPopup
          v-if="latestSelectedResourceFromMap === marker._featureId"
          :showed="true"
        >
          <div
            @click="toggleMap"
            v-html="mapboxSiteName(marker)"
          >
          </div>
        </MglPopup>

      </MglFontAwesomeMarker>

      <MglCircleMarker
        v-if="markerType === 'circle-marker'"
        v-for="(marker) in currentMapData"
        :coordinates="[marker.latlng[1], marker.latlng[0]]"
        :key="marker._featureId"
        :markerId="marker._featureId"
        :size="marker.size"
        :fill-color="marker.color"
        :weight="marker.weight"
        @click="handleMarkerClick"
      >
        <MglPopup
          v-if="latestSelectedResourceFromMap === marker._featureId"
          :showed="true"
        >
          <div
            @click="toggleMap"
            v-html="mapboxSiteName(marker)"
          >
          </div>
        </MglPopup>

      </MglCircleMarker>

      <!-- <MglPopup
        v-for="(marker) in currentMapData"
        v-if="marker.selected"
        :close-on-click="false"
        :coordinates="[marker.latlng[1], marker.latlng[0]]"
        :showed="marker.selected"
      >
        <div>Hello, I'm popup!</div>
      </MglPopup> -->

      <!-- <MglCircleMarker
        v-for="recording in cyclomediaRecordings"
        v-if="!fullScreenMapEnabled"
        :coordinates="[recording.lng, recording.lat]"
        :key="recording.imageId"
        :image-id="recording.imageId"
        :size="1.2"
        :color="'#3388ff'"
        :weight="1"
        @click="handleCyclomediaRecordingClick"
      /> -->

      <!-- <MbIcon
        v-if="!fullScreenMapEnabled"
        :url="'https://mapboard-images.s3.amazonaws.com/camera.png'"
        :name="'camera'"
        :rotation-angle="cycloRotationAngle"
      /> -->

      <!-- <MglGeojsonLayer
        v-if="!fullScreenMapEnabled"
        :sourceId="'cameraPoint'"
        :source="geojsonCameraSource"
        :layerId="'cameraPoints'"
        :layer="geojsonCameraLayer"
        :icon="sitePath + 'images/camera.png'"
      /> -->

      <!-- <MglGeojsonLayer
        v-if="!fullScreenMapEnabled"
        :sourceId="'viewcone'"
        :source="geojsonViewconeSource"
        :layerId="'viewcones'"
        :layer="geojsonViewconeLayer"
      /> -->

      <!-- <MglVectorLayer
        v-if="this.$config.vectorTiles"
        :source="this.$config.vectorTiles"
        :sourceId="'PVL_Original'"
        :layer="this.$config.vectorTiles"
        :layerId="'PVL_Original'"
      /> -->

      <MglRasterLayer
        v-for="(basemapSource, key) in this.basemapSources"
        v-if="shouldShowRasterLayer && activeBasemap === key"
        :sourceId="activeBasemap"
        :layerId="activeBasemap"
        :layer="basemapSource.layer"
        :source="basemapSource.source"
        :before="firstOverlay"
      />

      <MglRasterLayer
        v-for="(basemapLabelSource, key) in this.basemapLabelSources"
        v-if="shouldShowRasterLayer && tiledLayers.includes(key)"
        :sourceId="key"
        :layerId="key"
        :layer="basemapLabelSource.layer"
        :source="basemapLabelSource.source"
        :before="firstOverlay"
      />

      <!-- <MglRasterLayer
        v-for="(overlaySource, key) in this.overlaySources"
        v-if="activeTiledOverlays.includes(key)"
        :sourceId="key"
        :layerId="key"
        :layer="overlaySource.layer"
        :source="overlaySource.source"
        :before="cameraOverlay"
      /> -->

      <!-- <MglButtonControl
        :buttonId="'buttonId-01'"
        :buttonClass="'right'"
        :imageLink="BasemapImageLink"
        @click="this.handleBasemapToggleClick"
      /> -->

      <MglNavigationControl position="bottom-right"/>
      <!-- <MglGeolocateControl position="bottom-left"/> -->

    </MglMap>

    <slot
      class="widget-slot"
      name="cycloWidget"
    />
  </div>
</template>

<script>

import proj4 from 'proj4';
// import 'leaflet/dist/leaflet.css';
import SharedFunctions from './mixins/SharedFunctions.vue';

// import all fontawesome icons included in phila-vue-mapping
import * as faMapping from '@phila/vue-mapping/src/fa';
// import Map_ from '@phila/vue-mapping/src/leaflet/Map.vue';
// import PopupSimple from '@phila/vue-mapping/src/leaflet/PopupSimple.vue';
// import PopupContentFunctional from '@phila/vue-mapping/src/leaflet/PopupContentFunctional.vue';

import cyclomediaMixin from '@phila/vue-mapping/src/cyclomedia/map-panel-mixin.js';
// import CyclomediaButton from '@phila/vue-mapping/src/cyclomedia/Button.vue';
import CyclomediaRecordingsClient from '@phila/vue-mapping/src/cyclomedia/recordings-client.js';
// import ControlCorner from '@phila/vue-mapping/src/leaflet/ControlCorner.vue';
// import BasemapToggleControl from '@phila/vue-mapping/src/components/BasemapToggleControl.vue';
// import BasemapSelectControl from '@phila/vue-mapping/src/components/BasemapSelectControl.vue';
// import LegendControl from '@phila/vue-mapping/src/components/LegendControlNoTopic.vue';

export default {
  name: "MapPanel",
  components: {
    // Map_,
    // PopupSimple,
    // PopupContentFunctional,
    // PopUpContent,
    // CyclomediaButton,
    CyclomediaRecordingsClient,
    // ControlCorner,
    // BasemapToggleControl,
    // BasemapSelectControl,
    // LegendControl,
    // EsriTiledMapLayer: () => import(/* webpackChunkName: "pvm_EsriTiledMapLayer" */'@phila/vue-mapping/src/esri-leaflet/TiledMapLayer.vue'),
    // VectorMarker: () => import(/* webpackChunkName: "mbmp_pvm_VectorMarker" */'@phila/vue-mapping/src/components/VectorMarker.vue'),
    // CircleMarker: () => import(/* webpackChunkName: "mbmp_pvm_CircleMarker" */'@phila/vue-mapping/src/leaflet/CircleMarker.vue'),
    // PngMarker: () => import(/* webpackChunkName: "mbmp_pvm_PngMarker" */'@phila/vue-mapping/src/components/PngMarker.vue'),
    // CyclomediaRecordingCircle: () => import(/* webpackChunkName: "mbmp_pvm_CyclomediaRecordingCircle" */'@phila/vue-mapping/src/cyclomedia/RecordingCircle.vue'),
    // SvgViewConeMarker: () => import(/* webpackChunkName: "mbmp_pvm_CyclomediaSvgViewConeMarker" */'@phila/vue-mapping/src/cyclomedia/SvgViewConeMarker.vue'),
    MglMap: () => import(/* webpackChunkName: "pvm_MglMap" */'@phila/vue-mapping/src/mapbox/map/GlMap.vue'),
    MglMarker: () => import(/* webpackChunkName: "pvm_MglMarker" */'@phila/vue-mapping/src/mapbox/UI/Marker.vue'),
    MglIcon: () => import(/* webpackChunkName: "mbmp_pvm_MglIcon" */'@phila/vue-mapping/src/mapbox/UI/Icon.vue'),
    MglCircleMarker: () => import(/* webpackChunkName: "pvm_MglCircleMarker" */'@phila/vue-mapping/src/mapbox/UI/CircleMarker.vue'),
    MglNavigationControl: () => import(/* webpackChunkName: "pvm_MglNavigationControl" */'@phila/vue-mapping/src/mapbox/UI/controls/NavigationControl'),
    MglGeolocateControl: () => import(/* webpackChunkName: "pvm_MglGeolocateControl" */'@phila/vue-mapping/src/mapbox/UI/controls/GeolocateControl'),
    MglRasterLayer: () => import(/* webpackChunkName: "pvm_MglRasterLayer" */'@phila/vue-mapping/src/mapbox/layer/RasterLayer.vue'),
    MglButtonControl: () => import(/* webpackChunkName: "pvm_MglButtonControl" */'@phila/vue-mapping/src/mapbox/UI/controls/ButtonControl.vue'),
    MglControlContainer: () => import(/* webpackChunkName: "pvm_MglControlContainer" */'@phila/vue-mapping/src/mapbox/UI/controls/ControlContainer.vue'),
    MglImageLayer: () => import(/* webpackChunkName: "pvm_MglImageLayer" */'@phila/vue-mapping/src/mapbox/layer/ImageLayer'),
    MglVectorLayer: () => import(/* webpackChunkName: "pvm_MglVectorLayer" */'@phila/vue-mapping/src/mapbox/layer/VectorLayer'),
    MbIcon: () => import(/* webpackChunkName: "pvm_MbIcon" */'@phila/vue-mapping/src/mapbox/UI/MbIcon'),
    MglGeojsonLayer: () => import(/* webpackChunkName: "pvm_MglGeojsonLayer" */'@phila/vue-mapping/src/mapbox/layer/GeojsonLayer'),
    MglPopup: () => import(/* webpackChunkName: "pvm_MglPopup" */'@phila/vue-mapping/src/mapbox/UI/Popup'),
    MglFontAwesomeMarker: () => import(/* webpackChunkName: "pvm_MglFontAwesomeMarker" */'@phila/vue-mapping/src/mapbox/UI/FontAwesomeMarker.vue'),
    OverlayLegend: () => import(/* webpackChunkName: "pvm_OverlayLegend" */'@phila/vue-mapping/src/mapbox/OverlayLegend'),
  },
  mixins: [
    SharedFunctions,
    cyclomediaMixin,
  ],
  data() {
    const data = {
      rows: [],
      accessToken: process.env.VUE_APP_MAPBOX_ACCESSTOKEN,
    };
    return data;
  },
  computed: {
    map() {
      return this.$store.map;
    },
    shouldShowRasterLayer() {
      let value = true;
      if (this.$config.map.tiles === 'hosted') {
        value = false
      }
      return value;
    },
    locationInfo() {
      return this.$config.locationInfo;
    },
    isMobileOrTablet() {
      return this.$store.state.isMobileOrTablet;
    },
    legendControls() {
      return this.$config.legendControls || {};
    },
    isLoadingPins() {
      return this.$store.state.sources[this.$appType].status === 'waiting';
    },
    markerType() {
      let value;
      if (!this.$config.markerType || this.$config.markerType === 'pin-marker') {
        value = 'pin-marker';
      } else {
        value = this.$config.markerType;
      }
      return value;
    },
    selectedResources() {
      return this.$store.state.selectedResources;
    },
    latestSelectedResourceFromExpand() {
      return this.$store.state.latestSelectedResourceFromExpand;
    },
    latestSelectedResourceFromMap() {
      return this.$store.state.map.latestSelectedResourceFromMap;
    },
    currentData() {
      // console.log('MapPanel.vue currentData is recalculating');
      return this.$store.state.currentData;
    },
    projection4326() {
      return "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
    },
    projection2272() {
      return "+proj=lcc +lat_1=40.96666666666667 +lat_2=39.93333333333333 +lat_0=39.33333333333334 +lon_0=-77.75 +x_0=600000 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs";
    },
    projection3857() {
      return "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs";
    },
    currentMapData() {
      // console.log('MapPanel.vue currentMapData computed is starting recalculating');//, this.currentData:', this.currentData);
      const newRows = [];
      for (const row of [ ...this.currentData ]) {
        // console.log('in loop, row:', row);

        let color, // all markers
          size, // circleMarkers only
          weight, // circleMarkers only
          faSize; // font awesome markers only
          // offset; // font awesome markers only
          // markerSize,
          // radius,
          // nonSelectedRadius,

        // circle-marker size
        if (this.$config.circleMarkers && this.$config.circleMarkers.size) {
          if (this.isMobileOrTablet && this.$config.circleMarkers.mobileSize) {
            size = this.$config.circleMarkers.mobileSize;
            // radius = this.$config.circleMarkers.mobileRadius;
          } else {
            size = this.$config.circleMarkers.size;
            // radius = this.$config.circleMarkers.radius;
          }
        } else {
          size = 14;
          // radius = 6;
        }

        // selected = true;
        if (this.selectedResources.includes(row._featureId)) {
          // console.log('row is selected, row._featureId:', row._featureId);
          // if (this.$config.circleMarkers.selectedColor) {
          //   color = this.$config.circleMarkers.selectedColor;
          // } else {
          color = '#2176d2';
          // color = this.$config.circleMarkers.circleColors[row.category_type];
          // color = 'green';
          // }
          size = 30;
          // console.log('color:', color, 'size:', size, 'this.$config.circleMarkers.circleColors[row.category_type]:', this.$config.circleMarkers.circleColors[row.category_type]);
          faSize = '4x';
          weight = 0;
          // if (this.$config.markerType === 'pin-marker') {
          //   offset = [ 0, 0 ];
          // }
          // markerSize = 40;
          // radius = radius + 6;

        // selected = false;
        } else {
          // multiple circle colors defined
          if (this.$config.circleMarkers && this.$config.circleMarkers.circleColors) {
            if (row.attributes) {
              color = this.$config.circleMarkers.circleColors[row.attributes.category_type];
            } else if (row.category_type) {
              color = this.$config.circleMarkers.circleColors[row.category_type];
            } else if (row.site_type) {
              color = this.$config.circleMarkers.circleColors[row.site_type];
            }

          // single circle color defined
          } else if (this.$config.circleMarkers && this.$config.circleMarkers.color) {
            color = this.$config.circleMarkers.color;

          // no circle color defined;
          } else {
            color = 'purple';
          }

          faSize = '2x';
          // if (this.$config.markerType === 'pin-marker') {
          //   offset = [ 0, 0 ];
          // }
          // markerSize = 20;

          if (this.$config.circleMarkers && this.$config.circleMarkers.weight || this.$config.circleMarkers && this.$config.circleMarkers.weight === 0) {
            weight = this.$config.circleMarkers.weight;
          } else {
            weight = 1;
          }
          // console.log('weight:', weight, 'this.$config.circleMarkers.weight:', this.$config.circleMarkers.weight);
        }

        if (row.lat) {
          // console.log('if row.lat is running, row.lat:', row.lat, 'row.lon:', row.lon, 'color:', color, 'size:', size);
          // console.log('if row.lat is running, color:', color, 'markerSize:', markerSize);
          let projection = this.getProjection(row);
          if (projection === '3857') {
            // console.log('if row.lat, and projection is 3857');
            row.latlng = proj4(this.projection3857, this.projection4326, [ row.lat, row.lon ]);
          } else if (projection === '2272') {
            // console.log('if row.lat, and projection is 2272');
            let lnglat = proj4(this.projection2272, this.projection4326, [ row.geometry.x, row.geometry.y ]);
            row.latlng = [ lnglat[1], lnglat[0] ];
          } else {
            // console.log('if row.lat, and else is running');
            row.latlng = [ row.lat, row.lon ];
          }
        } else if (row.geometry) {
          let projection = this.getProjection(row);
          // console.log('else if row.geometry is true, row.geometry:', row.geometry, 'projection:', projection);
          if (projection === '3857') {
            let lnglat = proj4(this.projection3857, this.projection4326, [ row.geometry.x, row.geometry.y ]);
            row.latlng = [ lnglat[1], lnglat[0] ];
          } else if (projection === '2272') {
            let lnglat = proj4(this.projection2272, this.projection4326, [ row.geometry.x, row.geometry.y ]);
            row.latlng = [ lnglat[1], lnglat[0] ];
          } else {
            row.latlng = [ row.geometry.y, row.geometry.x ];
          }
        } //else {
          //row.latlng = [];
        //}

        row.color = color;
        row.size = size;
        row.weight = weight;
        row.icon = {
          prefix: 'fas',
          icon: 'map-marker-alt',
          shadow: false,
          size: faSize,
        };
        // if (this.$config.markerType === 'pin-marker') {
        //   row.offset = offset;
        // }
        // row.radius = radius;

        if (row.latlng) {
          newRows.push(row);
        }

      }
      // console.log('MapPanel.vue currentMapData computed is finishing');
      return newRows;
    },
    geocodeStatus() {
      return this.$store.state.geocode.status;
    },
    geocodeResult() {
      return this.$store.state.geocode.data || {};
    },
    geocodeGeom() {
      return this.geocodeResult.geometry;
    },
    // returns map markers as simple object with a geometry property, key,
    // and optional properties for symbology
    markersForAddress() {
      // console.log('markers-mixin.js markersForAddress computed is running');
      const markers = [];
      // geocoded address marker
      const { geocodeGeom } = this;
      if (geocodeGeom) {
        const latlng = [ ...geocodeGeom.coordinates ].reverse();
        const key = this.geocodeResult.properties.street_address;
        const color = '#2176d2';
        const markerType = 'geocode';
        const icon = {
          prefix: 'fas',
          icon: 'map-marker-alt',
          shadow: false,
          size: 30,
        };
        const addressMarker = {
          latlng, key, color, markerType, icon,
        };
        markers.push(addressMarker);
      }
      return markers;
    },
    cycloLatlng() {
      if (this.$store.state.cyclomedia.orientation.xyz !== null) {
        const xyz = this.$store.state.cyclomedia.orientation.xyz;
        return [ xyz[1], xyz[0] ];
      }
      const center = this.$config.map.center;
      return center;

    },
    cycloRotationAngle() {
      return this.$store.state.cyclomedia.orientation.yaw * (180/3.14159265359);
    },
    cycloHFov() {
      return this.$store.state.cyclomedia.orientation.hFov;
    },
    shouldShowCyclomediaButton() {
      return this.$config.cyclomedia.enabled && !this.isMobileOrTablet;
    },
    picOrCycloActive() {
      if (this.cyclomediaActive || this.pictometryActive) {
        return true;
      }
      return false;

    },
    activeBasemap() {
      const shouldShowBasemapSelectControl = this.$store.state.map.shouldShowBasemapSelectControl;
      if (shouldShowBasemapSelectControl) {
        return this.$store.state.map.imagery;
      }
      const defaultBasemap = this.$config.map.defaultBasemap;
      const basemap = this.$store.state.map.basemap || defaultBasemap;
      return basemap;
    },
    tiledLayers() {
      const activeBasemap = this.activeBasemap;
      const activeBasemapConfig = this.configForBasemap(activeBasemap);
      return activeBasemapConfig.tiledLayers || [];
    },
    basemapSelectControlPosition() {
      if (this.isMobileOrTablet) {
        return 'topright';
      }
      return 'topalmostright';

    },
    basemaps() {
      return Object.values(this.$config.map.basemaps);
    },
    imageryBasemaps() {
      return this.basemaps.filter(basemap => basemap.type === 'imagery');
    },
    hasImageryBasemaps() {
      return this.imageryBasemaps.length > 0;
    },
    shouldShowBasemapToggleControl() {
      if (this.$config.map.imagery) {
        return this.hasImageryBasemaps && this.$config.map.imagery.enabled;
      }
      return this.hasImageryBasemaps;

    },
    sitePath() {
      if (process.env.VUE_APP_PUBLICPATH) {
        return window.location.origin + process.env.VUE_APP_PUBLICPATH;
      }
      return '';
    },
    intersectingFeatures() {
      return this.$store.state.map.intersectingFeatures;
    },
    shouldShowPopup() {
      if (this.intersectingFeatures.length > 0) {
        return true;
      }
      return false;
    },
    geocodeZoom() {
      if (this.$config.map.geocodeZoom) {
        return this.$config.map.geocodeZoom;
      } else {
        return 19;
      }
    },

    basemapSources() {
      return this.$config.basemapSources;
    },
    basemapLabelSources() {
      return this.$config.basemapLabelSources;
    },
    overlaySources() {
      return this.$config.overlaySources;
    },
    mapType() {
      return this.$store.state.map.type;
    },
    firstOverlay() {
      let map = this.$store.map;
      let overlay;
      if (this.$config.overlaySources) {
        let overlaySources = Object.keys(this.$config.overlaySources);
        if (map) {
          let overlays = map.getStyle().layers.filter(function(layer) {
            // console.log('layer.id:', layer.id, 'overlaySources:', overlaySources);
            return overlaySources.includes(layer.id);//[0].id;
          })
          if (overlays.length) {
            overlay = overlays[0].id
          }
        }
      }
      return overlay;
    },

  },
  watch: {
    map(nextMap) {
      console.log('MapPanel watch map is firing, nextMap:', nextMap);
    },
    geocodeResult(nextGeocodeResult) {
      if (nextGeocodeResult._featureId) {
        this.$store.commit('setMapCenter', nextGeocodeResult.geometry.coordinates);
        this.$store.commit('setMapZoom', this.geocodeZoom);
      }
    },
    latestSelectedResourceFromExpand(nextLatestSelectedResource) {
      console.log('watch latestSelectedResourceFromExpand:', nextLatestSelectedResource, 'this.$appType:', this.$appType);
      if (nextLatestSelectedResource) {
        let rows;
        const map = this.$store.map;

        // data coming as "rows" means it came from carto
        if (this.$store.state.sources[this.$appType].data.rows) {
          rows = this.$store.state.sources[this.$appType].data.rows;
          const dataValue = rows.filter(row => row._featureId === nextLatestSelectedResource);
          console.log('in watch latestSelectedResourceFromExpand, rows, nextLatestSelectedResource:', nextLatestSelectedResource, 'rows:', rows, 'dataValue:', dataValue);
          // do not set view if there is not lat value
          if (dataValue[0].lat) {
            if (this.mapType === 'leaflet') {
              map.setView([ dataValue[0].lat, dataValue[0].lon ], this.geocodeZoom);
            } else if (this.mapType === 'mapbox') {
              map.setCenter([ dataValue[0].lon, dataValue[0].lat ], this.geocodeZoom);
            }
          }

        // data coming as "features" means it came from arcgis
        } else if (this.$store.state.sources[this.$appType].data.features) {
          rows = this.$store.state.sources[this.$appType].data.features;
          const dataValue = rows.filter(row => row._featureId === nextLatestSelectedResource);
          console.log('in watch latestSelectedResourceFromExpand, features, nextLatestSelectedResource:', nextLatestSelectedResource, 'rows:', rows, 'dataValue:', dataValue);
          if (dataValue[0].latlng[0]) {
            if (this.mapType === 'leaflet') {
              map.setView([ dataValue[0].latlng[0], dataValue[0].latlng[1] ], this.geocodeZoom);
              // map.setView([ dataValue[0].lat, dataValue[0].lon ], this.geocodeZoom);
            } else if (this.mapType === 'mapbox') {
              map.setCenter([ dataValue[0].latlng[1], dataValue[0].latlng[0] ], this.geocodeZoom);
            }
          }

        // data coming in as an array means it came from a compiled datasource or airtable
        } else if (Array.isArray(this.$store.state.sources[this.$appType].data)) {
          rows = this.$store.state.sources[this.$appType].data;
          const dataValue = rows.filter(row => row._featureId === nextLatestSelectedResource);
          console.log('in watch latestSelectedResourceFromExpand, array, nextLatestSelectedResource:', nextLatestSelectedResource, 'rows:', rows, 'dataValue:', dataValue);
          if (this.mapType === 'leaflet') {
            map.setView([ dataValue[0].latlng[0], dataValue[0].latlng[1] ], this.geocodeZoom);
          } else if (this.mapType === 'mapbox') {
            map.setCenter([ dataValue[0].latlng[1], dataValue[0].latlng[0] ], this.geocodeZoom);
          }
        }
      }
    },
    latestSelectedResourceFromMap(nextLatestSelectedResource) {
      let test = document.getElementById('customPopup');
      // console.log('in watch latestSelectedResourceFromMap, test:', test);
    },
    cyclomediaActive(value) {
      this.$nextTick(() => {
        // this.$store.state.map.map.invalidateSize();
        this.$store.map.invalidateSize();
      });
    },
  },
  // created() {
  //   this.mapbox = Mapbox;
  // },
  mounted() {
    console.log('MapPanel mounted, this.$store.map:', this.$store.map, 'this.$config.map.zoom:', this.$config.map.zoom);
    let logo = document.getElementsByClassName('mapboxgl-ctrl-logo');
    // console.log('MapPanel mounted, logo:', logo, 'logo.length:', logo.length, 'logo.item(0):', logo.item(0));
    // logo[0].remove();
    if (this.$config.map.zoom) {
      this.$store.commit('setMapZoom', this.$config.map.zoom);
    }
    if (this.$config.map.center) {
      this.$store.commit('setMapCenter', this.$config.map.center);
    }
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    mapboxSiteName(marker) {
      return '<span class="popup-text">' + this.getSiteName(marker) + '</span>'
    },
    configForBasemap(basemap) {
      return this.$config.map.basemaps[basemap] || {};
    },
    handleMarkerClick(e) {
      let featureId = e.component._props.markerId;
      let siteName;
      for (let datum of this.currentData) {
        if (datum._featureId === featureId) {
          siteName = this.getSiteName(datum);
          continue;
        }
      }
      console.log('handleMarkerClick is running, e:', e, 'siteName:', siteName);

      const selectedResource = [ ...this.selectedResources ];
      if (selectedResource.includes(featureId)) {
        // console.log('markerClick close marker, featureId', featureId);
        selectedResource.splice(selectedResource.indexOf(featureId), 1);
        this.$store.commit('setLatestSelectedResourceFromMap', null);
      } else {
        console.log('markerClick open marker, featureId', featureId);
        this.$gtag.event('map-click', {
          'event_category': this.$store.state.gtag.category,
          'event_label': siteName,
        })
        selectedResource.push(featureId);
        if (window.innerWidth < 750) {
          this.$store.commit('setLatestSelectedResourceFromMap', featureId);
        }
      }
      this.$store.commit('setSelectedResources', selectedResource);
    },

    handleResize(event) {
      // console.log('MapPanel.vue handleResize is running');
      if (this.mapType === 'leaflet') {
        this.$store.state.map.map.invalidateSize();
      } else if (this.mapType === 'mapbox') {
        this.$store.map.resize();
      }
    },
    handleMapMove(e) {
      // const map = this.$store.state.map.map;
      const map = this.$store.map;
      // console.log('in handleMapMove, map:', map);

      const pictometryConfig = this.$config.pictometry || {};

      const center = map.getCenter();
      const { lat, lng } = center;
      const coords = [ lng, lat ];

      if (pictometryConfig.enabled) {
        // update state for pictometry
        this.$store.commit('setPictometryMapCenter', coords);

        const zoom = map.getZoom();
        this.$store.commit('setPictometryMapZoom', zoom);
      }

      const cyclomediaConfig = this.$config.cyclomedia || {};

      if (cyclomediaConfig.enabled) {
        // update cyclo recordings
        this.updateCyclomediaRecordings();
        this.$store.commit('setCyclomediaLatLngFromMap', [ lat, lng ]);
      }
    },
    toggleMap() {
      this.$emit('toggleMap');
    },
    onMapLoaded(event) {
      // console.log('onMapLoaded is running, event.map:', event.map, this.$store.state.map);
      this.$store.map = event.map;
    },
    onMapPreloaded(event) {
      let logo = document.getElementsByClassName('mapboxgl-ctrl-logo');
      // console.log('MapPanel onMapPreloaded, logo:', logo, 'logo.length:', logo.length, 'logo.item(0):', logo.item(0));
      logo[0].remove();
      let attrib = document.getElementsByClassName('mapboxgl-ctrl-attrib');
      attrib[0].remove();
    }
  },
};
</script>

<style>

.popup-text {
  font-family: "Montserrat", sans-serif;
  font-size: 1.1rem;
}

.map-container-no-refine {
  height: 100%;
}

@media screen and (max-width: 749px) {
  .map-container{
    /* min-height: calc(100vh - 100px); */
    min-height: calc(100vh - 192px);
    /* height: 100vh; */
    /* height: 400px; */
    /* min-height: 100%; */
  }

  .map-container-no-refine {
    /* min-height: calc(100vh - 100px); */
    min-height: calc(100vh - 132px);
    /* height: 100vh; */
    /* height: 400px; */
    /* min-height: 100%; */
  }
}

.mb-map-with-widget {
  height: 50%;
}

.mb-map-loading-mask {
  /*display: inline;*/
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0 ,0 , 0.25);
  z-index: 1000;
  text-align: center;
  vertical-align: middle;
}

.mb-map-loading-mask-inner {
  position: absolute;
  top: 40%;
  left: 40%;
}

</style>
