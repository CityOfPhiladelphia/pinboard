<template>
  <div class="cell medium-12 medium-cell-block-y locations-panel">
    <div class="location-container"
      v-if="sources.immigrant.status === 'success'">
        <div v-if="currentData.length === 0"
          class="h3">
          <p>We're sorry, there are no results for that search.
            Adjust the filters you've selected and try again.</p>
        </div>
      <div v-for="item in currentData"
        :key="item.cartodb_id">
        <ExpandCollapse :title="item.organization_name"
                        :item="item"
        >
          <div class="grid-x grid-padding-x">
            <div class="cell medium-12">
              <div class="detail" v-if="item.street_address">
                <font-awesome-icon icon="map-marker-alt"/>
                <span v-html="parseAddress(item.street_address)">
                  {{parseAddress(item.street_address)}}
                </span>
              </div>
            </div>
            <div class="cell medium-12">
              <div class="detail" v-if="item.phone_number">
                <font-awesome-icon icon="phone"/>
                <span>{{ item.phone_number }}</span>
              </div>
              <div class="detail" v-if="item.email">
                <font-awesome-icon icon="envelope"/>
                <span><a :href="`mailto:${item.email}`">{{ item.email }}</a></span>
              </div>
              <div class="detail" v-if="item.facebook_name">
                <font-awesome-icon :icon="['fab', 'facebook']"/>
                <span><a :href="item.facebook_name">Facebook</a></span>
              </div>
              <div class="detail" v-if="item.twitter">
                <font-awesome-icon :icon="['fab', 'twitter']"/>
                <span><a :href="tem.twitter">Twitter</a></span>
              </div>
            </div>
          </div>
          <div v-if="item.services_offered != ''">
            <section class="services grid-x grid-padding-x">
              <div class="cell">
                <h3 class="h4">Services offered</h3>
                <div v-for="i in parseServiceList(item.services_offered)"
                :key="i">{{i}}</div>
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
  data() {
    return {
      appType: Object.keys(this.$store.state.sources),
    };
  },
  components: {
    ExpandCollapse,
  },
  computed: {
    ...mapState(['sources']),
    currentData() {
      const locations = this.$store.state.currentData;
      locations.sort((a, b) => a.organization_name.localeCompare(b.organization_name));
      return locations;
    },
    currentDataList() {
      return this.currentData.map(row => row._featureId);
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
      const locations = this.sources[this.$data.appType].data.rows;
      // const locations = this.bufferlist
      return locations;
    },
    // TODO: handle edge cases
    parseAddress(address) {
      const formattedAddress = address.replace(/(Phila.+)/g, city => `<div>${city}</div>`).replace(/^\d+\s[A-z]+\s[A-z]+/g, lineOne => `<div>${lineOne}</div>`).replace(/,/, '');
      return formattedAddress;
    },
    parseServiceList(list) {
      const formattedService = list.split(',');
      return formattedService;
    },
  },
};
</script>

<style lang="scss">

.locations-panel{
  overflow-y: auto;
  height: 100vh;
  .detail{
    margin-bottom: 1rem;
    svg {
      vertical-align: top;
      margin-top: .5rem;
    }
    span {
      display: inline-block;
      padding-left: 2rem;
      max-width: calc(100% - .75em);
    }
  }
  .services{
    margin-top: 3rem;
  }
}
.location-container{
  padding: 1rem;
}

</style>
