<template>
  <div class="cell medium-12 medium-cell-block-y locations-panel">
    <div class="location-container"
      v-if="sources.immigrant.status === 'success'">
      <div v-for="item in getLocationsList()"
        :key="item.cartodb_id">

        <ExpandCollapse :title="item.organization_name">
          <div class="grid-x">
            <div class="cell medium-12">
              <div
                v-if="item.street_address">
                <font-awesome-icon icon="map-marker-alt"/>
                {{ item.street_address }}
              </div>
            </div>
            <div class="cell medium-12">
              <div v-if="item.phone_number">
                <font-awesome-icon icon="phone"/>
                  {{ item.phone_number }}
              </div>
              <div v-if="item.email">
                <font-awesome-icon icon="envelope"/>
                <a :href="`mailto:${item.email}`">{{ item.email }}</a>
              </div>
              <div v-if="item.facebook_name">
                <font-awesome-icon icon="facebook"/>
                  {{ item.facebook_name }}
              </div>
              <div v-if="item.twitter">
                <font-awesome-icon icon="twitter"/>
                  {{ item.twitter }}
              </div>
            </div>
          </div>
          <section>
            <h3 class="h5 services">Services offered</h3>
            {{ item.services_offered }}
          </section>
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
      const locations = this.$store.state.sources.immigrant.data.rows
      console.log(locations)
      return locations
    },
  },
}
</script>

<style lang="scss">

.locations-panel{
  overflow-y: auto;
  height: 100vh;
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
