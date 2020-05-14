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
          <legend
            v-if="!i18nEnabled"
            class="legend-title h3"
          >
            {{ legendTitle }}
          </legend>
          <legend
            v-if="i18nEnabled"
            class="legend-title h3"
            v-html="$t('refinePanel.refine')"
          />
          <a
            v-if="!i18nEnabled"
            href=""
            class="clear-all hide-for-small-only"
            @click.prevent="clearAll"
          >
            Clear all
          </a>
          <a
            v-if="i18nEnabled"
            href=""
            class="clear-all hide-for-small-only"
            @click.prevent="clearAll"
            v-html="$t('refinePanel.clearAll')"
          />

        </div>

        <!-- if using categoryField or multipleFields options -->
        <div
          v-if="dataStatus === 'success' && refineType !== 'multipleFieldGroups'"
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
              class="input-label"
              :for="item"
              >
                <span
                  v-if="!i18nEnabled"
                  class="service-item"
                >
                  {{ item }}
                </span>

                <span
                  v-if="i18nEnabled"
                  class="service-item"
                >
                  {{ $t(item) }}
                </span>

            </label>
            <icon-tool-tip
              v-if="Object.keys(infoCircles).includes(item)"
              :item="item"
              :circleData="infoCircles[item]"
            >
            </icon-tool-tip>

          </div>
        </div>


        <!-- if using multipleFieldsGroups option -->
        <div
          v-if="dataStatus === 'success' && refineType === 'multipleFieldGroups'"
          class="grid-x group-service-list service-list"
        >
          <!-- :key="ind" -->
          <div
            v-for="(group, ind) in refineList"
            :key="group.i18n_key"
            class="service-group-holder"
          >
            <!-- {{ $t(ind) }} -->
            {{ $t(group.i18n_key) }}

            <div class="grid-x service-group">

              <div
                v-for="(item, index) in refineList[ind]"
                :key="index"
              >

                <input
                  :id="item.unique_key"
                  v-model="selected"
                  type="checkbox"
                  :name="item.unique_key"
                  :value="item.unique_key"
                >
                  <font-awesome-icon :for="item" :icon="['far', 'square']" v-show="!selected.includes(item.unique_key)" class="fa-checkbox" />
                  <font-awesome-icon :for="item" icon="check-square" v-show="selected.includes(item.unique_key)" class="fa-checkbox" />
                  <label
                    class="input-label"
                    :for="item.unique_key"
                    >
                      <span
                        v-if="!i18nEnabled"
                        class="service-item"
                      >
                        {{ item }}
                      </span>

                      <span
                        v-if="i18nEnabled"
                        class="service-item"
                        v-html="$t(item.box_label)"
                      />

                  </label>
                  <icon-tool-tip
                    v-if="Object.keys(infoCircles).includes(item)"
                    :item="item"
                    :circleData="infoCircles[item]"
                  >
                  </icon-tool-tip>

              </div>

            </div>

          </div>
        </div>


        <div class="mobile-filter-actions show-for-small-only">

          <PhilaButton
            v-if="!i18nEnabled"
            @click.native="expandRefine(); scrollToTop();"
          >
            <font-awesome-icon icon="filter" />
            Apply filters
          </PhilaButton>
          <PhilaButton
            v-if="i18nEnabled"
            @click.native="expandRefine(); scrollToTop();"
          >
            <font-awesome-icon icon="filter" />
            <div
              v-html="$t('refinePanel.applyFilters')"
              class="apply-filters-text"
            />
          </PhilaButton>

          <PhilaButton
            v-if="!i18nEnabled"
            @click.native="closeRefinePanel"
          >
            Clear all
          </PhilaButton>
          <PhilaButton
            v-if="i18nEnabled"
            @click.native="closeRefinePanel"
            v-html="$t('refinePanel.clearAll')"
          />

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
      // refineOpen: false,
      // addressEntered: null,
    };
  },
  computed: {
    refineType() {
      return this.$config.refine.type;
    },
    ...mapState([ 'sources', 'geocode', 'selectedServices' ]),
    refineOpen() {
      return this.$store.state.refineOpen;
    },
    i18nEnabled() {
      if (this.$config.i18n && this.$config.i18n.refinePanel) {
        return true;
      } else {
        return false;
      }
    },
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
      if (this.$store.state.sources[this.$appType].data) {
        return this.$store.state.sources[this.$appType].data.rows || this.$store.state.sources[this.$appType].data.features || this.$store.state.sources[this.$appType].data;
      }
      // } else if (this.$store.state.sources[this.$appType].data.features) {
      //   return this.$store.state.sources[this.$appType].data.features;
      // } else {
      //   return this.$store.state.sources[this.$appType].data;
      // }
    },
  },
  watch: {
    database(nextDatabase) {
      // console.log('watch database is running, nextDatabase:', nextDatabase);
      this.getRefineSearchList();
    },
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
    // console.log('RefinePanel is mounted, this.$store.state.selectedServices:', this.$store.state.selectedServices, 'this.$router:', this.$router);
    if (this.$store.state.selectedServices.length > 0) {
      // console.log('there are services');
    }
    // this.$data.selected = this.$store.state.selectedServices;

    // this.getRefineSearchList();
  },
  methods: {
    clearAll() {
      // console.log('RefinePanel clearAll is running');
      if (this.selected.length) {
        this.selected = [];
      }
    },
    getRefineSearchList() {
      const refineData = this.database;

      let service = '';

      // console.log('in getRefineSearchList, refineData:', refineData);
      refineData.forEach((arrayElem) => {
        // console.log('arrayElem:', arrayElem);
        if (this.$config.refine.categoryField) {
          let value = this.$config.refine.categoryField(arrayElem);

          service += `${value},`;
        } else if (arrayElem.services_offered) {
          service += `${arrayElem.services_offered},`;
        } else if (arrayElem.attributes.category_type) {
          service += `${arrayElem.attributes.category_type},`;
        }
      });

      // console.log('service:', service);

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

      if (this.$config.refine.type === 'multipleFields') {
        uniq = Object.keys(this.$config.refine.multipleFields);
      }
      uniq.sort();
      if (this.$config.refine.type === 'multipleFieldGroups') {
        uniq = {};
        for (let group of Object.keys(this.$config.refine.multipleFieldGroups)){
          // console.log('group:', group);
          uniq[group] = {};
          for (let field of Object.keys(this.$config.refine.multipleFieldGroups[group])){
            uniq[group][field] = {};
            // console.log('field:', field, 'this.$config.refine.multipleFieldGroups[group][field].unique_key:', this.$config.refine.multipleFieldGroups[group][field].unique_key);
            if (this.$config.refine.multipleFieldGroups[group][field].i18n_key) {
              uniq[group][field].box_label = this.$config.refine.multipleFieldGroups[group][field].i18n_key;
            } else {
              uniq[group][field].box_label = field;
            }
            uniq[group][field].unique_key = this.$config.refine.multipleFieldGroups[group][field].unique_key;
          }
        }
      }


      // console.log('uniq:', uniq);
      this.$data.refineList = uniq;
      return uniq;
    },
    scrollToTop() {
      const container = document.querySelector('.refine-panel');
      container.scrollTo(0, 0);
    },
    expandRefine() {
      if (window.innerWidth <= 749) { // converted from rems
        this.$store.commit('setRefineOpen', !this.refineOpen);
        // this.refineOpen = !this.refineOpen;
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

  .service-group{
    padding-top: 2px;
  }

  .service-group-holder{
    // padding: 2px;
    // padding-top: 4px;
    padding-left: 16px;
    padding-right: 10px;
    border-right: 1px solid black;
  }

  .group-service-list {
    width: 100%;
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
    height: calc(100vh - 90px);
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

.apply-filters-text {
  display: inline-block;
}

</style>
