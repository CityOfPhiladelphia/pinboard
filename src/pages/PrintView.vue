<template>
  <div class="whole-view">
    <div
      class="header-holder"
    >
      <app-header
        :app-title="appTitle"
        :app-subtitle="appSubTitle"
        :app-link="appLink"
        :is-sticky="false"
        :branding-image="brandingImage"
        :branding-link="brandingLink"
        :isFluid="true"
      >
        <mobile-nav
          slot="mobile-nav"
          :links="footerLinks"
        >
        </mobile-nav>

        <lang-selector
          slot="lang-selector-nav"
          v-if="i18nEnabled"
          :languages="i18nLanguages"
        >
        </lang-selector>

      </app-header>
    </div>

    <div
      class="loc-item open"
    >
      <button
        class="button no-print"
        @click="clickedBackToHome"
      >
        Back to home
        <!-- @click="clickedPrint" -->
        <!-- <router-link to="/"><font-awesome-icon icon="arrow-left" /> Back to home</router-link> -->
        <!-- print -->
      </button>

      <!-- <div
        class="columns location-row is-mobile"
        tabindex="0"
      >
        <div class="location-title column is-11">
          <h2
            class="h5"
            :aria-expanded="locationOpen"
          >
            Test
          </h2>
        </div>
      </div> -->

      <!-- <div class="map-holder">
        <map-panel
          :view="'print'"
        />
      </div> -->
      <!-- @handle-search-form-submit="handleSubmit"
      @clear-search="clearSearchTriggered"
      @toggleMap="toggleMap" -->

      <!-- class="component-holder card-content" -->
      <div
        class="item-content"
        v-for="item of items"
      >
        <div
          class="columns location-row is-mobile"
          tabindex="0"
        >
          <div class="location-title column is-11">
            <h2
              class="h5"
              :aria-expanded="locationOpen"
            >
              {{ getSiteName(item) }}
              <!-- Test -->

              <!-- <div
                v-if="section && !i18nEnabled"
                class="section-name"
                :style="{ 'background-color': sectionColor }"
                >
                {{ sectionTitle }}
              </div>
              <div
                v-if="section && i18nEnabled"
                class="section-name"
                :style="{ 'background-color': sectionColor }"
                v-html="'<b>'+$t(sectionTitle)+'</b>'"
              >
              </div> -->

            </h2>
          </div>
        </div>
        <component
          :is="'expandCollapseContent'"
          v-if="$config.customComps && Object.keys($config.customComps).includes('expandCollapseContent')"
          :item="item"
        />
        <div
          v-if="!$config.customComps || !Object.keys($config.customComps).includes('expandCollapseContent')"
          :class="isMobile ? 'main-content-mobile' : 'main-content'"
        >
          <div class="columns">
            <div class="column is-6">
              <div
                v-if="item.street_address"
                class="columns is-mobile"
              >
                <div class="column is-1">
                  <font-awesome-icon icon="map-marker-alt" />
                </div>
                <div
                  class="column is-11"
                  v-html="parseAddress(item.street_address)"
                >
                  <!-- {{ parseAddress(item.street_address) }} -->
                </div>
              </div>
            </div>

            <div class="column is-6">

              <div
                v-if="item.phone_number"
                class="columns is-mobile"
              >
                <div
                  class="column is-1"
                >
                  <font-awesome-icon icon="phone" />
                </div>
                <div class="column is-11">
                  {{ item.phone_number }}
                </div>
              </div>

              <div
                v-if="item.email"
                class="columns is-mobile"
              >
                <div
                  class="column is-1"
                >
                  <font-awesome-icon icon="envelope" />
                </div>
                <div class="column is-11">
                  <a :href="`mailto:${item.email}`">{{ item.email }}</a>
                </div>
              </div>

              <div
                v-if="item.website"
                class="columns is-mobile website-div"
              >
                <div
                  class="column is-1"
                >
                  <font-awesome-icon icon="globe" />
                </div>
                <div class="column is-11">
                  <a
                    target="_blank"
                    :href="makeValidUrl(item.website)"
                  >
                    {{ item.website }}
                    <font-awesome-icon icon="external-link-alt" />
                  </a>
                </div>
              </div>

              <div
                v-if="item.facebook_name"
                class="columns is-mobile"
              >
                <div
                  class="column is-1"
                >
                  <font-awesome-icon :icon="['fab', 'facebook']" />
                </div>
                <div class="column is-11">
                  <a
                    target="_blank"
                    :href="item.facebook_name"
                  >
                    Facebook
                  </a>
                </div>
              </div>

              <div
                v-if="item.twitter"
                class="columns is-mobile"
              >
                <div
                  class="column is-1"
                >
                  <font-awesome-icon :icon="['fab', 'twitter']" />
                </div>
                <div class="column is-11">
                  <a
                    target="_blank"
                    :href="item.twitter"
                  >
                    Twitter
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div
            v-if="item.services_offered"
          >
            <h3>
              Services offered
            </h3>
            <div class="columns is-multiline is-gapless">
              <div
                v-for="i in parseServiceList(item.services_offered)"
                :key="i"
                class="column is-half"
              >
                {{ i }}
              </div>
            </div>
          </div>

          <div
            v-if="item.tags && item.tags.length"
          >
            <!-- <h3 class="title section-title is-4 pt-2"> -->
            <h3>
              Tags
            </h3>
            <div>
              {{ parseTagsList(item.tags) }}
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>


