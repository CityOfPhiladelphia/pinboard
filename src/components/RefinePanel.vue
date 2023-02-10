<template>
  <div
    id="refine-panel-component"
    :class="refinePanelClass"
  >

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

      <h2
        v-if="!i18nEnabled"
        class="refine-label-text"
      >
        {{ refineTitle }}
      </h2>

      <h2
        v-if="i18nEnabled"
        class="refine-label-text"
      >
        {{ $t('refinePanel.refine') }}
      </h2>

      <div
        class="open-close-icon"
      >
        <font-awesome-icon
          v-if="refineOpen && retractable  || refineOpen && isMobile"
          :icon="[angleIconWeight, 'angle-up']"
        />
        <!-- class="open-close-icon" -->

        <font-awesome-icon
          v-if="!refineOpen && retractable  || !refineOpen && isMobile"
          :icon="[angleIconWeight, 'angle-down']"
        />
        <!-- class="open-close-icon" -->
      </div>

      <button
        v-if="!i18nEnabled && isTablet && (selected.length || anyValueEntered) || !i18nEnabled && isDesktop && (selected.length || anyValueEntered) || !i18nEnabled && isWideScreen && (selected.length || anyValueEntered)"
        class="clear-all"
        @click.prevent="clearAll"
      >
        Clear all
      </button>

      <button
        v-if="i18nEnabled && isTablet && (selected.length || anyValueEntered) || i18nEnabled && isDesktop && (selected.length || anyValueEntered) || i18nEnabled && isWideScreen && (selected.length || anyValueEntered)"
        class="clear-all"
        @click.prevent="clearAll"
        v-html="$t('refinePanel.clearAll')"
      />

      <div
        id="selected-boxes"
        v-if="isTablet || isDesktop || isWideScreen"
        class="selected-boxes columns"
        @click="clickBox"
      >
      <!-- v-if="refineType !== 'categoryField_value' && isTablet || refineType !== 'categoryField_value' && isDesktop || refineType !== 'categoryField_value' && isWideScreen" -->
      <!-- v-if="refineType !== 'categoryField_value'" -->
        <button
          v-for="box in keywordsEntered"
          class="box-value column is-narrow"
          @click="closeKeywordsBox(box)"
        >
          {{ $t(getBoxValue(box)) }}
          <font-awesome-icon
            class="fa-x"
            :icon="[timesIconWeight,'times']"
          />
        </button>

        <button
          v-if="zipcodeEntered"
          class="box-value column is-narrow"
          @click="closeZipcodeBox(zipcodeEntered)"
        >
          {{ $t(getBoxValue(zipcodeEntered)) + ' - 1 mile' }}
          <font-awesome-icon
            class="fa-x"
            :icon="[timesIconWeight,'times']"
          />
        </button>

        <button
          v-if="addressEntered"
          class="box-value column is-narrow"
          @click="closeAddressBox(addressEntered)"
        >
          {{ $t(getBoxValue(addressEntered)) + ' - ' + searchDistance }}
          <font-awesome-icon
            class="fa-x"
            :icon="[timesIconWeight,'times']"
          />
        </button>

        <button
          v-if="refineType !== 'categoryField_value'"
          v-for="box in selected"
          class="box-value column is-narrow"
          @click="closeBox(box)"
        >
          {{ $t(getBoxValue(box)) }}
          <font-awesome-icon
            class="fa-x"
            :icon="[timesIconWeight,'times']"
          />
        </button>
        <button
          v-if="refineType == 'categoryField_value' && selected.length && i18nEnabled"
          class="box-value column is-narrow"
          @click="closeBox(selected)"
        >
          {{ $t('sections.' + getCategoryFieldValue(selected) + '.header') }}
          <font-awesome-icon
            class="fa-x"
            :icon="[timesIconWeight,'times']"
          />
        </button>
        <button
          v-if="refineType == 'categoryField_value' && selected.length && !i18nEnabled"
          class="box-value column is-narrow"
          @click="closeBox(selected)"
        >
          {{ selected }}
          <font-awesome-icon
            class="fa-x"
            :icon="[timesIconWeight,'times']"
          />
        </button>
      </div>

    </div>

    <!-- Mobile Clear All Button -->
    <div
      v-if="isMobile && refineOpen"
    >
      <div
        v-if="!i18nEnabled"
      >
        <button
          class="clear-all"
          @click.prevent="clearAll"
        >
          Clear all
        </button>
      </div>
      <div
        v-if="i18nEnabled"
      >
        <button
          class="clear-all"
          @click.prevent="clearAll"
          v-html="$t('refinePanel.clearAll')"
        >
        </button>
      </div>
    </div>

    <!-- if using categoryField_value, categoryField_array, or multipleFields options -->
    <div
      v-if="dataStatus === 'success' && ['categoryField_array', 'multipleFields'].includes(refineType)"
      v-show="!retractable && !isMobile || refineOpen"
      id="field-div"
      class="refine-holder"
    >
      <checkbox
        :options="getRefineSearchList()"
        :numOfColumns="NumRefineColumns"
        :small="!isMobile"
        v-model="selected"
        text-key="textLabel"
        value-key="data"
        >
        <!-- ref="textLab" -->
        <!-- @click="clickedCheckbox" -->
      </checkbox>
    </div>

    <div
      v-if="dataStatus === 'success' && refineType == 'categoryField_value'"
      v-show="!retractable && !isMobile || refineOpen"
      id="field-div"
      class="refine-holder"
    >
      <radio
        v-model="selected"
        :options="refineListTranslated"
        text-key="text"
        value-key="value"
        :numOfColumns="NumRefineColumns"
        :small="!isMobile"
      >
      </radio>
    </div>

    <!-- if using multipleFieldGroups option and NOT dropdownRefine -->
    <div
      v-if="dataStatus === 'success' && refineType === 'multipleFieldGroups' && !dropdownRefine"
      v-show="!retractable && !isMobile || refineOpen"
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
            v-if="refineListTranslated[ind]['radio']"
            :options="refineListTranslated[ind]['radio']"
            text-key="textLabel"
            value-key="data"
            :small="!isMobile"
            :num-of-columns="calculateColumns(refineList[ind]['radio'])"
          >
            <div
              :class="isMobile ? 'large-label': 'small-label'"
              slot="label"
            >
              {{ $t(ind + '.category') }}
            </div>
          </radio>

          <checkbox
            v-if="refineListTranslated[ind]['checkbox']"
            :options="refineListTranslated[ind]['checkbox']"
            :small="!isMobile"
            v-model="selectedList[ind]"
            text-key="textLabel"
            value-key="data"
            shrinkToFit="true"
            :num-of-columns="calculateColumns(refineList[ind]['checkbox'])"
          >
            <!-- ref="ind" -->
            <div
              :class="isMobile ? 'large-label': 'small-label'"
              slot="label"
            >
              {{ $t(ind + '.category') }}
              <icon-tool-tip
                v-if="!isMobile && refineListTranslated[ind]['tooltip']"
                :tip="refineListTranslated[ind]['tooltip']"
                :circle-type="click"
                :position="'bottom'"
              />
              <div
                v-if="isMobile && refineListTranslated[ind]['tooltip']"
                class="mobile-tooltip"
              >
                <font-awesome-icon
                  icon="info-circle"
                  class="fa-infoCircle"
                />
                {{ $t(refineListTranslated[ind]['tooltip']) }}
              </div>
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
            </div>
            <div
              v-if="refineList[ind].expanded"
              class="refine-dropdown"
            >
              <radio
                v-model="selectedList['radio_'+ind]"
                v-if="refineListTranslated[ind]['radio']"
                :options="refineListTranslated[ind]['radio']"
                text-key="textLabel"
                value-key="data"
                :small="!isMobile"
                :num-of-columns="calculateColumns(refineList[ind]['radio'])"
              >
                <div
                  slot="label"
                >
                </div>
              </radio>

              <checkbox
                v-if="refineListTranslated[ind]['checkbox']"
                :options="refineListTranslated[ind]['checkbox']"
                :small="!isMobile"
                v-model="selectedList[ind]"
                text-key="textLabel"
                value-key="data"
                shrinkToFit="true"
                :num-of-columns="calculateColumns(refineList[ind]['checkbox'])"
              >
                <div
                  slot="label"
                >
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
              v-if="refineListTranslated[ind]['radio']"
              :options="refineListTranslated[ind]['radio']"
              text-key="textLabel"
              value-key="data"
              :num-of-columns="1"
              :small="!isMobile"
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
              :options="refineListTranslated[ind]['checkbox']"
              :num-of-columns="1"
              :small="!isMobile"
              v-model="selectedList[ind]"
              text-key="textLabel"
              value-key="data"
              shrinkToFit="true"
            >
              <div
                v-if="!refineListTranslated[ind]['radio']"
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
      v-if="isMobile && refineOpen"
      class="columns is-mobile mobile-clear-all"
    >
      <div
        class="column is-narrow add-margin-left small-side-padding"
        v-if="!i18nEnabled"
      >
        <button
          class="button apply-filters-button medium-side-padding"
          @click="expandRefine(); scrollToTop();"
        >
          <div class="apply-filters-text">
            Apply filters
          </div>
        </button>
      </div>

      <div
        class="column is-narrow add-margin-left small-side-padding"
        v-if="i18nEnabled"
      >
        <div
          class="button apply-filters-button medium-side-padding"
          @click="expandRefine(); scrollToTop();"
        >
          <div
            v-html="$t('refinePanel.applyFilters')"
            class="apply-filters-text"
          />
        </div>
      </div>

      <!-- <div
        class="column is-narrow small-side-padding"
        v-if="!i18nEnabled"
      >
        <button
          class="button is-primary medium-side-padding"
          @click.prevent="clearAll"
        >
          Clear all
        </button>
      </div> -->

      <!-- <div
        class="column is-narrow small-side-padding"
        v-if="i18nEnabled"
      >
        <button
          class="button is-primary medium-side-padding"
          @click.prevent="clearAll"
          v-html="$t('refinePanel.clearAll')"
        >
        </button>
      </div> -->

    </div>

  </div>
