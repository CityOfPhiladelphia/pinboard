<template>
  <div
    class="cell medium-cell-block-container location-item"
    :class="{ 'open': locationOpen }"
  >
  <!-- :id="makeID(item.organization_name)" -->
  <!-- :id="makeID(item.site_name)" -->
    <h2
      :id="makeID(evaluateSlot(slots.title))"
      class="h5 location-title"
      @click="expandLocation"
      tabindex="0"
      @keyup.enter="expandLocation"
      :aria-expanded="locationOpen"
    >
      {{ evaluateSlot(slots.title) }}
      <div
        v-if="section && !i18nEnabled"
        class="section-name"
        :style="{ 'background-color': sectionColor }"
        >
        {{ sectionTitle }}
      </div>
      <div
        v-if="section && i18nEnabled"
        class="section-name"
        :style="{ 'background-color': sectionColor }"
        v-html="'<b>'+$t(sectionTitle)+'</b>'"
      />
    </h2>
    <div
      :class="{ 'location-open': locationOpen }"
      class="location-content"
      :aria-labelledby="makeID(evaluateSlot(slots.title))"
      >
      <!-- :aria-labelledby="makeID(item.site_name)" -->
      <!-- :aria-labelledby="makeID(item.organization_name)" -->
      <slot />
    </div>
  </div>
</template>
<script>
import TopicComponent from '@phila/vue-comps/src/components/TopicComponent.vue';

export default {
  mixins: [ TopicComponent ],
  props: {
    isMapVisible: {
      type: Boolean,
      default: true,
    },
    item: {
      type: Object,
    }
  },
  data() {
    return {
      locationOpen: false,
    };
  },
  computed: {
    i18nEnabled() {
      if (this.$config.i18n && this.$config.i18n.expandCollapseTitle) {
        return true;
      } else {
        return false;
      }
    },
    subsections() {
      return this.$config.subsections || {};
    },
    section() {
      let section;
      if (Object.keys(this.subsections).length) {
        section = this.subsections[this.$props.item.attributes['CATEGORY']];
      }
      return section;
    },
    sectionItem() {
      let sectionItem = {};
      if (Object.keys(this.subsections).length) {
        sectionItem = this.$config.sections[this.section];
      }
      return sectionItem;
    },
    sectionTitle() {
      let sectionTitle;
      if (Object.keys(this.subsections).length) {
        sectionTitle = this.$config.sections[this.section].titleSingular;
      }
      return sectionTitle;
    },
    sectionColor() {
      let sectionColor;
      if (Object.keys(this.subsections).length) {
        sectionColor = this.$config.sections[this.section].color;
      }
      return sectionColor;
    },
    servicesOffered() {
      return this.$props.item.services_offered.split(',');
    },
    selectedResources() {
      return this.$store.state.selectedResources;
    },
    latestSelectedResourceFromMap() {
      return this.$store.state.map.latestSelectedResourceFromMap;
    },
  },
  watch: {
    selectedResources(nextSelectedResources) {
      // console.log('watch selectedResources is running');
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
    isMapVisible(nextIsMapVisible) {
      if (!nextIsMapVisible) {
        if (this.latestSelectedResourceFromMap) {
          // console.log('ExpandCollapse is reporting map is invisible and there is a this.latestSelectedResourceFromMap:', this.latestSelectedResourceFromMap);
          if (this.latestSelectedResourceFromMap === this.item._featureId) {
            const el = this.$el;
            const visible = this.isElementInViewport(el);
            if (!visible) {
              el.scrollIntoView();
            }
          }
        }
      }
    },
  },
  mounted() {
    if (this.selectedResources.includes(this.item._featureId)) {
      // console.log('ExpandCollapse mounted is running and item should be open');
      // this.locationOpen = true;
      this.openLocation();
    }
  },
  methods: {
    openLocation() {
      this.locationOpen = true;
      const el = this.$el;
      // console.log('ExpandCollapse openLocation is running, el:', el);
      let visible = this.isElementInViewport(el);
      // console.log('visible 1:', visible)
      if (!visible) {
        el.scrollIntoView();
      }

      // visible = this.isElementInViewport(el);
      // console.log('visible 2:', visible)
      // if (!visible) {
      //   setTimeout(function () {
      //     console.log('still not visible');
      //     console.log('attempting to scroll into view again');
      //     el.scrollIntoView();
      //   }, 1000);
      // }
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
      // console.log('ExpandCollapse expandLocation is starting');
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
      // console.log('ExpandCollapse expandLocation after selectedResources is defined');
      this.$store.commit('setSelectedResources', selectedResources);
      this.$store.commit('setLatestSelectedResourceFromExpand', latestSelectedResourceFromExpand);
    },
    makeID( itemTitle ){
      // console.log('itemTitle:', itemTitle);
      if (itemTitle) {
        return itemTitle.replace(/\s+/g, '-').toLowerCase();
      } else {
        return '';
      }
    },
  },
};
</script>
<style lang="scss">

.location-item {
  position: relative;
  border-bottom: 1px solid black;
  height:100%;

  &:hover::after {
    color: white;
  }

  .location-title {
    cursor: pointer;
    padding: 1rem;
    margin-bottom: 0;
    &:hover{
      background: #2176d2;
      color: white;
    }
  }

  .section-name {
    text-transform: uppercase;
    position: relative;
    top: -3px;
    padding-left: 14px;
    padding-right: 14px;
    font-size: 12px;
    border-style: solid;
    border-width: 1px;
    display: inline-block;
    color: white;
  }

  &::after{
    position: absolute;
    right:1rem;
    top: 0;
    content: '+';
    font-weight: 900;
    font-size:1.5rem;
    z-index: 100;
    color: color(dark-ben-franklin)
  }
  &.open{
    h2{
      color:white;
      background-color: color(ben-franklin-blue);
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
