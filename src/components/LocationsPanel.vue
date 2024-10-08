<template>
  <div class="locations-panel">

    <div
      v-if="shouldShowGreeting"
      class="topics-container cell medium-cell-block-y"
    >
      <custom-greeting
        v-if="shouldShowGreeting && hasCustomGreeting"
        @view-list="clickedViewList"
      />

    </div>

    <div
      v-if="!shouldShowGreeting && dataStatus === 'success'"
      class="summary-and-location-container"
    >
      
      <div class="summary-container">
        <div
          v-if="!isMobile && geocodeStatus !== 'error' > 0"
          class="columns is-desktop cut-right mb-0"
        >
          <div
            v-if="allowPrint"
            class="column is-6-desktop is-12-tablet mr-0 mb-0 pb-0 columns loc-panel-widget"
          >
            <div class="field column is-6 pt-5">
              <input
                class="is-checkradio location-checkbox"
                id="locationsPanelCheckbox"
                type="checkbox"
                name="locationsPanelCheckbox"
                @click="clickedSelectAll"
              >
              <label for="locationsPanelCheckbox">
                <span
                  v-if="!i18nEnabled"
                >
                  Select All
                </span>
                <span
                  v-if="i18nEnabled"
                  v-html="$t('selectAll')"
                />
              </label>
            </div>
            <div class="column is-6 pt-3">
              <button
                @click="clickedPrint"
                class="button app-button"
                :class="!printCheckboxes.length ? 'disabled' : '' "
              >
                <p
                  v-if="!i18nEnabled"
                >
                  Print
                </p>
                <p
                  v-if="i18nEnabled"
                  v-html="$t('print')"
                />
            </button>
            </div>
          </div>

          <div
            v-if="anySearch"
            class="column is-6-desktop is-12-tablet mr-0 mb-0 pb-0 pr-0 columns loc-panel-widget"
          >
            <div
              class="column is-6-tablet is-7-desktop p-0"
            >
              <dropdown
                v-model="sortBy"
                :options="sortByOptions"
                :placeholder="$t('sortBy')"
                :disabled="sortDisabled"
              />
            </div>
            <div
              class="column is-6-tablet is-5-desktop p-0"
            >
              <dropdown
                v-model="searchDistance"
                :options="searchDistanceOptions"
                :placeholder="$t('distance')"
                :disabled="sortDisabled"
              />
            </div>
          </div>
        </div>

        <div
          v-if="isMobile && geocodeStatus !== 'error'"
          class="columns is-mobile mb-0"
        >
          <div
            class="mb-1 p-0 mobile-dropdown-container column is-6"
          >
            <dropdown
              v-model="sortBy"
              :options="sortByOptions"
              placeholder="Sort By"
              :disabled="sortDisabled"
            />
          </div>
          <div
            class="mb-1 p-0 mobile-dropdown-container column is-6"
          >
            <dropdown
              v-model="searchDistance"
              :options="searchDistanceOptions"
              placeholder="Distance"
              :disabled="sortDisabled"
            />
          </div>
        </div>

        <div
          v-if="geocodeStatus !== 'error'"
          class="mt-2 mb-2"
        >
          {{ summarySentenceStart }} <b><i>{{ summarySentenceEnd }}</i></b>
        </div>
      </div>

      <div
        v-if="geocodeStatus === 'error'"
        class="h3 no-results"
      >
        <p class="pb-4">The address that was searched is not a valid Philadelphia address.</p>
        <button
          class="button app-button is-vcentered"
          @click="clearBadAddress"
        >
          Clear Address
        </button>
      </div>
      <div
        v-if="geocodeStatus !== 'error' && currentData.length === 0"
        class="h3 no-results"
      >
        <p
          v-if="!i18nEnabled"
        >
          We're sorry, there are no results for that search.
          Adjust the filters you've selected and try again.
        </p>
        <p
          v-if="i18nEnabled"
          v-html="$t('app.noResults')"
        />
      </div>

      <div
        v-if="geocodeStatus !== 'error'"
        class="location-container"
      >
      
        <div
          v-for="item in currentData"
          :key="item._featureId"
        >
          <expand-collapse
            :item="item"
            :is-map-visible="isMapVisible"
            :checked="selectAllCheckbox"
            @print-box-checked="printBoxChecked"
          >

            <component
              :is="'expandCollapseContent'"
              v-if="$config.customComps && Object.keys($config.customComps).includes('expandCollapseContent') && selectedResources.includes(item._featureId)"
              :item="item"
              :is-map-visible="isMapVisible"
            />

            <div
              v-if="!$config.customComps || !Object.keys($config.customComps).includes('expandCollapseContent') && selectedResources.includes(item._featureId)"
              :class="isMobile ? 'main-content-mobile' : 'main-content'"
            >
              <print-share-section
                :item="item"
              >
              </print-share-section>

              <div class="columns top-section">
                <div class="column is-6">
                  <div
                    v-if="item.street_address"
                    class="columns is-mobile"
                  >
                    <div class="column is-1">
                      <font-awesome-icon icon="map-marker-alt" />
                    </div>
                    <div
                      class="column is-11"
                      v-html="parseAddress(item.street_address)"
                    >
                    </div>
                  </div>
                </div>

                <div class="column is-6">

                  <div
                    v-if="item.phone_number"
                    class="columns is-mobile"
                  >
                    <div
                      class="column is-1"
                    >
                      <font-awesome-icon icon="phone" />
                    </div>
                    <div class="column is-11">
                      {{ item.phone_number }}
                    </div>
                  </div>

                  <div
                    v-if="item.email"
                    class="columns is-mobile"
                  >
                    <div
                      class="column is-1"
                    >
                      <font-awesome-icon icon="envelope" />
                    </div>
                    <div class="column is-11">
                      <a :href="`mailto:${item.email}`">{{ item.email }}</a>
                    </div>
                  </div>

                  <div
                    v-if="item.website"
                    class="columns is-mobile website-div"
                  >
                    <div
                      class="column is-1"
                    >
                      <font-awesome-icon icon="globe" />
                    </div>
                    <div class="column is-11">
                      <a
                        target="_blank"
                        :href="makeValidUrl(item.website)"
                      >
                        {{ item.website }}
                        <font-awesome-icon icon="external-link-alt" />
                      </a>
                    </div>
                  </div>

                  <div
                    v-if="item.facebook_name"
                    class="columns is-mobile"
                  >
                    <div
                      class="column is-1"
                    >
                      <font-awesome-icon :icon="['fab', 'facebook']" />
                    </div>
                    <div class="column is-11">
                      <a
                        target="_blank"
                        :href="item.facebook_name"
                      >
                        Facebook
                      </a>
                    </div>
                  </div>

                  <div
                    v-if="item.twitter"
                    class="columns is-mobile"
                  >
                    <div
                      class="column is-1"
                    >
                      <font-awesome-icon :icon="['fab', 'twitter']" />
                    </div>
                    <div class="column is-11">
                      <a
                        target="_blank"
                        :href="item.twitter"
                      >
                        Twitter
                      </a>
                    </div>
                  </div>
                </div>

              </div>

              <div
                v-if="item.services_offered"
              >
                <h3 v-if="!i18nEnabled">
                  Services offered
                </h3>
                <h3 v-if="i18nEnabled">
                  {{ $t('servicesOffered') }}
                </h3>

                <div
                  v-if="!i18nEnabled"
                  class="columns is-multiline is-gapless"
                >
                  <div
                    v-for="i in parseServiceList(item.services_offered)"
                    :key="i"
                    class="column is-half"
                  >
                    {{ i }}
                  </div>
                </div>

                <div
                  v-if="i18nEnabled"
                  class="columns is-multiline is-gapless"
                >
                  <div
                    v-for="service in parseServiceList(item.services_offered)"
                    :key="service"
                    class="column is-half"
                  >
                    {{ $t(service) }}
                  </div>
                </div>

                
              </div>

              <div
                v-if="item.tags && item.tags.length"
              >
                <h3 v-if="!i18nEnabled">
                  {{ tagsPhrase }}
                </h3>
                <h3 v-if="i18nEnabled">
                  {{ $t(tagsPhrase) }}
                </h3>
                <div>
                  {{ parseTagsList(item.tags) }}
                </div>
              </div>
            </div>

          </expand-collapse>
        </div>

      </div>

    </div>

  </div>
