<template>
  <div>
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

      <div class="component-holder">
        <component
          :is="'expandCollapseContent'"
          v-if="showComponent"
          :item="item"
          />
          <!-- v-if="$config.customComps && Object.keys($config.customComps).includes('expandCollapseContent')" -->
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

import {
  AppHeader,
  MobileNav,
  LangSelector,
} from '@phila/phila-ui';

export default {
  components: {
    AppHeader,
    MobileNav,
    LangSelector,
  },
  data() {
    return {
      resource: null,
      locationOpen: false,
      brandingImage: null,
      brandingLink: null,
      appLink: '/',
      footerLinks: [],
    };
  },
  mixins: [ SharedFunctions ],
  computed: {
    showComponent() {
      let value = false;
      if (this.item && this.item.attributes && this.$config.customComps && Object.keys(this.$config.customComps).includes('expandCollapseContent')) {
        value = true;
      }
      return value;
    },
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
        value = this.$config.app.printSubtitle;
      } else if (this.i18nEnabled) {
        value = this.$i18n.messages[this.i18nLocale].app.printSubtitle;
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
    item() {
      let appType = this.$config.app.type;
      console.log('in ResourceView.vue, item computed, appType:', appType);
      // let test = this.$store.state.sources[appType].data;
      let test = this.database;
      console.log('computed item test:', test, 'this.resource:', this.resource);
      let value;
      // if (this.$store.state.sources[appType].data) {
      if (test) {
        value = test.filter(features => {
          // console.log('inside filter function, features:', features, 'this.resource:', this.resource);
          return features._featureId == this.resource;
        })[0];
      }
      console.log('computed item, value:', value);
      return value;
    },
  },
  mounted() {
    if (this.$config.dataSources) {
      this.$controller.dataManager.fetchData();
    }

    this.resource = this.$route.params.resource;
    let selectedResources = [ this.resource ];
    this.$store.commit('setSelectedResources', selectedResources);
  },
  methods: {
    openPrintView(e) {
      e.stopPropagation();
      console.log('openPrintView is running, e:', e, 'this.$props.item._featureId:', this.$props.item._featureId);
      window.open();
    },
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
    overflow: hidden;
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
    overflow: hidden;
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

.component-holder {
  margin: 1.5rem;
}

</style>
