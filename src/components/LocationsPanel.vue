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
      class="location-container"
    >
      <div
        v-if="currentData.length === 0"
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
        v-for="item in currentData"
        :key="item._featureId"
      >
      <!-- :key="item.cartodb_id" -->
        <expand-collapse
          :item="item"
          :is-map-visible="isMapVisible"
        >

          <component
            :is="'expandCollapseContent'"
            v-if="$config.customComps && Object.keys($config.customComps).includes('expandCollapseContent') && selectedResources.includes(item._featureId)"
            :item="item"
            :is-map-visible="isMapVisible"
          />

          <div v-if="!$config.customComps || !Object.keys($config.customComps).includes('expandCollapseContent') && selectedResources.includes(item._featureId)">
            <div class="columns is-marginless">

              <div class="column">
                <div
                  v-if="item.street_address"
                  class="detail"
                >
                  <font-awesome-icon icon="map-marker-alt" />
                  <span v-html="parseAddress(item.street_address)">
                    {{ parseAddress(item.street_address) }}
                  </span>
                </div>
              </div>

              <div class="column">
                <div
                  v-if="item.phone_number"
                  class="detail"
                >
                  <font-awesome-icon icon="phone" />
                  <span>{{ item.phone_number }}</span>
                </div>
                <div
                  v-if="item.email"
                  class="detail"
                >
                  <font-awesome-icon icon="envelope" />
                  <span><a :href="`mailto:${item.email}`">{{ item.email }}</a></span>
                </div>
                <div
                  v-if="item.website"
                  class="detail"
                >
                  <font-awesome-icon icon="globe" />
                  <span><a target="_blank" :href="makeValidUrl(item.website)">{{ item.website }}</a></span>
                </div>
                <div
                  v-if="item.facebook_name"
                  class="detail"
                >
                  <font-awesome-icon :icon="['fab', 'facebook']" />
                  <span><a :href="item.facebook_name">Facebook</a></span>
                </div>
                <div
                  v-if="item.twitter"
                  class="detail"
                >
                  <font-awesome-icon :icon="['fab', 'twitter']" />
                  <span><a :href="item.twitter">Twitter</a></span>
                </div>
              </div>
            </div>

            <div
              v-if="item.services_offered"
            >
              <h3 class="title section-title is-4">
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
              <h3 class="title section-title is-4 pt-2">
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
</template>
<script>

import { mapState } from 'vuex';
import ExpandCollapse from './ExpandCollapse.vue';
import transforms from '../util/transforms.js';

export default {
  components: {
    ExpandCollapse,
  },
  props: {
    isMapVisible: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    // console.log('LocationsPanel.vue mounted, this.$config:', this.$config);
    if (!this.$config.greeting && (!this.$config.customComps || !this.$config.customComps.customGreeting)) {
      this.$store.commit(setShouldShowGreeting, false);
    }
  },
  computed: {
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
    geocode() {
      return this.$store.state.geocode.data;
    },
    geocodeStatus() {
      return this.$store.state.geocode.status;
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

      let valOrGetter = this.locationInfo.siteName;
      const valOrGetterType = typeof valOrGetter;
      let val;

      // console.log('LocationsPanel.vue, currentData, valOrGetter:', valOrGetter, 'valOrGetterType:', valOrGetterType);

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
    geocode(nextGeocode) {
      // console.log('watch, nextGeocode:', nextGeocode);
      this.$store.commit('setShouldShowGreeting', false);
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

.locations-panel{
  overflow-y: visible !important;

  .detail{
    margin-bottom: 1rem;
    svg {
      vertical-align: top;
      margin-top: .5rem;
    }
    span {
      display: inline-block;
      max-width: calc(100% - 1rem);
      word-break: break-word;
      padding-left: 2rem;
    }
  }
  // .services{
  //   margin-top: 1rem;
  // }
  // .service-item{
  //   margin-bottom: 0px;
  //   padding-bottom: 0px;
  //   padding-top: 0px;
  // }
  // .tags {
  //   margin-top: 2rem;
  // }
}

.location-container {
  padding: 1rem;
  overflow-y: visible;
}

.no-results {
  padding: 1rem;
}

.section-title {
  margin-bottom: .5rem !important;
}

</style>
