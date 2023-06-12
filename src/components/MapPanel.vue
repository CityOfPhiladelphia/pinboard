<template>
  <div
    :class="printHide"
    class="map-panel-main-div"
  >

    <phila-ui-address-input
      v-show="!isMobile && view=='app' && !this.$config.searchBar.hide"
      :over-map="true"
      :placeholder="addressInputPlaceholder"
      :width-from-config="addressInputWidth"
      @clear-search="handleClearSearch"
      @handle-search-form-submit="handleSearchFormSubmit"
    />

    <MaplibreGlMap
      :map-style.sync="this.$config.mbStyle"
      :bounds="boundsProp"
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
          v-if="latestSelectedResourceFromMap === marker._featureId || latestSelectedResourceFromExpand === marker._featureId"
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
        :color="marker.borderColor"
        :weight="marker.weight"
        @click="handleMarkerClick"
      >
        <MglPopup
          v-if="latestSelectedResourceFromMap === marker._featureId || latestSelectedResourceFromExpand === marker._featureId"
          :showed="true"
        >
          <div
            @click="toggleMap"
            v-html="mapboxSiteName(marker)"
          >
          </div>
        </MglPopup>

      </MglCircleMarker>

      <MglRasterLayer
        v-for="(basemapSource, key) in this.basemapSources"
        v-if="shouldShowRasterLayer && activeBasemap === key"
        :key="key"
        :sourceId="activeBasemap"
        :layerId="activeBasemap"
        :layer="basemapSource.layer"
        :source="basemapSource.source"
        :before="firstOverlay"
      />

      <MglRasterLayer
        v-for="(basemapLabelSource, key) in this.basemapLabelSources"
        v-if="shouldShowRasterLayer && tiledLayers.includes(key)"
        :key="key"
        :sourceId="key"
        :layerId="key"
        :layer="basemapLabelSource.layer"
        :source="basemapLabelSource.source"
        :before="firstOverlay"
      />

      <MglNavigationControl position="bottom-right"/>

      <MglGeojsonLayer
        v-if="geojsonForResourceBoolean"
        key="'geojsonForResourceFill'"
        :source-id="'geojsonForResource'"
        :source="geojsonForResourceSource"
        :layer-id="'geojsonForResourceFill'"
        :layer="geojsonForResourceFillLayer"
        :clear-source="false"
        :replace-source="true"
        :replace="true"
      />

      <MglGeojsonLayer
        v-if="geojsonForResourceBoolean"
        key="'geojsonForResourceLine'"
        :source-id="'geojsonForResource'"
        :source="geojsonForResourceSource"
        :layer-id="'geojsonForResourceLine'"
        :layer="geojsonForResourceLineLayer"
        :clear-source="true"
        :replace-source="true"
        :replace="true"
      />

      <MglGeojsonLayer
        v-if="geojsonForZipcodeBoolean"
        key="'geojsonForZipcodeFill'"
        :source-id="'geojsonForZipcode'"
        :source="geojsonForZipcodeSource"
        :layer-id="'geojsonForZipcodeFill'"
        :layer="geojsonForZipcodeFillLayer"
        :clear-source="false"
        :replace-source="true"
        :replace="true"
      />

      <MglGeojsonLayer
        v-if="geojsonForZipcodeBoolean"
        key="'geojsonForZipcodeLine'"
        :source-id="'geojsonForZipcode'"
        :source="geojsonForZipcodeSource"
        :layer-id="'geojsonForZipcodeLine'"
        :layer="geojsonForZipcodeLineLayer"
        :clear-source="true"
        :replace-source="true"
        :replace="true"
      />

      <MglGeojsonLayer
        v-if="showBuffers && geojsonForZipcodeBufferBoolean"
        key="'geojsonForZipcodeBufferFill'"
        :source-id="'geojsonForZipcodeBuffer'"
        :source="geojsonForZipcodeBufferSource"
        :layer-id="'geojsonForZipcodeBufferFill'"
        :layer="geojsonForZipcodeBufferFillLayer"
        :clear-source="false"
        :replace-source="true"
        :replace="true"
      />

      <MglGeojsonLayer
        v-if="showBuffers && geojsonForZipcodeBufferBoolean"
        key="'geojsonForZipcodeBufferLine'"
        :source-id="'geojsonForZipcodeBuffer'"
        :source="geojsonForZipcodeBufferSource"
        :layer-id="'geojsonForZipcodeBufferLine'"
        :layer="geojsonForZipcodeBufferLineLayer"
        :clear-source="true"
        :replace-source="true"
        :replace="true"
      />

      <MglGeojsonLayer
        v-if="showBuffers && geojsonForBufferBoolean"
        key="'geojsonForBufferFill'"
        :source-id="'geojsonForBuffer'"
        :source="geojsonForBufferSource"
        :layer-id="'geojsonForBufferFill'"
        :layer="geojsonForBufferFillLayer"
        :clear-source="false"
        :replace-source="true"
        :replace="true"
      />

      <MglGeojsonLayer
        v-if="showBuffers && geojsonForBufferBoolean"
        key="'geojsonForBufferLine'"
        :source-id="'geojsonForBuffer'"
        :source="geojsonForBufferSource"
        :layer-id="'geojsonForBufferLine'"
        :layer="geojsonForBufferLineLayer"
        :clear-source="true"
        :replace-source="true"
        :replace="true"
      />

    </MaplibreGlMap>

    <!-- <slot
      class="widget-slot"
      name="cycloWidget"
    /> -->
  </div>
