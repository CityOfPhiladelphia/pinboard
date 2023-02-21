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
      <!-- <div
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
      </div> -->

      <div class="summary-container">
        <div
          v-if="!isMobile && geocodeStatus !== 'error' && currentData.length > 0"
          class="columns is-desktop mb-0"
        >
          <div class="column is-8-desktop is-12-tablet mr-0 mb-0 pb-0 columns">
            <div class="field column is-6 pt-5">
              <input
                class="is-checkradio location-checkbox"
                id="locationsPanelCheckbox"
                type="checkbox"
                name="locationsPanelCheckbox"
                @click="clickedSelectAll"
              >
              <label for="locationsPanelCheckbox">Select All</label>
            </div>
            <div class="column is-6 pt-3">
              <a
                class="button app-button"
                @click="clickedPrint"
              >
                Print
              </a>
            </div>
          </div>
          <div
            v-if="currentData.length > 0"
            class="column is-4-desktop is-12-tablet p-0"
          >
            <dropdown
              v-model="sortBy"
              :options="dropdownOptions"
              placeholder="Sort By"
              :disabled="sortDisabled"
            />
          </div>
        </div>

        <div
          v-if="isMobile && geocodeStatus !== 'error' && currentData.length > 0"
          class="mb-1 mobile-dropdown-container"
        >
          <dropdown
            v-model="sortBy"
            :options="dropdownOptions"
            placeholder="Sort By"
            :disabled="sortDisabled"
          />
        </div>

        <div
          v-if="geocodeStatus !== 'error'"
          class="mt-2 mb-2"
        >
          {{ summarySentenceStart }} <b><i>{{ summarySentenceEnd }}</i></b>
        </div>
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
              <div class="columns">
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
                      <!-- {{ parseAddress(item.street_address) }} -->
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
                <h3>
                  Services offered
                </h3>
                <div class="columns is-multiline is-gapless">
                  <div
                    v-for="i in parseServiceList(item.services_offered)"
                    :key="i"
                    class="column is-half"
                  >
                    {{ i }}
                  </div>
                </div>
              </div>

              <div
                v-if="item.tags && item.tags.length"
              >
                <!-- <h3 class="title section-title is-4 pt-2"> -->
                <h3>
                  Tags
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

