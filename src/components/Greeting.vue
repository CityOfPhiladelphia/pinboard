<template>
  <div
    class="grid-y custom-greeting"
  >
    <!-- <div class="exclamation-holder">
      <font-awesome-icon
        icon="exclamation-triangle"
        class="fa-3x fa-icon-class"
      />
      <div
        class="grid-y exclamation-details small-19 medium-20"
      >
        <div><b>{{ $t('beforeYouGo') }}:</b></div>
        <div>{{ $t('checkSite') }}</div>
      </div>
    </div> -->
    <address-input v-if="shouldShowAddressInput" />
    <address-candidate-list v-if="addressAutocompleteEnabled && shouldShowAddressInput" />

    <div class="open-list-div">
      <!-- class="button open-list-button hide-for-medium" -->
      <phila-button
        class="button open-list-button"
        @click.native="$emit('view-list')"
        v-html="$t('app.viewList')"
      />
    </div>

    <div
      class="main-area"
    >

    <div
      v-if="!components && !hasError && i18nEnabled"
      class="greeting"
      v-html="$t('greeting')"
    />

    <div
      v-if="!components && !hasError && !i18nEnabled"
      class="greeting"
      v-html="message"
    />

    <div
      v-if="!components && hasError"
      class="greeting greeting-error"
      v-html="errorMessage"
    />

    <topic-component-group
      :topic-components="options.components"
      :item="item"
    />

    <component
      :is="topicComp.type"
      v-for="(topicComp) in components"
      v-if="components"
      :key="topicComp.type"
      :slots="topicComp.slots"
      class="topic-comp"
    />
      <!-- <h1>
        {{ $t('introPage.introTitle') }}
      </h1>
      <p
        v-html="$t('introPage.p1')"
      />
      <ul>
        <li
          v-for="(item, index) in $config.i18n.data.messages['en-US'].introPage.ul1"
          :key="index"
        >
          {{ $t('introPage.ul1.' + index) }}
        </li>
      </ul>
      <h2>
        {{ $t('introPage.section1Title') }}
      </h2>
      <p>
        {{ $t('introPage.p2') }}
      </p>
      <ul>
        <li
          v-for="(item, index) in $config.i18n.data.messages['en-US'].introPage.ul2"
          :key="index"
        >
          {{ $t('introPage.ul2.' + index) }}
        </li>
      </ul>
      <p>
        {{ $t('introPage.p3') }}
      </p>
      <div
        class="custom-callout"
      >
        <p
          class="no-margin"
          v-html="$t('introPage.callout1.p1')"
        />
      </div> -->
    </div> <!-- end of main-area -->
  </div>
</template>

<script>

import TopicComponent from '@phila/vue-comps/src/components/TopicComponent.vue';
import PhilaButton from '@phila/pinboard/src/components/PhilaButton.vue';
import callout from '@phila/vue-comps/src/components/Callout.vue';

