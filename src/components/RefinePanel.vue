<template>
  <div
    id="refine-panel-component"
    :class="refinePanelClass"
  >

    <!-- <button -->
    <div
      id="refine-top"
      :class="refineTitleClass + ' refine-title'"
      tabindex="0"
      role="button"
      @click="expandRefine"
    >

      <div
        class="slider-icon"
      >
        <font-awesome-icon icon="sliders-h" />
      </div>

      <div
        v-if="!i18nEnabled"
        class="refine-label-text"
      >
        {{ legendTitle }}
      </div>
      <div
        v-if="i18nEnabled"
        class="refine-label-text"
        v-html="$t('refinePanel.refine')"
      />

      <!-- href="" -->
      <div
        v-if="!i18nEnabled && isTablet && selected.length || !i18nEnabled && isDesktop && selected.length || !i18nEnabled && isWideScreen && selected.length"
        class="clear-all"
        @click.prevent="clearAll"
      >
        Clear all
      </div>
      <!-- href="" -->
      <div
        v-if="i18nEnabled && isTablet && selected.length || i18nEnabled && isDesktop && selected.length || i18nEnabled && isWideScreen && selected.length"
        class="clear-all"
        @click.prevent="clearAll"
        v-html="$t('refinePanel.clearAll')"
      />

      <div
        id="selected-boxes"
        v-if="isTablet || isDesktop || isWideScreen"
        class="selected-boxes columns"
      >
        <div
          v-for="box in selected"
          class="box-value column is-narrow"
          @click="clickBox"
        >
          <!-- {{ $t('visitType.sports') }} -->
          {{ $t(getBoxValue(box)) }}
          <button
            class="inline-icon"
            tabindex="0"
            @click="closeBox(box)"
          >
            <font-awesome-icon icon="times"
            />
          </button>
        </div>
      </div>
      <!-- </button> -->

      <div
        v-if="refineOpen && isTablet || refineOpen && isDesktop || refineOpen && isWideScreen"
        class="close-button"
      >
        <font-awesome-icon icon="times" />
      </div>

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
      v-show="refineOpen"
      id="multiple-field-groups-div"
      class="columns is-multiline multiple-field-groups"
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
          <!-- @click="checkboxClick" -->
            <div
              slot="label"
            >
              {{ $t(ind + '.category') }}
            </div>
          </checkbox>
        </div>
      </div>
    </div>

    <!-- if using multipleFieldGroups option and NOT dropdownRefine -->
    <div
      v-if="dataStatus === 'success' && refineType === 'multipleFieldGroups' && dropdownRefine"
      id="multiple-field-groups-dropdown-div"
      class="columns is-multiline multiple-field-groups"
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
                  <!-- <icon-tool-tip
                    v-if="Object.keys(infoCircles).includes(ind)"
                    :item="ind"
                    :circleData="infoCircles[ind]"
                    :circleType="'click'"
                  >
                  </icon-tool-tip> -->
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
                  <!-- <icon-tool-tip
                    v-if="Object.keys(infoCircles).includes(ind)"
                    :item="ind"
                    :circleData="infoCircles[ind]"
                    :circleType="'click'"
                  >
                  </icon-tool-tip> -->
                </div>
              </checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- if using multipleDependentFieldGroups option -->
    <div
      v-if="dataStatus === 'success' && refineType === 'multipleDependentFieldGroups'"
      id="multiple-dependent-field-groups-div"
      class="columns is-multiline multiple-field-groups"
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
import Checkbox from './Checkbox.vue';
import { Radio } from '@phila/phila-ui';

