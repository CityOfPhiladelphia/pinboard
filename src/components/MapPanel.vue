<template>
  <div class="cell medium-12 medium-cell-block-y mb-panel mb-panel-map map-height">

    <Map_ id="map-tag"
          :center="[-75.163471, 39.953338]"
          :zoom="12"
          zoom-control-position="bottomright"
          :min-zoom="11"
          :max-zoom="22"
    >
      <esri-tiled-map-layer v-for="(basemap, key) in this.$config.map.basemaps"
                            :key="key"
                            :url="basemap.url"
      />
      <!-- v-if="activeBasemap === key" -->

      <!-- basemap labels and parcels outlines -->
      <esri-tiled-map-layer v-for="(tiledLayer, key) in this.$config.map.tiledLayers"
                            :key="key"
                            :url="tiledLayer.url"
                            :zIndex="tiledLayer.zIndex"
      />
      <!-- v-if="tiledLayers.includes(key)" -->
      <vector-marker v-for="(marker) in this.$data.rows"
                     :latlng="marker.latlng"
                     :key="marker.key"
                     :markerColor="marker.color"
                     :icon="marker.icon"
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
    }
    return data;
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
  },
  //   // resizeMap() {
  //   //   window.onresize = function (event) {
  //   //     console.log(event)
  //   //     Map_.invalidateSize()
  //   //   }
  //   // },
  // },
}
</script>

<style>
.map-height{
  min-height: 100vh;
}
</style>
