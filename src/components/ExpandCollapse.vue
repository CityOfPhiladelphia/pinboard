<template>
  <div class="cell medium-cell-block-container bg-ghost-gray location-item"
  :class="{ 'location-open': locationOpen }"
  @click="expandLocation">
    <h2 class="title">{{ title }}</h2><slot></slot></div>
</template>
<script>
export default {
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
.location-item{
    padding: 1rem;
    cursor: pointer;
    height: 4rem;
    overflow: hidden;

  .title{
    &::after{
      content: '+';
      float: right;
      font-weight: 900;
      font-size:1.5rem;
    }
  }
  &.location-open{
    height: auto;
  }
}
</style>
