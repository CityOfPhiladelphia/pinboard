<template>
  <div class="cell medium-12 medium-cell-block-y mb-panel mb-panel-map map-height">

    <Map_ id="map-tag"
          :center="this.$store.state.map.center"
          :zoom="this.$store.state.map.zoom"
          zoom-control-position="bottomright"
          :min-zoom="11"
          :max-zoom="22"
    >
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

      <vector-marker v-for="(marker) in filteredData"
                    :latlng="marker.latlng"
                    :key="marker.key"
                    :markerColor="marker.color"
                    :icon="marker.icon"
                    :_featureId="marker._featureId"
      />

    </Map_>


  </div>
</template>

<script>
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
import 'leaflet/dist/leaflet.css';
// import all fontawesome icons included in phila-vue-mapping
import * as faMapping from '@philly/vue-mapping/src/fa';
import Map_ from '@philly/vue-mapping/src/leaflet/Map.vue';
import { point } from '@turf/helpers';
import buffer from '@turf/buffer';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

export default {
  created() {
    // Fetch Data
    this.getMarkerData();
  },
  components: {
    Map_,
    EsriTiledMapLayer: () => import(/* webpackChunkName: "pvm_EsriTiledMapLayer" */'@philly/vue-mapping/src/esri-leaflet/TiledMapLayer.vue'),
    VectorMarker: () => import(/* webpackChunkName: "mbmp_pvm_VectorMarker" */'@philly/vue-mapping/src/components/VectorMarker.vue'),
  },
  data() {
    const data = {
      rows: [],
      buffer: null,
    }
    return data;
  },
  watch: {
    geocodeStatus(nextGeocodeStatus) {
      // console.log('watch geocodeStatus firing:', nextGeocodeStatus);
      if (nextGeocodeStatus === 'success') {
        // console.log('if success passed, this.geocodeGeom:', this.geocodeGeom);
        const geocodePoint = point(this.geocodeGeom.coordinates);
        const pointBuffer = buffer(geocodePoint, 1, { units: 'miles' });
        this.$data.buffer = pointBuffer;
      } else if (nextGeocodeStatus === null) {
        // console.log('if null passed');
        this.$data.buffer = null;
      }
    },
    filteredData(nextFilteredData) {
      // console.log('nextFilteredData:', nextFilteredData);
      this.$store.commit('setBufferList', nextFilteredData.map(row => row._featureId));
      // this.$store.commit('setBufferList', nextFilteredData);
    },
  },
  computed: {
    filteredData() {
      const filteredRows = []
      if (this.$data.buffer === null) {
        // console.log('computed filteredData is running, buffer is null');
        return this.$data.rows;
      }
      // console.log('computed filteredData is running, buffer is not null');
      for (const row of this.$data.rows) {
        const rowPoint = point([row.lon, row.lat])
        if (booleanPointInPolygon(rowPoint, this.$data.buffer)) {
          filteredRows.push(row)
        }
      }

      return filteredRows;
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
        }
        const addressMarker = {
          latlng, key, color, markerType, icon,
        };
        markers.push(addressMarker);
      }
      return markers;
    },
  },
  methods: {
    async getMarkerData() {
      const response = await (this.$store.state.sources.immigrant === 'success');

      const promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve('done!'), 1000)
      });

      const result = await promise; // wait till the promise resolves (*)

      const refineData = this.$store.state.sources.immigrant.data.rows
      const newRows = [];
      for (const rm of refineData) {
        if (rm.lat) {
          rm.latlng = [rm.lat, rm.lon];
          rm.color = 'purple';
          rm.icon = {
            prefix: 'fas',
            icon: 'map-marker-alt',
            shadow: false,
            size: 20,
          }
          newRows.push(rm);
        }
      }
      this.rows = newRows;
      return Promise.resolve();
    },

    handleResize(event) {
      this.$store.state.map.map.invalidateSize();
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style>
@media screen and (max-width: 749px) {
  .map-container{
    min-height: 100vh !important;
  }
}
</style>
