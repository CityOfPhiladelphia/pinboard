<template>
  <div
    id="refine-panel-component"
    :class="refinePanelClass"
  >

    <div
      class="refine-title columns"
      @click="expandRefine"
    >
      <legend
        v-if="!i18nEnabled"
        class="column is-narrow legend-title h3"
      >
        {{ legendTitle }}
      </legend>
      <legend
        v-if="i18nEnabled"
        class="column is-narrow legend-title"
        v-html="$t('refinePanel.refine')"
      />

      <a
        v-if="!i18nEnabled && isTablet || !i18nEnabled && isDesktop || !i18nEnabled && isWideScreen"
        href=""
        class="column is-narrow clear-all"
        @click.prevent="clearAll"
      >
        Clear all
      </a>
      <a
        v-if="i18nEnabled && isTablet || i18nEnabled && isDesktop || i18nEnabled && isWideScreen"
        href=""
        class="column is-narrow clear-all"
        @click.prevent="clearAll"
        v-html="$t('refinePanel.clearAll')"
      />
    </div>

    <!-- if using categoryField_value, categoryField_array, or multipleFields options -->
    <!-- v-if="dataStatus === 'success' && refineType !== 'multipleFieldGroups'" -->
    <div
      v-if="dataStatus === 'success' && ['categoryField_array', 'multipleFields'].includes(refineType)"
      id="field-div"
      class="refine-holder"
    >
      <checkbox
        :options="getRefineSearchList()"
        :numOfColumns="NumRefineColumns"
        :small="true"
        v-model="selected"
      >
      <!-- v-if="Object.keys(infoCircles).includes(ind)" -->
      <!-- :item="ind"
      :circleData="infoCircles[ind]"
      :circleType="'click'" -->
        <icon-tool-tip
        >
          test
        </icon-tool-tip>
      </checkbox>
    </div>

    <div
      v-if="dataStatus === 'success' && refineType == 'categoryField_value'"
      id="field-div"
    >
    <!-- :options="getRefineSearchList()" -->
      <radio
        v-model="selected"
        :options="refineListTranslated"
        text-key="text"
        value-key="value"
        :numOfColumns="NumRefineColumns"
        :small="true"
      >
      </radio>
    </div>


    <!-- if using multipleFieldGroups option and NOT dropdownRefine -->
    <div
      v-if="dataStatus === 'success' && refineType === 'multipleFieldGroups' && !dropdownRefine"
      id="multiple-field-groups-div"
      class="columns is-multiline"
    >
      <div
        v-for="(ind) in Object.keys(refineListTranslated)"
        :id="'refine-list-'+ind"
        :key="ind"
        class="column is-narrow service-group-holder-x"
      >
      <!-- class="column is-narrow service-group-holder-x" -->

        <div
          id="columns-div-for-checkboxes"
          class="columns"
        >
          <radio
            v-model="selectedList['radio_'+ind]"
            v-if="refineListTranslated[ind]['independent']"
            :options="refineListTranslated[ind]['independent']"
            text-key="textLabel"
            value-key="data"
            :small="true"
            :num-of-columns="calculateColumns(refineList[ind]['independent'])"
          >
            <div
              slot="label"
            >
              {{ $t(ind + '.category') }}
              <icon-tool-tip
                v-if="Object.keys(infoCircles).includes(ind)"
                :item="ind"
                :circleData="infoCircles[ind]"
                :circleType="'click'"
              >
              </icon-tool-tip>
            </div>
          </radio>
          <checkbox
            v-if="refineListTranslated[ind]['dependent']"
            :options="refineListTranslated[ind]['dependent']"
            :small="true"
            v-model="selectedList[ind]"
            text-key="textLabel"
            value-key="data"
            shrinkToFit="true"
            :num-of-columns="calculateColumns(refineList[ind]['dependent'])"
          >
            <div
              slot="label"
            >
              {{ $t(ind + '.category') }}
              <icon-tool-tip
                v-if="Object.keys(infoCircles).includes(ind)"
                :item="ind"
                :circleData="infoCircles[ind]"
                :circleType="'click'"
              >
                test
              </icon-tool-tip>
              <!-- <tooltip
                v-if="Object.keys(infoCircles).includes(ind)"
                message="test"
              /> -->
            </div>
          </checkbox>
        </div>
      </div>
    </div>

    <!-- if using multipleFieldGroups option and NOT dropdownRefine -->
    <div
      v-if="dataStatus === 'success' && refineType === 'multipleFieldGroups' && dropdownRefine"
      id="multiple-field-groups-div"
      class="columns is-multiline"
    >
      <div
        v-for="(ind) in Object.keys(refineListTranslated)"
        :id="'refine-list-'+ind"
        :key="ind"
        class="column"
      >
      <!-- class="column service-group-holder-x" -->

        <div
          id="columns-div-for-checkboxes"
          class="columns"
        >
          <div
            class="column dropdown-checkbox-div"
            :style="{ 'width': 100/Object.keys(refineListTranslated).length+'%' }"
          >
            <div
              class="dropdown-checkbox-header"
              @click="expandCheckbox(ind)"
            >
              {{ $t(ind + '.category') }}
              <!-- {{ ind }} -->
            </div>
            <div
              v-if="refineList[ind].expanded"
              class="refine-dropdown"
            >
              <radio
                v-model="selectedList['radio_'+ind]"
                v-if="refineListTranslated[ind]['independent']"
                :options="refineListTranslated[ind]['independent']"
                text-key="textLabel"
                value-key="data"
                :small="true"
                :num-of-columns="calculateColumns(refineList[ind]['independent'])"
              >
                <div
                  slot="label"
                >
                  <!-- {{ $t(ind + '.category') }} -->
                  <icon-tool-tip
                    v-if="Object.keys(infoCircles).includes(ind)"
                    :item="ind"
                    :circleData="infoCircles[ind]"
                    :circleType="'click'"
                  >
                  </icon-tool-tip>
                </div>
              </radio>
              <checkbox
                v-if="refineListTranslated[ind]['dependent']"
                :options="refineListTranslated[ind]['dependent']"
                :small="true"
                v-model="selectedList[ind]"
                text-key="textLabel"
                value-key="data"
                shrinkToFit="true"
                :num-of-columns="calculateColumns(refineList[ind]['dependent'])"
              >
                <div
                  slot="label"
                >
                  <!-- {{ $t(ind + '.category') }} -->
                  <icon-tool-tip
                    v-if="Object.keys(infoCircles).includes(ind)"
                    :item="ind"
                    :circleData="infoCircles[ind]"
                    :circleType="'click'"
                  >
                  </icon-tool-tip>
                </div>
              </checkbox>
            </div>
          </div>
          <!-- <radio
            v-model="selectedList['radio_'+ind]"
            v-if="refineListTranslated[ind]['independent']"
            :options="refineListTranslated[ind]['independent']"
            text-key="textLabel"
            value-key="data"
            :small="true"
            :num-of-columns="calculateColumns(refineList[ind]['independent'])"
          >
            <div
              slot="label"
            >
              {{ $t(ind + '.category') }}
              <icon-tool-tip
                v-if="Object.keys(infoCircles).includes(ind)"
                :item="ind"
                :circleData="infoCircles[ind]"
                :circleType="'click'"
              >
              </icon-tool-tip>
            </div>
          </radio>
          <checkbox
            v-if="refineListTranslated[ind]['dependent']"
            :options="refineListTranslated[ind]['dependent']"
            :small="true"
            v-model="selectedList[ind]"
            text-key="textLabel"
            value-key="data"
            shrinkToFit="true"
            :num-of-columns="calculateColumns(refineList[ind]['dependent'])"
          >
            <div
              slot="label"
            >
              {{ $t(ind + '.category') }}
              <icon-tool-tip
                v-if="Object.keys(infoCircles).includes(ind)"
                :item="ind"
                :circleData="infoCircles[ind]"
                :circleType="'click'"
              >
              </icon-tool-tip>
            </div>
          </checkbox> -->
        </div>
      </div>
    </div>

    <!-- if using multipleDependentFieldGroups option -->
    <div
      v-if="dataStatus === 'success' && refineType === 'multipleDependentFieldGroups'"
      id="multiple-field-groups-div"
      class="columns is-multiline"
    >
      <div
        v-for="(ind) in Object.keys(refineListTranslated)"
        :id="'refine-list-'+ind"
        :key="ind"
        class="column is-narrow service-group-holder-x"
      >

        <div
          id="columns-div-for-checkboxes"
          class="columns"
        >
          <div class="column">
            <radio
              v-model="selectedList['radio_'+ind]"
              v-if="refineListTranslated[ind]['independent']"
              :options="refineListTranslated[ind]['independent']"
              text-key="textLabel"
              value-key="data"
              :num-of-columns="1"
              :small="true"
            >
              <div
                slot="label"
              >
                {{ $t(ind + '.category') }}
                <icon-tool-tip
                  v-if="Object.keys(infoCircles).includes(ind)"
                  :item="ind"
                  :circleData="infoCircles[ind]"
                  :circleType="'click'"
                >
                </icon-tool-tip>
              </div>
            </radio>
            <!-- <hr> -->

            <checkbox
              :options="refineListTranslated[ind]['dependent']"
              :num-of-columns="1"
              :small="true"
              v-model="selectedList[ind]"
              text-key="textLabel"
              value-key="data"
              shrinkToFit="true"
            >
              <div
                v-if="!refineListTranslated[ind]['independent']"
                slot="label"
              >
                {{ $t(ind + '.category') }}
                <icon-tool-tip
                  v-if="Object.keys(infoCircles).includes(ind)"
                  :item="ind"
                  :circleData="infoCircles[ind]"
                  :circleType="'click'"
                >
                </icon-tool-tip>
              </div>
            </checkbox>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isMobile"
      class="columns is-mobile"
    >
      <div
        class="column is-narrow"
        v-if="!i18nEnabled"
      >
        <button
          class="button is-primary"
          @click="expandRefine(); scrollToTop();"
        >
          <font-awesome-icon icon="filter" />
          Apply filters
        </button>
      </div>

      <div
        class="column is-narrow"
        v-if="i18nEnabled"
      >
        <div
          class="button is-primary"
          @click="expandRefine(); scrollToTop();"
        >
          <font-awesome-icon icon="filter" />
          <div
            v-html="$t('refinePanel.applyFilters')"
            class="apply-filters-text"
          />
        </div>
      </div>

      <div
        class="column is-narrow"
        v-if="!i18nEnabled"
      >
        <button
          class="button is-primary"
          @click="closeRefinePanel"
        >
          Clear all
        </button>
      </div>

      <div
        class="column is-narrow"
        v-if="i18nEnabled"
      >
        <div
          class="button is-primary"
          @click="closeRefinePanel"
          v-html="$t('refinePanel.clearAll')"
        />
      </div>

    </div>

  </div>