export default {
  components: {
    ExpandCollapse,
    Dropdown,
    SingleCheckbox,
  },
  props: {
    isMapVisible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      sortBy: 'Alphabetically',
      dropdownOptions: [ "Alphabetically", "Distance" ],
      // singleCheckboxOptions: [{ 'option-1': 'Option 1' }],
      printCheckboxes: [],
      selectAllCheckbox: false,
    };
  },
  mounted() {
    // console.log('LocationsPanel.vue mounted, this.$config:', this.$config);
    if (!this.$config.greeting && (!this.$config.customComps || !this.$config.customComps.customGreeting)) {
      this.$store.commit(setShouldShowGreeting, false);
    }
  },
  computed: {
    summarySentenceStart() {
      let sentence = 'Showing ' + this.currentData.length + ' resources';
      if (this.selectedKeywords.length || this.zipcodeEntered || this.addressEntered || this.selectedServices.length) {
        sentence += ' for '; 
      }
      return sentence;
    },
    summarySentenceEnd() {
      let sentence = '';
      if (this.selectedKeywords.length) {
        for (let keyword of this.selectedKeywords) {
          sentence += keyword;
          if (this.zipcodeEntered || this.addressEntered || this.selectedServices.length) {
            sentence += ': ';
          }
        }
      }
      if (this.zipcodeEntered) {
        sentence += this.zipcodeEntered;
        if (this.selectedServices.length) {
          sentence += ': ';
        }
      }
      if (this.addressEntered) {
        sentence += this.addressEntered;
        sentence += ' - ';
        sentence += this.searchDistance;
        if (this.selectedServices.length) {
          sentence += ': ';
        }
      }
      if (this.selectedServices.length) {
        for (let service of this.selectedServices) {
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
            sentence += ': ';
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
    searchDistance() {
      let value;
      if (this.$config.searchBar.searchDistance) {
        value = this.$config.searchBar.searchDistance;
      } else {
        value = 1
      }
      let word;
      if (value == 1) {
        word = 'mile';
      } else {
        word = 'miles';
      }
      return value + ' ' + word;
    },
    sortDisabled() {
      let value;
      let geocodeStatus = this.geocodeStatus;
      let zipcodeCenter = this.zipcodeCenter;
      console.log('computed sortDisabled, geocodeStatus:', geocodeStatus, 'zipcodeCenter:', zipcodeCenter);
      if (geocodeStatus || zipcodeCenter[0]) {
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
    ...mapState([ 'sources' ]),
    currentData() {
      const locations = this.$store.state.currentData;

      let currentQuery = { ...this.$route.query };
      let currentQueryKeys = Object.keys(currentQuery);

      // console.log('LocationsPanel.vue currentData computed, currentQuery:', currentQuery, 'currentQueryKeys:', currentQueryKeys);

      let valOrGetter = this.locationInfo.siteName;
      const valOrGetterType = typeof valOrGetter;
      let val;

      console.log('LocationsPanel.vue, currentData, locations:', locations, 'valOrGetter:', valOrGetter, 'valOrGetterType:', valOrGetterType);

      // if (currentQueryKeys.includes('address')) {
      if (this.sortBy == 'Distance') {
        val = 'distance';
        console.log('it includes address');
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
  },
  watch: {
    selectAllCheckbox(nextSelectAllCheckbox) {
      console.log('watch selectAllCheckbox, nextSelectAllCheckbox:', nextSelectAllCheckbox);
      if (nextSelectAllCheckbox == false) {
        // this.$nextTick(() => {
          this.printCheckboxes = [];
          let inputs = document.querySelectorAll('.location-checkbox');
          // console.log('inputs:', inputs);
          for (var i = 0; i < inputs.length; i++) {
            inputs[i].checked = false;
          }
        // });
      } else {
        // this.$nextTick(() => {
          this.printCheckboxes = this.currentDataList;
          let inputs = document.querySelectorAll('.location-checkbox');
          // console.log('inputs:', inputs);
          for (var i = 0; i < inputs.length; i++) {
            inputs[i].checked = true;
          }
        // });
      }
      this.$store.commit('setPrintCheckboxes', this.printCheckboxes);
    },
    zipcode(nextZipcode) {
      this.$store.commit('setShouldShowGreeting', false);
    },
    // geocode(nextGeocode) {
    //   // console.log('watch, nextGeocode:', nextGeocode);
    //   this.$store.commit('setShouldShowGreeting', false);
    // },
    geocodeStatus(nextGeocodeStatus) {
      this.$store.commit('setShouldShowGreeting', false);
      if (nextGeocodeStatus == null) {
        this.$data.sortBy = 'Alphabetically';
      } else {
        this.$data.sortBy = 'Distance';
      }
    },
    zipcodeCenter(nextZipcodeCenter) {
      // console.log('watch');
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
    clearBadAddress() {
      this.$emit('clear-bad-address');
    },
    clickedPrint() {
      console.log('clickedPrint is running');
      if (!this.printCheckboxes.length) {
        alert('There are no locations selected for printing');
        return;
      }
      // this.$router.push({ name: 'user', params: { userId: '123' } });
      this.$router.push({ name: 'printView'  });
      // window.open('./print-view/' + this.printCheckboxes[0], '_blank');
    },
    printBoxChecked(id) {
      console.log('LocationsPanel printBoxChecked, id:', id);
      // e.stopPropagation();
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
      if (!this.isMobile) {
        this.$store.commit('setRefineOpen', true);
      }
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
  margin-left: -10px;
  margin-right: -10px;
}

.dropdown-div {
  padding-top: 0px !important;
}

.locations-panel {
  overflow-y: visible !important;
}

.summary-and-location-container {
  // padding: 1rem;
  overflow-y: visible;
}

.summary-container {
  position: absolute;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
  // background-color: rgba(225, 225, 225, 1);
  width: 48%;
  z-index:9;
  background:#fff
}

@media (max-width: 767px) {
  .summary-container {
    width: 100%;
  }
}

.location-container {
  padding: 1rem;
}

@media (min-width: 1024px) {
  .location-container {
    padding-top: 150px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .location-container {
    padding-top: 270px;
  }
}

@media (max-width: 767px) {
  .location-container {
    padding-top: 200px;
  }
}

.no-results {
  padding: 1rem;
}

.section-title {
  margin-bottom: .5rem !important;
}

</style>