<script>

import SharedFunctions from '../components/mixins/SharedFunctions.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core';

// import all fontawesome icons included in phila-vue-mapping
import * as faMapping from '@phila/vue-mapping/src/fa';

// import MapPanel from '../components/MapPanel.vue';

import {
  AppHeader,
  MobileNav,
  LangSelector,
} from '@phila/phila-ui';

export default {
  name: 'PrintView',
  components: {
    AppHeader,
    MobileNav,
    LangSelector,
    // MapPanel,
  },
  data() {
    return {
      resource: null,
      locationOpen: false,
      brandingImage: null,
      brandingLink: null,
      appLink: '/',
      footerLinks: [],
      currentData: [],
    };
  },
  mixins: [ SharedFunctions ],
  computed: {
    printCheckboxes() {
      return this.$store.state.printCheckboxes;
    },
    items() {
      let appType = this.$config.app.type;
      let data = this.$store.state.sources[appType].data;
      console.log('PrintView items computed, data:', data);
      let filteredData;
      if (data) {
        console.log('in PrintView.vue items computed, data:', data);
        if (data.features) {
          filteredData = data.features.filter(item => this.printCheckboxes.includes(item._featureId));
        } else if (data.rows) {
          filteredData = data.rows.filter(item => this.printCheckboxes.includes(item._featureId));
        }
      }
      return filteredData;
    },
    mapType() {
      return this.$store.state.map.type;
    },
    // showComponent() {
    //   let value = false;
    //   if (this.item && this.item.attributes && this.$config.customComps && Object.keys(this.$config.customComps).includes('expandCollapseContent')) {
    //     value = true;
    //   }
    //   return value;
    // },
    appTitle() {
      let value;
      if (this.$config.app.title) {
        value = this.$config.app.title;
      } else if (this.i18nEnabled) {
        value = this.$i18n.messages[this.i18nLocale].app.title;
      }
      return value;
    },
    appSubTitle() {
      let value;
      if (this.$config.app.subtitle) {
        // value = this.$config.app.printSubtitle;
        value = this.$config.app.subtitle;
      } else if (this.i18nEnabled) {
        // value = this.$i18n.messages[this.i18nLocale].app.printSubtitle;
        value = this.$i18n.messages[this.i18nLocale].app.subtitle;
      }
      return value;
    },
    i18nLocale() {
      return this.$i18n.locale;
    },
    i18nLanguages() {
      let values = [];
      if (this.$config.i18n.languages) {
        console.log('in if, this.$config.i18n.languages');
        values = this.$config.i18n.languages;
      } else {
        for (let key of Object.keys(this.$i18n.messages)) {
          let value = {};
          // console.log('in loop, key:', key, 'this.$i18n.locale:', this.$i18n.locale, 'this.$i18n.messages[key]:', this.$i18n.messages[key]);
          value.language = key;
          value.title = this.$i18n.messages[key].language;
          values.push(value);
        }
      }
      console.log('end of i18nLanguages, values:', values);
      return values;
    },
    i18nEnabled() {
      let value;
      if (this.$config.i18n && this.$config.i18n.enabled) {
        value = true;
      } else {
        value = false;
      }
      return value;
    },
    selectedResources() {
      return this.$store.state.selectedResources;
    },
    latestSelectedResourceFromMap() {
      return this.$store.state.map.latestSelectedResourceFromMap;
    },
    database() {
      console.log('in ResourceView.vue database computed, this.$appType:', this.$appType, 'this.$store.state.sources[this.$appType].data:', this.$store.state.sources[this.$appType].data);
      if (this.$store.state.sources[this.$appType].data) {

        let database = this.$store.state.sources[this.$appType].data.rows || this.$store.state.sources[this.$appType].data.features || this.$store.state.sources[this.$appType].data.records;
        console.log('computed database is running, database:', database);
  
        for (let [key, value] of Object.entries(database)) {
  
          if (this.$config.hiddenRefine) {
            for (let field in this.$config.hiddenRefine) {
              let getter = this.$config.hiddenRefine[field];
              let val = getter(value);
              if (val === false) {
                delete database[key];
              }
            }
          }
  
          for (let [rowKey, rowValue] of Object.entries(value)) {
            if ( rowKey == 'hide_on_finder' && rowValue == true ){
              //console.log('deleted entry', database[key])
              delete database[key];
            }
          }
  
        }
        //filter empty values from deleted database
        let finalDB = database.filter(_ => true);
        return finalDB;
      }
    },
    // item() {
    //   let value;

    //   // let appType = this.$config.app.type;
    //   let appType = this.$appType;
    //   console.log('in ResourceView.vue, item computed, appType:', appType);
    //   // let test = this.$store.state.sources[appType].data;
    //   let test = this.database;
    //   console.log('computed item test:', test, 'this.resource:', this.resource);
    //   // let value;
    //   // if (this.$store.state.sources[appType].data) {
    //   if (test) {
    //     value = test.filter(features => {
    //       // console.log('inside filter function, features:', features, 'this.resource:', this.resource);
    //       return features._featureId == this.resource;
    //     })[0];
    //   }
    //   console.log('computed item, value:', value);
    //   return value;
    // },
  },
  mounted() {
    let body = document.body;
    body.classList.remove('main-view');
    body.classList.add('print-view');

    // if (this.$config.dataSources) {
    //   this.$controller.dataManager.fetchData();
    // }
    if (!this.$store.state.sources[this.$config.app.type].data && this.$config.dataSources) {
      this.$controller.dataManager.fetchData();
    }

    // this.resource = this.$route.params.resource;
    // let selectedResources = [ this.resource ];
    // this.$store.commit('setSelectedResources', selectedResources);

    window.print();
  },
  created() {
    if (this.$config.map) {
      if (this.$config.map.shouldInitialize === false) {
        this.$store.commit('setShouldInitializeMap', false);
      }
      if (this.$config.map.type) {
        this.$store.commit('setMapType', this.$config.map.type);
      }
    }
  },
  // watch: {
  //   item(nextItem) {
  //     let currentData = [ nextItem ];
  //     console.log('ResourceView.vue, watch item, nextItem:', nextItem, 'nextItem._featureId:', nextItem._featureId, 'nextItem.latlng:', nextItem.latlng, 'currentData:', currentData);
  //     this.$store.commit('setCurrentData', currentData);
  //     // this.$store.commit('setLatestSelectedResourceFromExpand', nextItem._featureId);
  //     // this.$store.commit('setMapCenter', [ nextItem.latlng[1], nextItem.latlng[0] ]);
  //     // this.$store.commit('setMapZoom', 17);
  //   },
  // },
  methods: {
    clickedBackToHome() {
      console.log('clickedBackToHome is running');
      // history.back();
      this.$router.push({ name: 'home'  });
      // this.$store.commit('setSelectedServices', null);
    },
    parseAddress(address) {
      const formattedAddress = address.replace(/(Phila.+)/g, city => `<div>${city}</div>`).replace(/^\d+\s[A-z]+\s[A-z]+/g, lineOne => `<div>${lineOne}</div>`).replace(/,/, '');
      return formattedAddress;
    },
    parseServiceList(list) {
      const formattedService = list;
      return formattedService;
    },
    parseTagsList(list) {
      const formattedTags = list.slice().sort().join(", ");
      return formattedTags;
    },
    makeValidUrl(url) {
      let newUrl = window.decodeURIComponent(url);
      newUrl = newUrl
        .trim()
        .replace(/\s/g, '');
      if (/^(:\/\/)/.test(newUrl)) {
        return `http${newUrl}`;
      }
      if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
        return `http://${newUrl}`;
      }
      return newUrl;
    },
  //   openPrintView(e) {
  //     e.stopPropagation();
  //     console.log('openPrintView is running, e:', e, 'this.$props.item._featureId:', this.$props.item._featureId);
  //     window.open();
  //   },
  },
};
</script>
<style lang="scss">
@import "../assets/scss/main.scss";

