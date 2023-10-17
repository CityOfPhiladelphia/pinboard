<template>
  <div
    :style="containerStyle"
    :class="{ 'over-map': overMap, 'pvm-search-control-container': true }"
  >
    <!-- <ValidationObserver
      v-slot="validation"
      tag="div"
    > -->
    <form
      id="search-form"
      autocomplete="off"
      :class="formClass"
      :title="searchBarTranslation"
      @submit.prevent="handleSearchFormSubmit"
      >
      <textbox
        id="map-textbox"
        v-model="addressEntered"
        :placeholder="placeholderComputed || 'Search by address or keyword'"
        :style="inputStyle"
      />

    </form>

    <button
      v-if="addressEntered != '' && addressEntered != null"
      :class="'pvm-search-control-x-button ' + buttonClass"
      aria-label="delete button"
      title="delete button"
      @click="handleFormX"
    >
      <font-awesome-icon
        icon="times"
        size="2x"
      />
    </button>

    <button
      :class="'pvm-search-control-button ' + buttonClass"
      aria-label="search button"
      :title="searchButtonTranslation"
      @click="handleSearchFormSubmit"
    >
      <font-awesome-icon icon="search" size="2x" aria-hidden="true" />
    </button>

  </div>
</template>

<script>
import debounce from 'lodash-es/debounce';
import axios from 'axios';
import generateUniqueId from '@phila/vue-mapping/src/util/unique-id';

import {
  Textbox,
} from '@phila/phila-ui';

// import {
//   extend,
//   withValidation,
//   ValidationObserver,
//   setInteractionMode,
//   validate,
// } from 'vee-validate';

// import { required, email } from 'vee-validate/dist/rules';
// const VeeTextbox = withValidation(Textbox);

export default {
  name: 'PhilaUiAddressInput',
  components: {
    Textbox,
    // VeeTextbox,
    // ValidationObserver,
  },
  props: {
    placeholder: {
      type: String,
      default: 'address',
    },
    overMap: {
      type: Boolean,
      default: true,
    },
    // inputValidation: {
    //   type: Boolean,
    //   default: true,
    // },
  },
  data() {
    const data = {
      inputID: generateUniqueId(),
      addressEntered: null,
    };
    return data;
  },
  computed: {
    i18nEnabled() {
      if (this.$config.i18n && this.$config.i18n.enabled) {
        return true;
      } else {
        return false;
      }
    },
    i18nLocale() {
      return this.$i18n.locale;
    },
    searchBarTranslation() {
      return this.$i18n.messages[this.i18nLocale]['searchBar'];
    },
    searchButtonTranslation() {
      return this.$i18n.messages[this.i18nLocale]['searchButton'];
    },
    searchBarType() {
      let value;
      let searchTypes = this.$config.searchBar.searchTypes;
      if (searchTypes.length == 1 && searchTypes.includes('address')) {
        value = 'address';
      } else if (searchTypes.length == 1 && searchTypes.includes('keyword')) {
        value = 'keyword';
      } else {
        value = 'all';
      }
      // console.log('searchBarType computed, searchTypes:', searchTypes, 'value:', value);
      return value;
    },
    placeholderComputed() {
      if (this.i18nEnabled) {
        // console.log('placeholderComputed and i18nEnabled, this.searchBarType:', this.searchBarType, 'this.$i18n.messages[this.i18nLocale]:', this.$i18n.messages[this.i18nLocale]);
        return this.$i18n.messages[this.i18nLocale].app.searchPlaceholders[this.searchBarType];
      } else if (this.$config.searchBar && this.$config.searchBar.labelText) {
        if (typeof this.$config.searchBar.labelText === 'string') {
          return this.$config.searchBar.labelText;
        } else {
          return this.$config.searchBar.labelText[this.searchBarType];
        }
      } else {
        return 'Search';
      }
    },
    containerStyle() {
      let value = {};
      if (this.isMobile) {
        value = {
          'width': '98%',
        };
      } else if (this.isTablet && this.addressEntered) {
        value = {
          'width': '305px',
        };
      } else if (this.isTablet) {
        value = {
          'width': '305px',
        };
      } else if (this.addressEntered) {
        value = {
          'width': '505px',
        };
      } else {
        value = {
          'width': '505px',
        };
      }
      return value;
    },
    inputStyle() {
      let value = {};
      if (this.isMobile) {
        value = {
          'width': '100%',
        };
      } else if (this.isTablet && this.addressEntered) {
        value = {
          'width': '297px',
        };
      } else if (this.isTablet) {
        value = {
          'width': '352px',
        };
      } else if (this.addressEntered) {
        value = {
          'width': '415px',
        };
      } else {
        value = {
          'width': '470px',
        };
      }
      return value;
    },
    map() {
      return this.$store.state.map.map;
    },
    formClass() {
      if (this.isMobile) {
        return 'pvm-search-control-form';
      }
      return '';
    },

    buttonClass() {
      if (this.isMobile) {
        return 'pvm-search-control-button-mobile';
      }
      return 'pvm-search-control-button-non-mobile';
    },

    addressAutocompleteEnabled() {
      // TODO this is temporarily disabled
      if (this.$config.addressInput) {
        if (this.$config.addressInput.autocompleteEnabled === true) {
          return true;
        }
        return false;

      }
      return false;

    },
    isMobileOrTablet() {
      return this.$store.state.isMobileOrTablet;
    },
    currentSearch() {
      return this.$store.state.currentSearch;
    },
  },
  created() {
    if (this.$config.defaultAddress) {
      this.addressEntered = this.$config.defaultAddress;
    }

    // setInteractionMode('aggressive');
    // let self = this;
    // extend('address', value => {
    //   let newValue;
    //   newValue = self.inputValidation;
    //   // console.log('extend address, value:', value, 'self.inputValidation:', self.inputValidation, 'newValue:', newValue);
    //   return newValue;
    // });
  },
  mounted() {
    // console.log('PhilaUiAddressInput mounted is running, this.currentSearch:', this.currentSearch);
    // if (this.currentSearch) {
    //   console.log('inside mounted if');
    //   this.addressEntered = this.currentSearch;
    // }
  },
  watch: {
    // currentSearch(nextCurrentSearch) {
    //   console.log('watch currentSearch, nextCurrentSearch:', nextCurrentSearch);
    //   this.addressEntered = this.currentSearch;
    // },
  },
  methods: {
    handleFormX() {
      console.log('handleFormX is running');
      this.$data.addressEntered = '';
      // this.$emit('clear-search');
    },
    async handleSearchFormSubmit() {
      console.log('MapAddressInput handleSearchFormSubmit is running, this.$data.addressEntered:', this.$data.addressEntered);
      let value = this.$data.addressEntered;
      if (value) {
        this.$emit('handle-search-form-submit', value);
      }
      this.$nextTick(() => {
        this.$data.addressEntered = '';
      });
    },
  },
};
</script>

