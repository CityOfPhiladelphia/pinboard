<template>
  <div
    :style="containerStyle"
    class="pvm-search-control-container"
  >

    <form
      id="search-form"
      autocomplete="off"
      :class="formClass"
      alt="test test"
      aria-label="button"
      title="addressform"
      @submit.prevent="handleSearchFormSubmit"
    >
      <textbox
        id="map-textbox"
        :placeholder="placeholder || 'Search by address or keyword'"
        v-model="addressEntered"
        :style="inputStyle"
      />
    </form>

    <div
      v-if="addressEntered != '' && addressEntered != null"
      :class="'pvm-search-control-button ' + buttonClass"
      aria-label="delete button"
      title="delete button"
      @click="handleFormX"
    >
      <font-awesome-icon icon="times" size="2x" />
    </div>

    <div
      :class="'pvm-search-control-button ' + buttonClass"
      aria-label="search button"
      title="search button"
      @click="handleSearchFormSubmit"
    >
      <font-awesome-icon icon="search" size="2x" aria-hidden="true" />
    </div>

  </div>
</template>

<script>
import debounce from 'lodash-es/debounce';
import axios from 'axios';
import generateUniqueId from '@phila/vue-mapping/src/util/unique-id';

import {
  Textbox,
} from '@phila/phila-ui';

export default {
  name: 'PhilaUiAddressInput',
  components: {
    Textbox,
  },
  props: {
    placeholder: {
      type: String,
      default: 'address',
    },
  },
  data() {
    const data = {
      inputID: generateUniqueId(),
      addressEntered: null,
    };
    return data;
  },
  computed: {
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
          'width': '305px',
        };
      } else if (this.isTablet) {
        value = {
          'width': '352px',
        };
      } else if (this.addressEntered) {
        value = {
          'width': '423px',
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
  },
  mounted() {
    // console.log('PhilaUiAddressInput mounted is running, this.currentSearch:', this.currentSearch);
    if (this.currentSearch) {
      console.log('inside mounted if');
      this.addressEntered = this.currentSearch;
    }
  },
  watch: {
    currentSearch(nextCurrentSearch) {
      console.log('watch currentSearch, nextCurrentSearch:', nextCurrentSearch);
      this.addressEntered = this.currentSearch;
    },
  },
  methods: {
    handleFormX() {
      console.log('handleFormX is running');
      this.$data.addressEntered = '';
      this.$emit('clear-search');
    },
    handleSearchFormSubmit() {
      console.log('MapAddressInput handleSearchFormSubmit is running');
      let value = this.$data.addressEntered;
      if (value) {
        this.$emit('handle-search-form-submit', value);
      }
    },
  },
};
</script>

<style lang="scss">
@import "../assets/scss/main.scss";

#tb-map-textbox {
  border-width: 3px !important;
  border-color: $ben-franklin-blue-dark !important;
}

/* Container */

.pvm-search-control-container {
  position: absolute;
  display: flex;
  border-radius: 2px;
  /* border-style: solid;
  border-color: #2176d2;
  border-width: 2px; */
  /* width: 405px; */
  /* width: 305px; */
  z-index: 1000;
}

/* Form */

.pvm-search-control-form {
  width: 100%;
}

/* Input */

.pvm-search-control-input {
  /* display: inline-block; */
  /* border: 0; */
  /* padding: 15px; */
  /* font-family: 'Montserrat', 'Tahoma', sans-serif; */
  /* font-size: 16px; */
  /* width: 250px; */
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
  min-width: 55px !important;
  margin-top: 8px;
  border-width: 3px !important;
  border-color: $ben-franklin-blue-dark !important;
  height: 56px;
  line-height: 50px;
}

.pvm-search-control-button-non-mobile {
  margin-left: -8px;
  // margin-left: -64px;
}

.pvm-search-control-button-mobile {
  margin-left: -8px;
}

</style>
