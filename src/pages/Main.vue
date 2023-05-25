<template>
  <div
    id="app"
    class="app"
  >
    <a href="#main-area" class="skip-to-main-content-link">Skip to main content</a>
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

    <div
      class="header-holder"
    >
      <app-header
        :app-title="appTitle"
        :app-subtitle="appSubTitle"
        :app-link="appLink"
        :is-sticky="false"
        :branding-image="brandingImage"
        :branding-link="brandingLink"
        :isFluid="true"
      >
        <mobile-nav
          slot="mobile-nav"
          :links="footerLinks"
        >
        </mobile-nav>

        <lang-selector
          slot="lang-selector-nav"
          v-if="i18nEnabled"
          :languages="i18nLanguages"
        >
        </lang-selector>

      </app-header>
    </div>

    <div
      v-show="isMobile && !this.$config.searchBar.hide"
      class="search-bar-container-class"
    >
      <phila-ui-address-input
        :over-map="false"
        :placeholder="addressInputPlaceholder"
        @clear-search="clearSearchTriggered"
        @handle-search-form-submit="handleSubmit"
      />
    </div>

    <div
      v-if="refineEnabled"
      :class="refinePanelClass"
    >
      <refine-panel
        :refine-title="refineTitle"
        :submitted-checkbox-value="submittedCheckboxValue"
        @watched-submitted-checkbox-value="watchedSubmittedCheckboxValue"
      />
    </div>

    <div
      v-show="!isMobile || isMobile && !refineOpen"
      class="invisible-scrollbar locations-and-map-panels-holder columns"
    >
      <div
        v-show="mapPanelVisible"
        class="map-panel-holder column"
      >
        <map-panel
          @handle-search-form-submit="handleSubmit"
          @clear-search="clearSearchTriggered"
          @toggleMap="toggleMap"
        />
      </div>

      <div
        v-show="locationsPanelVisible"
        :class="locationsPanelClass + ' locations-panel-holder column'"
      >
        <locations-panel
          :is-map-visible="isMapVisible"
          @clear-bad-address="clearBadAddress"
        />
          <!-- @change-search-distance="changeSearchDistance" -->
      </div>

    </div>

    <div
      v-show="toggleButtonVisible"
      @click="toggleMap"
    >
      <button class="button capitalized is-primary toggle-button is-fullwidth">
        {{ $t(this.$data.buttonText) }}
      </button>
    </div>

    <div
      class="footer-holder"
    >
      <app-footer
        id="app-footer"
        :is-sticky="false"
        :is-hidden-mobile="true"
        :links="footerLinks"
      >
      </app-footer>
    </div>

  </div>

</template>

<script>

import proj4 from 'proj4';
import SharedFunctions from '../components/mixins/SharedFunctions.vue';

import 'maplibre-gl/dist/maplibre-gl.css';

import Fuse from 'fuse.js'

import { point } from '@turf/helpers';
import buffer from '@turf/buffer';
import centerOfMass from '@turf/center-of-mass';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import distance from '@turf/distance';
import AlertBanner from '../components/AlertBanner.vue';
import PhilaModal from '../components/PhilaModal.vue';
import RefinePanel from '../components/RefinePanel.vue';
import LocationsPanel from '../components/LocationsPanel.vue';
import MapPanel from '../components/MapPanel.vue';
import PhilaUiAddressInput from '../components/PhilaUiAddressInput.vue';

import {
  AppHeader,
  MobileNav,
  AppFooter,
  InputForm,
  Textbox,
  Checkbox,
  LangSelector,
} from '@phila/phila-ui';
import { isThisSecond } from 'date-fns';

