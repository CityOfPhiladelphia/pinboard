<template>
  <div
    class="cell medium-cell-block-container bg-ghost-gray refine-panel"
    :class="{ 'refine-open': refineOpen }"
  >
    <div class="grid-x">
      <fieldset class="cell">
        <div
          class="refine-title"
          @click="expandRefine"
        >
          <legend class="legend-title h3">
            {{ legendTitle }}
          </legend>
          <a
            href=""
            class="clear-all hide-for-small-only"
            @click.prevent="clearAll"
          >
            Clear all
          </a>
        </div>
        <div
          v-if="dataStatus === 'success'"
          class="grid-x service-list"
        >
          <div
            v-for="(item, index) in getRefineSearchList()"
            :key="index"
            class="cell medium-6"
          >
          <input
            :id="item"
            v-model="selected"
            type="checkbox"
            :name="item"
            :value="item"
          >
            <font-awesome-icon :for="item" :icon="['far', 'square']" v-show="!selected.includes(item)" class="fa-checkbox" />
            <font-awesome-icon :for="item" icon="check-square" v-show="selected.includes(item)" class="fa-checkbox" />
            <label
              class="input-label" :for="item"><span class="service-item">{{ item }}</span>
            </label>
            <icon-tool-tip
              v-if="Object.keys(infoCircles).includes(item)"
              :item="item"
              :circleData="infoCircles[item]"
            >
            </icon-tool-tip>

          </div>
          <!-- </input> -->
        </div>
        <div class="mobile-filter-actions show-for-small-only">
          <PhilaButton
            @click.native="expandRefine(); scrollToTop();"
          >
            <font-awesome-icon icon="filter" /> Apply filters
          </PhilaButton>
          <PhilaButton
            @click.native="closeRefinePanel"
          >
            Clear all
          </PhilaButton>
        </div>
      </fieldset>
    </div>
  </div>
</template>
<script>

import { mapState } from 'vuex';
import PhilaButton from './PhilaButton.vue';

export default {
  components: {
    PhilaButton,
    IconToolTip: () => import(/* webpackChunkName: "mbmp_pvc_IconToolTip" */'@phila/vue-comps/src/components/IconToolTip.vue'),
  },
  props: {
    legendTitle: {
      type: String,
      default: 'Refine',
    },
    infoCircles: {

    }
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_URL,
      refineList: null,
      selected: [],
      refineOpen: false,
      // addressEntered: null,
    };
  },
  computed: {
    ...mapState([ 'sources', 'geocode', 'selectedServices' ]),
    addressEntered() {
      let address;

      if (this.geocode.status === 'success') {
        address = this.geocode.data.properties.street_address;
      }

      return address;
    },
    keywordsEntered() {
      return this.$store.state.selectedKeywords.toString();
    },
    dataStatus() {
      return this.$store.state.sources[this.$appType].status;
    },
    database() {
      // if (this.$store.state.sources[this.$appType].data.rows) {
        return this.$store.state.sources[this.$appType].data.rows || this.$store.state.sources[this.$appType].data;
      // } else if (this.$store.state.sources[this.$appType].data.features) {
      //   return this.$store.state.sources[this.$appType].data.features;
      // } else {
      //   return this.$store.state.sources[this.$appType].data;
      // }
    },
  },
  watch: {
    selected(nextSelected) {
      window.theRouter = this.$router;
      // console.log('RefinePanel watch selected is firing, nextSelected', nextSelected);
      this.$store.commit('setSelectedServices', nextSelected);
      this.$router.push({ query: { ...this.$route.query, ...{ services: nextSelected.join(',') }}});
    },
    selectedServices(nextSelectedServices) {
      // console.log('watch selectedServices is firing:', nextSelectedServices);
      this.$data.selected = nextSelectedServices;
    },
  },
  beforeMount() {
    if (this.$route.query.services) {
      this.selected = this.$route.query.services.split(',');
    }
  },
  mounted() {
    console.log('RefinePanel is mounted, this.$store.state.selectedServices:', this.$store.state.selectedServices, 'this.$router:', this.$router);
    if (this.$store.state.selectedServices.length > 0) {
      console.log('there are services');
    }
    // this.$data.selected = this.$store.state.selectedServices;
  },
  methods: {
    clearAll() {
      console.log('RefinePanel clearAll is running');
      if (this.selected.length) {
        this.selected = [];
      }
    },
    getRefineSearchList() {
      const refineData = this.database;
      // const refineData = this.sources[this.$appType].data.rows;

      let service = '';

      // console.log('in getRefineSearchList, refineData:', refineData);
      refineData.forEach((arrayElem) => {
        service += `${arrayElem.services_offered},`;
      });

      // TODO: break this into smaller chunks
      let serviceArray = service.split(/(,|;)/);
      serviceArray = serviceArray.map(s => s.trim());

      const uniqArray = [ ...new Set(serviceArray) ];

      // clean up any dangling , or ;
      let uniq = uniqArray.filter(a => a.length > 2);

      uniq.filter(Boolean); // remove empties

      if (this.$config.refineCategories) {
        uniq = this.$config.refineCategories;
      }

      uniq.sort();
      return uniq;
    },
    scrollToTop() {
      const container = document.querySelector('.refine-panel');
      container.scrollTo(0, 0);
    },
    expandRefine() {
      if (window.innerWidth <= 749) { // converted from rems
        this.refineOpen = !this.refineOpen;
      }
    },
    closeRefinePanel(){
      this.scrollToTop();
      this.expandRefine();
      this.clearAll();
    },
  },
};
</script>
<style lang="scss">

