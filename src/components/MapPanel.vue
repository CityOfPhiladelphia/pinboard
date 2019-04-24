<template>
  <div class="cell medium-12 purple-div height100 mb-panel mb-panel-map">

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
    </Map_>


  </div>
</template>

<script>
/* eslint-disable import/no-extraneous-dependencies */
import 'leaflet/dist/leaflet.css';
import Map_ from '@philly/vue-mapping/src/leaflet/Map.vue';

export default {
  components: {
    Map_,
    EsriTiledMapLayer: () => import(/* webpackChunkName: "pvm_EsriTiledMapLayer" */'@philly/vue-mapping/src/esri-leaflet/TiledMapLayer.vue'),
  },
}
</script>

<style>
</style>