</template>
<script>

import { library } from '@fortawesome/fontawesome-svg-core';
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core';

import Vue from 'vue';
import { mapState } from 'vuex';
import Checkbox from './Checkbox.vue';
import { Radio } from '@phila/phila-ui';

import IconToolTip from './IconToolTip.vue';

export default {
  components: {
    Checkbox,
    Radio,
    IconToolTip,
  },
  props: {
    refineTitle: {
      type: String,
      default: 'FILTER',
    },
    submittedCheckboxValue: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_URL,
      selected: [],
      selectedList: {},
    };
  },
  computed: {
    searchDistance() {
      let value;
      if (this.$config.searchBar.searchDistance) {
        value = this.$config.searchBar.searchDistance;
      } else {
        value = 1
      }
      let word;
      if (value == 1) {
        word = 'mile';
      } else {
        word = 'miles';
      }
      return value + ' ' + word;
    },
    refineList() {
      return this.$store.state.refineList;
    },
    anyValueEntered() {
      let value = false;
      if (this.zipcodeEntered != null || this.addressEntered != null || this.keywordsEntered.length != 0) {
        value = true;
      }
      return value;
    },
    angleIconWeight() {
      let value = 'fas';
      let regularExists = findIconDefinition({ prefix: 'far', iconName: 'angle-down' });
      // console.log('refinePanel.vue computed, library:', library, 'regularExists:', regularExists);
      if (regularExists) {
        value = 'far';
      }
      return value;
    },
    timesIconWeight() {
      let value = 'fas';
      let regularExists = findIconDefinition({ prefix: 'far', iconName: 'times' });
      if (regularExists) {
        value = 'far';
      }
      return value;
    },
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
      console.log('selectedListCompiled computed is running');
      let test = this.$data.selectedList;
      let compiled = [];
      for (let value of Object.keys(test)) {
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
      if (this.refineType === 'categoryField_value') {
        // mainArray = this.refineList;
        for (let category of this.refineList) {
          mainArray.push({
            value: category.data,
            text: this.$t(category.data),
          });
          console.log('refineListTranslated computed, category:', category, 'mainArray:', mainArray);
        }
        return mainArray;
      } else if (this.refineType !== 'multipleFieldGroups' && this.refineType !== 'multipleDependentFieldGroups') {
        for (let category of this.refineList) {
          mainArray.push({
            value: category,
            text: this.$t(category),
          });
          console.log('refineListTranslated computed, category:', category, 'this.$t(category):', this.$t(category), 'mainArray:', mainArray);
        }
        return mainArray;
      } else if (this.refineType == 'multipleFieldGroups') {
        if (this.refineList) {
          for (let category of Object.keys(this.refineList)) {
            mainObject[category] = {};
            for (let dep of Object.keys(this.refineList[category])) {
              // console.log('dep:', dep);
              if (dep !== 'tooltip') {

                mainObject[category][dep] = [];
                for (let box of Object.keys(this.refineList[category][dep])) {

                  let data = this.refineList[category][dep][box].unique_key;
                  let textLabel = this.$t(this.refineList[category][dep][box].box_label);
                  let tooltip;
                  if (this.refineList[category][dep][box].tooltip) {
                    tooltip = {};
                    tooltip.tip = this.$t(this.refineList[category][dep][box].tooltip.tip);
                    tooltip.multiline = this.refineList[category][dep][box].tooltip.multiline
                    // console.log('tooltip:', tooltip, 'this.refineList[category][dep][box].tooltip.tip:', this.refineList[category][dep][box].tooltip.tip);
                  }
                  let keyPairs = {
                    data: data,
                    textLabel: textLabel,
                    tooltip: tooltip,
                  };
                  mainObject[category][dep].push(keyPairs)
                }
              } else {
                mainObject[category][dep] = this.$t(this.refineList[category][dep].tip);
              }
            }
          }
        }
        return mainObject;
      } else {
        for (let category of Object.keys(this.refineList)) {
          mainObject[category] = {};
          for (let dep of Object.keys(this.refineList[category])) {
            // console.log('in loop, dep', dep);
            mainObject[category][dep] = [];
            for (let box of Object.keys(this.refineList[category][dep])) {
              // console.log('in inner loop, box:', box, 'dep:', dep);
              let data = this.refineList[category][dep][box].unique_key;
              let textLabel = this.$t(this.refineList[category][dep][box].box_label);
              let tooltip;
              if (this.refineList[category][dep][box].tooltip) {
                tooltip = this.$t(this.refineList[category][dep][box].tooltip);
              }
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
      }
    },
    retractable() {
      let value = false;
      if (this.$config.retractableRefine) {
        value = true;
      }
      return value;
    },
    refineTitleClass() {
      let value;
      if (this.retractable) {
        value = 'retractable-refine-title';
        // if (this.refineOpen) {
        //   value = 'refine-title-open';
        // // }
        // } else {
        //   value = 'retractable-refine-title';
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
      } else if (this.retractable) {
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
    zipcodeEntered() {
      return this.$store.state.selectedZipcode;
    },
    addressEntered() {
      let address;
      let routeAddress = this.$route.query.address;
      console.log('addressEntered computed, routeAddress:', routeAddress);
      if (this.geocode && this.geocode.data && this.geocode.data.properties && this.geocode.data.properties.street_address) {
        address = this.geocode.data.properties.street_address;
      } else if (routeAddress) {
        address = routeAddress;
      }
      return address;
    },
    keywordsEntered() {
      // return this.$store.state.selectedKeywords.toString();
      return this.$store.state.selectedKeywords;
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
    i18nLocale() {
      return this.$i18n.locale;
    },
  },
  watch: {
    submittedCheckboxValue(nextSubmittedCheckboxValue) {
      // console.log('RefinePanel watch submittedCheckboxValue, nextSubmittedCheckboxValue:', nextSubmittedCheckboxValue);
      if (nextSubmittedCheckboxValue == null) {
        return;
      }
      let refineList = this.refineList;
      for (let key of Object.keys(refineList)) {
        for (let key2 of Object.keys(refineList[key])) {
          if (key2 === 'radio' || key2 === 'checkbox') {
            for (let key3 of Object.keys(refineList[key][key2])) {
              let unique_key = this.$config.refine.multipleFieldGroups[key][key2][key3].unique_key;
              let i18nValue = this.$i18n.messages[this.i18nLocale][key][key3];
              // console.log('in watch submittedCheckboxValue, key:', key, 'key2:', key2, 'key3:', key3, 'unique_key:', unique_key, 'i18nValue:', i18nValue);
              if (i18nValue.toLowerCase() === nextSubmittedCheckboxValue.toLowerCase()) {


                this.selected.push(unique_key);

                let uniq = {};
                let selected = {};
                for (let group of Object.keys(this.$config.refine.multipleFieldGroups)){

                  uniq[group] = { expanded: false };
                  for (let dep of Object.keys(this.$config.refine.multipleFieldGroups[group])){
                    // console.log('middle loop, dep:', dep, 'group:', group);
                    if (dep !== 'tooltip') {
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
                    } else {
                      uniq[group][dep] = this.$config.refine.multipleFieldGroups[group][dep];
                    }
                  }
                }

                if (this.selected.length) {
                  for (let group of Object.keys(uniq)) {
                    for (let dep of Object.keys(uniq[group])) {
                      for (let field of Object.keys(uniq[group][dep])) {
                        if (dep == 'checkbox' && this.selected.includes(uniq[group][dep][field].unique_key)) {
                          // console.log('RefinePanel end of getRefineSearchList, dependent, group:', group, 'dep:', dep, 'field:', field, 'uniq[group][dep][field].unique_key', uniq[group][dep][field].unique_key, 'this.selected:', this.selected);
                          if (!selected[group]) {
                            selected[group] = [];
                          }
                          selected[group].push(uniq[group][dep][field].unique_key);
                        } else if (dep == 'radio' && this.selected.includes(uniq[group][dep][field].unique_key)) {
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

                this.$data.selectedList = selected;

              }
            }
          }
        }
      }
      this.$emit('watchedSubmittedCheckboxValue');
    },
    keywordsEntered(nextKeywordsEntered) {
      console.log('watch keywordsEntered, nextKeywordsEntered:', nextKeywordsEntered);
      // if (nextKeywordsEntered) {
      //   this.selected.push('keyword_' + nextKeywordsEntered);
      // }
    },
    refineOpen(nextRefineOpen) {
      // console.log('RefinePanel.vue watch refineOpen is firing');
      this.$nextTick(() => {
        this.$store.map.resize();
      });
    },
    database(nextDatabase) {
      // console.log('watch database is calling getRefineSearchList, nextDatabase:', nextDatabase);
      this.getRefineSearchList();
    },
    selected(nextSelected, oldSelected) {
      // console.log('watch selected is firing, nextSelected:', nextSelected, 'oldSelected:', oldSelected);
      let newSelection;
      if (this.refineType !== 'categoryField_value') {
        newSelection = nextSelected.filter(x => !oldSelected.includes(x));
        if (newSelection.length) {
          this.$gtag.event('refine-checkbox-click', {
            'event_category': this.$store.state.gtag.category,
            'event_label': newSelection[0],
          });
        }
      } else {
        newSelection = nextSelected;
        if (newSelection.length) {
          this.$gtag.event('refine-checkbox-click', {
            'event_category': this.$store.state.gtag.category,
            'event_label': newSelection,
          });
        }
      }
      console.log('watch selected is firing, nextSelected:', nextSelected, 'oldSelected:', oldSelected, 'newSelection:', newSelection);
      // if (newSelection.length) {
      //   this.$gtag.event('refine-checkbox-click', {
      //     'event_category': this.$store.state.gtag.category,
      //     'event_label': newSelection[0],
      //   });
      // }

      this.$store.commit('setSelectedServices', nextSelected);

      if (this.refineType !== 'categoryField_value' && nextSelected.length) {
        this.$router.push({ query: { ...this.$route.query, ...{ services: nextSelected.join(',') }}});
      } else {
        this.$router.push({ query: { ...this.$route.query, ...{ services: nextSelected }}});
      }
    },
    selectedListCompiled(nextSelected) {
      window.theRouter = this.$router;
      this.$store.commit('setSelectedServices', nextSelected);
      if (typeof nextSelected === 'string') {
        nextSelected = [nextSelected];
      }
      console.log('RefinePanel watch selectedListCompiled is firing, nextSelected', nextSelected);
      if (!nextSelected.length) {
        return;
      }
      this.$router.push({ query: { ...this.$route.query, ...{ services: nextSelected.join(',') }}});
    },
    selectedServices(nextSelectedServices) {
      console.log('RefinePanel watch selectedServices is firing:', nextSelectedServices);
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
    // console.log('refinePanel.vue mounted, library:', library);
    let divButton = document.querySelector('#refine-top');
    divButton.addEventListener('keypress', activate.bind(this));
    function activate(e) {
      console.log('activate, e:', e, 'e.path[0]:', e.path[0]);
      if (e.type === 'keypress' && [ 13, 32 ].includes(e.keyCode) && e.srcElement.id == 'refine-top') {
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
    this.getRefineSearchList();
    // console.log('this.$config.refine.type:', this.$config.refine.type);
    // this.$nextTick(() => {
    //   if (this.$config.refine.type == 'multipleFieldGroups') {
    // this.clickFirstBoxes();
    console.log('mounted still running');
    //   }
    // });
  },
  methods: {
    clickFirstBoxes() {
      console.log('clickFirstBoxes is running');
      for (let value of Object.keys(this.$config.refine.multipleFieldGroups)) {
        // console.log('clickFirstBoxes is running, this.$config.refine.multipleFieldGroups[value]:', this.$config.refine.multipleFieldGroups[value]);
        if (Object.keys(this.$config.refine.multipleFieldGroups[value]).includes('checkbox')) {
          let checkbox = this.$config.refine.multipleFieldGroups[value].checkbox;
          let firstValue = Object.keys(checkbox)[0];
          let unique_key = value+'_'+firstValue;
          let element = document.querySelector('[value='+unique_key+']');
          console.log('clickFirstBoxes is running, element:', element, 'unique_key:', unique_key, 'value:', value, 'firstValue:', firstValue, 'this.$config.refine.multipleFieldGroups[value]:', this.$config.refine.multipleFieldGroups[value]);
          // element.dispatchEvent(new Event('change'))
          // element.checked = !element.checked;
          // element.checked = !element.checked;
        }
      }
    },
    manualSelectedListCompiled(nextSelected) {
      window.theRouter = this.$router;
      this.$store.commit('setSelectedServices', nextSelected);
      if (typeof nextSelected === 'string') {
        nextSelected = [nextSelected];
      }
      console.log('RefinePanel manualSelectedListCompiled is firing, nextSelected', nextSelected);
      if (!nextSelected.length) {
        return;
      }
      this.$router.push({ query: { ...this.$route.query, ...{ services: nextSelected.join(',') }}});
    },
    // clickedCheckbox() {
    //   console.log('clickedCheckbox is running');
    // },
    getCategoryFieldValue(section) {
      let sectionLower = section.toLowerCase().replaceAll(' ', '');
      let i18nCategories = Object.keys(this.$i18n.messages[this.i18nLocale].sections);
      let selectedCategory;
      for (let category of i18nCategories) {
        let categoryLower = category.toLowerCase().replaceAll(' ', '');
        if (categoryLower === sectionLower || categoryLower === sectionLower + 's') {
          selectedCategory = category;
        }
      }
      return selectedCategory;
    },
    findTooltip(test) {
      console.log('findTooltip is running, test:', test);
      return 'test';
    },
    getBoxValue(box) {
      console.log('getBoxValue is running, box:', box);
      let value;
      if (box) {
        value = box.replace("_", ".");
      }
      return value;
    },
    calculateColumns(ind) {
      // console.log('calculateColumns is running, ind:', ind, 'this.$config.refine.columns', this.$config.refine.columns);
      let value;
      if (this.isMobile || this.$config.refine.columns) {
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
    closeZipcodeBox(box) {
      console.log('closeZipcodeBox is running');
      let startQuery = { ...this.$route.query };
      console.log('closeZipcodeBox is running, box:', box, 'startQuery:', startQuery);
      delete startQuery['zipcode'];
      this.$router.push({ query: { ...startQuery }});
      // this.$controller.resetGeocode();
      this.$store.commit('setSelectedZipcode', null);
      this.$store.commit('setZipcodeCenter', []);
      this.$store.commit('setCurrentSearch', null);
      // this.$store.commit('setBufferShape', null);
    },
    closeAddressBox(box) {
      let startQuery = { ...this.$route.query };
      console.log('closeAddressBox is running, box:', box, 'startQuery:', startQuery);
      delete startQuery['address'];
      this.$router.push({ query: { ...startQuery }});
      this.$controller.resetGeocode();
      this.$store.commit('setCurrentSearch', null);
      this.$store.commit('setBufferShape', null);
    },
    closeKeywordsBox(box) {
      let startQuery = { ...this.$route.query };
      let keywordsArray;
      if (startQuery.keyword && typeof startQuery.keyword === 'string' && startQuery.keyword != '') {
        keywordsArray = startQuery.keyword.split(',');
      } else if (startQuery.keyword && Array.isArray(startQuery.keyword) && startQuery.keyword.length) {
        keywordsArray = startQuery.keyword;
      } else {
        keywordsArray = [];
      }
      console.log('closeKeywordsBox is running, keywordsArray:', keywordsArray, 'typeof startQuery.keyword:', typeof startQuery.keyword, 'box:', box, 'startQuery.keyword:', startQuery.keyword);
      const index = keywordsArray.indexOf(box);
      if (index > -1) { // only splice array when item is found
        console.log('in closeKeywordsBox in if 1, keywordsArray:', keywordsArray);
        keywordsArray.splice(index, 1); // 2nd parameter means remove one item only
        console.log('in closeKeywordsBox in if 2, keywordsArray:', keywordsArray);
      }
      let newQuery = keywordsArray.toString();
      console.log('in closeKeywordsBox, this.$route.query:', this.$route.query, 'startQuery:', startQuery, 'newQuery:', newQuery);
      // console.log('in clearSearchTriggered2, this.$route.query:', this.$route.query, 'startQuery:', startQuery);
      if (newQuery.length) {
        this.$router.push({ query: { ...this.$route.query, ...{ keyword: newQuery }}});
      } else {
        this.$router.push({ query: { ...this.$route.query, ...{ keyword: [] } }});
      }
      // this.$router.push({ query: { ...this.$route.query, ...{ keyword: keywordsArray }}});
      this.searchString = '';
      this.$store.commit('setSelectedKeywords', keywordsArray);
    },
    closeBox(box) {
      if (this.refineType === 'categoryField_value') {
        this.$data.selectedList = [];
        return;
      }
      let section = box.split('_')[0];
      console.log('closeBox is running, section:', section, 'this.$data.selected:', this.$data.selected, 'this.$data.selected[section]:', this.$data.selected[section]);
      if (this.$data.selectedList[section]) {
        console.log('it\'s there in selectedList');
        let boxIndex = this.$data.selectedList[section].indexOf(box);
        this.$data.selectedList[section].splice(boxIndex, 1);
        // this.$data.selected.splice(box, 1);
      } else if (this.$data.selectedList['radio_' + section]) {
        // let boxIndex = this.$data.selectedList['radio_' + section].indexOf(box);
        console.log('1 it\'s there in selectedList WITH radio, box:', box, 'this.$data.selectedList["radio_" + section]:', this.$data.selectedList['radio_' + section]);
        let test = 'radio_' + section;
        const { [test]: removedProperty, ...exceptBoth } = this.$data.selectedList;
        this.$data.selectedList = exceptBoth;
        console.log('2 exceptBoth:', exceptBoth, 'it\'s there in selectedList WITH radio, box:', box, 'this.$data.selectedList["radio_" + section]:', this.$data.selectedList['radio_' + section]);
      } else if (this.$data.selected.includes(section)) {
        console.log('its in the array');
        let boxIndex = this.$data.selected.indexOf(section);
        this.$data.selected.splice(boxIndex, 1);
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
      this.$store.commit('setSelectedKeywords', []);
      this.$store.commit('setSelectedZipcode', null);
      this.$store.commit('setZipcodeCenter', []);
      this.$controller.resetGeocode();
      this.$store.commit('setCurrentSearch', null);
      this.$store.commit('setBufferShape', null);
      let startQuery = { ...this.$route.query };
      delete startQuery['address'];
      delete startQuery['zipcode'];
      delete startQuery['keyword'];
      this.$router.push({ query: { ...startQuery }});
    },
    getRefineSearchList() {
      console.log('getRefineSearchList is running');
      let refineData = this.database;
      if (refineData && refineData.records) {
        refineData = refineData.records;
      }

      let service = '';
      let uniq = [];
      let uniqPrep;
      let selected;

      if (!this.$config.refine || this.$config.refine && ['categoryField_array', 'categoryField_value'].includes(this.$config.refine.type)) {
        console.log('in getRefineSearchList, refineData:', refineData);
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
        uniqPrep = uniqArray.filter(a => a.length > 2);
        uniqPrep.filter(Boolean); // remove empties
        let undef = uniqPrep.indexOf('undefined');
        if (undef > -1) {
          uniqPrep.splice(undef, 1);
        }
        let nullVal = uniqPrep.indexOf('null');
        if (nullVal > -1) {
          uniqPrep.splice(nullVal, 1);
        }
        uniqPrep.sort();

        for (let value of uniqPrep) {
          let theTooltip;
          if (this.$config.infoCircles && Object.keys(this.$config.infoCircles).includes(value)) {
            theTooltip = this.$config.infoCircles[value];
          }
          uniq.push({
            data: value,
            textLabel: value,
            tooltip: theTooltip,
          });
        }


        selected = uniqArray.filter(a => a.length > 2);
        selected.filter(Boolean); // remove empties
        selected.sort();
        console.log('uniq:', uniq, 'uniqPrep:', uniqPrep, 'uniqArray:', uniqArray, 'selected:', selected);

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

          // if (Object.keys(this.$config.refine.multipleFieldGroups[group]).includes('checkbox')) {
          //   console.log('this.$data.selectedList:', this.$data.selectedList, 'Object.keys(this.$config.refine.multipleFieldGroups[group]):', Object.keys(this.$config.refine.multipleFieldGroups[group]));
          //   this.$data.selectedList[group] = []
          // }
          // console.log('group:', group);
          uniq[group] = { expanded: false };
          for (let dep of Object.keys(this.$config.refine.multipleFieldGroups[group])){
            // console.log('middle loop, dep:', dep, 'group:', group);
            if (dep !== 'tooltip') {
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
            } else {
              uniq[group][dep] = this.$config.refine.multipleFieldGroups[group][dep];
            }
          }
        }

        

        // console.log('RefinePanel end of getRefineSearchList, uniq:', uniq, 'selected:', selected, 'this.selected:', this.selected);
        if (this.selected.length) {
          for (let group of Object.keys(uniq)) {
            for (let dep of Object.keys(uniq[group])) {
              for (let field of Object.keys(uniq[group][dep])) {
                if (dep == 'checkbox' && this.selected.includes(uniq[group][dep][field].unique_key)) {
                  // console.log('RefinePanel end of getRefineSearchList, dependent, group:', group, 'dep:', dep, 'field:', field, 'uniq[group][dep][field].unique_key', uniq[group][dep][field].unique_key, 'this.selected:', this.selected);
                  if (!selected[group]) {
                    selected[group] = [];
                  }
                  selected[group].push(uniq[group][dep][field].unique_key);
                } else if (dep == 'radio' && this.selected.includes(uniq[group][dep][field].unique_key)) {
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

      // this.refineList = uniq;
      this.$store.commit('setRefineList', uniq);

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
  overflow-x: hidden;
}

#columns-div-for-checkboxes {

  .input-checkbox, .input-radio {
    padding-bottom: 8px;
    // padding-top: 24px;
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
  padding: 4px 4px 2px 4px !important;
  height: 30px;
  border-width: 2px !important;
  border-style: solid;
  border-color: #cfcfcf;
  border-radius: 4px;
  background-color: #cfcfcf;
  box-sizing: border-box;
  font-family: "ArialMT", "Arial", sans-serif;
  font-size: 1em;
  color: #333333;
  text-align: left;
  line-height: normal;
}

.box-value:hover {
  border-color: #2176d2 !important;
}

.invisible-x-button {
  border-style: none;
  background-color: #cfcfcf;
  cursor: pointer;
}

.fa-x {
  margin-left: 4px;
  margin-right: 4px;
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
      margin-bottom: 24px !important;
      padding-top: 0px;
      padding-bottom: 0px;
      margin-bottom: 10px;
      padding-left: 24px;
      padding-right: 24px;
      border-right: 1px solid #cfcfcf;
      &:first-of-type{
        // padding-left: 0px;
      }
      &:last-of-type{
        border-right: none;
      }
    }

    .refine-title {
      border-style: solid;
      border-width: 2px;
      border-color: #f0f0f0;
    }

    .retractable-refine-title {
      cursor: pointer;
    }

    .retractable-refine-title:hover {
      border-color: #2176d2;
    }

    // .refine-title-open {
    //   cursor: pointer;
    // }

    // .retractable-refine-title-open:hover {
    //   border-color: #f0f0f0;
    // }

    .close-button {
      height: 20px;
      // position: absolute;
      // top: 115px;
      // right: 12px;
      border-style: none;
      background-color: rgb(240, 240, 240);
      color: $ben-franklin-blue-dark;
      cursor: pointer;
      padding-left: 0px;
      padding-top: 8px;
      // padding-bottom: 12px;
      padding-right: 0px;
    }

    .refine-holder {
      padding-left: 12px;
      padding-right: 12px;
    }
  }

  .refine-title {
    color: $ben-franklin-blue-dark;
    margin: 0px !important;
    display: flex;
    flex-direction: row;

    .clear-all {
      margin-top: 10px;
      border-style: none;
      background-color: rgb(240, 240, 240);
      height: 20px;
      font-weight: bold;
      font-size: .8rem;
      color: #0f4d90 !important;
      text-decoration: underline;
      padding-left: 16px;
      padding-right: 12px;
      cursor: pointer;
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
    position: relative;

    .clear-all {
      // margin-top: 8px;
      border-style: none;
      background-color: rgb(240, 240, 240);
      height: 30px;
      font-weight: bold;
      font-size: 1.063rem;
      color: #0f4d90 !important;
      text-decoration: underline;
      padding-left: 16px;
      padding-right: 12px;
      cursor: pointer;
    }

    .slider-icon {
      padding-top: 11px;
      padding-left: 14px;
      padding-bottom: 11px;
    }

    .refine-label-text {
      padding-top: 13px;
      padding-bottom: 13px;
    }

    .open-close-icon {
      padding-top: 9px;
      font-size: 26px;
    }

    #columns-div-for-checkboxes {

      .input-checkbox, .input-radio {
        padding-bottom: 24px;
        padding-top: 24px;
      }
    }

    .close-button {
      height: 30px;
      // position: absolute;
      // top: 10px;
      // right: 5px;
      border-style: none;
      background-color: rgb(240, 240, 240);
      color: $ben-franklin-blue-dark;
      padding-left: 0px;
      padding-top: 9px;
      // padding-bottom: 12px;
      padding-right: 0px;
    }

    .refine-title{
      // margin-bottom: 14px !important;
      cursor: pointer;
      height:7vh;
    }

    .service-group-holder-x {
      padding-top: 0px;
      padding-bottom: 12px;
      margin-bottom: 12px;
      padding-left: 6px !important;
      padding-right: 6px !important;
      border-bottom: 1px solid black;
      &:first-of-type{
        // padding-left: 0px;
      }
      &:last-of-type{
        border-bottom: none;
      }
    }

    .add-margin-left {
      margin-left: 24px;
    }

    .small-side-padding {
      padding-left: 6px !important;
      padding-right: 6px !important;
    }

    .medium-side-padding {
      padding-left: 12px !important;
      padding-right: 12px !important;
    }

    #multiple-field-groups-div {
      padding-left: 16px;
      padding-right: 16px;
    }
  }

  &.refine-panel-open {
    overflow-y: hidden;
    height: 100%;
  }
}

.mobile-clear-all {
  padding-bottom: 1.5rem;
}

.small-label {
  font-size: 16px;
}

.large-label {
  font-size: 20px;
  margin-bottom: 4px;
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

.apply-filters-button {
  background-color: #0f4d90 !important;
}

.apply-filters-text {
  display: inline-block;
  color: #ffffff;
}

.slider-icon {
  padding-top: 10px;
  padding-left: 14px;
  padding-bottom: 10px;
}

.refine-label-text {
  box-sizing: border-box;
  font-family: "Montserrat-Bold", "Montserrat Bold", "Montserrat", sans-serif;
  font-weight: 700;
  color: #0f4d90;
  text-align: left;
  line-height: normal;
  padding-left: 4px;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-right: 8px;
  text-transform: uppercase;
}

.input-wrap.input-checkbox .is-checkradio+label:hover::before, .input-wrap.input-radio .is-checkradio+label:hover::before {
  border-width: 2px !important;
}

.is-checkradio[type=checkbox]:focus:not([disabled])+label::before, .is-checkradio[type=checkbox]:focus:not([disabled])+label:before, .is-checkradio[type=radio]:focus:not([disabled])+label::before, .is-checkradio[type=radio]:focus:not([disabled])+label:before {
  border-width: 2px !important;
  border-color: #2176d2 !important;
}

.open-close-icon {
  padding-top: 8px;
  font-size: 26px;
}

</style>
