<template>
  <div class="cell medium-12 medium-cell-block-y locations-panel">
    <div class="location-container"
      v-if="sources.immigrant.status === 'success'">
      <div v-for="item in getLocationsList()"
        :key="item.cartodb_id">

        <ExpandCollapse :title="item.organization_name">
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
      <!-- <div class="step-group">
          <div class="step-label">1</div>

          <div class="step">
            <div class="step-title">Step 1</div>
            <div class="step-content">
            </div>
          </div>
          <div class="step-label">2</div>

          <div class="step">
            <div class="step-title">Step 2</div>
            <div class="step-content">
            </div>
          </div>
        <div class="step-label">3</div>

          <div class="step">
            <div class="step-title">Step 3</div>
            <div class="step-content">
            </div>
          </div>
      </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import ExpandCollapse from './ExpandCollapse.vue'

export default {
  components: {
    ExpandCollapse,
  },
  computed: {
    ...mapState(['sources']),

  },
  methods: {
    getLocationsList() {
      const locations = this.sources.immigrant.data.rows
      return locations
    },
    // TODO: handle edge cases
    parseAddress(address) {
      const formattedAddress = address.replace(/(Phila.+)/g, city => `<div>${city}</div>`).replace(/^\d+\s[A-z]+\s[A-z]+/g, lineOne => `<div>${lineOne}</div>`).replace(/,/, '')
      return formattedAddress
    },
    parseServiceList(list) {
      const formattedService = list.split(',')
      return formattedService
    },
  },
}
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
