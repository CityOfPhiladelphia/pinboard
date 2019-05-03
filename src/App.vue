<template>
  <div id="app" class="grid-y medium-grid-frame">
    <PhilaHeader
      :app-title="this.$config.app.title"
      :app-tag-line="this.$config.app.tagLine"
    />

    <router-view/>

    <RefinePanel
    />

    <div class="cell medium-auto medium-cell-block-container">
      <div class="grid-x">
        <LocationsPanel
        />
        <MapPanel
        />
      </div>
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
    if (this.$config.dataSources) {
      this.$controller.dataManager.fetchData();
    }
  },
}
</script>

<style lang="scss">
//@import "@/scss/global.scss";

</style>