</template>
<script>

import Vue from 'vue';

import { mapState } from 'vuex';
import IconToolTip from './IconToolTip.vue';
import Checkbox from './Checkbox.vue';
// import { Checkbox, Radio, Tooltip } from '@phila/phila-ui';
import { Radio, Tooltip } from '@phila/phila-ui';

export default {
  components: {
    IconToolTip,
    Checkbox,
    Radio,
    // Tooltip,
  },
  props: {
    legendTitle: {
      type: String,
      default: 'REFINE',
    },
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_URL,
      refineList: null,
      selected: [],
      selectedList: {},
      // pushValue: [],
      // pushValue2: {
      //   pushValue2Child: [],
      // },
    };
  },
  computed: {
    dropdownRefine() {
      let value;
      if (this.$config.dropdownRefine) {
        value = true;
      } else {
        value = false;
      }
      return value;
    },
    NumRefineColumns() {
      let value;
      if (this.isMobile) {
        value = 1;
      } else {
        value = 4;
      }
      return value;
    },
    selectedListCompiled() {
      let compiled = [];
      for (let value of Object.keys(this.$data.selectedList)) {
        console.log('in selectedListCompiled, value:', value, value.split('_')[0]);
        if (value.split('_')[0] == 'radio') {
          console.log('radio button clicked!');
            compiled.push(this.$data.selectedList[value]);
        } else {
          for (let selected of this.$data.selectedList[value]) {
            compiled.push(selected);
          }
        }
      }
      return compiled;
    },
    refineListTranslated() {
      let mainObject = {};
      let mainArray = [];
      if (this.refineType !== 'multipleFieldGroups' && this.refineType !== 'multipleDependentFieldGroups') {
        for (let category of this.$data.refineList) {
          mainArray.push({
            value: category,
            text: this.$t(category),
          });
          console.log('refineListTranslated computed, category:', category, 'this.$t(category):', this.$t(category), 'mainArray:', mainArray);
        }
        return mainArray;
      } else if (this.refineType == 'multipleFieldGroups') {
        for (let category of Object.keys(this.$data.refineList)) {
          mainObject[category] = {};
          for (let dep of Object.keys(this.$data.refineList[category])) {

            mainObject[category][dep] = [];
            for (let box of Object.keys(this.$data.refineList[category][dep])) {

              let data = this.$data.refineList[category][dep][box].unique_key;
              let textLabel = this.$t(this.$data.refineList[category][dep][box].box_label);
              let keyPairs = {
                data: data,
                textLabel: textLabel,
              };
              mainObject[category][dep].push(keyPairs)
            }
          }
        }
        return mainObject;
      } else {
        for (let category of Object.keys(this.$data.refineList)) {
          mainObject[category] = {};
          for (let dep of Object.keys(this.$data.refineList[category])) {
            // console.log('in loop, dep', dep);
            mainObject[category][dep] = [];
            for (let box of Object.keys(this.$data.refineList[category][dep])) {
              // console.log('in inner loop, box:', box, 'dep:', dep);
              let data = this.$data.refineList[category][dep][box].unique_key;
              let textLabel = this.$t(this.$data.refineList[category][dep][box].box_label);
              let keyPairs = {
                data: data,
                textLabel: textLabel,
              };
              mainObject[category][dep].push(keyPairs)
            }
          }
        }
        return mainObject;
      }
    },
    refinePanelClass() {
      let value;
      if (this.isMobile) {
        if (this.refineOpen) {
          value = 'refine-panel refine-panel-open invisible-scrollbar';
        } else {
          value = 'refine-panel refine-panel-closed invisible-scrollbar';
        }
      } else if (this.$config.retractableRefine) {
        if (!this.refineOpen) {
          value = 'refine-panel refine-retractable-closed refine-panel-non-mobile-closed invisible-scrollbar';
        } else if (this.refineOpen) {
          value = 'refine-panel refine-retractable-open refine-panel-non-mobile invisible-scrollbar';
        }
      } else if (this.$config.dropdownRefine) {
        console.log('dropdownRefine is used');
        value = 'refine-panel refine-dropdown-closed refine-panel-non-mobile-closed invisible-scrollbar';
        // value = 'refine-panel refine-panel-non-mobile invisible-scrollbar';
      } else {
        value = 'refine-panel refine-panel-non-mobile invisible-scrollbar';
      }
      return value;
    },
    infoCircles() {
      let value = {};
      if (this.$config.infoCircles) {
        value = this.$config.infoCircles;
      }
      return value;
    },
    refineType() {
      if (this.$config.refine) {
        return this.$config.refine.type;
      }
    },
    ...mapState([ 'sources', 'geocode', 'selectedServices' ]),
    refineOpen() {
      return this.$store.state.refineOpen;
    },
    i18nEnabled() {
      if (this.$config.i18n && this.$config.i18n.enabled) {
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
      let value;
      if (this.$store.state.sources[this.$appType]) {
        value = this.$store.state.sources[this.$appType].status;
      }
      return value;
    },
    database() {
      if (this.$store.state.sources[this.$appType]) {
        if (this.$store.state.sources[this.$appType].data) {
          return this.$store.state.sources[this.$appType].data.rows || this.$store.state.sources[this.$appType].data.features || this.$store.state.sources[this.$appType].data;
        }
      }
    },
  },
  watch: {
    database(nextDatabase) {
      // console.log('watch database is running, nextDatabase:', nextDatabase);
      this.getRefineSearchList();
    },
    selected(nextSelected) {
      // console.log('watch selected is firing, nextSelected:', nextSelected);
      this.$store.commit('setSelectedServices', nextSelected);

      if (this.refineType !== 'categoryField_value') {
        this.$router.push({ query: { ...this.$route.query, ...{ services: nextSelected.join(',') }}});
      } else {
        this.$router.push({ query: { ...this.$route.query, ...{ services: nextSelected }}});
      }
    },
    selectedListCompiled(nextSelected) {
      window.theRouter = this.$router;
      // console.log('RefinePanel watch selectedListCompiled is firing, nextSelected', nextSelected);
      this.$store.commit('setSelectedServices', nextSelected);
      if (typeof nextSelected === 'string') {
        nextSelected = [nextSelected];
      }
      this.$router.push({ query: { ...this.$route.query, ...{ services: nextSelected.join(',') }}});
    },
    selectedServices(nextSelectedServices) {
      // console.log('RefinePanel watch selectedServices is firing:', nextSelectedServices);
      this.$data.selected = nextSelectedServices;
    },
  },
  beforeMount() {
    if (this.$route.query.services) {
      console.log('RefinePanel.vue beforeMount is running, this.selectedList:', this.selectedList, 'this.$route.query:', this.$route.query, 'this.$route.query.services.split(','):', this.$route.query.services.split(','));
      if (this.refineType !== 'categoryField_value') {
        this.$data.selected = this.$route.query.services.split(',');
      } else {
        this.$data.selected = this.$route.query.services;
      }
    }
  },
  methods: {
    calculateColumns(ind) {
      console.log('calculateColumns is running, ind:', ind, 'this.$config.refine.columns', this.$config.refine.columns);
      let value;
      if (this.$config.refine.columns && Object.keys(ind).length < 8) {
        value = 1;
      } else if (this.$config.refine.columns) {
        value = 2;
      } else {
        value = Object.keys(ind).length;
      }
      return value;
    },
    clickedRefineBox(item) {
      // console.log('clickedRefineBox, item:', item, 'typeof item:', typeof item, 'this.$data.selected:', this.$data.selected);
      let data = this.$data;
      let gtag = this.$gtag
      let category = this.$store.state.gtag.category;
      setTimeout(function() {
        if (typeof item === 'object') {
          if (data.selected.includes(item.unique_key)) {
            gtag.event('refine', {
              'event_category': category,
              'event_label': item.unique_key,
            })
          }
        } else if (typeof item === 'string') {
          console.log('data.selected:', data.selected);
          if (data.selected.includes(item)) {
            gtag.event('refine', {
              'event_category': category,
              'event_label': item,
            })
          }
        }
      }, 2000);
    },
    clearAll() {
      console.log('RefinePanel clearAll is running');
      if (this.refineType === 'multipleFieldGroups' || this.refineType === 'multipleDependentFieldGroups') {
        for (let checkbox of Object.keys(this.$data.selectedList)) {
          console.log('this.$data.selectedList[checkbox]:', this.$data.selectedList[checkbox]);
          if (Array.isArray(this.$data.selectedList[checkbox])) {
            this.$data.selectedList[checkbox].splice(0);
          } else {
            this.$data.selectedList[checkbox] = undefined;
          }
        }
      } else {
        this.selected = [];
      }
    },
    getRefineSearchList() {
      console.log('getRefineSearchList is running');
      const refineData = this.database;

      let service = '';
      let uniq;
      let selected;

      if (!this.$config.refine || this.$config.refine && ['categoryField_array', 'categoryField_value'].includes(this.$config.refine.type)) {
        // console.log('in getRefineSearchList, refineData:', refineData);
        refineData.forEach((item) => {
          if (this.$config.refine) {
            let value = this.$config.refine.value(item);
            service += `${value},`;
          } else if (item.services_offered) {
            service += `${item.services_offered},`;
          }
        });

        // console.log('RefinePanel.vue, service:', service);
        let serviceArray = service.split(/(,|;)/);
        serviceArray = serviceArray.map(s => s.trim());
        // console.log('RefinePanel.vue, serviceArray:', serviceArray);

        const uniqArray = [ ...new Set(serviceArray) ];
        // console.log('RefinePanel.vue, uniqArray:', uniqArray);

        // clean up any dangling , or ;
        uniq = uniqArray.filter(a => a.length > 2);
        uniq.filter(Boolean); // remove empties
        let undef = uniq.indexOf('undefined');
        if (undef > -1) {
          uniq.splice(undef, 1);
        }
        let nullVal = uniq.indexOf('null');
        if (nullVal > -1) {
          uniq.splice(nullVal, 1);
        }
        uniq.sort();

        selected = uniqArray.filter(a => a.length > 2);
        selected.filter(Boolean); // remove empties
        selected.sort();

      } else if (this.$config.refine && this.$config.refine.type === 'multipleFields') {
        uniq = Object.keys(this.$config.refine.multipleFields);
        uniq.sort();

        selected = Object.keys(this.$config.refine.multipleFields);
        selected.sort();
      }

      // console.log('getRefineSearchList is still running');
      if (this.$config.refine && this.$config.refine.type === 'multipleFieldGroups') {
        uniq = {};
        selected = {};
        for (let group of Object.keys(this.$config.refine.multipleFieldGroups)){
          // console.log('group:', group);
          uniq[group] = { expanded: false };
          for (let dep of Object.keys(this.$config.refine.multipleFieldGroups[group])){
            // console.log('middle loop, dep:', dep, 'group:', group);
            uniq[group][dep] = {};
            for (let field of Object.keys(this.$config.refine.multipleFieldGroups[group][dep])){
              uniq[group][dep][field] = {};
              // console.log('field:', field, 'selected:', selected, 'this.$config.refine.multipleFieldGroups[group][field].unique_key:', this.$config.refine.multipleFieldGroups[group][field].unique_key);
              if (this.$config.refine.multipleFieldGroups[group][dep][field].i18n_key) {
                uniq[group][dep][field].box_label = this.$config.refine.multipleFieldGroups[group][dep][field].i18n_key;
              } else {
                uniq[group][dep][field].box_label = field;
              }
              uniq[group][dep][field].unique_key = this.$config.refine.multipleFieldGroups[group][dep][field].unique_key;
            }
          }
        }

        // console.log('RefinePanel end of getRefineSearchList, uniq:', uniq, 'selected:', selected, 'this.selected:', this.selected);
        if (this.selected.length) {
          for (let group of Object.keys(uniq)) {
            for (let dep of Object.keys(uniq[group])) {
              for (let field of Object.keys(uniq[group][dep])) {
                if (dep == 'dependent' && this.selected.includes(uniq[group][dep][field].unique_key)) {
                  // console.log('RefinePanel end of getRefineSearchList, dependent, group:', group, 'dep:', dep, 'field:', field, 'uniq[group][dep][field].unique_key', uniq[group][dep][field].unique_key, 'this.selected:', this.selected);
                  if (!selected[group]) {
                    selected[group] = [];
                  }
                  selected[group].push(uniq[group][dep][field].unique_key);
                } else if (dep == 'independent' && this.selected.includes(uniq[group][dep][field].unique_key)) {
                  // console.log('RefinePanel end of getRefineSearchList, independent, selected:', selected, 'group:', group, 'dep:', dep, 'field:', field, 'uniq[group][dep][field].unique_key', uniq[group][dep][field].unique_key, 'this.selected:', this.selected);
                  if (!selected['radio_'+group]) {
                    selected['radio_'+group] = undefined;
                  }
                  selected['radio_'+group] = uniq[group][dep][field].unique_key;
                }
              }
            }
          }
        }
        // console.log('RefinePanel end of getRefineSearchList, selected:', selected);
        this.$data.selectedList = selected;
      }

      if (this.$config.refine && this.$config.refine.type === 'multipleDependentFieldGroups') {
        uniq = {};
        selected = {};
        for (let group of Object.keys(this.$config.refine.multipleDependentFieldGroups)){
          // console.log('outer loop, group:', group);
          uniq[group] = {};
          for (let dep of Object.keys(this.$config.refine.multipleDependentFieldGroups[group])){
            // console.log('middle loop, dep:', dep, 'group:', group);
            uniq[group][dep] = {};
            for (let field of Object.keys(this.$config.refine.multipleDependentFieldGroups[group][dep])){
              uniq[group][dep][field] = {};
              // console.log('inner loop field:', field, 'selected:', selected, 'this.$config.refine.multipleDependentFieldGroups[group][field].unique_key:', this.$config.refine.multipleDependentFieldGroups[group][field].unique_key);
              if (this.$config.refine.multipleDependentFieldGroups[group][dep][field].i18n_key) {
                uniq[group][dep][field].box_label = this.$config.refine.multipleDependentFieldGroups[group][dep][field].i18n_key;
              } else {
                uniq[group][dep][field].box_label = field;
              }
              uniq[group][dep][field].unique_key = this.$config.refine.multipleDependentFieldGroups[group][dep][field].unique_key;
            }
          }
        }

        console.log('RefinePanel end of getRefineSearchList, uniq:', uniq, 'selected:', selected, 'this.selected:', this.selected);
        if (this.selected.length) {
          for (let group of Object.keys(uniq)) {
            for (let dep of Object.keys(uniq[group])) {
              for (let field of Object.keys(uniq[group][dep])) {
                if (this.selected.includes(uniq[group][dep][field].unique_key)) {
                  // console.log('RefinePanel end of getRefineSearchList, group:', group, 'field:', field, 'uniq[group][field].unique_key', uniq[group][field].unique_key, 'this.selected:', this.selected);
                  if (!selected[group]) {
                    selected[group] = [];
                  }
                  selected[group].push(uniq[group][dep][field].unique_key);
                }
              }
            }
          }
        }
        console.log('RefinePanel end of getRefineSearchList, selected:', selected);
        this.$data.selectedList = selected;
      }

      this.$data.refineList = uniq;

      return uniq;
    },
    scrollToTop() {
      const container = document.querySelector('.refine-panel');
      container.scrollTo(0, 0);
    },
    expandCheckbox(ind) {
      console.log('expandCheckbox is running');
      this.refineList[ind].expanded = !this.refineList[ind].expanded;
    },
    expandRefine() {
      console.log('expandRefine is running');
      // if (window.innerWidth <= 767) { // converted from rems
      this.$gtag.event('refine-panel-open', {
        'event_category': this.$store.state.gtag.category,
      })
      this.$store.commit('setRefineOpen', !this.refineOpen);
      // }
    },
    closeRefinePanel(){
      console.log('closeRefinePanel is running');
      this.scrollToTop();
      this.expandRefine();
      this.clearAll();
    },
  },
};
</script>