$refine-panel-height: 19vh;
.refine-panel{
  max-height: $refine-panel-height;
  overflow-y: hidden;
  padding: 1rem;

  .legend-title{
    float:left;
  }

  .refine-title{
    color: color(dark-ben-franklin);
    position: relative;

    .clear-all{
      margin: .35rem 0 0 3rem;
    }

    .clear-button{
      background-color: rgb(0, 204, 255);
      height: 30px;
      width: 80px;
      margin-left: 10px;
      margin-right: 10px;
    }
  }

  .margin-add{
    margin-left: 10px;
    margin-right: 10px;
    display: inline-block;
  }

  .min-width-needed{
    min-width: 140px;
    min-height: 30px;
    border-style: solid;
    border-width: 1px;
  }


  .service-list{
    margin-top: 1rem;
    input{
      margin-right: -2rem;
    }
    .service-item {
      margin-left: 1rem;
      display: inline-block;
      line-height: 1.3rem;
      vertical-align: text-top;
      padding-right: 3px;
    }
  }
  label {
    font-weight: normal;
    cursor: pointer;
  }
  @media screen and (max-width: 749px) {
    height: 3rem;
    padding: .5rem;
    position: relative;
    z-index: 10000;
    .refine-title{
      cursor: pointer;
      height:7vh;
      padding: .5rem;

      &::after{
        content: '+';
        font-weight: 900;
        position: absolute;
        font-size: 1.2rem;
        right: 0;
        top: 0;
      }
    }
  }
  &.refine-open{
    overflow-y: scroll;
    height: calc(100vh - 100px);
    max-height: 100vh;
    z-index: 1002;
    .refine-title{
      &::after{
        content: '-';
      }
    }
  }
}

//add outline to checkboxes
input[type=checkbox]:focus + svg,
input[type=checkbox]:focus + svg + svg{
  outline: rgb(59, 153, 252) auto 5px;
}

input[type=checkbox] {
  display: block;
  opacity: 0;
  height: 0;
  margin: 0;
}


.checkbox-wrap {
  label {
    line-height: 1.2;
    margin-bottom: 10px;
    width: 100%;
    div {
      display: inline-block;
      vertical-align: top;
      padding: 0 0 0 1rem;
      max-width: calc(100% - 23px);
    }
  }
  @media screen and (max-width: 39.9375em) {
    margin: 10px 0 0 10px;
    label {
      font-size: 18px;
      width: 100%;
      margin-right: 0;
      div {
        max-width: 280px;
      }
    }
  }
}

.input-label {
  display: inline-block;
  color: color(dark-ben-franklin);
  font-size: 14px;
  margin-bottom: .5rem;
  padding-left: 10px;
}

.fa-checkbox {
  pointer-events: none;
  color: color(dark-ben-franklin);
  position: relative;
  right: -15px;
  bottom: 1px;
}

.fa-infoCircle {
  color: color(dark-ben-franklin);
  cursor: pointer;
}

</style>
