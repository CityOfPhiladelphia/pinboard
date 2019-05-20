<template>
  <div class="cell medium-12 medium-cell-block-y mb-panel mb-panel-map map-height">

    <Map_ id="map-tag"
          :center="this.$store.state.map.center"
          :zoom="this.$store.state.map.zoom"
          zoom-control-position="bottomright"
          :min-zoom="11"
          :max-zoom="22"
    >
    <!-- @l-click="handleMapClick" -->
      <esri-tiled-map-layer v-for="(basemap, key) in this.$config.map.basemaps"
                            :key="key"
                            :url="basemap.url"
      />

      <!-- basemap labels and parcels outlines -->
      <esri-tiled-map-layer v-for="(tiledLayer, key) in this.$config.map.tiledLayers"
                            :key="key"
                            :url="tiledLayer.url"
                            :zIndex="tiledLayer.zIndex"
      />

      <vector-marker v-for="(marker) in markersForAddress"
                     :latlng="marker.latlng"
                     :key="marker.key"
                     :markerColor="marker.color"
                     :icon="marker.icon"
      />

      <!-- <vector-marker v-for="(marker) in this.$data.rows" -->
      <vector-marker v-for="marker in currentMapData"
                    :latlng="marker.latlng"
                    :key="marker.key"
                    :markerColor="marker.color"
                    :icon="marker.icon"
                    :_featureId="marker._featureId"
                    @l-click="handleMarkerClick"
                    :data="{
                      featureId: marker._featureId
                    }"
      />

    </Map_>


  </div>
</template>

<script>
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import 'leaflet/dist/leaflet.css';
// import all fontawesome icons included in phila-vue-mapping
import * as faMapping from '@philly/vue-mapping/src/fa';
import Map_ from '@philly/vue-mapping/src/leaflet/Map.vue';

export default {
  components: {
    Map_,
    EsriTiledMapLayer: () => import(/* webpackChunkName: "pvm_EsriTiledMapLayer" */'@philly/vue-mapping/src/esri-leaflet/TiledMapLayer.vue'),
    VectorMarker: () => import(/* webpackChunkName: "mbmp_pvm_VectorMarker" */'@philly/vue-mapping/src/components/VectorMarker.vue'),
  },
  data() {
    const data = {
      rows: [],
    };
    return data;
  },
  watch: {
  },
  computed: {
    selectedResources() {
      return this.$store.state.selectedResources;
    },
    currentData() {
      return this.$store.state.currentData;
    },
    currentMapData() {
      // console.log('currentMapData computed is recalculating');
      const newRows = [];
      for (const row of [...this.currentData]) {
        let markerColor; let
          markerSize;
        if (this.selectedResources.includes(row._featureId)) {
          markerColor = 'orange';
          markerSize = 40;
        } else {
          markerColor = 'purple';
          markerSize = 20;
        }
        if (row.lat) {
          row.latlng = [row.lat, row.lon];
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
        const latlng = [...geocodeGeom.coordinates].reverse();
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
  },
  methods: {
    // handleMapClick() {
    //   console.log('mapClick!');
    // },
    handleMarkerClick(e) {
      const { target } = e;
      const { featureId } = target.options.data;
      // console.log('markerClick, featureId', featureId);
      const selectedResource = [...this.selectedResources];
      if (selectedResource.includes(featureId)) {
        selectedResource.splice(selectedResource.indexOf(featureId), 1);
      } else {
        selectedResource.push(featureId);
      }
      this.$store.commit('setSelectedResources', selectedResource);
    },
    handleResize(event) {
      this.$store.state.map.map.invalidateSize();
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
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
