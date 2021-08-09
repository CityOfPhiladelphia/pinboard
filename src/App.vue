<template>

  <div
    id="app"
    class="app"
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

    <PhilaModal
      v-show="isAlertModalOpen"
      @close="closeModal"
    >
      <div
        slot="header"
        v-html="alertModalHeader"
      />
      <div
        slot="body"
        v-html="alertModalBody"
      />
    </PhilaModal>

    <app-header
      :app-title="$config.app.title"
      :is-sticky="true"
      :branding-image="brandingImage"
      :branding-link="brandingLink"
    >
      <mobile-nav slot="mobile-nav">
        <ul>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
        </ul>
      </mobile-nav>
      <input-form slot="textbox-form">
        <div class="columns">
          <textbox
            v-model="myValue"
            class="column is-10"
            placeholder="Search an address"
            label="Search an address in Philadelphia"
          />
          <button
            slot="submit"
            class="button is-dark is-large"
            @click.prevent="handleSubmit"
          >
            Submit
          </button>
        </div>
      </input-form>
    </app-header>

    <refine-panel>
    </refine-panel>

    <main
      class="main no-padding"
    >

      <div
        v-show="!refineOpen"
        id="column-div"
        class="columns is-mobile"
      >
      <!-- class="grid-x middle-panel" -->

        <div
          v-show="isTablet || isDesktop || !isMapVisible"
          class="column overflows"
        >
          <locations-panel />
          <!-- <LocationsPanel
            v-show="!isMapVisible || isLarge"
            :is-map-visible="this.$data.isMapVisible"
          /> -->
        </div>

        <div
          v-show="isTablet || isDesktop || isMapVisible"
          class="column no-padding"
        >
          <map-panel />
          <!-- <MapPanel
          v-show="isMapVisible || isLarge"
          @toggleMap="toggleMap"
          >
          <cyclomedia-widget
          v-if="this.shouldLoadCyclomediaWidget"
          v-show="cyclomediaActive"
          slot="cycloWidget"
          screen-percent="2"
          />
        </MapPanel> -->

        </div>

      </div>

    </main>

    <button
      id="switch-button"
      class="button is-sticky-to-bottom full-screen is-primary is-hidden-tablet"
      @click="toggleMap"
    >
      switch button
    </button>

    <!-- <PhilaButton
      v-if="!i18nEnabled"
      class="button toggle-map hide-for-medium"
      @click.native="toggleMap"
    >
      {{ buttonText }}
    </PhilaButton> -->

    <!-- <PhilaButton
      v-if="i18nEnabled"
      class="button toggle-map hide-for-medium"
      @click.native="toggleMap"
      v-html="$t(buttonText)"
    /> -->

    <app-footer
      :is-sticky="true"
      :is-hidden-mobile="true"
    >
      <ul>
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/terms-and-conditions">Terms & Conditions</a>
        </li>
      </ul>
    </app-footer>

    <!-- <PhilaFooter
      v-show="isLarge"
      :feedbackLink="feedbackLink"
      @howToUseLink="toggleModal()"
    /> -->

  </div>

</template>

<script>

import 'maplibre-gl/dist/maplibre-gl.css';

import Fuse from 'fuse.js'

import { point } from '@turf/helpers';
import buffer from '@turf/buffer';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

import PhilaButton from './components/PhilaButton.vue';
import PhilaHeader from './components/PhilaHeader.vue';
import AlertBanner from './components/AlertBanner.vue';
import i18nBanner from './components/i18nBanner.vue';
import PhilaModal from './components/PhilaModal.vue';
import RefinePanel from './components/RefinePanel.vue';
import LocationsPanel from './components/LocationsPanel.vue';
import MapPanel from './components/MapPanel.vue';

import AppHeader from './components/AppHeader';
import {
  MobileNav,
  AppFooter,
  InputForm,
  Textbox,
} from '@phila/phila-ui';

