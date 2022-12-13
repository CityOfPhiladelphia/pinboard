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
            <div
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
          </div>

          </h2>
        </div>
      </div>

      <div class="component-holder">
        <component
          :is="'expandCollapseContent'"
          v-if="$config.customComps && Object.keys($config.customComps).includes('expandCollapseContent') && selectedResources.includes(item._featureId)"
          :item="item"
        />
      </div>

    </div>
  </div>

</template>


<script>

import SharedFunctions from '@/components/mixins/SharedFunctions.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core';

// import all fontawesome icons included in phila-vue-mapping
import * as faMapping from '@phila/vue-mapping/src/fa';

import {
  AppHeader,
  MobileNav,
  AppFooter,
  InputForm,
  Textbox,
  Checkbox,
  LangSelector,
} from '@phila/phila-ui';

export default {
  components: {
    AppHeader,
    MobileNav,
    AppFooter,
    InputForm,
    Textbox,
    Checkbox,
    LangSelector,
  },
  data() {
    return {
      resource: null,
      locationOpen: false,
    };
  },
  mixins: [ SharedFunctions ],
  computed: {
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
        value = this.$config.app.subtitle;
      } else if (this.i18nEnabled) {
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
    item() {
      let test = this.$store.state.sources.primaryCareSites.data;
      console.log('computed item test:', test, 'this.resource:', this.resource);
      let value;
      if (this.$store.state.sources.primaryCareSites.data) {
        value = this.$store.state.sources.primaryCareSites.data.features.filter(features => {
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

        .title-col {
          padding-top: 1rem !important;
          padding-bottom: 0rem;
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

  // .title-col {
  //   padding-top: 1rem;
  // }

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