<style lang="scss">
@import "../assets/scss/main.scss";

#tb-map-textbox {
  background-color: #FFFFFF;
  border-width: 2px !important;
  border-color: $ben-franklin-blue-dark !important;
  border-right-style: none !important;
}

/* Container */

.pvm-search-control-container {
  position: absolute;
  display: flex;
  border-radius: 2px;
}

.over-map {
  z-index: 998;
}

/* Form */

.pvm-search-control-form {
  width: 100%;
}

/* Input */

.pvm-search-control-input {
  border-style: solid;
  border-color: #2176d2;
  border-width: 2px;
}

.pvm-input-non-mobile {
  height: 48px;
}

.pvm-input-mobile {
  height: 38px;
}


/* Button */

.button-container {
  display: flex;
}

.pvm-search-control-button {
  /* display: inline-block; */
  color: #fff;
  background: $ben-franklin-blue-dark;
  padding: 10px;
  padding-bottom: 20px;
  min-width: 55px !important;
  margin-top: 8px;
  border-style: solid;
  border-width: 3px !important;
  border-color: $ben-franklin-blue-dark !important;
  height: 56px;
  line-height: 44px;
  cursor: pointer;
}

.pvm-search-control-x-button {
  /* display: inline-block; */
  color: rgb(60, 60, 60, 0.5);
  background: #FFFFFF;
  padding: 10px;
  padding-bottom: 20px;
  min-width: 55px !important;
  margin-top: 8px;
  margin-right: 8px;
  border-right-style: none;
  border-left-style: none;
  border-top-style: solid;
  border-bottom-style: solid;
  border-color: $ben-franklin-blue-dark !important;
  height: 56px;
  line-height: 44px;
  cursor: pointer;
}

.pvm-search-control-x-button:hover {
  color: rgb(68, 68, 68);
}

.pvm-search-control-x-button:focus {
  border-right-style: solid;
  border-left-style: solid;
  // margin-top: 9px;
  // height: 54px;
}

.pvm-search-control-button-non-mobile {
  margin-left: -8px;
  // margin-left: -64px;
}

.pvm-search-control-button-mobile {
  margin-left: -8px;
}

</style>
