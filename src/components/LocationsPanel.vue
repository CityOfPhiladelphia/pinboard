<template>
  <div class="locations-panel">

    <div
      v-if="shouldShowGreeting"
      class="topics-container cell medium-cell-block-y"
    >
      <greeting
        v-if="shouldShowGreeting && !hasCustomGreeting"
        :message="greetingText"
        :options="greetingOptions"
        @view-list="clickedViewList"
      />

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
        class="h3"
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
        :key="item.cartodb_id"
      >
        <expand-collapse
          :item="item"
          :is-map-visible="isMapVisible"
        >

          <component
            :is="'expandCollapseContent'"
            v-if="$config.customComps && Object.keys($config.customComps).includes('expandCollapseContent')"
            :item="item"
            :is-map-visible="isMapVisible"
          />

          <div v-if="!$config.customComps || !Object.keys($config.customComps).includes('expandCollapseContent')">
            <div class="grid-x grid-padding-x">
              <div class="cell medium-12">
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
              <div class="cell medium-12">
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
                  <span><a :href="makeValidUrl(item.website)">{{ item.website }}</a></span>
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
            <div v-if="item.services_offered">
              <section class="services grid-x grid-padding-x">
                <div class="cell">
                  <h3 class="h4">
                    Services offered
                  </h3>
                  <div class="grid-x">
                    <div
                      v-for="i in parseServiceList(item.services_offered)"
                      :key="i"
                      class="cell medium-12 service-item"
                    >
                      {{ i }}
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div v-if="item.tags && item.tags.length">
              <section class="tags grid-x grid-padding-x mtm">
                <div class="cell">
                  <h3 class="h4">
                    Tags
                  </h3>
                  <div class="grid-x">
                    <div>
                      {{ parseTagsList(item.tags) }}
                    </div>
                  </div>
                </div>
              </section>
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
    // Greeting: () => import(/* webpackChunkName: "pb_Greeting" */'./Greeting.vue'),
  },
  props: {
    isMapVisible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    const data = {
      'shouldShowGreeting': true,
    };
    return data;
  },
  mounted() {
    // console.log('LocationsPanel.vue mounted, this.$config:', this.$config);
    if (!this.$config.greeting && (!this.$config.customComps || !this.$config.customComps.customGreeting)) {
      this.shouldShowGreeting = false;
    }
  },
  computed: {
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
    orgTitle() {
      return 'agencyname';
    },
    ...mapState([ 'sources' ]),
    currentData() {
      const locations = this.$store.state.currentData;

      let valOrGetter = this.locationInfo.siteName;
      const valOrGetterType = typeof valOrGetter;
      let val;

      if (valOrGetterType === 'function') {
        const getter = valOrGetter;
        locations.sort(function(a, b) {
          let valueA = getter(a, transforms);
          let valueB = getter(b, transforms);
          // console.log('valueA:', valueA, 'valueB:', valueB);
          let value;
          if (valueA && valueB) {
            value = valueA.localeCompare(valueB);
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
      this.shouldShowGreeting = false;
    },
    selectedKeywords(nextSelectedKeywords) {
      // console.log('watch, nextSelectedKeywords:', nextSelectedKeywords);
      this.shouldShowGreeting = false;
    },
    selectedServices(nextSelectedServices) {
      // console.log('watch, nextSelectedServices:', nextSelectedServices);
      this.shouldShowGreeting = false;
    },
    selectedResources(nextSelectedResources) {
      // console.log('watch, nextSelectedResources:', nextSelectedResources);
      this.shouldShowGreeting = false;
    },
  },
  methods: {
    clickedViewList() {
      // console.log('clickedViewList is running');
      this.shouldShowGreeting = false;
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
  overflow-y: auto;
  // height: calc(100vh - 192px);
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
  .services{
    margin-top: 1rem;
  }
  .service-item{
    margin-bottom: .5rem;
  }
  .tags {
    margin-top: 2rem;
  }
}
.location-container{
  padding: 1rem;
}
</style>
