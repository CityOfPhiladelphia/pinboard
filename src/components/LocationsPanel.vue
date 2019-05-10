<template>
  <div class="cell medium-12 medium-cell-block-y locations-panel">
    <div class="location-container">
      <ExpandCollapse>
        content!
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
</template>
<script>
import ExpandCollapse from './ExpandCollapse.vue'

export default {
  components: {
    ExpandCollapse,
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getLocationsList()
    },
    async getLocationsList() {
      await new Promise(resolve => setTimeout(resolve, 500))

      const locations = this.$store.state.sources.immigrant.data.rows
      console.log(locations)
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
  padding: 3rem;
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