export default {
  name: 'Greeting',
  components: {
    PhilaButton,
    callout,
    Image_: () => import(/* webpackChunkName: "inGreeting_pvc_Image" */'@phila/vue-comps/src/components/Image.vue'),
    AddressInput: () => import(/* webpackChunkName: "inGreeting_pvc_AddressInput" */'@phila/vue-comps/src/components/AddressInput.vue'),
    AddressCandidateList: () => import(/* webpackChunkName: "inGreeting_pvc_AddressCandidateList" */'@phila/vue-comps/src/components/AddressCandidateList.vue'),
    TopicComponentGroup: () => import(/* webpackChunkName: "inGreeting_pvc_TopicComponentGroup" */'@phila/vue-comps/src/components/TopicComponentGroup.vue'),
  },
  mixins: [ TopicComponent ],
  props: {
    'message': {
      type: String,
      default: function() {
        return 'defaultMessage';
      },
    },
  },
  data() {
    let data = {
      sections: {},
      subsections: {},
    };
    return data;
  },
  computed: {
    i18nEnabled() {
      if (this.$config.i18n && this.$config.i18n.enabled) {
        return true;
      }
      return false;

    },
    calloutOptions() {
      return {};
    },
    calloutSlots() {
      return {
        text: 'test',
      };
    },
    database() {
      if (this.$store.state.sources[this.$appType].data) {
        return this.$store.state.sources[this.$appType].data.rows || this.$store.state.sources[this.$appType].data.features || this.$store.state.sources[this.$appType].data;
      }
      return [];

    },
    shouldShowAddressInput() {
      if (this.$config.addressInputLocation == 'topics') {
        return true;
      }
      return false;

    },
    addressAutocompleteEnabled() {
      // TODO tidy up the code
      if (this.$config.addressInput) {
        if (this.$config.addressInput.autocompleteEnabled === true) {
          return true;
        }
        return false;

      }
      return false;

    },
    components() {
      const greetingConfig = this.$config.greeting || {};
      // console.log('Greeting.vue computing components');
      let components;
      if (greetingConfig) {
        // console.log('Greeting.vue inside if, greetingConfig:', greetingConfig);
        components = greetingConfig.components;
      }
      return components;
    },
    hasError() {
      return this.$store.state.geocode.status === 'error';
    },
    errorMessage() {
      const input = this.$store.state.geocode.input;
      return `
          <p>
            We couldn't find
            ${input ? '<strong>' + input + '</strong>' : 'that address'}.
            Are you sure everything was spelled correctly?
          </p>
          <p>
            Here are some examples of things you can search for:
          </p>
          <ul>
            <li>1234 Market St</li>
            <li>1001 Pine Street #201</li>
            <li>12th & Market</li>
            <li>883309050 (an OPA number with no hyphens or other characters)</li>
          </ul>
        `;
    },
  },
  watch: {
    database() {
      let subsections = this.getCounts();
      this.subsections = subsections;
      this.$store.commit('setSubsections', subsections);
    },
  },
  mounted() {
    this.sections = this.$config.sections;
  },
  methods: {
    getCounts() {
      // console.log('customGreeting.vue getCounts is running');
      const refineData = this.database;
      // const refineData = this.sources[this.$appType].data.rows;

      let service = '';

      // console.log('in getRefineSearchList, refineData:', refineData);
      refineData.forEach((arrayElem) => {
        // console.log('arrayElem:', arrayElem);
        if (arrayElem.services_offered) {
          service += `${arrayElem.services_offered},`;
        } else if (arrayElem.attributes.CATEGORY) {
          service += `${arrayElem.attributes.CATEGORY},`;
        }
      });

      // TODO: break this into smaller chunks
      // let serviceArray = service.split(/(,|;)/);
      let serviceArray = service.split(',');
      serviceArray = serviceArray.map(s => s.trim());

      // const uniqArray = [ ...new Set(serviceArray) ];
      // console.log('serviceArray:', serviceArray, 'uniqArray:', uniqArray);
      //
      // // clean up any dangling , or ;
      // let uniq = uniqArray.filter(a => a.length > 2);
      //
      // uniq.filter(Boolean); // remove empties

      let countObject = serviceArray.reduce(function (acc, curr) {
        if (typeof acc[curr] == 'undefined') {
          acc[curr] = 1;
        } else {
          acc[curr] += 1;
        }
        return acc;
      }, {});

      return countObject;
    },
  },
};
</script>

<style scoped>

  h1 {
    font-size: 20px;
  }

  h2 {
    font-size: 16px;
  }

  .main-area {
    padding: 10px;
  }

  .custom-callout {
    border-style: solid;
    border-width: 1px;
    padding: 10px;
  }

  .no-margin {
    margin: 0px;
  }

  .open-list-div {
    margin: 0 auto;
  }

  .open-list-button {
    margin-top: 6px;
    margin-bottom: 14px;
    width: 200px;
  }

  .custom-greeting {
    padding: 12px;
  }

  .exclamation-holder {
    display: flex;
    align-items: center;
    margin-top: 6px;
    margin-bottom: 14px;
  }

  .fa-icon-class {
    margin: 0 auto;
    display: block;
  }

  .exclamation-details {
    margin-left: 14px;
    font-size: 14px;
  }

  .mb-panel-topics-greeting {
    padding-top: 20px;
  }

  .greeting {
    font-size: 20px;
    color: #444;
    padding: 14px;
  }

  .greeting-error {
    border-left-color: #ff0000;
  }

  .custom-section {
    margin-left: 8px;
    margin-top: 4px;
  }

  .custom-ul {
    margin-left: 4rem;
    font-size: 14px;
  }

  /*medium*/
  @media screen and (min-width: 750px) {
    .mb-panel-topics-greeting {
      /*make this scroll on medium screens*/
      /*REVIEW this is a little hacky. the 120px shouldn't be hard-coded.*/
      height: calc(100vh - 120px);
      overflow: auto;
    }
  }
</style>