</template>

<script>

import proj4 from 'proj4';
import SharedFunctions from './mixins/SharedFunctions.vue';

// import all fontawesome icons included in phila-vue-mapping
// import * as faMapping from '@phila/vue-mapping/src/fa';

// import cyclomediaMixin from '@phila/vue-mapping/src/cyclomedia/map-panel-mixin.js';
import PhilaUiAddressInput from './PhilaUiAddressInput.vue';
import MglFontAwesomeMarker from '@phila/vue-mapping/src/mapbox/UI/FontAwesomeMarker.vue';

import MaplibreGlMap from '@phila/vue-mapping/src/mapbox/map/MaplibreGlMap.vue';
import MglMarker from '@phila/vue-mapping/src/mapbox/UI/Marker.vue';
import MglCircleMarker from '@phila/vue-mapping/src/mapbox/UI/CircleMarker.vue';
import MglNavigationControl from '@phila/vue-mapping/src/mapbox/UI/controls/NavigationControl';
import MglRasterLayer from '@phila/vue-mapping/src/mapbox/layer/RasterLayer.vue';
import MglPopup from '@phila/vue-mapping/src/mapbox/UI/Popup';
import OverlayLegend from '@phila/vue-mapping/src/mapbox/OverlayLegend';

import bbox from '@turf/bbox';
import { point, polygon, convertArea, featureCollection } from '@turf/helpers';

