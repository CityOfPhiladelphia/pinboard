<template>
  <div id="app" class="grid-y medium-grid-frame">
    <PhilaHeader
      :app-title="this.$config.app.title"
      :app-tag-line="this.$config.app.tagLine">
      <RefinePanel slot="after-stripe" />
    </PhilaHeader>

    <div class="cell medium-auto medium-cell-block-container main-content">
      <div class="grid-x">
        <LocationsPanel
          v-show="isMapVisible || isLarge" />
          <MapPanel
          v-show="!isMapVisible || isLarge" />
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
      isLarge: true,
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
    this.onResize();
  },
  methods: {
    toggleMap() {
      if (window.innerWidth > 749) {
        this.$data.isMapVisible = true
      } else {
        this.$data.isMapVisible = !this.$data.isMapVisible
      }
    },
    onResize() {
      if (window.innerWidth > 749) {
        this.$data.isMapVisible = true
        this.$data.isLarge = true
      } else {
        this.$data.isLarge = false
      }
    },
  },
  created() {
    window.addEventListener('resize', this.onResize)
    console.log('resize, created')
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
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
@media screen and (max-width: 749px) {
  .main-content{
    margin-top:9rem;
    margin-bottom:2rem;
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
  z-index: 1002;
}
</style>
