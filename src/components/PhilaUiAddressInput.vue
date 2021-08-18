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
        :placeholder="$props.placeholder || 'Search by address or keyword'"
        v-model="addressEntered"
        :style="inputStyle"
      />
      <!-- :value="addressEntered" -->

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
      <!-- tabindex="-1" -->
        <font-awesome-icon icon="search" size="2x" aria-hidden="true" />
      </div>
    <!-- </div> -->

    <!-- <slot name="address-candidates-slot" /> -->

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
  props: [
    'position',
    'widthFromConfig',
    'placeholder',
    'static',
  ],
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
    // inputWidth() {
    //   // if (this.addressAutocompleteEnabled) {
    //   if (this.addressEntered === '' || this.addressEntered === null) {
    //     return this.$props.widthFromConfig - 55;
    //   }
    //   return this.$props.widthFromConfig - 108;
    //
    //   // } else {
    //   //   return this.$props.widthFromConfig - 55;
    //   // }
    // },
    // inputClass() {
    //   // if (this.isMobileOrTablet) {
    //   if (this.isMobile) {
    //     return 'pvm-input-mobile';
    //   }
    //   return 'pvm-input-non-mobile';
    // },

    // containerClass() {
    //   if (this.isMobile) {
    //     return 'pvm-container-mobile';
    //   }
    //   return 'pvm-container-non-mobile';
    // },

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
    // createLeafletElement(L) {
    //   // console.log('AddressInput.vue createLeafletElement is running')
    //   // subclass Control to accept an el which gets mounted to the map
    //   class ControlParent extends L.Control {
    //     constructor(el, options) {
    //       super(options);
    //       this.el = el;
    //     }
    //     onAdd() {
    //       const el = this.el;
    //
    //       // keep clicks from hitting the map
    //       L.DomEvent.disableClickPropagation(el);
    //       L.DomEvent.disableScrollPropagation(el);
    //
    //       return el;
    //     }
    //   }
    //
    //   const el = this.$el;
    //   return new ControlParent(el, {
    //     position: this.position,
    //   });
    // },
    // parentMounted(parent, props) {
    //   // console.log('AddressInput.vue parentMounted is running, parent:', parent, 'props:', props);
    //   const leafletElement = this.createLeafletElement(L);
    //   this.$leafletElement = leafletElement;
    //   const map = this.map;
    //   leafletElement.addTo(map);
    // },
    // didType: debounce(function (e) {
    //   // console.log('debounce is running');
    //   const { value } = e.target;
    //   this.$data.addressEntered = value;
    //   // this.$store.commit('setAddressEntered', value);
    //
    //   if (this.addressAutocompleteEnabled) {
    //     // console.log('debounce is running, e:', e, 'this:', this);
    //     if (e.key === "ArrowDown") {
    //       document.getElementById('address-candidate-list-0').focus();
    //       return;
    //     }
    //     // const { value } = e.target;
    //     this.getCandidates(value);
    //     // this.$store.commit('setAddressEntered', value);
    //     if (e.key !== "Enter") {
    //       // console.log('AddressInput.vue didType is running, e.key !== "Enter"');
    //       this.$store.commit('setShouldShowAddressCandidateList', true);
    //     }
    //   }
    // }, 300,
    // ),
    // getCandidates(address) {
    //   // console.log('getCandidates is running, address:', address);
    //   axios.get('https://cqvfg1pm72.execute-api.us-east-1.amazonaws.com/dev/first-api-test/', {
    //     params: {
    //       address,
    //     },
    //   })
    //     .then(this.didGetCandidates)
    //     .catch(this.didGetCandidatesError);
    // },
    // didGetCandidates(res) {
    //   const { matches } = res.data;
    //   // console.log('matches:', matches, 'matches map:', matches.map(x => x.address));
    //   const matchesArray = matches.map(x => x.address);
    //   this.$store.commit('setCandidates', matchesArray);
    // },
    // didGetCandidatesError(err) {
    //   console.log('error getting candidates', err);
    //   this.$store.commit('setCandidates', []);
    // },
    handleFormX() {
      console.log('handleFormX is running');
      this.$data.addressEntered = '';
      // this.$controller.resetGeocode;
      this.$emit('clear-search');

      // this.$store.commit('setAddressEntered', '');
      // this.$store.commit('setShouldShowAddressCandidateList', false);
      // this.$store.commit('setCandidates', []);
    },
    handleSearchFormSubmit() {
      console.log('MapAddressInput handleSearchFormSubmit is running');
      // let value;
      // if (this.addressAutocompleteEnabled){
      let value = this.$data.addressEntered;
        // value = this.$store.state.addressEntered;
      // } else {
      //   // if (document.querySelector('#' + inputID)) {
      //   value = document.querySelector('#' + this.$data.inputID.toString()).value;
      //   // } else if (document.querySelector('#pvm-search-control-input')) {
      //   //   value = document.querySelector('#pvm-search-control-input')
      //   // } else {
      //   //   return;
      //   // }
      // }
      // console.log('phila-vue-comps AddressInput.vue, handleSearchFormSubmit is running, value:', value);
      if (value) {
        this.$emit('handle-search-form-submit', value);
      }
    },
  },
};
</script>

<style lang="scss">

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
  z-index: 10000;
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