</template>
<script>

import { mapState } from 'vuex';
import ExpandCollapse from './ExpandCollapse.vue';
import transforms from '../util/transforms.js';

import { Dropdown } from '@phila/phila-ui';

import SingleCheckbox from './SingleCheckbox.vue';
import PrintShareSection from '@phila/pinboard/src/components/PrintShareSection';

export default {
  components: {
    ExpandCollapse,
    Dropdown,
    SingleCheckbox,
    PrintShareSection,
  },
  props: {
    isMapVisible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // searchDistance: '3' + this.$i18n.messages[this.i18nLocale]['miles'],
      searchDistance: null,
      // searchDistanceOptions: [ '1 mile', '2', '3', '4', '5' ],
      sortBy: 'Alphabetically',
      printCheckboxes: [],
      selectAllCheckbox: false,
    };
  },
  mounted() {
    console.log('LocationsPanel.vue mounted, this.$config:', this.$config, 'this.i18nLocale:', this.i18nLocale);
    if (!this.$config.greeting && (!this.$config.customComps || !this.$config.customComps.customGreeting)) {
      this.$store.commit(setShouldShowGreeting, false);
    }

    let value, valueWithMiles;
    if (this.$config.searchBar.searchDistance && this.$config.searchBar.searchDistance != 1) {
      value = this.$config.searchBar.searchDistance;
      valueWithMiles = this.$config.searchBar.searchDistance + ' ' + this.$i18n.messages[this.i18nLocale]['miles'];
    } else {
      value = 1;
      valueWithMiles = 1 + ' ' + this.$i18n.messages[this.i18nLocale]['mile'];
    }
    this.searchDistance = valueWithMiles;
    this.$store.commit('setSearchDistance', value);

    this.printCheckboxes = this.$store.state.printCheckboxes;
  },
  computed: {
    tagsPhrase() {
      let value;
      if (this.$config.locationInfo.tagsPhrase) {
        value = this.$config.locationInfo.tagsPhrase;
      } else {
        value = 'Tags';
      }
      return value;
    },
    searchDistanceOptions() {
      return [
        '1 ' + this.$i18n.messages[this.i18nLocale]['mile'],
        '2 ' + this.$i18n.messages[this.i18nLocale]['miles'],
        '3 ' + this.$i18n.messages[this.i18nLocale]['miles'],
        '4 ' + this.$i18n.messages[this.i18nLocale]['miles'],
        '5 ' + this.$i18n.messages[this.i18nLocale]['miles']
      ];
    },
    anySearch() {
      let value = true;
      if (Object.keys(this.$config).includes('anySearch')) {
        value = this.$config.anySearch
      } //else {
      //   value = true;
      // }
      return value;
    },
    showPrintAndShare() {
      let value = false;
      if (this.$route.name == 'home') {
        value = true;
      }
      return value;
    },
    sortByOptions() {
      let value = {};
      value.Alphabetically = this.$i18n.messages[this.i18nLocale]['alphabetically'];
      value.Distance = this.$i18n.messages[this.i18nLocale]['distance'];
      return value;
    },
    allowPrint() {
      let value = false;
      if (this.$config.allowPrint) {
        value = true;
      }
      return value;
    },
    database() {
      return this.$store.state.databaseWithoutHiddenItems;
    },
    databaseLength() {
      return this.database.length
    },
    summarySentenceStart() {
      let sentence = this.$i18n.messages[this.i18nLocale]['showing'] + ' ' + this.currentData.length + ' ' + this.$i18n.messages[this.i18nLocale]['outOf'] + ' ' + this.databaseLength + ' ' + this.$i18n.messages[this.i18nLocale]['results'];
      if (this.selectedKeywords.length || this.zipcodeEntered || this.addressEntered || this.selectedServices.length) {
        sentence += ' ' + this.$i18n.messages[this.i18nLocale]['for'] + ' '; 
      }
      return sentence;
    },
    summarySentenceEnd() {
      let sentence = '';
      if (this.selectedKeywords.length) {
        for (let keyword of this.selectedKeywords) {
          sentence += '"' + keyword + '"';
          if (this.zipcodeEntered || this.addressEntered || this.selectedServices.length) {
            sentence += ' : ';
          }
        }
      }
      if (this.zipcodeEntered) {
        sentence += this.zipcodeEntered;

        sentence += ' - ';
        sentence += this.searchDistance;

        // let word;
        // if (this.searchDistance == 1) {
        //   word = ' ' + this.$i18n.messages[this.i18nLocale]['mile'];
        // } else {
        //   word = ' ' + this.$i18n.messages[this.i18nLocale]['miles'];
        // }
        // sentence += word;

        if (this.selectedServices.length) {
          sentence += ' : ';
        }
      }
      if (this.addressEntered) {
        sentence += this.addressEntered;
        sentence += ' - ';
        sentence += this.searchDistance;

        // let word;
        // if (this.searchDistance == 1) {
        //   word = ' ' + this.$i18n.messages[this.i18nLocale]['mile'];
        // } else {
        //   word = ' ' + this.$i18n.messages[this.i18nLocale]['miles'];
        // }
        // sentence += word;
        
        if (this.selectedServices.length) {
          sentence += ' : ';
        }
      }
      if (this.selectedServices.length) {
        if (typeof this.selectedServices == 'string') {
          // console.log('this.$i18n.messages[this.i18nLocale][this.selectedServices]:', this.$i18n.messages[this.i18nLocale]);
          sentence += this.$i18n.messages[this.i18nLocale][this.selectedServices];
        } else {
          if (Array.isArray(this.refineList)) {
            for (let service of this.selectedServices) {
              sentence += service;
              if (this.selectedServices.indexOf(service) < this.selectedServices.length-1) {
                sentence += ' : ';
              }
            }
          } else {
            for (let service of this.selectedServices) {
              // console.log('in summarySentenceEnd, if else for service:', service);
              let refineList = this.refineList;
              for (let key of Object.keys(refineList)) {
                for (let key2 of Object.keys(refineList[key])) {
                  if (key2 === 'radio' || key2 === 'checkbox') {
                    for (let key3 of Object.keys(refineList[key][key2])) {
                      if (refineList[key][key2][key3].unique_key == service) {
                        sentence += this.$i18n.messages[this.i18nLocale][key][key3];//.toLowerCase();
                      }
                    }
                  }
                }
              }
              if (this.selectedServices.indexOf(service) < this.selectedServices.length-1) {
                sentence += ' : ';
              }
            }
          }
        }
      }
      return sentence;
    },
    refineList() {
      return this.$store.state.refineList;
    },
    i18nLocale() {
      return this.$i18n.locale;
    },
    zipcodeEntered() {
      return this.$store.state.selectedZipcode;
    },
    geocode() {
      return this.$store.state.geocode;
    },
    addressEntered() {
      let address;
      let routeAddress = this.$route.query.address;
      console.log('addressEntered computed, routeAddress:', routeAddress);
      if (this.geocode && this.geocode.properties && this.geocode.properties.street_address) {
        address = this.geocode.properties.street_address;
      } else if (routeAddress) {
        address = routeAddress;
      }
      return address;
    },
    watchPositionOn() {
      return this.$store.state.map.watchPositionOn;
    },
    sortDisabled() {
      let value;
      let geocodeStatus = this.geocodeStatus;
      let zipcodeCenter = this.zipcodeCenter;
      let watchPositionOn = this.watchPositionOn;
      // console.log('computed sortDisabled, geocodeStatus:', geocodeStatus, 'zipcodeCenter:', zipcodeCenter);
      if (geocodeStatus || zipcodeCenter[0] || watchPositionOn) {
        value = false;
      } else {
        value = true;
      }
      return value;
    },
    shouldShowGreeting() {
      return this.$store.state.shouldShowGreeting;
    },
    i18nEnabled() {
      let value;
      if (this.$config.i18n && this.$config.i18n.enabled) {
        value = true;
      } else {
        value = false;
      }
      return value;
    },
    hasCustomGreeting() {
      let value = false;
      if (this.$config.customComps) {
        value = Object.keys(this.$config.customComps).includes('customGreeting');
      }
      return value;
    },
    greetingText() {
      let value;
      if (this.$config.greeting) {
        value = this.$config.greeting.message;
      } else {
        value = null;
      }
      return value;
    },
    greetingOptions() {
      let value;
      if (this.$config.greeting) {
        value = this.$config.greeting.options;
      } else {
        value = {};
      }
      return value;
    },
    zipcode() {
      return this.$store.state.selectedZipcode;
    },
    geocode() {
      return this.$store.state.geocode.data;
    },
    geocodeStatus() {
      return this.$store.state.geocode.status;
    },
    zipcodeCenter() {
      return this.$store.state.zipcodeCenter;
    },
    selectedKeywords() {
      return this.$store.state.selectedKeywords;
    },
    selectedServices() {
      return this.$store.state.selectedServices;
    },
    selectedResources() {
      return this.$store.state.selectedResources;
    },
    latestSelectedResourceFromMap() {
      return this.$store.state.map.latestSelectedResourceFromMap;
    },
    orgTitle() {
      return 'agencyname';
    },
    // ...mapState([ 'sources' ]),
    currentData() {
      const locations = this.$store.state.currentData;

      let currentQuery = { ...this.$route.query };
      let currentQueryKeys = Object.keys(currentQuery);

      console.log('LocationsPanel.vue currentData computed, currentQuery:', currentQuery, 'currentQueryKeys:', currentQueryKeys);

      let valOrGetter = this.locationInfo.siteName;
      const valOrGetterType = typeof valOrGetter;
      let val;

      // console.log('LocationsPanel.vue, currentData, locations:', locations, 'valOrGetter:', valOrGetter, 'valOrGetterType:', valOrGetterType);

      // if (currentQueryKeys.includes('address')) {
      if (this.sortBy == 'Distance') {
        console.log('LocationsPanel.vue currentData computed, this.sortBy:', this.sortBy);
        val = 'distance';
        // console.log('it includes address');
        locations.sort(function(a, b) {
          // console.log('a:', a, 'b:', b, 'val:', val);
          // if (a[val] != null && b[val] != null) {
          //   return a[val].localeCompare(b[val]);
          // }
          if (a[val] < b[val]) {
              return -1;
            }
            if (a[val] > b[val]) {
              return 1;
            }
            return 0;
        });
      } else {
        console.log('LocationsPanel.vue currentData computed, this.sortBy:', this.sortBy);
        if (valOrGetterType === 'function') {
          const getter = valOrGetter;
          locations.sort(function(a, b) {
            let valueA = getter(a, transforms);
            let valueB = getter(b, transforms);
            // console.log('valueA:', valueA, 'valueB:', valueB, 'value:', value);
            let value;
            if (valueA && valueB) {
              value = valueA.localeCompare(valueB, undefined, { numeric: true });
            }
            // return valueA.localeCompare(valueB);
            return value;
          });
        } else {
          val = valOrGetter;
          locations.sort(function(a, b) {
            // console.log('a:', a, 'b:', b, 'val:', val);
            if (a[val] != null && b[val] != null) {
              return a[val].localeCompare(b[val]);
            }
          });
        }
      }
      return locations;
    },
    currentDataList() {
      return this.currentData.map(row => row._featureId);
    },
    dataStatus() {
      return this.$store.state.sources[this.$appType].status;
    },
    locationInfo() {
      return this.$config.locationInfo;
    },
    noLocations() {
      return this.$i18n.messages[this.i18nLocale]['noLocations'];
    },
    copiedUrl() {
      return this.$i18n.messages[this.i18nLocale]['copiedUrl'];
    },
  },
  watch: {
    i18nLocale(nexti18nLocale){
      let value = this.searchDistance.split(' ')[0];
      console.log('i18nLocale change, nexti18nLocale:', nexti18nLocale, 'value:', value);
      if (value == 1) {
        this.searchDistance = value + ' ' + this.$i18n.messages[this.i18nLocale]['mile'];
      } else {
        this.searchDistance = value + ' ' + this.$i18n.messages[this.i18nLocale]['miles'];
      }
    },
    searchDistance(nextSearchDistance) {
      this.$store.commit('setSearchDistance', parseInt(nextSearchDistance));
    },
    selectAllCheckbox(nextSelectAllCheckbox) {
      console.log('watch selectAllCheckbox, nextSelectAllCheckbox:', nextSelectAllCheckbox);
      if (nextSelectAllCheckbox == false) {
        this.printCheckboxes = [];
        let inputs = document.querySelectorAll('.location-checkbox');
        // console.log('inputs:', inputs);
        for (var i = 0; i < inputs.length; i++) {
          inputs[i].checked = false;
        }
      } else {
        this.printCheckboxes = this.currentDataList;
        let inputs = document.querySelectorAll('.location-checkbox');
        // console.log('inputs:', inputs);
        for (var i = 0; i < inputs.length; i++) {
          inputs[i].checked = true;
        }
      }
      this.$store.commit('setPrintCheckboxes', this.printCheckboxes);
    },
    zipcode(nextZipcode) {
      this.$store.commit('setShouldShowGreeting', false);
    },
    geocodeStatus(nextGeocodeStatus) {
      this.$store.commit('setShouldShowGreeting', false);
      if (nextGeocodeStatus == null) {
        this.$data.sortBy = 'Alphabetically';
      } else {
        this.$data.sortBy = 'Distance';
      }
    },
    zipcodeCenter(nextZipcodeCenter) {
      if (nextZipcodeCenter[0]) {
        this.$data.sortBy = 'Distance';
      } else {
        this.$data.sortBy = 'Alphabetically';
      }
    },
    selectedKeywords(nextSelectedKeywords) {
      // console.log('watch, nextSelectedKeywords:', nextSelectedKeywords);
      this.$store.commit('setShouldShowGreeting', false);
    },
    selectedServices(nextSelectedServices) {
      // console.log('watch, nextSelectedServices:', nextSelectedServices);
      if (nextSelectedServices.length) {
        this.$store.commit('setShouldShowGreeting', false);
      }
    },
    selectedResources(nextSelectedResources) {
      // console.log('watch, nextSelectedResources:', nextSelectedResources);
      this.$store.commit('setShouldShowGreeting', false);
    },
  },
  methods: {
    clickedShare() {
      console.log('clickedShare is running');
      var dummy = document.createElement('input'),
        text = window.location.href;

      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);

      this.$success(this.copiedUrl, {
        duration: 3000,
        closeOnClick: true,
      });
    },
    clearBadAddress() {
      this.$emit('clear-bad-address');
    },
    // clickedSinglePrint(item) {
    //   console.log('clickedSinglePrint is running');
    //   this.$store.commit('setPrintCheckboxes', [ item._featureId ]);
    //   this.$router.push({ name: 'printView'  });
    // },
    clickedPrint() {
      this.$store.commit('setSelectedZipcode', null);
      console.log('clickedPrint is running');
      if (!this.printCheckboxes.length) {
        this.$warning(this.noLocations, {
          duration: 3000,
          closeOnClick: true,
        });
        return;
      }
      this.$router.push({ name: 'printView'  });
    },
    printBoxChecked(id) {
      console.log('LocationsPanel printBoxChecked, id:', id);
      if (this.printCheckboxes.includes(id)) {
        this.printCheckboxes.splice(this.printCheckboxes.indexOf(id), 1);
        this.$store.commit('setPrintCheckboxes', this.printCheckboxes);
      } else {
        this.printCheckboxes.push(id);
        this.$store.commit('setPrintCheckboxes', this.printCheckboxes);
      }
    },
    clickedSelectAll() {
      console.log('LocationsPanel clickedSelectAll is running');
      if (this.selectAllCheckbox) {
        console.log('clickedSelect all if');
        this.$data.selectAllCheckbox = false;
      } else {
        console.log('clickedSelect all else');
        this.$data.selectAllCheckbox = true;
      }
    },
    clickedViewList() {
      // console.log('clickedViewList is running');
      // if (!this.isMobile) {
      //   this.$store.commit('setRefineOpen', true);
      // }
      this.$store.commit('setShouldShowGreeting', false);
      this.$gtag.event('click', {
        'event_category': this.$store.state.gtag.category,
        'event_label': 'view list',
      });
    },
    getLocationsList() {
      const locations = this.sources[this.$appType].data.rows;
      // const locations = this.bufferlist
      return locations;
    },
    // TODO: handle edge cases
    parseAddress(address) {
      const formattedAddress = address.replace(/(Phila.+)/g, city => `<div>${city}</div>`).replace(/^\d+\s[A-z]+\s[A-z]+/g, lineOne => `<div>${lineOne}</div>`).replace(/,/, '');
      return formattedAddress;
    },
    parseServiceList(list) {
      const formattedService = list;
      return formattedService;
    },
    parseTagsList(list) {
      const formattedTags = list.slice().sort().join(", ");
      return formattedTags;
    },
    makeValidUrl(url) {
      let newUrl = window.decodeURIComponent(url);
      newUrl = newUrl
        .trim()
        .replace(/\s/g, '');
      if (/^(:\/\/)/.test(newUrl)) {
        return `http${newUrl}`;
      }
      if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
        return `http://${newUrl}`;
      }
      return newUrl;
    },
  },
};
</script>

