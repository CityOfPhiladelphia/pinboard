<template>
  <div
    id="app"
    class="app"
  >
    <!-- <PhilaModal
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
    </PhilaModal> -->

    <!-- <PhilaModal
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
    </PhilaModal> -->
    <div
      class="header-holder"
    >
      <app-header
        :app-title="$config.app.title"
        :is-sticky="false"
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

           <div class="field has-addons">
             <div class="control is-expanded">
               <input
                 v-model="myValue"
                 class="column is-10"
                 placeholder="Search an address"
                 label="Search an address in Philadelphia"
               >
             </div>
             <div class="control">
               <font-awesome-icon
                 :icon="['fa', 'search']"
                 class="is-link fa-w-10"
                 slot="submit"
                 @click.prevent="handleSubmit"/>
               <!-- <a
                 class="button is-link fa fa-search fa-fw fa-sm"
                 slot="submit"
                 @click.prevent="handleSubmit"
               /> -->
             </div>
           </div>

         </div>
       </input-form>

      </app-header>
    </div>

    <div
      v-if="i18nEnabled"
      class="i18n-banner-holder"
    >
      <i18n-banner />
    </div>

    <div
      v-if="refineEnabled"
      :class="refinePanelClass"
    >
      <refine-panel />
    </div>

    <div
      v-show="!isMobile || isMobile && !refineOpen"
      class="locations-and-map-panels-holder columns"
    >
      <div
        v-show="locationsPanelVisible"
        class="locations-panel-holder column"
      >
        <locations-panel />
      </div>

      <div
        v-show="mapPanelVisible"
        class="map-panel-holder column"
      >
        <map-panel />
      </div>

    </div>

    <div
      v-show="toggleButtonVisible"
      @click="toggleMap"
    >
      <button class="button capitalized is-primary is-fullwidth">
        {{ $t(this.$data.buttonText) }}
      </button>
    </div>

    <!-- <button
      id="switch-button"
      class="button is-sticky-to-bottom full-screen is-primary is-hidden-tablet"
      @click="toggleMap"
      >
      switch button
    </button> -->

    <div
      class="footer-holder"
    >
      <app-footer
        id="app-footer"
        :is-sticky="false"
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
    </div>

  </div>

</template>

<script>

import 'maplibre-gl/dist/maplibre-gl.css';

import Fuse from 'fuse.js'

import { point } from '@turf/helpers';
import buffer from '@turf/buffer';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import PhilaButton from './components/PhilaButton.vue';
import AlertBanner from './components/AlertBanner.vue';
import i18nBanner from './components/i18nBanner.vue';
import PhilaModal from './components/PhilaModal.vue';
import RefinePanel from './components/RefinePanel.vue';
import LocationsPanel from './components/LocationsPanel.vue';
import MapPanel from './components/MapPanel.vue';

import {
  AppHeader,
  MobileNav,
  AppFooter,
  InputForm,
  Textbox,
  Checkbox
} from '@phila/phila-ui';

export default {
  name: 'App',
  components: {
    AppHeader,
    MobileNav,
    AppFooter,
    InputForm,
    Textbox,
    Checkbox,
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
      myValue: '',
      brandingImage: {
        src: require('@/assets/city-of-philadelphia-logo.png'),
        alt: "City of Philadelphia logo",
        width: "200px",
      },
      brandingLink: {
        href: 'https://www.phila.gov/',
        target: '_blank',
      },
      dropdownOptions: {
        address: {
          text: 'Address',
          data: null,
        },
        keyword: {
          text: 'Keyword',
          data: null,
        },
      },
      // i18nEnabled: true,
      refineEnabled: true,
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
    layoutDescription() {
      let value;
      if (this.isMobile && !this.refineEnabled) {
        value = 'mobileNoRefine';
      } else if (this.isMobile && this.refineEnabled && this.refineOpen) {
        value = 'mobileRefineOpen';
      } else if (this.isMobile && this.refineEnabled && !this.refineOpen) {
        value = 'mobileRefineClosed';
      } else if (!this.refineEnabled) {
        value = 'nonMobileNoRefine';
      } else {
        value = 'nonMobileRefine';
      }
      return value;
    },
    refinePanelClass() {
      let value;
      if (this.refineOpen) {
        value = 'refine-panel-holder-open';
      } else {
        value = 'refine-panel-holder';
      }
      return value;
    },
    locationsPanelVisible() {
      return !this.isMobile || this.layoutDescription !== 'mobileRefineOpen' && !this.isMapVisible;
    },
    mapPanelVisible() {
      return !this.isMobile || this.layoutDescription !== 'mobileRefineOpen' && this.isMapVisible;
    },
    toggleButtonVisible() {
      return this.isMobile && this.layoutDescription !== 'mobileRefineOpen';
    },
    refineOpen() {
      return this.$store.state.refineOpen;
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

    // this.handleResize();
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

  methods: {
    handleSubmit() {
      this.$controller.handleSearchFormSubmit(this.myValue);
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
      // if (window.innerWidth > 749) {
      //   this.$data.isMapVisible = true;
      // } else {
      this.$data.isMapVisible = !this.$data.isMapVisible;
      console.log('toggleMap is running');
      if (this.$data.isMapVisible === true) {
        console.log('toggleMap is running, this.$data.isMapVisible === true');
        // console.log('setTimeout function is running');
        // if (this.mapType === 'leaflet') {
        //   this.$store.state.map.map.invalidateSize();
        // } else if (this.mapType === 'mapbox') {
        let themap = this.$store.map;
        setTimeout(function() {
          console.log('mapbox running map resize now');
          themap.resize();
          console.log('mapbox ran map resize');
        }, 250);
        // }
      }
      // }
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
@import "./assets/scss/main.scss";

html, body {
  box-sizing: border-box;
  height: 100%;
}

#app {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000000;
  display: flex;
  display: -ms-flexbox;
  flex-direction: column;
}

.capitalized {
  text-transform: uppercase;
}

.header-holder {
  background-color: blue;
}

.footer-holder {
  background-color: blue;
  margin-top: auto;
}

@media screen and (max-width: 767px) {
  .i18n-banner-holder {
    display: none;
  }
}

.refine-panel-holder-open {
  flex-grow: 1;
  background: $ghost-grey;
}

.locations-and-map-panels-holder {
  overflow-y: scroll;
  min-height: 0px;
  flex-grow: 1;
  // display: flex;
  // display: -ms-flexbox;
  // flex-direction: row;
  margin: 0px !important;
  // background-color: yellow;
}

.locations-panel-holder {
  min-height: 0px;
  padding: 0px;
  overflow-y: scroll;
  // background-color: #88d8b0;
}

@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  /* IE10+ CSS styles go here */

  @media (min-width: 768px) {
    .locations-and-map-panels-holder {
      overflow-y: hidden;
      height: 100px;
    }
  }
  @media (max-width: 767px) {
    .locations-and-map-panels-holder {
      height: 100px;
    }
    .locations-panel-holder {
      overflow-y: hidden;
    }
  }

}

.locations-panel {
  overflow-y: hidden;
}

.map-panel-holder {
  height: 100%;
  padding: 0px;
}

.toggle-button {
  background-color: #d2d2d2;
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
