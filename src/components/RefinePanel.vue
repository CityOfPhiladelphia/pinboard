<template>
  <div class="cell medium-cell-block-container bg-ghost-gray refine-panel">
    <div class="grid-x">
      <fieldset class="cell">
        <div class="labels">
          <legend class="legend-title h3">{{ legendTitle }}</legend>
          <a href="#"
            @click="clearAll"
            class="clear-all">Clear all</a>
        </div>
        <div class="grid-x service-list">
          <div class="cell medium-6"
            v-for="(item, index) in refineList"
            :key="index">
            <label :for="item.service">
              <input
                :id="item.service"
                type="checkbox"
                :name="item.service"
                :value="item.service"
                v-model="selected">
                <span class="service-item">{{ item.service }}</span>
              </label>
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
<style lang="scss">
.refine-panel{
  max-height: $refine-panel-height;
  overflow-y: scroll;
  padding: 1rem;

  .labels{
    height:5vh;
    color: color(dark-ben-franklin);
    .clear-all{
      margin: 0 0 0 4rem;
    }
  }

  legend.legend-title, .clear-all{
    float: left;
  }

  .service-list{
    input{
      margin-right: -2rem;
    }
    .service-item {
      margin-left: 3rem;
      display: inline-block;
      line-height: 1.3rem;
      vertical-align: text-top;
    }
  }
}

</style>
