<template>
  <div
    id="app"
    class="grid-y small-grid-frame medium-grid-frame"
  >
    <PhilaModal
      v-show="isModalOpen"
      @close="closeModal"
    >
      <div slot="body">
        <p>The resource finder helps you locate services related to a particular topic. You can browse the list of providers, search by keyword or address, and narrow your results by category.</p>

        <p>The providers are listed alphabetically. To learn about what they offer and where they are, select their name. This will expand their listing and locate them on the map. You can also:
          <ul>
        <li><b>Search by location or keyword.</b> To find service providers near you, select “Address” in the dropdown and enter a street address. To search for a specific term, select “Keyword” in the dropdown and enter your term.</li>
        <li><b>Choose a category.</b> If you’re looking for a specific type of resource, select the appropriate topic under “Filter list by category.” You can pick multiple categories.</li>
          </ul></p>
        <p>If you’re interested in a particular service or resource, contact the provider to learn more and confirm that it’s still available.</p>

      </div>
    </PhilaModal>
    <PhilaHeader
      :app-title="this.$config.app.title"
      :app-tag-line="this.$config.app.tagLine"
      :app-logo="`${publicPath}logo.png`"
      :app-logo-alt="this.$config.app.logoAlt"
      :app-link="this.appLink"
    >

      <AlertBanner
        slot="alert-banner"
        v-if="this.$config.alerts && this.$config.alerts.header != null"
      >
      </AlertBanner>

      <div slot="mobile-menu">
        <PhilaFooter
          @howToUseLink="toggleModal()"
        />
      </div>

      <RefinePanel
        slot="after-stripe"
        :infoCircles="this.$config.infoCircles"
      />

      <!-- <component
        :is="this.$config.alerts.header"
      /> -->
      <!-- v-if="this.$config.alerts && this.$config.alerts.header != null" -->

    </PhilaHeader>

    <!-- <div class="cell medium-auto medium-cell-block-container main-content"> -->
    <div class="cell medium-auto medium-cell-block-container">
      <div
        v-show="!refineOpen"
        class="grid-x middle-panel"
      >
        <LocationsPanel
          v-show="!isMapVisible || isLarge"
          :is-map-visible="this.$data.isMapVisible"
        />
        <MapPanel
          v-show="isMapVisible || isLarge"
          @toggleMap="toggleMap"
        >
          <cyclomedia-widget
            v-if="this.shouldLoadCyclomediaWidget"
            v-show="cyclomediaActive"
            slot="cycloWidget"
            screen-percent="2"
          />
        </MapPanel>
      </div>
    </div>

    <PhilaButton
      v-if="!i18nEnabled"
      class="button toggle-map hide-for-medium"
      @click.native="toggleMap"
    >
      {{ buttonText }}
    </PhilaButton>

    <PhilaButton
      v-if="i18nEnabled"
      class="button toggle-map hide-for-medium"
      @click.native="toggleMap"
      v-html="$t(buttonText)"
    />

    <PhilaFooter
      v-show="isLarge"
      @howToUseLink="toggleModal()"
    />
  </div>
</template>
<script>

import { point } from '@turf/helpers';
import buffer from '@turf/buffer';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

import PhilaButton from './components/PhilaButton.vue';
import PhilaHeader from './components/PhilaHeader.vue';
import AlertBanner from './components/AlertBanner.vue';
import i18nBanner from './components/i18nBanner.vue';
import PhilaFooter from './components/PhilaFooter.vue';
import PhilaModal from './components/PhilaModal.vue';
import RefinePanel from './components/RefinePanel.vue';
import LocationsPanel from './components/LocationsPanel.vue';
import MapPanel from './components/MapPanel.vue';

