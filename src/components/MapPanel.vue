<template>
  <div class="cell medium-12 medium-cell-block-y mb-panel mb-panel-map map-height">
    <Map_
      id="map-tag"
      :class="{ 'mb-map-with-widget': this.$store.state.cyclomedia.active || this.$store.state.pictometry.active }"
      :center="this.$store.state.map.center"
      :zoom="this.$store.state.map.zoom"
      zoom-control-position="bottomright"
      :min-zoom="11"
      :max-zoom="22"
      @l-moveend="handleMapMove"
    >
      <div
        v-show="isLoadingPins"
        class="mb-map-loading-mask"
      >
        <div class="mb-map-loading-mask-inner">
          <i class="fa fa-spinner fa-4x spin" />
          <h1>Finding map data...</h1>
        </div>
      </div>
      <!-- @l-click="handleMapClick" -->
      <esri-tiled-map-layer
        v-for="(basemap, key) in this.$config.map.basemaps"
        v-if="activeBasemap === key"
        :key="key"
        :url="basemap.url"
      />

      <!-- basemap labels and parcels outlines -->
      <esri-tiled-map-layer
        v-for="(tiledLayer, key) in this.$config.map.tiledLayers"
        v-if="tiledLayers.includes(key)"
        :key="key"
        :url="tiledLayer.url"
        :z-index="tiledLayer.zIndex"
      />

      <vector-marker
        v-for="(marker) in markersForAddress"
        :key="marker.key"
        :latlng="marker.latlng"
        :marker-color="marker.color"
        :icon="marker.icon"
      />

      <circle-marker
        v-if="markerType === 'circle-marker'"
        v-for="(marker) in currentMapData"
        :latlng="marker.latlng"
        :radius="marker.radius"
        :fill-color="marker.color"
        :color="'black'"
        :weight="1"
        :opacity="1"
        :fill-opacity="1"
        :data="{
          featureId: marker._featureId
        }"
        @l-click="handleMarkerClick"
      >
        <popup-simple
          v-if="latestSelectedResourceFromMap === marker._featureId"
          :latlng="marker.latlng"
          :feature-id="marker._featureId"
        >
          <popup-content-functional
            :popup-data="marker.organization_name"
            @didClickPopupContent="toggleMap"
          />
        </popup-simple>
      </circle-marker>
      <!-- :feature-id="marker._featureId" -->

      <!-- :rotation-angle="cycloRotationAngle" -->
      <!-- :icon="sitePath + 'images/camera.png'" -->
      <!-- :latlng="cycloLatlng" -->

      <!-- <vector-marker v-for="(marker) in this.$data.rows" -->
      <vector-marker
        v-if="markerType === 'pin-marker'"
        v-for="(marker) in currentMapData"
        :key="marker.key"
        :latlng="marker.latlng"
        :marker-color="marker.color"
        :feature-id="marker._featureId"
        @l-click="handleMarkerClick"
        :icon="marker.icon"
        :data="{
          featureId: marker._featureId
        }"
      >
        <popup-simple
          v-if="latestSelectedResourceFromMap === marker._featureId"
          :latlng="marker.latlng"
          :feature-id="marker._featureId"
        >
          <popup-content-functional
            :popup-data="marker.organization_name"
            @didClickPopupContent="toggleMap"
          />
        </popup-simple>
      </vector-marker>

      <!-- marker using a png and ablility to rotate it -->
      <png-marker
        v-if="cyclomediaActive"
        :icon="sitePath + 'images/camera.png'"
        :latlng="cycloLatlng"
        :rotation-angle="cycloRotationAngle"
      />

      <!-- marker using custom code extending icons - https://github.com/iatkin/leaflet-svgicon -->
      <svg-view-cone-marker
        v-if="cyclomediaActive"
        :latlng="cycloLatlng"
        :rotation-angle="cycloRotationAngle"
        :h-fov="cycloHFov"
      />

      <!-- basemap control -->
      <control-corner
        :v-side="'top'"
        :h-side="'almostright'"
      />

      <control-corner
        :v-side="'top'"
        :h-side="'almostleft'"
      />

      <div v-once>
        <basemap-toggle-control
          v-if="shouldShowBasemapToggleControl"
          v-once
          :position="'topright'"
        />
      </div>

      <div v-once>
        <basemap-select-control :position="this.basemapSelectControlPosition" />
      </div>

      <div v-once>
        <cyclomedia-button
          v-if="shouldShowCyclomediaButton"
          v-once
          :position="'topright'"
          :link="'cyclomedia'"
          :img-src="sitePath + 'images/cyclomedia.png'"
          @click="handleCyclomediaButtonClick"
        />
      </div>

      <cyclomedia-recording-circle
        v-for="recording in cyclomediaRecordings"
        v-if="cyclomediaActive"
        :key="recording.imageId"
        :image-id="recording.imageId"
        :latlng="[recording.lat, recording.lng]"
        :size="1.2"
        :color="'#3388ff'"
        :weight="1"
        @l-click="handleCyclomediaRecordingClick"
      />
    </Map_>
    <slot
      class="widget-slot"
      name="cycloWidget"
    />
  </div>