export default {
  name: 'App',
  components: {
    AppHeader,
    MobileNav,
    AppFooter,
    InputForm,
    Textbox,
    PhilaButton,
    AlertBanner,
    i18nBanner,
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
      isAlertModalOpen: false,
      isLarge: true,
      buffer: null,
      buttonText: 'Toggle to map',
      appLink: '/',
    };
  },
  computed: {
    feedbackLink() {
      let value;
      if (this.$config.footer && this.$config.footer.feedback && this.$config.footer.feedback.link) {
        value = this.$config.footer.feedback.link;
      }
      return value;
    },
    mapType() {
      return this.$store.state.map.type;
    },
    alertResponse() {
      return this.$store.state.alertResponse || null;
    },
    shouldShowHeaderAlert() {
      let value = false;
      if (this.$config.alerts && this.$config.alerts.header) {
        value = this.$config.alerts.header.enabled(this.$store.state);
      }
      return value;
    },
    alertModalHeader() {
      let value = '';
      if (this.$config.alerts && this.$config.alerts.modal && this.$config.alerts.modal.header) {
        value = this.$config.alerts.modal.header;
      }
      return value;
    },
    alertModalBody() {
      let value = '';
      if (this.$config.alerts && this.$config.alerts.modal && this.$config.alerts.modal.body) {
        value = this.$config.alerts.modal.body;
      }
      return value;
    },
    i18nEnabled() {
      if (this.$config.i18n && this.$config.i18n.enabled) {
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
      let value;
      if (this.$store.state.sources[this.$appType]) {
        value = this.$store.state.sources[this.$appType].status;
      }
      return value;
    },
    database() {
      let database = this.$store.state.sources[this.$appType].data.rows || this.$store.state.sources[this.$appType].data.features || this.$store.state.sources[this.$appType].data;
      // console.log('computed database is running, database:', database);

      for (let [key, value] of Object.entries(database)) {

        if (this.$config.hiddenRefine) {
          for (let field in this.$config.hiddenRefine) {
            let getter = this.$config.hiddenRefine[field];
            let val = getter(value);
            if (val === false) {
              delete database[key];
            }
          }
        }

        for (let [rowKey, rowValue] of Object.entries(value)) {
          if ( rowKey == 'hide_on_finder' && rowValue == true ){
            //console.log('deleted entry', database[key])
            delete database[key];
          }
        }

      }
      //filter empty values from deleted database
      let finalDB = database.filter(_ => true);
      return finalDB;
    },
    shouldLoadCyclomediaWidget() {
      return this.$config.cyclomedia && this.$config.cyclomedia.enabled && !this.isMobileOrTablet;
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
    isMobile(nextIsMobile) {
      if (nextIsMobile) {
        console.log('is mobile');
        this.handleResize();
      }
    },
    isTablet(nextIsTablet) {
      if (nextIsTablet) {
        console.log('is tablet');
        this.handleResize();
      }
    },
    isDesktop(nextIsDesktop) {
      if (nextIsDesktop) {
        console.log('is desktop');
        this.handleResize();
      }
    },
    isWideScreen(nextIsWidescreen) {
      if (nextIsWidescreen) {
        console.log('is widescreen');
        this.handleResize();
      }
    },
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
    console.log('in App.vue mounted, this.$store.state:', this.$store.state, 'this.$config:', this.$config, 'window.location.href:', window.location.href);
    // this.track();

    if (this.$config.appLink) {
      this.appLink = this.$config.appLink;
    } else {
      this.appLink = '.';
    }
    if (this.$config.dataSources) {
      this.$controller.dataManager.fetchData();
    }
    // this.setUpData(this.$store.state.sources);

    if (!this.i18nEnabled) {
      this.$data.buttonText = this.$data.isMapVisible ? 'Toggle to resource list' : 'Toggle to map';
    } else {
      this.$data.buttonText = this.$data.isMapVisible ? 'app.viewList' : 'app.viewMap';
    }

    if (this.$config.alerts && this.$config.alerts.modal && this.$config.alerts.modal.enabled) {
      this.isAlertModalOpen = true;
    }

    if (this.$config.comboSearch) {
      if (this.$config.comboSearch.dropdown) { //&& this.$config.comboSearch.dropdown.length === 1) {
        this.$store.commit('setSearchType', this.$config.comboSearch.dropdown[0]);
      }
    }

    if (this.$config.gtag && this.$config.gtag.category) {
      this.$store.commit('setGtagCategory', this.$config.gtag.category);
    }

    this.handleResize();
  },
  created() {
    if (this.$config.map) {
      if (this.$config.map.shouldInitialize === false) {
        this.$store.commit('setShouldInitializeMap', false);
      }
      if (this.$config.map.type) {
        this.$store.commit('setMapType', this.$config.map.type);
      }
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize () {
      console.log('handleResize is starting');
      //wait for dom to finish updating
      let isMobile = this.isMobile;
      Vue.nextTick(function () {
        let header = document.querySelector('#app-header');
        let footer = document.querySelector('#app-footer');
        let switchButton = document.querySelector('#switch-button');
        let main = document.querySelector('main');
        let refineDiv = document.querySelector('#refine-div');
        let columnDiv = document.querySelector('#column-div');
        let refineDivOffsetHeight = refineDiv.offsetHeight || 0;
        let headerOffsetHeight = header.offsetHeight || 0;
        let headerClientHeight = header.clientHeight || 0;
        let headerInnerHeight = header.clientHeight || 0;
        let footerOffsetHeight = 0;
        if (footer !== null) {
          footerOffsetHeight = footer.offsetHeight;
        }
        let switchButtonOffsetHeight = switchButton.offsetHeight;
        let offsetHeight;
        if (isMobile) {
          let offsetHeight = headerOffsetHeight  + switchButtonOffsetHeight + refineDivOffsetHeight;
          console.log('handleResize isMobile, offsetHeight:', offsetHeight, 'headerClientHeight:', headerClientHeight, 'headerOffsetHeight:', headerOffsetHeight, 'footerOffsetHeight:', footerOffsetHeight, 'switchButtonOffsetHeight:', switchButtonOffsetHeight);
        } else {
          let offsetHeight = headerOffsetHeight + footerOffsetHeight;
          let offsetHeight2 = headerOffsetHeight + refineDivOffsetHeight;
          console.log('handleResize is NOT mobile, refineDiv:', refineDiv, 'refineDivOffsetHeight:', refineDivOffsetHeight, 'offsetHeight2:', offsetHeight2, 'offsetHeight:', offsetHeight, 'headerClientHeight:', headerClientHeight, 'headerOffsetHeight:', headerOffsetHeight, 'footerOffsetHeight:', footerOffsetHeight, 'switchButtonOffsetHeight:', switchButtonOffsetHeight);
          main.style['height'] = `calc(100vh - ${offsetHeight}px)`;
          main.style['padding-bottom'] = '0px';
          main.style['margin-bottom'] = '0px';
          refineDiv.style['top'] = headerOffsetHeight + 'px';
          columnDiv.style['margin-top'] = offsetHeight2 + 'px';
          columnDiv.style['height'] = `calc(100vh - ${offsetHeight2}px)`;
        }
        // console.log('App.vue handleResize, offsetHeight:', offsetHeight, 'headerOffsetHeight:', headerOffsetHeight, 'footerOffsetHeight:', footerOffsetHeight);
        console.log('end of handleResize');
      });

    },
    setUpData(theSources) {
      // console.log('Pinboard App.vue setUpData is running, theSources:', theSources);
      let compiled = {
        key: 'compiled',
        data: [],
        status: 'success',
      }
      if (theSources.length > 1) {
        for (let source of theSources) {
          for (let point of source.features) {
            // console.log('point:', point);
            compiled.data.push(point);
          }
        }
        // console.log('compiled:', compiled);
        this.$store.commit('setSourceData', compiled);
        this.$store.commit('setSourceStatus', compiled);
      }
      // console.log('end of setUpData, this.$store.state.sources:', this.$store.state.sources);
    },
    runBuffer() {
      let searchDistance = 1;
      if (this.$config.comboSearch.searchDistance) {
        searchDistance = this.$config.comboSearch.searchDistance;
      }
      // console.log('runBuffer is running, searchDistance:', searchDistance);
      const geocodePoint = point(this.geocodeGeom.coordinates);
      const pointBuffer = buffer(geocodePoint, searchDistance, { units: 'miles' });
      this.$data.buffer = pointBuffer;
    },
    filterPoints() {
      // console.log('App.vue filterPoints is running, this.database:', this.database);
      const filteredRows = [];

      for (const row of this.database) {
        // console.log('row:', row);
        let booleanServices;
        const { selectedServices } = this.$store.state;
        // console.log('row.services_offered:', row.services_offered);

        if (this.$config.refine && this.$config.refine.type && ['multipleFields', 'multipleFieldGroups'].includes(this.$config.refine.type)) {
          let booleanConditions = [];

          if (selectedServices.length === 0) {
            booleanConditions.push(true);
          } else {

            // if refine.type = multipleFields
            if (this.$config.refine.type === 'multipleFields') {
              for (let field in this.$config.refine.multipleFields) {
                if (selectedServices.includes(field)) {

                  let getter = this.$config.refine.multipleFields[field];
                  let val = getter(row);
                  booleanConditions.push(val);
                }
              }
            } else {
              // if refine.type = multipleFieldsGroups
              let selectedGroups = [];
              for (let value of selectedServices) {
                let valueGroup = value.split('_', 1)[0]
                if (!selectedGroups.includes(valueGroup)) {
                  selectedGroups.push(valueGroup)
                }
              }
              // console.log('selectedServices:', selectedServices, 'selectedGroups:', selectedGroups);
              let groupValues = [];
              for (let group of selectedGroups) {
                let groupBooleanConditions = [];
                for (let service of selectedServices) {
                  if (service.split('_', 1)[0] === group) {
                    // console.log('service.split("_", 1)[0]:', service.split('_', 1)[0], 'service.split("_")[1]:', service.split('_')[1], 'group', group, 'this.$config.refine.multipleFieldGroups[group]', this.$config.refine.multipleFieldGroups[group], 'this.$config.refine.multipleFieldGroups[group][service.split("_")[1]]:', this.$config.refine.multipleFieldGroups[group][service.split('_')[1]]);
                    let getter = this.$config.refine.multipleFieldGroups[group][service.split('_')[1]]['value'];
                    let val = getter(row);
                    groupBooleanConditions.push(val);
                  }
                }
                if (groupBooleanConditions.includes(true)) {
                  booleanConditions.push(true);
                } else {
                  booleanConditions.push(false);
                }
              }
            }
          }
          // console.log('booleanConditions:', booleanConditions);
          if (!booleanConditions.includes(false)) {
            booleanServices = true
          }

        // if refine.type = categoryField_value
        } else if (this.$config.refine && this.$config.refine.type === 'categoryField_value') {
          if (selectedServices.length === 0) {
            booleanServices = true;
          } else {
            let value = this.$config.refine.value(row);
            booleanServices = selectedServices.includes(value);
          }

        } else {
          // the original default version, or refine.type = 'categoryField_array'
          let servicesSplit;
          if (this.$config.refine) {
            servicesSplit = this.$config.refine.value(row);
          } else if (row.services_offered) {
            servicesSplit = row.services_offered;
          }

          if (selectedServices.length === 0) {
            booleanServices = true;
          } else {
            const servicesFiltered = servicesSplit.filter(f => selectedServices.includes(f));
            // console.log('servicesFiltered:', servicesFiltered, 'selectedServices:', selectedServices);
            // booleanServices = servicesFiltered.length > 0;
            booleanServices = servicesFiltered.length == selectedServices.length;
          }
        }

        let booleanBuffer = false;
        if (!this.$data.buffer) {
          // console.log('!this.$data.buffer');
          booleanBuffer = true;
        } else if (row.latlng) {
          if (typeof row.latlng[0] === 'number' && row.latlng[0] !== null) {
            const rowPoint = point([ row.latlng[1], row.latlng[0] ]);
            if (booleanPointInPolygon(rowPoint, this.$data.buffer)) {
              booleanBuffer = true;
            }
          }
        }

        let booleanKeywords = true;
        // console.log('this.selectedKeywords:', this.selectedKeywords, 'this.selectedKeywords.length:', this.selectedKeywords.length);
        if (this.selectedKeywords.length > 0) {
          booleanKeywords = false;
          let description = [];
          if (Array.isArray(row.tags)) {
            description = row.tags;
          } else if (row.tags) {
            description = row.tags.split(', ');
          } else if (this.$config.tags && this.$config.tags.type == 'fieldValues') {
            for (let tag of this.$config.tags.tags) {
              // console.log('tag:', tag, 'tag.field:', tag.field, 'row.attributes[tag.field]:', row.attributes[tag.field]);
              if (tag.type == 'boolean' && row.attributes[tag.field] == 'Yes') {
                description.push(tag.value);
              } else if (tag.type == 'value' && row.attributes[tag.field] !== null && row.attributes[tag.field] != ' ') {
                description.push(row.attributes[tag.field].charAt(0) + row.attributes[tag.field].substring(1).toLowerCase());
              }
            }
          }
          console.log('still going, this.selectedKeywords:', this.selectedKeywords, 'row.tags:', row.tags, 'description:', description);

          const options = {
    			  // isCaseSensitive: false,
    			  // includeScore: false,
    			  // shouldSort: true,
    			  // includeMatches: false,
    			  // findAllMatches: false,
    			  minMatchCharLength: 3,
    			  // location: 0,
    			  // threshold: 0.6,
    			  // distance: 100,
    			  // useExtendedSearch: false,
    			  // ignoreLocation: false,
    			  // ignoreFieldNorm: false,

    			  // keys: [
    			  //   "title",
    			  //   "author.firstName"
    			  // ]
    			};

          const fuse = new Fuse(description, options);
    			const result = fuse.search(this.selectedKeywords[0]);
          // console.log('result:', result);
          if (result.length > 0) {
            booleanKeywords = true;
          }

          // let lowerCaseDescription = [];
          // for (let tag of description) {
          //   lowerCaseDescription.push(tag.toLowerCase());
          // }
          // const keywordsFiltered = this.selectedKeywords.filter(function(f) {
          //   // console.log('filter, f:', f, 'f.toLowerCase():', f.toLowerCase(), 'lowerCaseDescription:', lowerCaseDescription, 'lowerCaseDescription.includes(f.toLowerCase()):', lowerCaseDescription.includes(f.toLowerCase()));
          //   return lowerCaseDescription.includes(f.toLowerCase())
          // });
          // // console.log('description:', description, 'lowerCaseDescription:', lowerCaseDescription, 'keywordsFiltered:', keywordsFiltered);
          // if (keywordsFiltered.length > 0) {
          //   booleanKeywords = true;
          // }
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
        console.log('toggleMap is running');
        if (this.$data.isMapVisible === true) {
          console.log('toggleMap is running, this.$data.isMapVisible === true');
            console.log('setTimeout function is running');
            if (this.mapType === 'leaflet') {
              this.$store.state.map.map.invalidateSize();
            } else if (this.mapType === 'mapbox') {
              let themap = this.$store.map;
              setTimeout(function() {
                console.log('mapbox running map resize now');
                themap.resize();
                console.log('mapbox ran map resize');
              }, 250);
            }
        }
      }
      if (!this.i18nEnabled) {
        this.$data.buttonText = this.$data.isMapVisible ? 'Toggle to resource list' : 'Toggle to map';
      } else {
        this.$data.buttonText = this.$data.isMapVisible ? 'app.viewList' : 'app.viewMap';
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
      this.isAlertModalOpen = false;
      this.toggleBodyClass('no-scroll');
    },
    toggleBodyClass(className) {
      const el = document.body;
      return this.isOpen ? el.classList.add(className) : el.classList.remove(className);
    },
  },
};
</script>

<style lang="scss">
@import "./scss/global.scss";

// .toggle-map{
//   margin:0 !important;
// }
// .main-content{
//   margin-top:.5rem;
// }
//
// .middle-panel {
//   height: 100%;
// }

.full-screen {
  width: 100%;
}

.is-sticky-to-bottom {
  position: fixed;
  bottom: 0;
  z-index: 99;
}

.no-padding {
  padding: 0px;
}

.overflows {
  overflow-y: scroll;
}

a {
  font-weight: bold;
  text-decoration: underline;
}

.no-scroll{
  overflow: hidden;
  height: 100vh;
}

::-webkit-scrollbar {
  display: none;
}

.toggle-map{
  position: fixed;
  bottom:0;
  width: 100%;
  z-index: 1002;
}

</style>
