<template>
  <div id="app">
    <PhilaHeader
      :app-title="this.$config.app.title"
      :app-tag-line="this.$config.app.tagLine"
    />

    <router-view/>

    <RefinePanel
    />

    <div class="grid-x">
      <LocationsPanel
      />
      <MapPanel
      />
    </div>


    <PhilaFooter
    />
    </div>
</template>
<script>
/* eslint-disable no-console */
import PhilaHeader from './components/PhilaHeader.vue'
import PhilaFooter from './components/PhilaFooter.vue'
import RefinePanel from './components/RefinePanel.vue'
import LocationsPanel from './components/LocationsPanel.vue'
import MapPanel from './components/MapPanel.vue'

export default {
  name: 'App',
  components: {
    PhilaHeader,
    PhilaFooter,
    RefinePanel,
    LocationsPanel,
    MapPanel,
  },
  mounted() {
    console.log('in App.vue mounted, this.$config:', this.$config);
  },
}
</script>

<style lang="scss">
//@import "@/scss/global.scss";

</style>
