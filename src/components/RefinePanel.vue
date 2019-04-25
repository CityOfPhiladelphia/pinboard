<template>
  <div class="grid-x grid-padding-x grid-margin-x bg-ghost-gray">
    <div class="cell">
      <fieldset>
        <legend class="legend-title h3">{{ legendTitle }}</legend>
        <a href="#"
          @click="clearAll"
          class="clear-all">Clear all</a>
        <div class="refine-columns">
          <div v-for="(item, index) in refineList"
          :key="index">
            <input
              :id="item.service"
              type="checkbox"
              :name="item.service"
              :value="item.service"
              v-model="selected">
            <label :for="item.service">{{ item.service }}</label>
            </div>
          </div>
        </fieldset>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  props: {
    legendTitle: {
      type: String,
      default: 'Refine',
    },
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_URL,
      refineList: null,
      selected: [],
    }
  },
  created() {
    // Fetch Data
    this.getRefineSearchList();
  },
  methods: {
    clearAll() {
      if (this.selected.length) {
        this.selected = []
      }
    },
    getRefineSearchList() {
      axios.get(`${this.baseUrl}temp-refine-list.json`).then((response) => {
        this.$data.refineList = response.data
      })
        .catch((error) => {
          console.log(error)
        // this.errored = true
        })
    },
  },

}
</script>
<style>
.legend-title, .clear-all{
  display: inline-block;
}
.refine-columns{
  columns: 4;
}
</style>
