<template>
  <div class="cell medium-cell-block-container bg-ghost-gray refine-panel"
  :class="{ 'refine-open': refineOpen }">
    <div class="grid-x">
      <fieldset class="cell">
        <div class="refine-title"
          @click="expandRefine">
          <legend class="legend-title h3">{{ legendTitle }}</legend>
          <a href="#"
            @click="clearAll"
            class="clear-all hide-for-small-only">Clear all</a>
        </div>
        <div class="grid-x service-list">
          <div class="cell medium-6"
            v-for="(item, index) in refineList"
            :key="index">
            <label :for="item">
              <input
                :id="item"
                type="checkbox"
                :name="item"
                :value="item"
                v-model="selected">
                <span class="service-item">{{ item }}</span>
              </label>
            </div>
          </div>
          <div class="mobile-filter-actions show-for-small-only">
            <PhilaButton
              buttonText="Apply filters"
              @click.native="expandRefine">
              <font-awesome-icon icon="filter" />
            </PhilaButton>
            <a href="#"
              @click="clearAll"
              class="">Clear all</a>
          </div>
      </fieldset>
    </div>
  </div>
</template>
<script>
import PhilaButton from './PhilaButton.vue'

export default {
  components: {
    PhilaButton,
  },
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
      refineOpen: false,
    }
  },
  created() {
    this.init()
  },
  methods: {
    clearAll() {
      if (this.selected.length) {
        this.selected = []
      }
    },
    init() {
      this.getRefineSearchList()
    },
    async getRefineSearchList() {
      await new Promise(resolve => setTimeout(resolve, 500))

      const refineData = this.$store.state.sources.immigrant.data.rows

      let service = ''

      refineData.forEach((arrayElem) => {
        service += `${arrayElem.services_offered},`
      })

      // TODO: break this into smaller chunks
      let serviceArray = service.split(/(,|;)/);
      serviceArray = serviceArray.map(s => s.trim())

      const uniqArray = [...new Set(serviceArray)];

      // clean up any dangling , or ;
      const uniq = uniqArray.filter(a => a.length > 2)

      uniq.filter(Boolean) // remove empties
      uniq.sort()
      this.$data.refineList = uniq
    },
    expandRefine() {
      if (window.innerWidth <= 639) { // converted from rems
        this.refineOpen = !this.refineOpen;
      }
    },
  },
}
</script>
<style lang="scss">
$refine-panel-height: 19vh;
.refine-panel{
  max-height: $refine-panel-height;
  overflow-y: scroll;
  padding: 1rem;

  .refine-title{
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
  label {
    font-weight: normal;
  }
  @media screen and (max-width: 39.9375em) {
    height: 3rem;
    padding: .5rem;

    .refine-title{
      cursor: pointer;

      &::after{
        content: '+';
        float: right;
        font-weight: 900;
        font-size:1.5rem;
      }
    }
  }
  &.refine-open{
    min-height: 100vh !important;
    .refine-title{
      &::after{
        content: '-';
      }
    }
  }
}

</style>