<style lang="scss">

.mobile-dropdown-container {
  // margin-left: -10px;
  margin-right: -10px;
}

.dropdown-div {
  padding-top: 0px !important;
}

.locations-panel {
  overflow-y: visible !important;
  // width: 100%;
}

.summary-and-location-container {
  // padding: 1rem;
  // width: 100%;
  overflow-y: visible;
}

.summary-container {
  // position: absolute;
  padding-left: 1rem;
  // padding-right: 1rem;
  padding-top: 1rem;
  // background-color: rgba(225, 225, 225, 1);
  // width: 48%;
  z-index:9;
  background:#fff
}

@media (max-width: 767px) {
  .summary-container {
    // width: 100%;
  }
}

.location-container {
  padding: 1rem;
}

@media (min-width: 1024px) {
  .location-container {
    width: 100%;
  }

  .summary-container {
    width: 100%;
    position: sticky;
    top: 0;
    width: 100%;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .location-container {
    // padding-top: 170px;
    width: 100%;
  }

  .summary-container {
    position: sticky;
    top: 0;
    width: 100%;
    padding-top: .5rem;
  }

  .loc-panel-widget {
    padding-top: 0px !important;
  }

}

@media (max-width: 767px) {
  .location-container {
    // padding-top: 120px;
  }

  .summary-container {
    position: sticky;
    top: 0;
    width: 100%;
  }
}

.cut-right {
  margin-right: .1rem !important;
}

.no-results {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;
  padding-top: 12rem;
}

.section-title {
  margin-bottom: .5rem !important;
}

.main-content {
  padding-top: .5rem;
  padding-bottom: 1.5rem;
}

.app-button:focus {
  color: white !important;
}

.card-button {
  border-width: 0px !important;
  color: #0f4d90 !important;
}

.card-button:hover {
  color: black !important;
}

.card-button:focus:not(:active), .card-button.is-focused:not(:active) {
  box-shadow: none !important;
}
.card-button-text {
  font-family: "OpenSans-Regular", "Open Sans", sans-serif;
  font-size: 14px;
  padding-left: 5px;
  text-transform: none;
}

.top-section {
  padding-top: 1rem;
}

.button.disabled, fieldset.disabled .button {
  // background-color: #878787 !important;
  // border-color: #878787 !important;
  background-color: #cfcfcf !important;
  border-color: #cfcfcf !important;
}

.button.disabled, fieldset.disabled .button {
  // background-color: #878787 !important;
  // border-color: #878787 !important;
  background-color: #cfcfcf !important;
  border-color: #cfcfcf !important;
  cursor: not-allowed;
}

.button.disabled:focus:not(:active), .button.disabled.is-medium:focus:not(:active), .button.disabled.is-default:focus:not(:active) {
  box-shadow: 0 0 0 0em #25cef7 !important;
}

</style>