export default {
  name: 'Main',
  components: {
    AppHeader,
    MobileNav,
    AppFooter,
    InputForm,
    Textbox,
    Checkbox,
    LangSelector,
    AlertBanner,
    PhilaModal,
    RefinePanel,
    LocationsPanel,
    MapPanel,
    PhilaUiAddressInput,
    CyclomediaWidget: () => import(/* webpackChunkName: "mbmb_pvm_CyclomediaWidget" */'@phila/vue-mapping/src/cyclomedia/Widget.vue'),
  },
  mixins: [
    SharedFunctions,
  ],
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
      brandingImage: null,
      brandingLink: {
        href: 'https://www.phila.gov/',
        target: '_blank',
      },
      searchString: null,
      refineEnabled: true,
      searchBarType: 'address',
      addressInputPlaceholder: null,
      submittedCheckboxValue: null,
    };
  },
  computed: {
    refineList() {
      return this.$store.state.refineList;
    },
    checkboxText() {
      let text = []
      let refineList = this.refineList;
      for (let key of Object.keys(refineList)) {
        for (let key2 of Object.keys(refineList[key])) {
          if (key2 === 'radio' || key2 === 'checkbox') {
            for (let key3 of Object.keys(refineList[key][key2])) {
              text.push(this.$i18n.messages[this.i18nLocale][key][key3].toLowerCase());
            }
          }
        }
      }
      return text;
    },
    printCheckboxes() {
      return this.$store.state.printCheckboxes;
    },
    zipcodeData() {
      // return this.$store.state.sources.zipcodes.data;
      let zipcode;
      if (this.$store.state.sources.zipcodes) {
        let zipcodesData = this.$store.state.sources.zipcodes.data;
        let selectedZipcode = this.selectedZipcode;
        if (zipcodesData && selectedZipcode) {
          zipcode = zipcodesData.features.filter(test => test.attributes.CODE == selectedZipcode)[0];
        }
      }
      return zipcode;
    },
    selectedZipcode() {
      return this.$store.state.selectedZipcode;
    },
    refineTitle() {
      return this.$config.refine.title;
    },
    projection4326() {
      return "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
    },
    projection2272() {
      return "+proj=lcc +lat_1=40.96666666666667 +lat_2=39.93333333333333 +lat_0=39.33333333333334 +lon_0=-77.75 +x_0=600000 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs";
    },
    projection3857() {
      return "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs";
    },
    shouldShowGreeting() {
      return this.$store.state.shouldShowGreeting;
    },
    locationsPanelClass() {
      let value;
      if (this.isMobile) {
        value = 'invisible-scrollbar';
      } else {
        value = '';
      }
      return value;
    },
    footerLinks() {
      if (this.$config.footer) {
        let newValues = []
        for (let i of this.$config.footer) {
          // console.log('i:', i);
          let value = {}
          for (let j of Object.keys(i)) {
            if (!this.i18nEnabled || j !== "text") {
              value[j] = i[j];
            } else {
              value[j] = this.$i18n.messages[this.i18nLocale].app[i[j]];
            }
          }
          newValues.push(value)
        }
        return newValues;
      }
    },
    appTitle() {
      let value;
      if (this.$config.app.title) {
        value = this.$config.app.title;
      } else if (this.i18nEnabled) {
        value = this.$i18n.messages[this.i18nLocale].app.title;
      }
      return value;
    },
    appSubTitle() {
      let value;
      if (this.$config.app.subtitle) {
        value = this.$config.app.subtitle;
      } else if (this.i18nEnabled) {
        value = this.$i18n.messages[this.i18nLocale].app.subtitle;
      }
      return value;
    },
    i18nLocale() {
      return this.$i18n.locale;
    },
    i18nLanguages() {
      let values = [];
      if (this.$config.i18n.languages) {
        // console.log('in if, this.$config.i18n.languages');
        values = this.$config.i18n.languages;
      } else {
        for (let key of Object.keys(this.$i18n.messages)) {
          let value = {};
          // console.log('in loop, key:', key, 'this.$i18n.locale:', this.$i18n.locale, 'this.$i18n.messages[key]:', this.$i18n.messages[key]);
          value.language = key;
          value.title = this.$i18n.messages[key].language;
          values.push(value);
        }
      }
      // console.log('end of i18nLanguages, values:', values);
      return values;
    },
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
      if (this.$store.state.sources[this.$appType].data) {

        let database = this.$store.state.sources[this.$appType].data.rows || this.$store.state.sources[this.$appType].data.features || this.$store.state.sources[this.$appType].data.records;
        // console.log('computed database is running, database:', database, 'this.$appType:', this.$appType);
  
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

        console.log('Main.vue database computed, finalDB:', finalDB);
        let languages = []
        for (let row of finalDB) {
          if (row.attributes.language) {
            let langs = row.attributes.language.split(',');
            // console.log('row.attributes.language:', row.attributes.language, 'langs:', langs);
            for (let lang of langs) {
              if (!languages.includes(lang.trim())) {
                languages.push(lang.trim());
              }
            }
          }
        }
        console.log('languages:', languages);

        return finalDB;
      }
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

        // let sourcesWatched = [];
        let sourcesWatched = {};

        for (let source of sources) {
          sourcesWatched[source] = this.$store.state.sources[source].data;
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
      if (this.isMobile && this.refineOpen) {
        value = 'mobile-refine-panel-holder-open';
      } else if (this.refineOpen) {
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
    lastPinboardSearchMethod() {
      return this.$store.state.lastPinboardSearchMethod;
    },
    searchDistance() {
      return this.$store.state.searchDistance;
    },
  },
  watch: {
    database(nextDatabase) {
      this.$store.commit('setDatabaseWithoutHiddenItems', nextDatabase);
    },
    searchDistance(nextSearchDistance) {
      console.log('Main.vue watch searchDistance, nextSearchDistance:', nextSearchDistance);
      if (this.lastPinboardSearchMethod == 'geocode') {
        this.runBuffer();
      } else if (this.lastPinboardSearchMethod == 'zipcode') {
        console.log('Main.vue watch searchDistance and lastPinboardSearchMethod is zipcode');
        let nextZipcodeData = this.zipcodeData;
        if (nextZipcodeData) {
          let geo = {
            geometry: {
              coordinates: nextZipcodeData.geometry.rings,
              type: "Polygon"
            },
            type: "Feature",
          };
          this.runZipcodeBuffer(geo);
        }
      }
    },
    zipcodeData(nextZipcodeData) {
      console.log('Main.vue watch zipcodeData, nextZipcodeData:', nextZipcodeData);
      if (nextZipcodeData) {
        console.log('watch zipcodeData setting buffer to shape');
        let geo = {
          geometry: {
            coordinates: nextZipcodeData.geometry.rings,
            type: "Polygon"
          },
          type: "Feature",
        };
        this.runZipcodeFindCenter(geo);
        this.runZipcodeBuffer(geo);
      } else {
        console.log('watch zipcodeData setting buffer to null');
        this.$data.buffer = null;
      }
    },
    i18nLocale(nexti18nLocale) {
      // console.log('watch i18nLocale, nexti18nLocale:', nexti18nLocale);
      let startQuery = { ...this.$route.query };

      delete startQuery['lang'];

      if (nexti18nLocale !== 'en-US') {
        let query = { 'lang': nexti18nLocale };
        this.$router.push({ query: { ...startQuery, ...query }});
      } else {
        this.$router.push({ query: { ...startQuery }});
      }

      this.$gtag.event('language-click', {
        'event_category': this.$store.state.gtag.category,
        'event_label': nexti18nLocale,
      })
    },
    sourcesWatched(nextSourcesWatched) {
      console.log('watch sourcesWatched, nextSourcesWatched:', nextSourcesWatched);
      let allSourceValues = [];
      for (let value of Object.keys(nextSourcesWatched)) {
        allSourceValues.push(nextSourcesWatched[value]);
      }
      if (!allSourceValues.includes(null)) {
        this.setUpData(nextSourcesWatched);
      }
    },
    geocodeStatus(nextGeocodeStatus) {
      if (nextGeocodeStatus === 'success') {
        this.runBuffer();
      } else if (nextGeocodeStatus === null && this.lastPinboardSearchMethod != 'zipcode') {
        this.$data.buffer = null;
      } else if (nextGeocodeStatus === 'error') {
        console.log('Main.vue watch geocodeStatus, nextGeocodeStatus is an error:', nextGeocodeStatus);
        this.geocodeFailed();
      }
    },
    buffer() {
      console.log('watch buffer is calling filterPoints');
      this.filterPoints();
    },
    selectedServices() {
      if (this.$store.state.sources[this.$appType].data) {
        this.filterPoints();
      }
    },
    selectedResources(nextSelectedResources) {
      let startQuery = { ...this.$route.query };
      console.log('watch selectedResources fired, startQuery:', startQuery, 'nextSelectedResources:', nextSelectedResources, 'nextSelectedResources.length:', nextSelectedResources.length);
  
      delete startQuery['resource'];
  
      if (nextSelectedResources.length) {
        let query = { 'resource': nextSelectedResources[0] };
        this.$router.push({ query: { ...startQuery, ...query }});
      } else {
        this.$router.push({ query: { ...startQuery }});
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
    let body = document.body;
    body.classList.remove('print-view');
    body.classList.add('main-view');

    console.log('in Main.vue mounted, this.$route.query:', this.$route.query);

    // this.$store.commit('setLastSearchMethod', 'zipcode');
    console.log('in Main.vue mounted, this.$store.state:', this.$store.state, 'this.$config:', this.$config, 'window.location.href:', window.location.href);
    this.$config.searchBar.searchTypes.forEach(item => {
      if (this.$route.query[item]) {
        // console.log('App.vue mounted item:', item, 'this.searchBarType:', this.searchBarType);
        this.$controller.handleSearchFormSubmit(this.$route.query[item], item);
        this.searchString = this.$route.query[item];
      }
    });

    if (this.$route.query.address) {
      this.$store.commit('setLastPinboardSearchMethod', 'geocode');
    } else if (this.$route.query.zipcode) {
      this.$store.commit('setLastPinboardSearchMethod', 'zipcode');
    }

    if (this.$route.query.resource) {
      console.log('App.vue mounted, this.$route.query.resource:', this.$route.query.resource);
      let selectedResources = [ this.$route.query.resource ];
      this.$store.commit('setSelectedResources', selectedResources);
    }
    
    if (this.$route.query.lang) {
      // console.log('App.vue mounted language:', this.$route.query.lang);
      this.$i18n.locale = this.$route.query.lang;
    }

    if (this.$config.searchBar) {
      let routeQuery = Object.keys(this.$route.query);
      // console.log('App.vue mounted in searchTypes section, this.$route:', this.$route, 'routeQuery:', routeQuery, 'Object.keys(this.$route.query)[0]', Object.keys(this.$route.query)[0]);
      let value;
      for (let query of routeQuery) {
        if (query === 'address' || query === 'keyword') {
          value = this.$route.query[query];
        }
      }
      this.$store.commit('setCurrentSearch', value);

      this.addressInputPlaceholder = this.$config.searchBar.placeholder;
    }

    if (this.$config.appLink) {
      this.appLink = this.$config.appLink;
    } else {
      this.appLink = '.';
    }

    // console.log('Main.vue mounted this.$store.state.sources[this.$config.app.type].data:', this.$store.state.sources[this.$config.app.type].data, 'Object.keys(this.$store.state.sources):', Object.keys(this.$store.state.sources));
    if (!this.$store.state.sources[this.$config.app.type].data && this.$config.dataSources) {
      this.$controller.dataManager.fetchData();
    }

    if (!this.i18nEnabled) {
      this.$data.buttonText = this.$data.isMapVisible ? 'Toggle to resource list' : 'Toggle to map';
    } else {
      this.$data.buttonText = this.$data.isMapVisible ? 'app.viewList' : 'app.viewMap';
    }

    if (this.$config.alerts && this.$config.alerts.modal && this.$config.alerts.modal.enabled) {
      this.isAlertModalOpen = true;
    }

    if (this.$config.gtag && this.$config.gtag.category) {
      this.$store.commit('setGtagCategory', this.$config.gtag.category);
    }

    if (this.$config.app.trustedSite && this.$config.app.trustedSite === 'hidden') {
      let trusted = document.getElementById('trusted-site');
      console.log('trusted:', trusted);
      trusted.classList.add("trusted-site-hidden");
    }

    if (this.$config.app.skipGreeting) {
      this.$store.commit('setShouldShowGreeting', false);
    }

    // console.log('Main.vue mounted, this.$store.state.sources[this.$appType].data.features:', this.$store.state.sources[this.$appType].data.features)
  },
  created() {
    let root = document.getElementsByTagName( 'html' )[0]; // '0' to assign the first (and only `HTML` tag)
    root.setAttribute( 'class', 'invisible-scrollbar' );

    // console.log('Pinboard Main.vue created, this.$config:', this.$config);
    if (this.$config.map) {
      if (this.$config.map.shouldInitialize === false) {
        this.$store.commit('setShouldInitializeMap', false);
      }
      if (this.$config.map.type) {
        this.$store.commit('setMapType', this.$config.map.type);
      }
    }

    if (this.$config.app.logoSrc) {
      this.brandingImage = {
        src: this.$config.app.logoSrc,
        alt: this.$config.app.logoAlt,
        width: "200px",
      }
    }

    window.addEventListener("popstate", (event) => {
      console.log('popstate event:', document.location, event.state);
      // this.handlePopStateChange();
      // this.filterPoints();
      location.reload();
    });
  },

  methods: {
    // handlePopStateChange() {
    //   console.log('Main.vue handlePopStateChange is running');
    //   location.reload();
    // },
    watchedSubmittedCheckboxValue() {
      console.log('Main.vue watchedSubmittedCheckboxValue is running');
      this.submittedCheckboxValue = null;
    },
    clearBadAddress() {
      console.log('clearBadAddress is running');
      let startQuery = { ...this.$route.query };
      delete startQuery['address'];
      this.$router.push({ query: startQuery });
      this.searchString = '';
      this.$controller.resetGeocode();
      this.$store.commit('setCurrentSearch', null);
    },
    geocodeFailed() {
      console.log('geocodeFailed is running');
      this.$store.commit('setBufferShape', null);
    },
    compareArrays(arr1, arr2) {
      const finalArray = [];
      arr1.forEach((e1) => arr2.forEach((e2) =>
        {
          if (e1 === e2) {
            finalArray.push(e1);
          }
        }
      ));
      return finalArray;
    },
    handleSubmit(val) {
      let query;
      let searchBarType;
      let valAsFloat = parseFloat(val.substring(0));
      let valToString = valAsFloat.toString();
      let checkVals = val === valToString;
      console.log('handleSubmit 1, val.substring(0):', val.substring(0), 'valAsFloat:', valAsFloat, 'checkVals:', checkVals, 'this.$config.searchBar.searchTypes:', this.$config.searchBar.searchTypes);
      
      let startQuery = { ...this.$route.query };
      
      if (isNaN(valAsFloat)) {
        if (!this.$config.searchBar.searchTypes.includes('keyword')) {
          console.log('cannot search keywords');
          this.$warning(`Please search an address`, {
            duration: 4000,
            closeOnClick: true,
          });
          return;
        } else {
          console.log('in handleSubmit, checking checkboxText');
          if (this.checkboxText.includes(val.toLowerCase())) {
            console.log('in handleSubmit, checking checkboxText - its there');
            // alert('There is already a checkbox or radio button for that search term');
            this.submittedCheckboxValue = val;
            if (this.$store.state.shouldShowGreeting && !this.isMobile) {
              this.$store.commit('setRefineOpen', true);
            }
            return;
          }
          this.$store.commit('setLastPinboardSearchMethod', 'keyword');
          let startKeyword;
          if (startQuery['keyword'] && startQuery['keyword'] != '') {
            startKeyword = startQuery['keyword'];
            val = startKeyword + ',' + val;
          }
          query = { ...startQuery, ...{ 'keyword': val }};
          this.searchBarType = 'keyword';
          searchBarType = 'keyword';
        }
      } else if (checkVals) {
        console.log('its a zipcode');
        if (this.$config.allowZipcodeSearch) {
          this.$store.commit('setLastPinboardSearchMethod', 'zipcode');
          query = { 'zipcode': val };
          this.searchBarType = 'zipcode';
          searchBarType = 'zipcode';
        }
      } else {
        console.log('its an address');
        query = { ...startQuery, ...{ 'address': val }};
        this.$store.commit('setLastPinboardSearchMethod', 'geocode');
        this.searchBarType = 'address';
        searchBarType = 'address';
      }
      delete startQuery['address'];
      delete startQuery['keyword'];
      delete startQuery['zipcode'];
      console.log('handleSubmit is running, valAsFloat:', valAsFloat, 'searchBarType:', searchBarType, 'startQuery:', startQuery, 'this.$route.query:', this.$route.query, 'query:', query, 'val:', val, 'val.substring(0, 1):', val.substring(0, 1));
      this.$router.push({ query: { ...startQuery, ...query }});
      this.searchString = query[this.searchBarType];
      const searchCategory = Object.keys(query)[0];
      const value = query[searchCategory];
      this.$gtag.event(this.searchBarType + '-search', {
        'event_category': this.$store.state.gtag.category,
        'event_label': value,
      })
      this.$store.commit('setCurrentSearch', val);
      this.$store.commit('setZipcodeCenter', []);
      this.$controller.handleSearchFormSubmit(val, searchBarType);

      if (this.$store.state.shouldShowGreeting && !this.isMobile) {
        this.$store.commit('setRefineOpen', true);
      }
    },
    clearSearchTriggered() {
      let startQuery = { ...this.$route.query };
      // console.log('in clearSearchTriggered1, this.$route.query:', this.$route.query, 'startQuery:', startQuery);
      delete startQuery['address'];
      delete startQuery['zipcode'];
      delete startQuery['keyword'];
      // console.log('in clearSearchTriggered2, this.$route.query:', this.$route.query, 'startQuery:', startQuery);
      this.$router.push({ query: startQuery });
      this.searchString = '';
      this.$store.commit('setSelectedKeywords', []);
      this.$store.commit('setSelectedZipcode', null);
      this.$store.commit('setBufferShape', null);
      this.$controller.resetGeocode();
      this.$store.commit('setCurrentSearch', null);
    },
    setUpData(theSources) {
      console.log('Pinboard App.vue setUpData is running, theSources:', theSources);
      let compiled = {
        key: 'compiled',
        data: {
          'records':[],
        },
        status: 'success',
      }
      let keys = Object.keys(theSources);
      if (keys.length > 1) {
        console.log('theSources:', theSources, 'this.$config.dataSources:', this.$config.dataSources);
        for (let key of keys) {
          console.log('source:', key);
          if (theSources[key].features && this.$config.dataSources[key].compile) {
            for (let point of theSources[key].features) {
              // console.log('point:', point);
              compiled.data.push(point);
            }
          } else if (theSources[key].records && this.$config.dataSources[key].compile) {
            for (let point of theSources[key].records) {
              let featureId = point._featureId.split('-')[1];
              if (this.$config.app.categorizeCompiled) {
                point.fields.category_type = featureId;
              }
              // console.log('point:', point);
              compiled.data.records.push(point);
            }
          }
        }
        // console.log('compiled:', compiled);
        this.$store.commit('setSourceData', compiled);
        this.$store.commit('setSourceStatus', compiled);
      }
      // console.log('end of setUpData, this.$store.state.sources:', this.$store.state.sources);
    },
    runBuffer() {
      let searchDistance = this.searchDistance;
      console.log('runBuffer is running, searchDistance:', searchDistance, 'this.geocodeGeom:', this.geocodeGeom);
      if (this.geocodeGeom) {
        const geocodePoint = point(this.geocodeGeom.coordinates);
        const pointBuffer = buffer(geocodePoint, searchDistance, { units: 'miles' });
        this.$data.buffer = pointBuffer;
        this.$store.commit('setBufferShape', pointBuffer);
      }
    },
    runZipcodeBuffer(geo) {
      console.log('Main.vue runZipcodeBuffer is running, geo:', geo);
      let searchDistance = this.searchDistance;
      const polygonBuffer = buffer(geo, searchDistance, { units: 'miles' });
      this.$data.buffer = polygonBuffer;
      this.$store.commit('setZipcodeBufferShape', polygonBuffer);
    },
    runZipcodeFindCenter(geo) {
      let zipcodeCenter = centerOfMass(geo);
      console.log('Main.vue runZipcodeFindCenter is running, geo:', geo, 'zipcodeCenter:', zipcodeCenter);
      this.$store.commit('setZipcodeCenter', zipcodeCenter.geometry.coordinates);
    },
    filterPoints() {
      console.log('App.vue filterPoints is running, this.database:', this.database);
      const filteredRows = [];

      if (!this.database) {
        return;
      }

      for (const [index, row] of [ ...this.database.entries() ]) {
        // console.log('row:', row, 'index:', index);
        let booleanServices;
        const { selectedServices } = this.$store.state;
        // console.log('row.services_offered:', row.services_offered);

        if (this.$config.refine && this.$config.refine.type && ['multipleFields', 'multipleFieldGroups', 'multipleDependentFieldGroups'].includes(this.$config.refine.type)) {
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
            } else if (this.$config.refine.type === 'multipleFieldGroups') {
              // if refine.type = multipleFieldGroups
              let selectedGroups = [];
              for (let value of selectedServices) {
                // console.log('App.vue filterPoints value:', value);
                let valueGroup;
                if (value) {
                  valueGroup = value.split('_', 1)[0];
                }
                if (valueGroup && !selectedGroups.includes(valueGroup)) {
                  selectedGroups.push(valueGroup)
                }
              }
              // console.log('App.vue filterPoints is running on multipleFieldGroups, selectedServices:', selectedServices, 'selectedGroups:', selectedGroups);
              let groupValues = [];
              for (let group of selectedGroups) {
                let groupBooleanConditions = [];
                for (let service of selectedServices) {
                  // console.log('App.vue filterPoints loop, service:', service);
                  if (group !== 'keyword' && service.split('_', 1)[0] === group && this.$config.refine.multipleFieldGroups[group]['radio']) {
                    // console.log('group:', group, 'this.$config.refine.multipleFieldGroups[group]["radio"]:', this.$config.refine.multipleFieldGroups[group]['radio']);
                    let dependentGroups = this.$config.refine.multipleFieldGroups[group]['radio'][service.split('_')[1]]['dependentGroups'] || [];
                    // console.log('dependentGroup:', dependentGroup, 'service.split("_", 1)[0]:', service.split('_', 1)[0], 'service.split("_")[1]:', service.split('_')[1], 'group', group, 'this.$config.refine.multipleFieldsGroups[group]', this.$config.refine.multipleFieldsGroups[group], 'this.$config.refine.multipleFieldsGroups[group][service.split("_")[1]]:', this.$config.refine.multipleFieldsGroups[group][service.split('_')[1]]);
                    let getter = this.$config.refine.multipleFieldGroups[group]['radio'][service.split('_')[1]]['value'];
                    let dependentServices = [];
                    for (let service of selectedServices) {
                      if (dependentGroups.length && dependentGroups.includes(service.split('_')[0])) {
                        dependentServices.push(service.split('_')[1]);
                      }
                    }
                    // console.log('getter:', getter, 'dependentGroups:', dependentGroups, 'selectedServices:', selectedServices, 'dependentServices:', dependentServices);
                    let val = getter(row, dependentServices);
                    groupBooleanConditions.push(val);
                  }
                  if (group !== 'keyword' && service.split('_', 1)[0] === group && this.$config.refine.multipleFieldGroups[group]['checkbox']) {
                    // console.log('group:', group, 'this.$config.refine.multipleFieldGroups[group]["dependent"]:', this.$config.refine.multipleFieldGroups[group]['dependent']);
                    let independentGroups = this.$config.refine.multipleFieldGroups[group]['checkbox'][service.split('_')[1]]['independentGroups'] || [];
                    // console.log('dependentGroup:', dependentGroup, 'service.split("_", 1)[0]:', service.split('_', 1)[0], 'service.split("_")[1]:', service.split('_')[1], 'group', group, 'this.$config.refine.multipleFieldsGroups[group]', this.$config.refine.multipleFieldsGroups[group], 'this.$config.refine.multipleFieldsGroups[group][service.split("_")[1]]:', this.$config.refine.multipleFieldsGroups[group][service.split('_')[1]]);
                    let getter = this.$config.refine.multipleFieldGroups[group]['checkbox'][service.split('_')[1]]['value'];
                    let independentServices = [];
                    for (let service of selectedServices) {
                      if (independentGroups.length && independentGroups.includes(service.split('_')[0])) {
                        independentServices.push(service.split('_')[1]);
                      }
                    }
                    // console.log('getter:', getter, 'dependentGroups:', dependentGroups, 'selectedServices:', selectedServices, 'dependentServices:', dependentServices);
                    let val = getter(row, independentServices);
                    groupBooleanConditions.push(val);
                  }
                }
                // console.log('group:', group, 'groupBooleanConditions:', groupBooleanConditions);
                if (groupBooleanConditions.includes(true)) {
                  booleanConditions.push(true);
                } else if (groupBooleanConditions.length) {
                  booleanConditions.push(false);
                }
              }
            } else {
              // if refine.type = multipleDependentFieldGroups
              let selectedGroups = [];
              for (let value of selectedServices) {
                let valueGroup = value.split('_', 1)[0]
                if (!selectedGroups.includes(valueGroup)) {
                  selectedGroups.push(valueGroup)
                }
              }
              // console.log('App.vue filterPoints is running on multipleDependentFieldGroups, selectedServices:', selectedServices, 'selectedGroups:', selectedGroups);
              let groupValues = [];
              for (let group of selectedGroups) {
                let groupBooleanConditions = [];
                for (let service of selectedServices) {
                  if (service.split('_', 1)[0] === group) {
                    let ind = this.$config.refine.multipleDependentFieldGroups[group]['independent'];
                    let serviceEnd = service.split('_')[1];
                    // console.log('ind:', ind, 'serviceEnd:', serviceEnd, 'selectedServices:', selectedServices);
                    let getter;
                    if (this.$config.refine.multipleDependentFieldGroups[group]['dependent'][service.split('_')[1]]) {
                      getter = this.$config.refine.multipleDependentFieldGroups[group]['dependent'][service.split('_')[1]]['value'];
                      let dependentServices = [];
                      if (ind) {
                        for (let service of selectedServices) {
                          if (Object.keys(ind).includes(service.split('_')[1])) {
                            dependentServices.push(service.split('_')[1]);
                          }
                        }
                      }
                      let val = getter(row, dependentServices);
                      // console.log('getter:', getter, 'selectedServices:', selectedServices, 'dependentServices:', dependentServices, 'val:', val);
                      groupBooleanConditions.push(val);
                    }
                  }
                }
                // console.log('groupBooleanConditions:', groupBooleanConditions);
                if (groupBooleanConditions.includes(true) || !groupBooleanConditions.length) {
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
          // console.log('in else, row:', row, 'row.services_offered:', row.services_offered);
          let servicesSplit;
          if (this.$config.refine) {
            servicesSplit = this.$config.refine.value(row);
          } else if (row.services_offered) {
            servicesSplit = row.services_offered;
          }

          // console.log('1 servicesSplit:', servicesSplit, 'typeof servicesSplit:', typeof servicesSplit);
          if (typeof servicesSplit === 'string') {
            servicesSplit = servicesSplit.split(',');
          }
          // console.log('2 servicesSplit:', servicesSplit, 'typeof servicesSplit:', typeof servicesSplit);

          if (selectedServices.length === 0) {
            booleanServices = true;
          } else {
            let servicesFiltered = [];
            if (servicesSplit) {
              servicesFiltered = servicesSplit.filter(f => selectedServices.includes(f));
            }
            // console.log('servicesFiltered:', servicesFiltered, 'selectedServices:', selectedServices);
            booleanServices = servicesFiltered.length == selectedServices.length;
          }
          // console.log('services else is running, row:', row, 'selectedServices:', selectedServices, 'booleanServices:', booleanServices);
        }

        // console.log('about to do buffer stuff, row:', row);
        let booleanBuffer = false;
        if (!this.$data.buffer) {
          // console.log('!this.$data.buffer');
          booleanBuffer = true;
        } else if (row.latlng) {
          // console.log('row.latlng:', row.latlng);
          // console.log('buffer else if 1 is running, row:', row, 'booleanBuffer:', booleanBuffer, 'typeof row.latlng[0]:', typeof row.latlng[0], 'this.$store.state.zipcodeCenter:', this.$store.state.zipcodeCenter);
          if (typeof row.latlng[0] === 'number' && row.latlng[0] !== null) {
            const rowPoint = point([ row.latlng[1], row.latlng[0] ]);
            let geocodedPoint, options, theDistance;
            if (this.$store.state.geocode.data) {
              geocodedPoint = point(this.$store.state.geocode.data.geometry.coordinates);
              options = { units: 'miles' };
              theDistance = distance(geocodedPoint, rowPoint, options);
              row.distance = theDistance;
            } else if (this.$store.state.zipcodeCenter[0]) {
              // console.log('inside zipcode center else if');
              let zipcodeCenter = point(this.$store.state.zipcodeCenter);
              options = { units: 'miles' };
              theDistance = distance(zipcodeCenter, rowPoint, options);
              row.distance = theDistance;
            }
            // console.log('rowPoint:', rowPoint, 'this.$data.buffer:', this.$data.buffer, 'booleanPointInPolygon(rowPoint, this.$data.buffer):', booleanPointInPolygon(rowPoint, this.$data.buffer));
            if (booleanPointInPolygon(rowPoint, this.$data.buffer)) {
              booleanBuffer = true;
            }
            // }
            // console.log('buffer else if 1 IF is running, row:', row, 'rowPoint:', rowPoint, 'booleanBuffer:', booleanBuffer);
          } else if (typeof row.latlng[0] === 'string' && row.latlng[0] !== null) {
            // console.log('buffer else if 1 ELSE IF');
            const rowPoint = point([ parseFloat(row.latlng[1]), parseFloat(row.latlng[0]) ]);
            if (booleanPointInPolygon(rowPoint, this.$data.buffer)) {
              booleanBuffer = true;
            }
          }
        } else if (row.lat && row.lon) {
          // console.log('buffer else if 2 is running, row:', row, 'booleanBuffer:', booleanBuffer);
          if (typeof row.lat === 'number' && typeof row.lon === 'number') {
            let projection = this.getProjection(row);
            let lnglat;
            if (projection === '3857') {
              lnglat = proj4(this.projection3857, this.projection4326, [ row.lon, row.lat ]);
            } else if (projection === '2272') {
              lnglat = proj4(this.projection2272, this.projection4326, [ row.lon, row.lat ]);
            } else {
              lnglat = [ row.lon, row.lat ];
            }
            const rowPoint = point(lnglat);
            if (booleanPointInPolygon(rowPoint, this.$data.buffer)) {
              booleanBuffer = true;
            }
            // console.log('buffer else if 2 IF is running, row:', row, 'rowPoint:', rowPoint, 'booleanBuffer:', booleanBuffer);
          }
        } else if (row.geometry && row.geometry.x) {
          // console.log('buffer else if 3 is running, row:', row, 'booleanBuffer:', booleanBuffer);
          if (typeof row.geometry.x === 'number' && typeof row.geometry.y === 'number') {
            let projection = this.getProjection(row);
            let lnglat;
            if (projection === '3857') {
              lnglat = proj4(this.projection3857, this.projection4326, [ row.geometry.x, row.geometry.y ]);
            } else if (projection === '2272') {
              lnglat = proj4(this.projection2272, this.projection4326, [ row.geometry.x, row.geometry.y ]);
            } else {
              lnglat = [ row.geometry.x, row.geometry.y ];
            }
            const rowPoint = point(lnglat);

            let geocodedPoint, options, theDistance;
            if (this.$store.state.geocode.data) {
              geocodedPoint = point(this.$store.state.geocode.data.geometry.coordinates);
              options = { units: 'miles' };
              theDistance = distance(geocodedPoint, rowPoint, options);
              row.distance = theDistance;
            } else if (this.$store.state.zipcodeCenter[0]) {
              // console.log('inside zipcode center else if');
              let zipcodeCenter = point(this.$store.state.zipcodeCenter);
              options = { units: 'miles' };
              theDistance = distance(zipcodeCenter, rowPoint, options);
              row.distance = theDistance;
            }

            if (booleanPointInPolygon(rowPoint, this.$data.buffer)) {
              booleanBuffer = true;
            }
            // console.log('buffer else if 3 IF is running, row:', row, 'rowPoint:', rowPoint, 'booleanBuffer:', booleanBuffer);
          }
        } else {
          // console.log('neither ran');
          // booleanBuffer = true;
        }

        let booleanKeywords = true;
        // console.log('row:', row, 'this.$config.tags', this.$config.tags, 'this.selectedKeywords:', this.selectedKeywords, 'this.selectedKeywords.length:', this.selectedKeywords.length);
        if (this.selectedKeywords.length > 0) {
          booleanKeywords = false;
          let description = [];
          if (Array.isArray(row.tags)) {
            description = row.tags;
          } else if (row.tags) {
            description = row.tags.split(', ');
          } else if (this.$config.tags && this.$config.tags.type == 'tagLocation') {
            if (Array.isArray(this.$config.tags.location(row))) {
              description = this.$config.tags.location(row);
            } else if (this.$config.tags.location(row)) {
              description = this.$config.tags.location(row).split(', ');
            }
          } else if (this.$config.tags && this.$config.tags.type == 'fieldValues') {
            for (let tag of this.$config.tags.tags) {
              // console.log('tag:', tag, 'tag.field:', tag.field, 'row.attributes[tag.field]:', row.attributes[tag.field]);
              if (tag.type == 'boolean' && row.attributes[tag.field] == 'Yes') {
                description.push(tag.value);
              } else if (tag.type == 'value' && row.attributes[tag.field] !== null && row.attributes[tag.field] != ' ') {
                // console.log('in else if, row.attributes[tag.field]:', row.attributes[tag.field]);
                description.push(row.attributes[tag.field].charAt(0) + row.attributes[tag.field].substring(1).toLowerCase());
              }
            }
          }
          // console.log('still going, this.selectedKeywords[0]:', this.selectedKeywords[0], 'row.tags:', row.tags, 'description:', description);

          let threshold = 0.2;
          if (this.$config.searchBar.fuseThreshold) {
            threshold = this.$config.searchBar.fuseThreshold;
          };

          const options = {
    			  // isCaseSensitive: false,
    			  // includeScore: false,
    			  // shouldSort: true,
    			  // includeMatches: false,
    			  // findAllMatches: true,
    			  minMatchCharLength: 3,
    			  location: 0,
    			  threshold: threshold,
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
    			let results = {};
          for (let keyword of this.selectedKeywords) {
            console.log('in selectedKeywords loop, keyword:', keyword);
            results[keyword] = fuse.search(keyword);
          }
    			// const result = fuse.search(this.selectedKeywords[0]);
          // console.log('App.vue filterPoints booleanKeywords section, result:', result, 'results:', results);
          // if (result.length > 0) {
          //   booleanKeywords = true;
          // }
          for (let keyword of Object.keys(results)) {
            if (results[keyword].length > 0) {
              booleanKeywords = true;
            }
          }
        }

        // console.log('booleanServices:', booleanServices, 'booleanBuffer:', booleanBuffer, 'booleanKeywords:', booleanKeywords);

        if (booleanServices && booleanBuffer && booleanKeywords) {
          filteredRows.push(row);
        }
      }
      // console.log('filteredRows:', filteredRows);

      this.$store.commit('setCurrentData', filteredRows);
    },
    toggleMap() {
      this.$data.isMapVisible = !this.$data.isMapVisible;
      console.log('toggleMap is running');
      if (this.$data.isMapVisible === true) {
        console.log('toggleMap is running, this.$data.isMapVisible === true');
        // console.log('setTimeout function is running');
        let themap = this.$store.map;
        setTimeout(function() {
          console.log('mapbox running map resize now');
          themap.resize();
          console.log('mapbox ran map resize');
        }, 250);
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
@import "../assets/scss/main.scss";

html, body {
  box-sizing: border-box;
  height: 100%;
}

.skip-to-main-content-link {
  position: absolute;
  left: -9999px;
  z-index: 999;
  padding: .5em;
  background-color: $ben-franklin-blue-dark;
  color: white;
  opacity: 0;
  text-decoration: underline;
}

.skip-to-main-content-link:focus {
  left: 0px;
  opacity: 1;
}

.skip-to-main-content-link:hover {
  color: white;
}

#app {
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  display: -ms-flexbox;
  flex-direction: column;
}

#app-header {
  .trusted-site-hidden {
    display: none;
  }

  #nav-wrap {
    height: 80px;
    line-height: 80px;


    #main-nav {
      .columns {
        height: 80px;
        .column {
          height: 80px;
        }
      }
    }

  }
  .container {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  // .title-col {
  //   padding-top: 1rem !important;
  //   padding-bottom: 1rem !important;
  // }
  h2 {
    font-weight: 100;
  }
}

#app-footer {
  height: 33px !important;

  a {
    font-family: "Open Sans Semibold", "Open Sans", sans-serif !important;
    font-weight: 600 !important;
    font-size: 14px;
    // height: 33px !important;
    line-height: 33px !important;
  }

  ul li:after {
    font-weight: lighter !important;
  }
}

.search-bar-container-class {
  min-height: 4.5rem;
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

@media screen and (min-width: 768px) {
  .title-col {
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
  }
}

@media screen and (max-width: 767px) {
  .title-col {
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
  }
}

.mobile-refine-panel-holder-open {
  flex-grow: 1;
  background: $ghost-grey;
}

#mobile-menu-close-bar {
  height: 50px;
  .button {
    bottom: 3px !important;
  }
}

#mobile-menu-wrap {
  height: calc(100% - 105px) !important;
}

.refine-panel-holder-open {
  background: $ghost-grey;
  border-width: 0px 0px 2px 0px;
  border-style: solid;
  border-color: #a1a1a1;
}

.refine-panel-holder {
  border-width: 0px 0px 2px 0px;
  border-style: solid;
  border-color: #a1a1a1;
}

.locations-and-map-panels-holder {
  flex-direction: row-reverse;
  overflow-y: scroll;
  min-height: 0px;
  flex-grow: 1;
  margin-left: 0px !important;
  margin-right: 0px !important;
  margin-bottom: 0px !important;
  margin-top: 0px !important;
}

.locations-panel-holder {
  min-height: 0px;
  padding: 0px !important;
  overflow-y: scroll;
}

.invisible-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.invisible-scrollbar::-webkit-scrollbar {
  display: none;
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
  padding: 0px !important;
}

.toggle-button {
  // background-color: #d2d2d2;
  // color: white;
  background-color: $ben-franklin-blue-dark !important;
}

.overflows {
  overflow-y: scroll;
}

.footer-holder a {
  text-decoration: underline;
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

@media print {

  .locations-panel-holder {
    overflow-y: visible;
  }

  .locations-panel {
    overflow-y: visible;
  }

  .no-scroll {
    overflow: visible;
  }

  .locations-and-map-panels-holder {
    // flex-direction: row-reverse;
    overflow-y: visible;
  }

  .overflows {
    overflow-y: visible;
  }
}

</style>
