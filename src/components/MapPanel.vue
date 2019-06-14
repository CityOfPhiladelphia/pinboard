<template>
  <div class="cell medium-12 medium-cell-block-y mb-panel mb-panel-map map-height">
    <Map_
      id="map-tag"
      :center="this.$store.state.map.center"
      :zoom="this.$store.state.map.zoom"
      zoom-control-position="bottomright"
      :min-zoom="11"
      :max-zoom="22"
    >
      <!-- @l-click="handleMapClick" -->
      <esri-tiled-map-layer
        v-for="(basemap, key) in this.$config.map.basemaps"
        :key="key"
        :url="basemap.url"
      />

      <!-- basemap labels and parcels outlines -->
      <esri-tiled-map-layer
        v-for="(tiledLayer, key) in this.$config.map.tiledLayers"
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

      <!-- <vector-marker v-for="(marker) in this.$data.rows" -->
      <vector-marker
        v-for="marker in currentMapData"
        :key="marker.key"
        :latlng="marker.latlng"
        :marker-color="marker.color"
        :icon="marker.icon"
        :feature-id="marker._featureId"
        :data="{
          featureId: marker._featureId
        }"
        @l-click="handleMarkerClick"
      >
        <pop-up-simple
          v-if="latestSelectedResourceFromMap === marker._featureId"
          :latlng="marker.latlng"
          :feature-id="marker._featureId"
        >
          <dom-util
            :popup-data="marker.organization_name"
            @testfuncEmit="toggleMap"
          />
        </pop-up-simple>
      </vector-marker>

      <!-- <pop-up-simple v-if="this.shouldShowPopup">
      </pop-up-simple> -->
    </Map_>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
// import all fontawesome icons included in phila-vue-mapping
import * as faMapping from '@philly/vue-mapping/src/fa';
import Map_ from '@philly/vue-mapping/src/leaflet/Map.vue';
import PopUpSimple from '@philly/vue-mapping/src/leaflet/PopUpSimple.vue';
import DomUtil from '@philly/vue-mapping/src/leaflet/DomUtil.vue';
// import PopUpContent from '@philly/vue-mapping/src/leaflet/PopUpContent.vue';


export default {
  components: {
    Map_,
    PopUpSimple,
    DomUtil,
    // PopUpContent,
    EsriTiledMapLayer: () => import(/* webpackChunkName: "pvm_EsriTiledMapLayer" */'@philly/vue-mapping/src/esri-leaflet/TiledMapLayer.vue'),
    VectorMarker: () => import(/* webpackChunkName: "mbmp_pvm_VectorMarker" */'@philly/vue-mapping/src/components/VectorMarker.vue'),
  },
  data() {
    const data = {
      rows: [],
    };
    return data;
  },
  computed: {
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
      return this.$store.state.currentData;
    },
    currentMapData() {
      // console.log('currentMapData computed is recalculating');
      const newRows = [];
      for (const row of [ ...this.currentData ]) {
        let markerColor; let
          markerSize;
        if (this.selectedResources.includes(row._featureId)) {
          markerColor = '#2176d2';
          markerSize = 40;
        } else {
          markerColor = 'purple';
          markerSize = 20;
        }
        if (row.lat) {
          row.latlng = [ row.lat, row.lon ];
          row.color = markerColor;
          row.icon = {
            prefix: 'fas',
            icon: 'map-marker-alt',
            shadow: false,
            size: markerSize,
          };
          newRows.push(row);
        }
      }
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
    intersectingFeatures() {
      return this.$store.state.map.intersectingFeatures;
    },
    shouldShowPopup() {
      if (this.intersectingFeatures.length > 0) {
        return true;
      } 
      return false;
      
    },
  },
  watch: {
    latestSelectedResourceFromExpand(nextLatestSelectedResource) {
      if (nextLatestSelectedResource) {
        const { rows } = this.$store.state.sources[this.$appType].data;
        const dataValue = rows.filter(row => row._featureId === nextLatestSelectedResource);
        let geocodeZoom = 19;
        if (this.$config.map.geocodeZoom) {
          geocodeZoom = this.$config.map.geocodeZoom;
        }
        const { map } = this.$store.state.map;
        map.setView([ dataValue[0].lat, dataValue[0].lon ], geocodeZoom);
      }
    },
    latestSelectedResourceFromMap(nextLatestSelectedResource) {
      let test = document.getElementById('customPopup');
      console.log('in watch latestSelectedResourceFromMap, test:', test);
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    // handleMapClick() {
    //   console.log('mapClick!');
    // },
    testfunc() {
      console.log('testfunc is running');
    },
    handleMarkerClick(e) {
      const { target } = e;
      const { featureId } = target.options.data;
      
      console.log('markerClick, featureId', featureId);
      const selectedResource = [ ...this.selectedResources ];
      if (selectedResource.includes(featureId)) {
        // console.log('markerClick close marker, featureId', featureId);
        selectedResource.splice(selectedResource.indexOf(featureId), 1);
        this.$store.commit('setLatestSelectedResourceFromMap', null);
      } else {
        // console.log('markerClick open marker, featureId', featureId);
        selectedResource.push(featureId);
        // if (window.innerWidth < 750) {
        // this.$emit('trigger-marker-click', 'test');
        this.$store.commit('setLatestSelectedResourceFromMap', featureId);
        // }
      }
      this.$store.commit('setSelectedResources', selectedResource);
    },
    handleResize(event) {
      this.$store.state.map.map.invalidateSize();
    },
    toggleMap() {
      this.$emit('toggle', 'test');
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
</style>
