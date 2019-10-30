<template>
  <div class="cell medium-12 medium-cell-block-y locations-panel">
    <div
      v-if="dataStatus === 'success'"
      class="location-container"
    >
      <div
        v-if="currentData.length === 0"
        class="h3"
      >
        <p>
          We're sorry, there are no results for that search.
          Adjust the filters you've selected and try again.
        </p>
      </div>
      <div
        v-for="item in currentData"
        :key="item.cartodb_id"
      >
        <ExpandCollapse
          :item="item"
          :is-map-visible="isMapVisible"
          :slots="locationSlots"
          >
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
          <div v-if="item.tags">
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
        </ExpandCollapse>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import ExpandCollapse from './ExpandCollapse.vue';

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
  computed: {
    orgTitle() {
      return 'agencyname';
    },
    ...mapState([ 'sources' ]),
    currentData() {
      const locations = this.$store.state.currentData;
      // locations.sort((a, b) => a.organization_name.localeCompare(b.organization_name));
      return locations;
    },
    currentDataList() {
      return this.currentData.map(row => row._featureId);
    },
    dataStatus() {
      return this.$store.state.sources[this.$appType].status;
    },
    locationSlots() {
      return this.$config.locationSlots;
    },
  },
  methods: {
    // filterExpand(item) {
    //   // console.log('filterExpand is running, item:', item);
    //   return this.currentDataList.includes(item._featureId);
    //   // first filter by services
    //   // const servicesOffered = item.services_offered;
    //   // const servicesSplit = servicesOffered.split(',');
    //   // const { selectedServices } = this.$store.state;
    //   // if (selectedServices.length === 0) {
    //   //   return true;
    //   // }
    //   // const servicesFiltered = servicesSplit.filter(f => selectedServices.includes(f));
    //   // const booleanServices = servicesFiltered.length > 0;
    //
    //   // second filter by bufferList
    //   // const booleanBuffer = this.$store.state.bufferList.includes(item._featureId);
    //   //
    //   // return booleanServices && booleanBuffer;
    // },
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
  height: calc(100vh - 300px);
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
    margin-top: 3rem;
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