#app-header {

  .trusted-site-hidden {
    display: none;
  }

  #nav-wrap {
    height: 80px;
    line-height: 80px;


    #main-nav {

      .columns {
        height: 80px;
        .column {
          height: 80px;
          padding-top: 0rem;
        }

      }
    }

  }
  .container {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  h2 {
    font-weight: 100;
  }


}

@media screen and (min-width: 768px) {

  // body {
  //   overflow-y: scroll;
  // }

  .print-view {
    overflow-y: scroll;
  }

  .title-col {
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
  }
}

@media screen and (max-width: 767px) {
  .title-col {
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
  }
}

.loc-item {
  position: relative;
  height:100%;

  &:hover {
    .plus-icon {
      color: white;
    }
  }

  .location-row {
    cursor: pointer;
    padding: 0px;
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    margin-left: 0px !important;
    margin-right: 0px !important;
    &:hover{
      background: #2176d2;
      color: white;
    }
  }

  .location-title {
    padding-top: 1rem;
    padding-bottom: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .location-icon {
    padding-top: 1rem;
    padding-bottom: 1rem;
    text-align: right;
  }

  .section-name {
    text-transform: uppercase;
    position: relative;
    top: -3px;
    padding-left: 14px;
    padding-right: 14px;
    font-size: 12px;
    display: inline-block;
    color: white;
  }

  &.open{
    .location-row {
      color:white;
      // background-color: $ben-franklin-blue-dark;
      background-color: #2176d2;;
    }

    h2 {
      font-weight: 900 !important;
    }
  }

  .location-content{
    // overflow: hidden;
    height:0;

    &.location-open{
      padding-top: 1rem;
      padding-bottom: 1rem;
      padding-right: 0px;
      padding-left: 0px;
      height: 100%;
      overflow: initial;
    }
  }

  .location-content-mobile{
    // overflow: hidden;
    height:0;

    &.location-open{
      padding-top: 1rem;
      padding-bottom: 1rem;
      padding-right: 0px;
      padding-left: 0px;
      height: 100%;
      overflow: initial;
    }
  }
}

.plus-icon {
  color: $ben-franklin-blue-dark;
}

.print-view-button {
  width: 100px;
}

.map-holder {
  height: 300px;
  width: 100%;
}

.component-holder {
  // margin-left: 1rem;
  // margin-right: 1rem;
  width: 100%;
  // height: 300px;
}

.card-content {
  margin: 1rem;
  // position: absolute;
  // top: 340px;
  z-index: 1001;
  // width: 100%;
  padding-left: 0px;
  background-color: white;
}

@media print {
  .no-print {
    visibility: hidden;
    // display: none;
  }
}

</style>
