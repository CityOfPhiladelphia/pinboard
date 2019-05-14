<template>
  <div id="app" class="grid-y medium-grid-frame">
    <PhilaHeader
      :app-title="this.$config.app.title"
      :app-tag-line="this.$config.app.tagLine" />

    <RefinePanel
      v-if="isMapVisible"/>

    <div class="cell medium-auto medium-cell-block-container">
      <div class="grid-x">
        <LocationsPanel
          v-if="isMapVisible"/>
        <MapPanel
          v-if="$mq === 'lg' || !isMapVisible"/>
      </div>
    </div>

    <PhilaButton
      class="button toggle-map hide-for-medium"
      @click.native="toggleMap"
      buttonText="Toggle map"/>
    <PhilaFooter />
  </div>
</template>
<script>
/* eslint-disable no-console */
import PhilaButton from './components/PhilaButton.vue'
import PhilaHeader from './components/PhilaHeader.vue'
import PhilaFooter from './components/PhilaFooter.vue'
import RefinePanel from './components/RefinePanel.vue'
import LocationsPanel from './components/LocationsPanel.vue'
import MapPanel from './components/MapPanel.vue'

export default {
  data() {
    return {
      isMapVisible: true,
    }
  },
  name: 'App',
  components: {
    PhilaButton,
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
  methods: {
    toggleMap() {
      console.log('toggle')
      console.log(this.isMapVisible)
      this.$data.isMapVisible = !this.$data.isMapVisible
    },
  },
}
</script>

<style lang="scss">
@import "@/scss/global.scss";

//TODO, move to standards
@each $value in $colors {
  //sass-lint:disable-block no-important
  .#{nth($value, 1)} {
    color: nth($value, 2) !important;
  }
  .bg-#{nth($value, 1)} {
    background-color: nth($value, 2) !important;
  }
  .bdr-#{nth($value, 1)} {
    border-color: nth($value, 2) !important;
  }
}

.no-scroll{
  overflow: hidden;
  height: 100vh;
}
.toggle-map{
  position: fixed;
  bottom:0;
  width: 100%;
  z-index: 1000;
}
</style>