</template>

<script>
import proj4 from 'proj4';
import 'leaflet/dist/leaflet.css';
// import all fontawesome icons included in phila-vue-mapping
import * as faMapping from '@phila/vue-mapping/src/fa';
import Map_ from '@phila/vue-mapping/src/leaflet/Map.vue';
import PopupSimple from '@phila/vue-mapping/src/leaflet/PopupSimple.vue';
import PopupContentFunctional from '@phila/vue-mapping/src/leaflet/PopupContentFunctional.vue';

import cyclomediaMixin from '@phila/vue-mapping/src/cyclomedia/map-panel-mixin.js';
import CyclomediaButton from '@phila/vue-mapping/src/cyclomedia/Button.vue';
import CyclomediaRecordingsClient from '@phila/vue-mapping/src/cyclomedia/recordings-client.js';
import ControlCorner from '@phila/vue-mapping/src/leaflet/ControlCorner.vue';
import BasemapToggleControl from '@phila/vue-mapping/src/components/BasemapToggleControl.vue';
import BasemapSelectControl from '@phila/vue-mapping/src/components/BasemapSelectControl.vue';

export default {
  name: "MapPanel",
  components: {
    Map_,
    PopupSimple,
    PopupContentFunctional,
    // PopUpContent,
    EsriTiledMapLayer: () => import(/* webpackChunkName: "pvm_EsriTiledMapLayer" */'@phila/vue-mapping/src/esri-leaflet/TiledMapLayer.vue'),
    VectorMarker: () => import(/* webpackChunkName: "mbmp_pvm_VectorMarker" */'@phila/vue-mapping/src/components/VectorMarker.vue'),
    CircleMarker: () => import(/* webpackChunkName: "mbmp_pvm_CircleMarker" */'@phila/vue-mapping/src/leaflet/CircleMarker.vue'),
    PngMarker: () => import(/* webpackChunkName: "mbmp_pvm_PngMarker" */'@phila/vue-mapping/src/components/PngMarker.vue'),
    CyclomediaRecordingCircle: () => import(/* webpackChunkName: "mbmp_pvm_CyclomediaRecordingCircle" */'@phila/vue-mapping/src/cyclomedia/RecordingCircle.vue'),
    SvgViewConeMarker: () => import(/* webpackChunkName: "mbmp_pvm_CyclomediaSvgViewConeMarker" */'@phila/vue-mapping/src/cyclomedia/SvgViewConeMarker.vue'),
    CyclomediaButton,
    CyclomediaRecordingsClient,
    ControlCorner,
    BasemapToggleControl,
    BasemapSelectControl,
  },
  mixins: [
    cyclomediaMixin,
  ],
  data() {
    const data = {
      rows: [],
    };
    return data;
  },
  computed: {
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
      // console.log('MapPanel.vue currentMapData computed is recalculating');//, this.currentData:', this.currentData);
      const newRows = [];
      for (const row of [ ...this.currentData ]) {
        // console.log('in loop, row:', row);
        let markerColor;
        let markerSize;
        let radius;
        if (this.selectedResources.includes(row._featureId)) {
          markerColor = '#2176d2';
          markerSize = 40;
          radius = 12;
        } else {
          markerColor = 'purple';
          markerSize = 20;
          radius = 6;
        }
        if (row.lat) {
          if (this.$config.projection === '3857') {
            row.latlng = proj4(this.projection3857, this.projection4326, [ row.lat, row.lon ]);
          } else {
            row.latlng = [ row.lat, row.lon ];
          }
          row.color = markerColor;
          row.radius = radius;
          row.icon = {
            prefix: 'fas',
            icon: 'map-marker-alt',
            shadow: false,
            size: markerSize,
          };
          newRows.push(row);
        } else if (row.geometry) {
          if (this.$config.projection === '3857') {
            let lnglat = proj4(this.projection3857, this.projection4326, [ row.geometry.x, row.geometry.y ]);
            row.latlng = [ lnglat[1], lnglat[0] ];
          } else {
            row.latlng = [ row.geometry.y, row.geometry.x ];
          }
          row.color = markerColor;
          row.radius = radius;
          row.icon = {
            prefix: 'fas',
            icon: 'map-marker-alt',
            shadow: false,
            size: markerSize,
          };
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
  },
  watch: {
    geocodeResult(nextGeocodeResult) {
      if (nextGeocodeResult._featureId) {
        this.$store.commit('setMapCenter', nextGeocodeResult.geometry.coordinates);
        this.$store.commit('setMapZoom', this.geocodeZoom);
      }
    },
    latestSelectedResourceFromExpand(nextLatestSelectedResource) {
      if (nextLatestSelectedResource) {
        const { rows } = this.$store.state.sources[this.$appType].data;
        const dataValue = rows.filter(row => row._featureId === nextLatestSelectedResource);
        const { map } = this.$store.state.map;
        map.setView([ dataValue[0].lat, dataValue[0].lon ], this.geocodeZoom);
      }
    },
    latestSelectedResourceFromMap(nextLatestSelectedResource) {
      let test = document.getElementById('customPopup');
      console.log('in watch latestSelectedResourceFromMap, test:', test);
    },
    cyclomediaActive(value) {
      this.$nextTick(() => {
        this.$store.state.map.map.invalidateSize();
      });
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    configForBasemap(basemap) {
      return this.$config.map.basemaps[basemap] || {};
    },
    handleMarkerClick(e) {
      const { target } = e;
      const { featureId } = target.options.data;
      console.log('MapPanel.vue handleMarkerClick is running, target:', target, 'featureId:', featureId);
      const selectedResource = [ ...this.selectedResources ];
      if (selectedResource.includes(featureId)) {
        // console.log('markerClick close marker, featureId', featureId);
        selectedResource.splice(selectedResource.indexOf(featureId), 1);
        this.$store.commit('setLatestSelectedResourceFromMap', null);
      } else {
        // console.log('markerClick open marker, featureId', featureId);
        selectedResource.push(featureId);
        if (window.innerWidth < 750) {
          this.$store.commit('setLatestSelectedResourceFromMap', featureId);
        }
      }
      this.$store.commit('setSelectedResources', selectedResource);
    },
    handleResize(event) {
      this.$store.state.map.map.invalidateSize();
    },
    handleMapMove(e) {
      const map = this.$store.state.map.map;

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
  },
};
</script>

<style>
@media screen and (max-width: 749px) {
  .map-container{
    min-height: 100vh !important;
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
