<template>
  <div
    :style="containerStyle"
    :class="'pvm-search-control-container ' + containerClass"
  >
  <!-- class="pvm-search-control-container" -->

    <!-- <form
      id="search-form"
      autocomplete="off"
      class="pvm-search-control-form"
      alt="test test"
      aria-label="button"
      title="addressform"
      @submit.prevent="handleSearchFormSubmit"
    > -->

      <textbox
        id="map-textbox"
        :placeholder="this.$props.placeholder || 'Search by address or keyword'"
        v-model="addressEntered"
        :style="inputStyle"
      />
      <!-- :id="inputID" -->
      <!-- title="inputform" -->
      <!-- tabindex="0" -->
      <!-- :value="addressEntered" -->
      <!-- @keyup="didType" -->
      <!-- :class="'pvm-search-control-input ' + inputClass" -->

    <!-- </form> -->

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
      name="pvm-search-control-button"
      aria-label="search button"
      title="search button"
      @click="handleSearchFormSubmit"
    >
    <!-- tabindex="-1" -->
      <font-awesome-icon icon="search" size="2x" aria-hidden="true" />
    </div>

    <!-- <slot name="address-candidates-slot" /> -->

  </div>
</template>

<script>
// import * as L from 'leaflet';
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
      containerStyle: {
        'width': '305px',
      },
      inputStyle: {
        'width': '250px',
      },
      inputID: generateUniqueId(),
      addressEntered: null,
    };
    return data;
  },
  computed: {
    map() {
      return this.$store.state.map.map;
    },
    inputWidth() {
      // if (this.addressAutocompleteEnabled) {
      if (this.addressEntered === '' || this.addressEntered === null) {
        return this.$props.widthFromConfig - 55;
      }
      return this.$props.widthFromConfig - 108;

      // } else {
      //   return this.$props.widthFromConfig - 55;
      // }
    },
    inputClass() {
      if (this.isMobileOrTablet) {
        return 'pvm-input-mobile';
      }
      return 'pvm-input-non-mobile';
    },

    containerClass() {
      if (this.isMobileOrTablet) {
        return 'pvm-container-mobile';
      }
      return 'pvm-container-non-mobile';

    },
    buttonClass() {
      if (this.isMobileOrTablet) {
        return 'pvm-button-mobile';
      }
      return 'pvm-button-non-mobile';

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
  },
  watch: {
    addressEntered(nextValue) {
      this.handleWindowResize();
    },
  },
  created() {
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();
    if (this.$config.defaultAddress) {
      this.addressEntered = this.$config.defaultAddress;
    }
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
    didType: debounce(function (e) {
      // console.log('debounce is running');
      const { value } = e.target;
      this.$data.addressEntered = value;
      // this.$store.commit('setAddressEntered', value);

      if (this.addressAutocompleteEnabled) {
        // console.log('debounce is running, e:', e, 'this:', this);
        if (e.key === "ArrowDown") {
          document.getElementById('address-candidate-list-0').focus();
          return;
        }
        // const { value } = e.target;
        this.getCandidates(value);
        // this.$store.commit('setAddressEntered', value);
        if (e.key !== "Enter") {
          // console.log('AddressInput.vue didType is running, e.key !== "Enter"');
          this.$store.commit('setShouldShowAddressCandidateList', true);
        }
      }
    }, 300,
    ),
    getCandidates(address) {
      // console.log('getCandidates is running, address:', address);
      axios.get('https://cqvfg1pm72.execute-api.us-east-1.amazonaws.com/dev/first-api-test/', {
        params: {
          address,
        },
      })
        .then(this.didGetCandidates)
        .catch(this.didGetCandidatesError);
    },
    didGetCandidates(res) {
      const { matches } = res.data;
      // console.log('matches:', matches, 'matches map:', matches.map(x => x.address));
      const matchesArray = matches.map(x => x.address);
      this.$store.commit('setCandidates', matchesArray);
    },
    didGetCandidatesError(err) {
      console.log('error getting candidates', err);
      this.$store.commit('setCandidates', []);
    },
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
    handleWindowResize() {
      const addressEntered = this.addressEntered;
      console.log('PhilaUiAddressInput.vue handleWindowResize is running', window.innerWidth, 'addressEntered:', addressEntered);
      if (window.innerWidth >= 850) {
        this.containerStyle.width = this.$props.widthFromConfig + 'px';
        if (addressEntered === '' || addressEntered === null) {
          this.inputStyle.width = this.$props.widthFromConfig - 55 + 'px';
        } else {
          this.inputStyle.width = this.$props.widthFromConfig - 108 + 'px';
        }
      } else if (window.innerWidth >= 750 && !this.$props.static) {
        this.containerStyle.width = this.$props.widthFromConfig - 100 + 'px';
        if (addressEntered === '' || addressEntered === null) {
          this.inputStyle.width = this.$props.widthFromConfig - 155 + 'px';
        } else {
          this.inputStyle.width = this.$props.widthFromConfig - 208 + 'px';
        }
      } else {
        this.containerStyle.width = '280px';
        if (addressEntered === '' || addressEntered === null) {
          // this.inputStyle.width = '245px';
          this.inputStyle.width = '225px';
        } else {
          // this.inputStyle.width = '192px';
          this.inputStyle.width = '172px';
        }
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

.pvm-search-control-form {
  /* display: inline-block; */
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
  /* z-index: 1; */
}

.pvm-container-non-mobile {
  height: 48px;
}

.pvm-container-mobile {
  height: 38px;
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

.pvm-search-control-button {
  /* display: inline-block; */
  color: #fff;
  background: $ben-franklin-blue-dark;
  padding: 10px;
  width: 55px;
  margin-left: -8px;
  margin-top: 8px;
  border-width: 3px !important;
  border-color: $ben-franklin-blue-dark !important;
}

.pvm-button-non-mobile {
  height: 56px;
  line-height: 50px;
}

.pvm-button-mobile {
  height: 38px;
  line-height: 38px;
  padding-top: 1px;
}


</style>