export default {
  components: {
    Checkbox,
    Radio,
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
        console.log('in selectedListCompiled computed, value:', value, value.split('_')[0]);
        if (value.split('_')[0] == 'radio') {
          // console.log('radio button clicked!');
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
              let tooltip = this.$t(this.$data.refineList[category][dep][box].tooltip);
              let keyPairs = {
                data: data,
                textLabel: textLabel,
                tooltip: tooltip,
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
    refineTitleClass() {
      let value;
      if (this.$config.retractableRefine) {
        if (this.refineOpen) {
          value = 'refine-title-open';
        }
        // } else {
        //   value = 'refine-title';
        // }
      // } else {
      //   value = 'refine-title';
      }
      return value;
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
    refineOpen(nextRefineOpen) {
      // console.log('RefinePanel.vue watch refineOpen is firing');
      this.$nextTick(() => {
        this.$store.map.resize();
      });
    },
    database(nextDatabase) {
      // console.log('watch database is running, nextDatabase:', nextDatabase);
      this.getRefineSearchList();
    },
    selected(nextSelected, oldSelected) {
      let newSelection = nextSelected.filter(x => !oldSelected.includes(x));
      console.log('watch selected is firing, nextSelected:', nextSelected, 'oldSelected:', oldSelected, 'newSelection:', newSelection);
      if (newSelection.length) {
        this.$gtag.event('refine-checkbox-click', {
          'event_category': this.$store.state.gtag.category,
          'event_label': newSelection[0],
        });
      }

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
  mounted() {
    let divButton = document.querySelector('#refine-top');
    divButton.addEventListener('keypress', activate.bind(this));
    function activate(e) {
      console.log('activate, e:', e, 'e.path[0]:', e.path[0]);
      if (e.type === 'keypress' && e.keyCode == 32 && e.srcElement.id == 'refine-top') {
        this.expandRefine();
      }
    };
    // let closeButton = document.querySelectorAll('.fa-times');
    // console.log('closeButton:', closeButton);
    // closeButton.addEventListener('keypress', activate2.bind(this));
    // function activate2(e) {
    //   console.log('activate2, e:', e, 'e.path[0]:', e.path[0]);
    //   // if (e.type === 'keypress' && e.keyCode == 32 && e.srcElement.id == 'refine-top') {
    //   //   this.expandRefine();
    //   // }
    // };
  },
  methods: {
    // checkboxClick(e) {
    //   console.log('refinePanel checkboxClick is running, e:', e);
    // },
    getBoxValue(box) {
      let value;
      if (box) {
        value = box.replace("_", ".");
      }
      return value;
    },
    calculateColumns(ind) {
      // console.log('calculateColumns is running, ind:', ind, 'this.$config.refine.columns', this.$config.refine.columns);
      let value;
      if (this.$config.refine.columns) {
        value = 1;
      // if (this.$config.refine.columns && Object.keys(ind).length < 8) {
      //   value = 1;
      // } else if (this.$config.refine.columns) {
      //   value = 2;
      } else {
        value = Object.keys(ind).length;
      }
      return value;
    },
    clickedRefineBox(item) {
      console.log('clickedRefineBox, item:', item, 'typeof item:', typeof item, 'this.$data.selected:', this.$data.selected);
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
    clickBox(e) {
      console.log('clickBox is running, e:', e);
      e.stopPropagation();
    },
    closeBox(box) {
      console.log('closeBox is running');
      let section = box.split('_')[0];
      if (this.$data.selectedList[section]) {
        console.log('it\'s there in selectedList');
        let boxIndex = this.$data.selectedList[section].indexOf(box);
        this.$data.selectedList[section].splice(boxIndex, 1);
      } else if (this.$data.selectedList['radio_' + section]) {
        // let boxIndex = this.$data.selectedList['radio_' + section].indexOf(box);
        console.log('1 it\'s there in selectedList WITH radio, box:', box, 'this.$data.selectedList["radio_" + section]:', this.$data.selectedList['radio_' + section]);
        let test = 'radio_' + section;
        const { [test]: removedProperty, ...exceptBoth } = this.$data.selectedList;
        this.$data.selectedList = exceptBoth;
        console.log('2 exceptBoth:', exceptBoth, 'it\'s there in selectedList WITH radio, box:', box, 'this.$data.selectedList["radio_" + section]:', this.$data.selectedList['radio_' + section]);
      } else {
        console.log('not there in selected list');
      }
      // console.log('closeBox is running, box:', box, 'section:', section, 'boxIndex:', boxIndex);
    },
    clearAll(e) {
      e.stopPropagation();
      console.log('RefinePanel clearAll is running, e:', e);
      if (this.refineType === 'multipleFieldGroups' || this.refineType === 'multipleDependentFieldGroups') {
        for (let checkbox of Object.keys(this.$data.selectedList)) {
          console.log('this.$data.selectedList[checkbox]:', this.$data.selectedList[checkbox]);
          if (Array.isArray(this.$data.selectedList[checkbox])) {
            this.$data.selectedList[checkbox].splice(0);
          } else {
            const { [checkbox]: removedProperty, ...exceptBoth } = this.$data.selectedList;
            this.$data.selectedList = exceptBoth;
            // this.$data.selectedList[checkbox] = undefined;
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
              uniq[group][dep][field].tooltip = this.$config.refine.multipleFieldGroups[group][dep][field].tooltip;
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
      let tagValue;
      if (this.refineOpen) {
        tagValue = 'retract refine panel';
      } else {
        tagValue = 'expand refine panel';
      }
      console.log('expandRefine is running, tagValue:', tagValue);
      // if (window.innerWidth <= 767) { // converted from rems
      this.$gtag.event('refine-panel-open', {
        'event_category': this.$store.state.gtag.category,
        'event_label': tagValue,
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
  // height: 3rem;
  // height: 4rem;
}

.box-value {
  margin-left: 4px;
  margin-right: 4px;
  margin-bottom: 8px;
  padding: 6px 4px 2px 4px !important;
  // padding: 0px !important;
  height: 30px;
  border-radius: 4px;
  background-color: #cfcfcf;
  box-sizing: border-box;
  font-family: "ArialMT", "Arial", sans-serif;
  color: #333333;
  text-align: left;
  line-height: normal;
}

.refine-panel {
  overflow-y: hidden;
  // padding: 1rem;

  .legend-title{
    margin-bottom: 0;
    font-weight: bold;
    font-size: 1.2rem;
    text-transform: uppercase;
  }

  @media screen and (min-width: 768px) {
    .service-group-holder-x {
      padding-top: 0px;
      padding-bottom: 0px;
      margin-bottom: 10px;
      padding-left: 24px;
      padding-right: 24px;
      border-right: 2px solid #cfcfcf;
      &:first-of-type{
        // padding-left: 0px;
      }
      &:last-of-type{
        border-right: none;
      }
    }

    .refine-title {
      // height:48px;
      // width: 100%;
      border-style: solid;
      // border-width: 2px !important;
      border-color: #f0f0f0;
    }

    .refine-title:hover {
      border-color: #2176d2;
    }

    .refine-title-open:hover {
      border-color: #f0f0f0;
    }
  }

  .refine-title {
    color: $ben-franklin-blue-dark;
    margin: 0px !important;
    display: flex;
    flex-direction: row;

    .clear-all {
      padding: 10px;
      height: 20px;
      font-weight: normal;
      font-size: .8rem;
      color: #0f4d90 !important;
      text-decoration: underline;
      // pointer-events: none;
    }

    .clear-button {
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
    // padding: .5rem;
    position: relative;
    // z-index: 10000;

    .refine-title{
      margin-bottom: 14px !important;
      cursor: pointer;
      height:7vh;
      // padding: .5rem;

      &::after{
        content: '+';
        font-weight: 900;
        position: absolute;
        font-size: 1.6rem;
        right: 5px;
        top: 10px;
      }
    }

    .service-group-holder-x {
      padding-top: 0px;
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

.multiple-field-groups {
  margin-left: 0px !important;
  margin-right: 0px !important;
  margin-bottom: 0px !important;
  margin-top: 12px !important;
}

.selected-boxes {
  flex-wrap: wrap;
  max-width: 80%;
  padding-top: 6px;
  margin-left: 0px !important;
  margin-right: 0px !important;
  margin-bottom: 0px !important;
  margin-top: 0px !important;
}

.dropdown-checkbox-div {
  padding: 0px !important;
  position: absolute;
  z-index: 1001;
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

.fa-infoCircle {
  color: $ben-franklin-blue-dark;
  cursor: pointer;
}

.apply-filters-text {
  display: inline-block;
}

.slider-icon {
  // width: 40px;
  padding-top: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
}

.close-button {
  position: absolute;
  right: 10px;
  padding: 10px;
}

.refine-label-text {
  // background-color: rgba(240, 240, 240, 0);
  box-sizing: border-box;
  font-family: "Montserrat-Bold", "Montserrat Bold", "Montserrat", sans-serif;
  font-weight: 700;
  color: #0f4d90;
  text-align: left;
  line-height: normal;
  padding-left: 5px;
  padding-top: 12px;
  padding-bottom: 12px;
}

.input-wrap.input-checkbox .is-checkradio+label:hover::before, .input-wrap.input-radio .is-checkradio+label:hover::before {
  border-width: 2px !important;
}

.is-checkradio[type=checkbox]:focus:not([disabled])+label::before, .is-checkradio[type=checkbox]:focus:not([disabled])+label:before, .is-checkradio[type=radio]:focus:not([disabled])+label::before, .is-checkradio[type=radio]:focus:not([disabled])+label:before {
  border-width: 2px !important;
  // border-color: rgb(33, 118, 210) !important;
  border-color: #2176d2 !important;
}

.inline-icon {
  // display: inline-block;
  border-style: none;
  background-color: #cfcfcf;
}



</style>
