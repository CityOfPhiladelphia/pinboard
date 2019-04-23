<template>
  <div id="app">
    <PhilaHeader
      app-title="Resource finder title"
      app-tag-line="Find what you're looking for"/>

    <router-view/>

      <div class="grid-x">
        <div class="cell small-24">
          refine
        </div>
      </div>
      <div class="grid-x">
        <div class="cell small-12">
          nav
        </div>
        <div class="cell small-12">
          map
        </div>
      </div>
      <div class="grid-x">
        <div class="cell small-24">
          footer
        </div>
      </div>
    </div>
</template>
<script>
import PhilaHeader from './components/PhilaHeader.vue'

export default {
  name: 'App',
  components: {
    PhilaHeader,
  },
}
</script>

<style lang="scss">
//@import "@/scss/global.scss";

</style>