export default {
  name: 'App',
  components: {
    PhilaButton,
    PhilaHeader,
    AlertBanner,
    i18nBanner,
    PhilaFooter,
    PhilaModal,
    RefinePanel,
    LocationsPanel,
    MapPanel,
    CyclomediaWidget: () => import(/* webpackChunkName: "mbmb_pvm_CyclomediaWidget" */'@phila/vue-mapping/src/cyclomedia/Widget.vue'),
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      isMapVisible: false,
      isModalOpen: false,
      isLarge: true,
      buffer: null,
      buttonText: 'Toggle to map',
      appLink: '/',
    };
  },
  computed: {
    i18nEnabled() {
      if (this.$config.i18n && this.$config.i18n.app) {
        return true;
      } else {
        return false;
      }
    },
    refineOpen() {
      return this.$store.state.refineOpen;
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
    bufferList() {
      return this.$store.state.bufferList;
    },
    selectedKeywords() {
      return this.$store.state.selectedKeywords;
    },
    selectedServices() {
      return this.$store.state.selectedServices;
    },
    dataStatus() {
      return this.$store.state.sources[this.$appType].status;
    },
    dataTest() {
      console.log('computed dataTest is running');
      return this.$store.state.sources[this.$appType].data.rows;
    },
    database() {
      let database = this.$store.state.sources[this.$appType].data.rows || this.$store.state.sources[this.$appType].data.features || this.$store.state.sources[this.$appType].data;
      // console.log('computed database is running, database:', database);

      for (let [key, value] of Object.entries(database)) {
        for (let [rowKey, rowValue] of Object.entries(value)) {
          if ( rowKey == 'hide_on_finder' && rowValue == true ){
            //console.log('deleted entry', database[key])
            delete database[key]
          }
        }
      }
      //filter empty values from deleted database
      let finalDB = database.filter(_ => true);

      // if (this.$store.state.sources[this.$appType].data.rows) {
      return finalDB;
      // } else if (this.$store.state.sources[this.$appType].data.features) {
      //   return this.$store.state.sources[this.$appType].data.features;
      // } else {
      //   return this.$store.state.sources[this.$appType].data;
      // }
    },
    shouldLoadCyclomediaWidget() {
      return this.$config.cyclomedia.enabled && !this.isMobileOrTablet;
    },
    cyclomediaActive() {
      return this.$store.state.cyclomedia.active;
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
    selectedResources() {
      return this.$store.state.selectedResources;
    },
    sourcesWatched() {
      let sources = Object.keys(this.$store.state.sources);
      const index = sources.indexOf('compiled');
      if (index > -1) {
        sources.splice(index, 1);

        let sourcesWatched = [];

        for (let source of sources) {
          sourcesWatched.push(this.$store.state.sources[source].data);
        }
        return sourcesWatched;
      } else {
        return null
      }
    },
  },
  watch: {
    sourcesWatched(nextSourcesWatched) {
      console.log('watch sourcesWatched, nextSourcesWatched:', nextSourcesWatched);
      if (!nextSourcesWatched.includes(null)) {
        this.setUpData(nextSourcesWatched);
      }
    },
    geocodeStatus(nextGeocodeStatus) {
      if (nextGeocodeStatus === 'success') {
        this.runBuffer();
      } else if (nextGeocodeStatus === null) {
        this.$data.buffer = null;
      }
    },
    buffer() {
      this.filterPoints();
    },
    selectedServices() {
      if (this.$store.state.sources[this.$appType].data) {
        this.filterPoints();
      }
    },
    selectedKeywords() {
      if (this.$store.state.sources[this.$appType].data) {
        this.filterPoints();
      }
    },
    dataStatus(nextDataStatus) {
      if (nextDataStatus === 'success') {
        this.filterPoints();
      }
    },
  },
  mounted() {
    console.log('in App.vue mounted, this.$config:', this.$config, 'window.location.href:', window.location.href);
    if (this.$config.appLink) {
      this.appLink = this.$config.appLink;
    } else {
      this.appLink = '.';
    }
    if (this.$config.dataSources) {
      this.$controller.dataManager.fetchData();
    }

    if (!this.i18nEnabled) {
      this.$data.buttonText = this.$data.isMapVisible ? 'Toggle to resource list' : 'Toggle to map';
    } else {
      // this.$data.buttonText = this.$data.isMapVisible ? 'viewMap' : 'viewList';
      this.$data.buttonText = this.$data.isMapVisible ? 'viewList' : 'viewMap';
    }

    // this.$i18n.locale = 'es';
    // let compiledDataSource = [];
    // if (Object.keys(this.$config.dataSources).length > 1) {
    //   console.log('this.$store.state.sources:', this.$store.state.sources);
    //   for (let source of Object.keys(this.$store.state.sources)) {
    //     console.log('this.$store.state.sources[source].data:', this.$store.state.sources[source].data);
    //     compiledDataSource.push(this.$store.state.sources[source].data.features);
    //   }
    // }
    // console.log('compiledDataSource:', compiledDataSource);

    // this.setUpData();

    this.onResize();
  },
  created() {
    window.addEventListener('resize', this.onResize);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    togglei18nMenu() {
      console.log('App.vue togglei18nMenu is running');
    },
    setUpData(theSources) {
      console.log('Pinboard App.vue setUpData is running, theSources:', theSources);
      let compiled = {
        key: 'compiled',
        data: [],
        status: 'success',
      }
      if (theSources.length > 1) {
        console.log('this.$store.state.sources:', this.$store.state.sources);
        for (let source of theSources) {
          // console.log('source:', source, 'this.$store.state.sources[source].data:', this.$store.state.sources[source].data);
          // for (let point of this.$store.state.sources[source].data.features) {
          for (let point of source.features) {
            // console.log('point:', point);
            Object.assign(point, point.attributes);
            point.attributes = undefined;
            compiled.data.push(point);
          }
        }
        console.log('compiled:', compiled);
        this.$store.commit('setSourceData', compiled);
        this.$store.commit('setSourceStatus', compiled);
      }
    },
    runBuffer() {
      const geocodePoint = point(this.geocodeGeom.coordinates);
      const pointBuffer = buffer(geocodePoint, 1, { units: 'miles' });
      this.$data.buffer = pointBuffer;
    },
    filterPoints() {
      // console.log('App.vue filterPoints is running, this.database:', this.database);
      const filteredRows = [];

      for (const row of this.database) {
        // console.log('row:', row);
        let booleanServices;
        // console.log('row.services_offered:', row.services_offered);
        // const servicesSplit = row.services_offered.split(',');
        let servicesSplit;
        if (row.services_offered) {
          servicesSplit = row.services_offered;
        } else if (row.attributes.category_type) {
          servicesSplit = [row.attributes.category_type];
        }
        // console.log('servicesSplit:', servicesSplit);
        const { selectedServices } = this.$store.state;
        if (selectedServices.length === 0) {
          booleanServices = true;
        } else {
          const servicesFiltered = servicesSplit.filter(f => selectedServices.includes(f));
          booleanServices = servicesFiltered.length > 0;
        }

        let booleanBuffer = false;
        if (!this.$data.buffer) {
          // console.log('!this.$data.buffer');
          booleanBuffer = true;
        // } else if (typeof row.lon === 'number' && row.lon !== null) {
        } else if (row.latlng) {
          if (typeof row.latlng[0] === 'number' && row.latlng[0] !== null) {
            // const rowPoint = point([ row.lon, row.lat ]);
            const rowPoint = point([ row.latlng[1], row.latlng[0] ]);
            if (booleanPointInPolygon(rowPoint, this.$data.buffer)) {
              booleanBuffer = true;
            }
          }
        }

        let booleanKeywords = true;
        if (this.selectedKeywords.length > 0) {
          booleanKeywords = false;
          // console.log('row:', row);
          const description = row.tags;
          // const description = row.tags.split(/,| /);
          const keywordsFiltered = this.selectedKeywords.filter(f => description.includes(f));
          if (keywordsFiltered.length > 0) {
            booleanKeywords = true;
          }
        }

        if (booleanServices && booleanBuffer && booleanKeywords) {
          filteredRows.push(row);
        }
      }
      this.$store.commit('setCurrentData', filteredRows);
    },
    toggleMap() {
      if (window.innerWidth > 749) {
        this.$data.isMapVisible = true;
      } else {
        this.$data.isMapVisible = !this.$data.isMapVisible;
      }
      if (!this.i18nEnabled) {
        this.$data.buttonText = this.$data.isMapVisible ? 'Toggle to resource list' : 'Toggle to map';
      } else {
        this.$data.buttonText = this.$data.isMapVisible ? 'viewList' : 'viewMap';
      }
    },
    toggleModal() {
      this.isModalOpen = !this.isModalOpen;
      this.toggleBodyClass('no-scroll');
    },
    showModal() {
      this.isModalOpen = true;
      this.toggleBodyClass('no-scroll');
    },
    closeModal() {
      this.isModalOpen = false;
      this.toggleBodyClass('no-scroll');
    },
    toggleBodyClass(className) {
      const el = document.body;
      return this.isOpen ? el.classList.add(className) : el.classList.remove(className);
    },
    onResize() {
      if (window.innerWidth > 749) {
        this.$data.isMapVisible = true;

        if (!this.i18nEnabled) {
          this.$data.buttonText = this.$data.isMapVisible ? 'Toggle to resource list' : 'Toggle to map';
        } else {
          this.$data.buttonText = this.$data.isMapVisible ? 'viewList': 'viewMap';
        }
        this.$data.isLarge = true;
      } else {
        this.$data.isLarge = false;
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/scss/global.scss";

.toggle-map{
  margin:0 !important;
}
.main-content{
  margin-top:.5rem;
}

.middle-panel {
  height: 100%;
}

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

.step-group{
  margin-left:$spacing-medium;

  .step-label {
    @include secondary-font(400);
    display: inline-block;
    margin-left: -$spacing-medium;
    background: black;
    border-radius: $spacing-extra-large;
    color:white;
    padding: 0 $spacing-small;
    width:$spacing-large;
    height:$spacing-large;
    line-height: $spacing-large;
    text-align: center;
  }
  .step{
    margin-top: -$spacing-large;
    padding-left: $spacing-large;
    padding-bottom: $spacing-large;
    border-left:1px solid black;

    &:last-of-type {
      border:none;
    }

    .step-title{
      @include secondary-font(400);
      font-size:1.2rem;
      margin-bottom: $spacing-small;
    }
  }
}
</style>
