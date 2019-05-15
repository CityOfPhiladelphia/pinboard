<template>
  <div class="cell medium-cell-block-container location-item"
    :class="{ 'open': locationOpen }">
    <h2 class="h4 location-title"
      @click="expandLocation">{{ title }}</h2>
    <div :class="{ 'location-open': locationOpen }" class="location-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import TopicComponent from '@philly/vue-comps/src/components/TopicComponent.vue';

export default {
  mixins: [TopicComponent],
  data() {
    return {
      locationOpen: false,
    }
  },
  props: {
    title: {
      type: String,
      default: 'Title',
    },
  },
  methods: {
    expandLocation() {
      this.locationOpen = !this.locationOpen;
    },
  },
}
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