<style lang="scss">
@import "../assets/scss/main.scss";

#refine-panel-component {
  background: $ghost-grey;
}

#columns-div-for-checkboxes {

  .input-checkbox {
    padding-bottom: 16px;
  }

  .checkbox-div {
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 0px;

    .control {
      margin-right: 12px;
    }
  }
}

.refine-dropdown-closed {
  height: 6rem;
}

.refine-retractable-closed {
  height: 3rem;

  .refine-title {
    &::after{
      content: '+';
      font-weight: 900;
      position: absolute;
      font-size: 1.6rem;
      right: 5px;
      top: 110px;
    }
  }
}

.refine-retractable-open .refine-title{
  &::after {
    content: '-';
    font-weight: 900;
    position: absolute;
    font-size: 1.6rem;
    right: 5px;
    top: 110px;
  }
}

.refine-panel {
  overflow-y: hidden;
  padding: 1rem;

  .legend-title{
    margin-bottom: 0;
    font-weight: bold;
    font-size: 1.2rem;
    text-transform: uppercase;
  }

  @media screen and (min-width: 768px) {
    .service-group-holder-x{
      padding-bottom: 0px;
      margin-bottom: 10px;
      padding-left: 16px;
      padding-right: 10px;
      border-right: 1px solid black;
      &:first-of-type{
        // padding-left: 0px;
      }
      &:last-of-type{
        border-right: none;
      }
    }
  }

  .refine-title{
    color: $ben-franklin-blue-dark;
    margin-bottom: 0px !important;

    .clear-all{
      font-weight: normal;
      font-size: .8rem;
      color: #0f4d90 !important;
    }

    .clear-button{
      background-color: rgb(0, 204, 255);
      height: 30px;
      width: 80px;
      margin-left: 10px;
      margin-right: 10px;
    }

  }

  label {
    font-weight: normal;
    cursor: pointer;
  }

  @media screen and (max-width: 767px) {
    height: 3rem;
    padding: .5rem;
    position: relative;
    // z-index: 10000;

    .refine-title{
      margin-bottom: 14px !important;
      cursor: pointer;
      height:7vh;
      padding: .5rem;

      &::after{
        content: '+';
        font-weight: 900;
        position: absolute;
        font-size: 1.6rem;
        right: 5px;
        top: 10px;
      }
    }

    .service-group-holder-x{
      padding-bottom: 10px;
      margin-bottom: 10px;
      padding-left: 16px;
      padding-right: 10px;
      border-bottom: 1px solid black;
      &:first-of-type{
        // padding-left: 0px;
      }
      &:last-of-type{
        border-bottom: none;
      }
    }

    #multiple-field-groups-div {
      margin: 5px;
    }
  }

  &.refine-panel-open {
    overflow-y: scroll;
    height: calc(100vh - 190px);
    max-height: 100vh;
    .refine-title{
      &::after {
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

.dropdown-checkbox-div {
  // padding-left: 0px;
  // padding-right: 0px;
  // padding-top: 0px;
  // padding-bottom: 0px;
  padding: 0px !important;
  position: absolute;
  z-index: 1001;
  // width: 20%;
  border-style: solid;
  border-width: 1px;
}

.dropdown-checkbox-header {
  padding: 0.75rem;
}

.refine-dropdown {
  background-color: rgb(240, 240, 240);
}

.input-label {
  display: inline-block;
  color: $ben-franklin-blue-dark;
  font-size: 14px;
  margin-bottom: .5rem;
  padding-left: 10px;
}

.fa-checkbox {
  pointer-events: none;
  color: $ben-franklin-blue-dark;
  position: relative;
  right: -15px;
  bottom: 1px;
}

.fa-infoCircle {
  color: $ben-franklin-blue-dark;
  cursor: pointer;
}

.apply-filters-text {
  display: inline-block;
}

.white-font-link {
  color: white;
}

.white-font-link:hover {
  color: #25cef7 !important;
}

.white-font-link:visited {
  color: white;
}

// .refine-holder {
//   margin-top: 20px;
// }

</style>