export default {
  name: "MapPanel",
  components: {
    MaplibreGlMap,
    MglMarker,
    MglCircleMarker,
    MglNavigationControl,
    MglRasterLayer,
    MglPopup,
    OverlayLegend,
    PhilaUiAddressInput,
    MglGeojsonLayer: () => import(/* webpackChunkName: "pvm_MglGeojsonLayer" */'@phila/vue-mapping/src/mapbox/layer/GeojsonLayer'),
    MglFontAwesomeMarker,
  },
  props: {
    view: {
      type: String,
      default: 'app',
    },
  },
  mixins: [
    SharedFunctions,
  ],
  data() {
    const data = {
      rows: [],
      accessToken: process.env.VUE_APP_MAPBOX_ACCESSTOKEN,
      addressInputPlaceholder: null,

      geojsonForZipcodeBoolean: false,
      geojsonForZipcodeSource: {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [],
          },
        },
      },
      geojsonForZipcodeFillLayer: {
        'id': 'geojsonForZipcodeFill',
        'type': 'fill',
        'source': 'geojsonForZipcode',
        'layout': {},
        'paint': {
          'fill-color': '#cc3000',
          'fill-opacity': 0.2,
          'fill-outline-color': 'rgb(0,102,255)',
        },
      },
      geojsonForZipcodeLineLayer: {
        'id': 'geojsonForZipcodeLine',
        'type': 'line',
        'source': 'geojsonForZipcode',
        'layout': {},
        'paint': {
          'line-color': '#cc3000',
          'line-width': 2,
        },
      },

      geojsonForZipcodeBufferBoolean: false,
      geojsonForZipcodeBufferSource: {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [],
          },
        },
      },
      geojsonForZipcodeBufferFillLayer: {
        'id': 'geojsonForZipcodeBufferFill',
        'type': 'fill',
        'source': 'geojsonForZipcodeBuffer',
        'layout': {},
        'paint': {
          'fill-color': '#9e9ac8',
          'fill-opacity': 0.2,
          'fill-outline-color': 'rgb(0,102,255)',
        },
      },
      geojsonForZipcodeBufferLineLayer: {
        'id': 'geojsonForZipcodeBufferLine',
        'type': 'line',
        'source': 'geojsonForZipcodeBuffer',
        'layout': {},
        'paint': {
          'line-color': '#9e9ac8',
          'line-width': 2,
        },
      },

      geojsonForBufferBoolean: false,
      geojsonForBufferSource: {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [],
          },
        },
      },
      geojsonForBufferFillLayer: {
        'id': 'geojsonForBufferFill',
        'type': 'fill',
        'source': 'geojsonForBuffer',
        'layout': {},
        'paint': {
          'fill-color': '#9e9ac8',
          'fill-opacity': 0.2,
          'fill-outline-color': 'rgb(0,102,255)',
        },
      },
      geojsonForBufferLineLayer: {
        'id': 'geojsonForBufferLine',
        'type': 'line',
        'source': 'geojsonForBuffer',
        'layout': {},
        'paint': {
          'line-color': '#9e9ac8',
          'line-width': 2,
        },
      },

      geojsonForResourceBoolean: false,
      geojsonForResourceSource: {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [],
          },
        },
      },
      geojsonForResourceFillLayer: {
        'id': 'geojsonForResourceFill',
        'type': 'fill',
        'source': 'geojsonForResource',
        'layout': {},
        'paint': {
          'fill-color': '#9e9ac8',
          'fill-opacity': 0.4,
          'fill-outline-color': 'rgb(0,102,255)',
        },
      },
      geojsonForResourceLineLayer: {
        'id': 'geojsonForResourceLine',
        'type': 'line',
        'source': 'geojsonForResource',
        'layout': {},
        'paint': {
          'line-color': '#9e9ac8',
          'line-width': 2,
        },
      },
      zoomToShape: {
        geojsonParcels: [],
        geojsonForResource: [],
        markersForAddress: [],
        markersForTopic: [],
      },

    };
    return data;
  },
  computed: {
    showBuffers() {
      let value = false;
      if (this.$config.showBuffers) {
        value = true;
      }
      return value;
    },
    zipcodeBufferShape() {
      return this.$store.state.zipcodeBufferShape;
    },
    bufferShape() {
      return this.$store.state.bufferShape;
    },
    zipcodeData() {
      let zipcode;
      if (this.$store.state.sources.zipcodes) {
        let zipcodesData = this.$store.state.sources.zipcodes.data;
        let selectedZipcode = this.selectedZipcode;
        if (zipcodesData && selectedZipcode) {
          zipcode = zipcodesData.features.filter(test => test.attributes.CODE == selectedZipcode)[0];
        }
      }
      return zipcode;
    },
    selectedZipcode() {
      return this.$store.state.selectedZipcode;
    },
    boundsProp() {
      let bounds = this.$store.state.map.bounds;
      // console.log('in boundsProps, bounds:', bounds);
      let finalBounds;

      if (this.mapType === 'leaflet') {
        // console.log('in boundsProp, mapType is leaflet');
        finalBounds = bounds;
      } else {
        if (bounds._northEast && bounds._northEast.lat != null) {
          // console.log('in boundsProp else then if 1');
          finalBounds = [[ bounds._southWest.lng, bounds._southWest.lat ], [ bounds._northEast.lng, bounds._northEast.lat ]];
        } else if (bounds._northEast && bounds._northEast.lat == null) {
          // console.log('in boundsProp else then else if 1');
        } else {
          // console.log('in boundsProp else then else');
          finalBounds = bounds;
        }
      }
      return finalBounds;
    },
    geojsonForResource() {
      let selectedResource = this.$store.state.selectedResources[0];
      let selectedCurrentMapData = this.currentMapData.filter(test => test._featureId == selectedResource);
      console.log('geojsonForResource computed, selectedResource:', selectedResource);
      let coordinates = [];
      let result = [];
      if (this.$config && this.$config.geojsonForResource) {
        let geojsonData = this.$store.state.sources[this.$config.geojsonForResource.source].data;
        // console.log('in geojsonForResource computed, geojsonData:', geojsonData, 'selectedCurrentMapData:', selectedCurrentMapData);
        if (geojsonData && geojsonData.features && selectedCurrentMapData[0]) {
          let geojsonForResource = geojsonData.features.filter(test2 => test2.attributes.globalid == selectedCurrentMapData[0].attributes.globalid);
          coordinates = geojsonForResource[0].geometry.rings[0];
          console.log('in geojsonForResource computed, geojsonForResource:', geojsonForResource, 'coordinates:', coordinates, 'geojsonData:', geojsonData);
          result = [{
            'resource': selectedResource,
            'color':"#9e9ac8",
            'fillColor':"#9e9ac8",
            'fillOpacity':0.3,
            'opacity':1,
            'weight':2,
            'geojson': {
              "type": "Feature",
              '_featureId':"feat-divisions-0",
              "id": 1384,
              "geometry": {
                "type": "Polygon",
                "coordinates": [ coordinates ],
              },
              "properties": {
              }
            }
          }];
        }
      }
      return result;
    },
    printHide() {
      let value;
      if (this.view != 'print') {
        value = 'print-hide';
      }
      return value;
    },
    addressInputWidth() {
      if (this.$config.addressInput) {
        return this.$config.addressInput.mapWidth;
      }
      return 415;
    },
    map() {
      return this.$store.map;
    },
    shouldShowRasterLayer() {
      let value = true;
      if (this.$config.map.tiles === 'hosted') {
        value = false;
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
      return [ ...this.$store.state.currentData ];
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
      // console.log('MapPanel.vue currentMapData computed is starting recalculating, this.$config:', this.$config);//, this.currentData:', this.currentData);
      // if (!this.$config) {
      //   return;
      // }
      const newRows = [];
      for (const row of [ ...this.currentData ]) {
        // console.log('MapPanel in loop, row:', row);

        let color, // all markers
          size, // circleMarkers only
          weight, // circleMarkers only
          borderColor, // circleMarkers only
          faSize; // font awesome markers only
          // offset; // font awesome markers only
          // markerSize,
          // radius,
          // nonSelectedRadius,

        // circle-marker size
        // console.log('this.$config:', this.$config);
        if (this.$config && this.$config.circleMarkers && this.$config.circleMarkers.size) {
          if (this.isMobileOrTablet && this.$config.circleMarkers.mobileSize) {
            size = this.$config.circleMarkers.mobileSize;
          } else {
            size = this.$config.circleMarkers.size;
          }
        } else {
          size = 14;
        }

        if (this.$config && this.$config.circleMarkers && this.$config.circleMarkers.borderColor) {
          borderColor = this.$config.circleMarkers.borderColor;
        }

        // selected = true;
        if (this.selectedResources.includes(row._featureId)) {
          console.log('row is selected, row._featureId:', row._featureId);

          if (this.$config && this.$config.circleMarkers && this.$config.circleMarkers.selectedColor) {
            color = this.$config.circleMarkers.selectedColor;
          } else {
            color = '#0f4d90';
          }

          size = 30;
          // console.log('color:', color, 'size:', size, 'this.$config.circleMarkers.circleColors[row.category_type]:', this.$config.circleMarkers.circleColors[row.category_type]);
          faSize = '4x';
          weight = 0;

        // selected = false;
        } else {
          // multiple circle colors defined
          // console.log('MapPanel.vue else is running');
          if (this.$config && this.$config.circleMarkers && this.$config.circleMarkers.circleColors) {
            // console.log('in MapPanel circleColores, row:', row);
            if (row.attributes) {
              color = this.$config.circleMarkers.circleColors[row.attributes.category_type];
            } else if (row.category_type) {
              color = this.$config.circleMarkers.circleColors[row.category_type];
            } else if (row.site_type) {
              color = this.$config.circleMarkers.circleColors[row.site_type];
            } else if (row.fields) {
              color = this.$config.circleMarkers.circleColors[row.fields.category_type];
            }

          // single circle color defined
          } else if (this.$config && this.$config.circleMarkers && this.$config.circleMarkers.color) {
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

          if (this.$config && this.$config.circleMarkers && this.$config.circleMarkers.weight || this.$config && this.$config.circleMarkers && this.$config.circleMarkers.weight === 0) {
            weight = this.$config.circleMarkers.weight;
          } else {
            weight = 1;
          }
          // console.log('weight:', weight, 'this.$config.circleMarkers.weight:', this.$config.circleMarkers.weight);
        }

        if (row.fields && row.fields.lat) {
          row.lat = row.fields.lat;
          row.lon = row.fields.lon;
        }

        
        let projection;
        if (this.$config && this.$config.projection) {
          projection = this.$config.projection;
        }

        if (row.lat) {
          // console.log('MapPanel if row.lat is running, row.lat:', row.lat, 'row.lon:', row.lon, 'color:', color, 'size:', size);
          // console.log('if row.lat is running, color:', color, 'markerSize:', markerSize);
          // let projection = this.getProjection(row);
          if (projection === '3857') {
            // console.log('if row.lat, and projection is 3857, row.lat:', row.lat, 'row.lon:', row.lon);
            let lnglat = proj4(this.projection3857, this.projection4326, [ row.lon, row.lat ]);
            row.latlng = [ lnglat[1], lnglat[0] ];
          } else if (projection === '2272') {
            // console.log('if row.lat, and projection is 2272');
            let lnglat = proj4(this.projection2272, this.projection4326, [ row.geometry.x, row.geometry.y ]);
            row.latlng = [ lnglat[1], lnglat[0] ];
          } else {
            // console.log('if row.lat, and else is running');
            row.latlng = [ row.lat, row.lon ];
          }
        } else if (row.geometry) {
          // console.log('else if row.geometry is true, this.$config.projection:', this.$config.projection);
          // let projection = this.getProjection(row);
          // console.log('else if row.geometry is true, row.geometry:', row.geometry, 'projection:', projection, 'row.geometry.x:', row.geometry.x, 'row.geometry.y:', row.geometry.y);
          if (projection === '3857') {
            let lnglat = proj4(this.projection3857, this.projection4326, [ row.geometry.x, row.geometry.y ]);
            row.latlng = [ lnglat[1], lnglat[0] ];
          } else if (projection === '2272') {
            let lnglat = proj4(this.projection2272, this.projection4326, [ row.geometry.x, row.geometry.y ]);
            row.latlng = [ lnglat[1], lnglat[0] ];
          } else {
            row.latlng = [ row.geometry.y, row.geometry.x ];
          }
        }

        row.color = color;
        row.borderColor = borderColor;
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
    lastPinboardSearchMethod() {
      return this.$store.state.lastPinboardSearchMethod;
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
        let color;
        if (this.$config.addressMarkerColor) {
          color = this.$config.addressMarkerColor;
        } else {
          color = '#cc3000';
        }
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
      let value;
      if (this.$config.map.geocodeZoom) {
        value = this.$config.map.geocodeZoom;
      } else {
        value = 19;
      }
      return value;
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
          });
          if (overlays.length) {
            overlay = overlays[0].id;
          }
        }
      }
      return overlay;
    },

  },
  watch: {
    selectedResources(nextSelectedResources) {
      if (this.latestSelectedResourceFromExpand == null && this.latestSelectedResourceFromMap == null) {
        this.$store.commit('setLatestSelectedResourceFromExpand', nextSelectedResources[0]);
      }
    },
    lastPinboardSearchMethod(nextLastPinboardSearchMethod) {
      console.log('watch lastPinboardSearchMethod, nextLastPinboardSearchMethod:', nextLastPinboardSearchMethod);
      if (nextLastPinboardSearchMethod === 'geocode') {
        this.$data.geojsonForZipcodeBoolean = false;
        this.$data.geojsonForZipcodeBufferBoolean = false;
        let startQuery = { ...this.$route.query };
        delete startQuery['zipcode'];
        this.$router.push({ query: { ...startQuery }});
        this.$store.commit('setSelectedZipcode', null);
      } else if (nextLastPinboardSearchMethod === 'zipcode') {
        this.$data.geojsonForBufferBoolean = false;
        let startQuery = { ...this.$route.query };
        delete startQuery['address'];
        this.$router.push({ query: { ...startQuery }});
      }
    },
    zipcodeBufferShape(nextZipcodeBufferShape) {
      console.log('watch zipcodeBufferShape is firing now, nextZipcodeBufferShape:', nextZipcodeBufferShape);
      let geo;
      if (nextZipcodeBufferShape) {
        // console.log('if is running, nextZipcodeBufferShape:', nextZipcodeBufferShape);
        geo = nextZipcodeBufferShape.geometry;
        this.$data.geojsonForZipcodeBufferSource.data.geometry.coordinates = geo.coordinates;
        this.$data.geojsonForZipcodeBufferBoolean = true;
      } else {
        // console.log('else is running, nextBufferShape:', nextBufferShape);
        this.$data.geojsonForZipcodeBufferSource.data.geometry.coordinates = [];
        this.$data.geojsonForZipcodeBufferBoolean = false;
      }
    },
    bufferShape(nextBufferShape) {
      console.log('watch bufferShape is firing now, nextBufferShape:', nextBufferShape);
      let geo;
      if (nextBufferShape) {
        // console.log('if is running, nextBufferShape:', nextBufferShape);
        geo = nextBufferShape.geometry;
        this.$data.geojsonForBufferSource.data.geometry.coordinates = geo.coordinates;
        this.$data.geojsonForBufferBoolean = true;
      } else {
        // console.log('else is running, nextBufferShape:', nextBufferShape);
        this.$data.geojsonForBufferSource.data.geometry.coordinates = [];
        this.$data.geojsonForBufferBoolean = false;
      }
    },
    zipcodeData(nextZipcodeData) {
      // console.log('watch zipcodeData, nextZipcodeData:', nextZipcodeData);
      let geo;
      if (nextZipcodeData) {
        geo = nextZipcodeData.geometry.rings;
        this.$data.geojsonForZipcodeSource.data.geometry.coordinates = geo;
        this.$data.geojsonForZipcodeBoolean = true;
        this.$data.geojsonForZipcodeBufferBoolean = true;
      } else {
        this.$data.geojsonForZipcodeSource.data.geometry.coordinates = [];
        this.$data.geojsonForZipcodeBoolean = false;
        this.$data.geojsonForZipcodeBufferBoolean = false;
      }
    },
    // map(nextMap) {
    //   console.log('MapPanel watch map is firing, nextMap:', nextMap);
    // },
    geocodeResult(nextGeocodeResult) {
      if (nextGeocodeResult._featureId) {
        this.$store.commit('setMapCenter', nextGeocodeResult.geometry.coordinates);
        this.$store.commit('setMapZoom', this.geocodeZoom);
      }
    },
    latestSelectedResourceFromExpand(nextLatestSelectedResource) {
      // console.log('watch latestSelectedResourceFromExpand:', nextLatestSelectedResource, 'this.$appType:', this.$appType, 'this.$store.state.sources[this.$appType].data:', this.$store.state.sources[this.$appType].data);
      if (nextLatestSelectedResource) {
        // this.$store.commit('setLatestSelectedResourceFromMap', null);
        console.log('watch latestSelectedResourceFromExpand, in if nextLatestSelectedResource:', nextLatestSelectedResource);
        let rows;
        const map = this.$store.map;

        if (!this.latestSelectedResourceFromMap || !this.latestSelectedResourceFromMap == nextLatestSelectedResource) {
        
          // data coming as "rows" means it came from carto
          if (this.$store.state.sources[this.$appType].data.rows) {
            rows = this.$store.state.sources[this.$appType].data.rows;
            const dataValue = rows.filter(row => row._featureId === nextLatestSelectedResource);
            // console.log('in watch latestSelectedResourceFromExpand, rows, nextLatestSelectedResource:', nextLatestSelectedResource, 'rows:', rows, 'dataValue:', dataValue);
            // do not set view if there is not lat value
            if (dataValue[0].lat) {
              map.setCenter([ dataValue[0].lon, dataValue[0].lat ], this.geocodeZoom);
            }

          // data coming as "features" means it came from arcgis
          } else if (this.$store.state.sources[this.$appType].data.features) {
            rows = this.$store.state.sources[this.$appType].data.features;
            const dataValue = rows.filter(row => row._featureId === nextLatestSelectedResource);
            console.log('in watch latestSelectedResourceFromExpand, features, nextLatestSelectedResource:', nextLatestSelectedResource, 'rows:', rows, 'dataValue:', dataValue, 'dataValue[0].latlng:', dataValue[0].latlng);
            if (dataValue[0].latlng[0]) {
              map.setCenter([ dataValue[0].latlng[1], dataValue[0].latlng[0] ], this.geocodeZoom);
            }

          // data coming in as "records" means it came from airtable
          } else if (this.$store.state.sources[this.$appType].data.records) {
            rows = this.$store.state.sources[this.$appType].data.records;
            const dataValue = rows.filter(row => row._featureId === nextLatestSelectedResource);
            // console.log('in watch latestSelectedResourceFromExpand, array, nextLatestSelectedResource:', nextLatestSelectedResource, 'rows:', rows, 'dataValue:', dataValue);
            map.setCenter([ dataValue[0].latlng[1], dataValue[0].latlng[0] ], this.geocodeZoom);
          
          // data coming in as an array means it came from a compiled datasource or airtable
          } else if (Array.isArray(this.$store.state.sources[this.$appType].data)) {
            rows = this.$store.state.sources[this.$appType].data;
            const dataValue = rows.filter(row => row._featureId === nextLatestSelectedResource);
            // console.log('in watch latestSelectedResourceFromExpand, array, nextLatestSelectedResource:', nextLatestSelectedResource, 'rows:', rows, 'dataValue:', dataValue);
            map.setCenter([ dataValue[0].latlng[1], dataValue[0].latlng[0] ], this.geocodeZoom);
          }
        }
        // this.$store.commit('setLatestSelectedResourceFromMap', nextLatestSelectedResource);
        this.$store.commit('setLatestSelectedResourceFromMap', null);

      } else {
        // console.log('watch latestSelectedResourceFromExpand, in else nextLatestSelectedResource:', nextLatestSelectedResource);
        this.$store.commit('setLatestSelectedResourceFromMap', null);
      }
    },
    latestSelectedResourceFromMap(nextLatestSelectedResource) {
      let test = document.getElementById('customPopup');
      // this.$store.commit('setLatestSelectedResourceFromExpand', nextLatestSelectedResource);
      // console.log('in watch latestSelectedResourceFromMap, test:', test);
    },
    cyclomediaActive(value) {
      this.$nextTick(() => {
        this.$store.map.invalidateSize();
      });
    },
    currentMapData(nextCurrentMapData) {
      // console.log('MapPanel.vue, watch currentMapData, this.view:', this.view, 'nextCurrentMapData:', nextCurrentMapData);
      if (this.view == 'print') {
        // console.log('watch currentMapData, its print view, nextCurrentMapData[0].latlng[1]:', nextCurrentMapData[0].latlng[1]);
        this.$store.commit('setMapCenter', [ nextCurrentMapData[0].latlng[1], nextCurrentMapData[0].latlng[0] ]);
      }
    },

    geojsonForResource(nextGeojson) {
      console.log('watch geojsonForResource is firing, nextGeojson[0]:', nextGeojson[0]);
      if (this.$store.map) {
        // console.log('watch geojsonForResource is running, map.getStyle():', this.$store.map.getStyle(), 'map.getStyle().layers:', this.$store.map.getStyle().layers, 'nextGeojson:', nextGeojson);
      }
      if (nextGeojson[0] && nextGeojson.length > 1) {
        // console.log('watch geojsonForResource is running, nextGeojson:', nextGeojson, 'nextGeojson[0].geojson:', nextGeojson[0].geojson);
        this.$data.geojsonCollectionForTopicSource.data.features = [];

        for (let feature of nextGeojson) {
          this.$data.geojsonCollectionForTopicSource.data.features.push(feature.geojson);
        }

        const valOrGetter = nextGeojson[0].fillColor;
        const valOrGetterType = typeof valOrGetter;
        let val;

        if (valOrGetterType === 'function') {
          const state = this.$store.state;
          const getter = valOrGetter;
          val = getter(state);
        } else {
          val = valOrGetter;
        }
        this.$data.geojsonCollectionForTopicFillLayer.paint['fill-color'] = val;
        this.$data.geojsonCollectionForTopicFillLayer.paint['fill-opacity'] = nextGeojson[0].fillOpacity;

        if (nextGeojson[0].labelField) {
          this.$data.geojsonCollectionForTopicLabelsLayer.layout = {
            'text-font': [ 'Open Sans Regular' ],
            'text-field': [ 'get', nextGeojson[0].labelField ],
            'text-variable-anchor': [ 'top', 'bottom', 'left', 'right' ],
            'text-radial-offset': 0.5,
            'text-justify': 'auto',
            // 'icon-image': ['concat', ['get', 'icon'], '-15']
          };
        }
        if (nextGeojson[0].labelMinZoom) {
          this.$data.geojsonCollectionForTopicLabelsLayer.minzoom = nextGeojson[0].labelMinZoom;
        }

        this.$data.geojsonForResourceBoolean = true;
      } else if (nextGeojson[0]) {
        // console.log('watch geojsonForResource else if is running, nextGeojson[0].geojson.geometry:', nextGeojson[0].geojson.geometry);
        this.$data.geojsonForResourceSource.data.geometry.coordinates = nextGeojson[0].geojson.geometry.coordinates;
        this.$data.geojsonForResourceBoolean = true;
      } else {
        // console.log('watch geojsonForResource else is running');
        this.$data.geojsonForResourceSource.data.geometry.coordinates = [];
        this.$data.geojsonForResourceBoolean = false;
      }
      let czts = [ 'geojsonForResource' ];
      let dzts = this.$data.zoomToShape;
      if (!czts || !czts.includes('geojsonForResource')) {
        dzts.geojsonForResource = [];
        return;
      }
      dzts.geojsonForResource = nextGeojson;
      // console.log('exiting geojsonForResource');
      if (nextGeojson[0] && nextGeojson[0].geojson.geometry.coordinates.length) {
        // console.log('end of watch geojsonForResource, calling checkBoundsChanges, nextGeojson[0].geojson.geometry.coordinates.length:', nextGeojson[0].geojson.geometry.coordinates.length);
        this.checkBoundsChanges();
      }
      // console.log('end of watch geojsonForResource');
    },
  },
  mounted() {
    // console.log('MapPanel mounted, this.view:', this.view, 'this.currentData:', this.currentData, 'this.$store.map:', this.$store.map, 'this.$config.map.zoom:', this.$config.map.zoom);
    let logo = document.getElementsByClassName('mapboxgl-ctrl-logo');
    // console.log('MapPanel mounted, logo:', logo, 'logo.length:', logo.length, 'logo.item(0):', logo.item(0));
    // logo[0].remove();
    if (this.view == 'print') {
      this.$store.commit('setMapZoom', 14);
    } else if (this.$config.map.zoom) {
      this.$store.commit('setMapZoom', this.$config.map.zoom);
    }

    if (this.view != 'print' && this.$config.map.center) {
      this.$store.commit('setMapCenter', this.$config.map.center);
    }

    window.addEventListener('resize', this.handleResize);

    if (this.lastPinboardSearchMethod) {
      console.log('MapPanel mounted, this.lastPinboardSearchMethod:', this.lastPinboardSearchMethod);
      if (this.lastPinboardSearchMethod == 'zipcode') {
        this.$data.geojsonForZipcodeBoolean = true;
        this.$data.geojsonForZipcodeBufferBoolean = true;
      }
    }

    if (this.$config.searchBar) {
      this.addressInputPlaceholder = this.$config.searchBar.placeholder;
    }

  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleSearchFormSubmit(value) {
      this.$emit('handle-search-form-submit', value);
    },
    handleClearSearch() {
      this.$emit('clear-search');
    },
    mapboxSiteName(marker) {
      return '<span class="popup-text">' + this.getSiteName(marker) + '</span>';
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

      let selectedResource = [ ...this.selectedResources ];
      if (selectedResource.includes(featureId)) {
        console.log('markerClick close marker, featureId', featureId);
        selectedResource.splice(selectedResource.indexOf(featureId), 1);
        this.$store.commit('setLatestSelectedResourceFromMap', null);
      } else {
        selectedResource = [];
        console.log('markerClick open marker, featureId', featureId);
        this.$gtag.event('map-click', {
          'event_category': this.$store.state.gtag.category,
          'event_label': siteName,
        });
        selectedResource.push(featureId);
        // if (window.innerWidth < 750) {
        this.$store.commit('setLatestSelectedResourceFromMap', featureId);
        // }
      }
      this.$store.commit('setSelectedResources', selectedResource);
    },

    handleResize(event) {
      // console.log('MapPanel.vue handleResize is running');
      this.$store.map.resize();
    },
    handleMapMove(e) {
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
      console.log('MapPanel.vue toggleMap is running');
      this.$emit('toggleMap');
    },
    onMapLoaded(event) {
      // console.log('onMapLoaded is running, event.map:', event.map, this.$store.state.map);
      this.$store.map = event.map;

      let canvas = document.querySelector(".mapboxgl-canvas");
      canvas.setAttribute('tabindex', -1);
      // console.log('canvas:', canvas);

      setTimeout(function() {
        let zoomIn = document.querySelector(".mapboxgl-ctrl-zoom-in");
        zoomIn.setAttribute('tabindex', -1);
        let zoomOut = document.querySelector(".mapboxgl-ctrl-zoom-out");
        zoomOut.setAttribute('tabindex', -1);
        let compass = document.querySelector(".mapboxgl-ctrl-compass");
        compass.setAttribute('tabindex', -1);
        // console.log('compass:', compass, 'zoomIn:', zoomIn);
      }, 1000);

    },
    onMapPreloaded(event) {
      let logo = document.getElementsByClassName('mapboxgl-ctrl-logo');
      // console.log('MapPanel onMapPreloaded, logo:', logo, 'logo.length:', logo.length, 'logo.item(0):', logo.item(0));
      // logo[0].remove();
      let attrib = document.getElementsByClassName('mapboxgl-ctrl-attrib');
      attrib[0].remove();
    },

    checkBoundsChanges() {
      // console.log('checkBoundsChanges is running');
      let czts = [ 'geojsonForResource' ];
      if (!czts) {
        return;
      }
      let dzts = this.$data.zoomToShape;
      // console.log('dzts:', dzts, 'czts:', czts);
      let tf = [];
      for (let shape of czts) {
        if (dzts[shape] !== false && dzts[shape].length > 0) {
          tf.push(true);
        } else {
          tf.push(false);
        }
      }
      // console.log('MapPanel.vue checkBoundsChanges, dzts:', dzts, 'czts:', czts, 'tf:', tf);
      if (tf.includes(false)) {
        return;
      }
      this.setMapToBounds();

    },

    setMapToBounds() {
      // console.log('setMapToBounds is running, this.geojsonForResource[0].geojson.geometry.coordinates:', this.geojsonForResource[0].geojson.geometry.coordinates);
      let featureArray = [];
      let czts = [ 'geojsonForResource' ];
      if (czts) {
        if (czts.includes('geojsonForResource')) {
          console.log('setMapToBounds is still running');
          for (let geojsonFeature of this.geojsonForResource) {
            let theCoords = geojsonFeature.geojson.geometry.coordinates;
            console.log('theCoords:', theCoords);
            let thePolygon = polygon(theCoords);
            console.log('setMapToBounds geojsonFeature.geojson:', geojsonFeature.geojson, 'thePolygon:', thePolygon);
            featureArray.push(thePolygon);
          }
        }
        const theFeatureCollection = featureCollection(featureArray);
        // console.log('featureArray:', featureArray, 'theFeatureCollection:', theFeatureCollection);
        const bounds = bbox(theFeatureCollection);
        // console.log('bounds:', bounds);
        let bounds2 = [[ bounds[0], bounds[1] ], [ bounds[2], bounds[3] ]];
        this.$store.commit('setMapBounds', bounds2);
      }
    },
  },
};
</script>

<style>

.popup-text {
  font-family: "Montserrat", sans-serif;
  font-size: .9rem;
  padding-right: 20px;
}

.map-container-no-refine {
  height: 100%;
}

.map-panel-main-div {
  height: 100%;
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


@media print {
  .print-hide {
    display: none;
  }

  .circle-div {
    color: red !important;
    background-color: red !important;
  }
}

</style>
