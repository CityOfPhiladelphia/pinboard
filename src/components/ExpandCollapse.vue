<template>
  <div
    class="cell medium-cell-block-container location-item"
    :class="{ 'open': locationOpen }"
  >
    <h2
      class="h4 location-title"
      @click="expandLocation"
    >
      {{ title }}
    </h2>
    <div
      :class="{ 'location-open': locationOpen }"
      class="location-content"
    >
      <slot />
    </div>
  </div>
</template>
<script>
/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
import TopicComponent from '@philly/vue-comps/src/components/TopicComponent.vue';

export default {
  mixins: [ TopicComponent ],
  props: {
    title: {
      type: String,
      default: 'Title',
    },
  },
  data() {
    return {
      locationOpen: false,
    };
  },
  computed: {
    servicesOffered() {
      return this.$props.item.services_offered.split(',');
    },
    selectedResources() {
      return this.$store.state.selectedResources;
    },
  },
  watch: {
    selectedResources(nextSelectedResources) {
      if (this.locationOpen || nextSelectedResources.includes(this.$props.item._featureId)) {
        if (this.locationOpen === false) {
          this.openLocation();
        } else if (this.locationOpen && !nextSelectedResources.includes(this.$props.item._featureId)) {
          this.locationOpen = false;
        }
      } else {
        this.locationOpen = false;
      }
    },
  },
  methods: {
    openLocation() {
      this.locationOpen = true;
      const el = this.$el;
      const visible = this.isElementInViewport(el);
      if (!visible) {
        el.scrollIntoView();
      }
    },
    isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      // console.log('bounding box', rect);
      const visibility = {
        // TODO the 108 below is account for the combined height of the
        // app header and address header. this is not a good long-term
        // solution - instead, use the `bottom` value of the address header's
        // bounding rect. however, this should only fire on small devices,
        // which would require again hard-coding screen breakpoints from
        // standards or some other magic, which might not a huge
        // improvement in terms of decoupling logic and presentation. hmm.
        top: rect.top >= 108,
        left: rect.left >= 0,
        bottom: rect.bottom <= (window.innerHeight || document.documentElement.clientHeight),
        right: rect.right <= (window.innerWidth || document.documentElement.clientWidth),
      };

      // console.log('visibility', visibility);

      // return if all sides are visible
      return Object.values(visibility).every(val => val);
    },
    expandLocation() {
      this.locationOpen = !this.locationOpen;
      const selectedResource = this.$props.item._featureId;
      const selectedResources = [ ...this.selectedResources ];
      let latestSelectedResourceFromExpand = null;
      if (this.locationOpen) {
        selectedResources.push(selectedResource);
        latestSelectedResourceFromExpand = selectedResource;
      } else {
        selectedResources.splice(selectedResources.indexOf(selectedResource), 1);
      }
      // this.locationOpen ? selectedResources.push(selectedResource) : selectedResources.splice(selectedResources.indexOf(selectedResource), 1);
      this.$store.commit('setSelectedResources', selectedResources);
      this.$store.commit('setLatestSelectedResourceFromExpand', latestSelectedResourceFromExpand);
    },
  },
};
</script>
<style lang="scss">
.location-item {
  position: relative;
  border-bottom: 1px solid black;
  height:100%;

  .location-title {
    cursor: pointer;
    padding: 1rem;
    margin-bottom: 0;
    &:hover{
      background: #2176d2;
      color: white;
    }
  }

  &::after{
    position: absolute;
    right:1rem;
    top: 0;
    content: '+';
    font-weight: 900;
    font-size:1.5rem;
    z-index: 100;
  }
  &.open{
    h2{
      color:white;
      background-color: #2176d2;
      font-weight: 900;
    }
    &::after{
      content: '-';
      color:white;
    }
  }
  .location-content{
    overflow: hidden;
    height:0;

    &.location-open{
      padding: 1rem;
      height: 100%;
      overflow: initial;
    }
  }
}
</style>
