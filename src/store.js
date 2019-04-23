import Vue from 'vue';
import Vuex from 'vuex';

import pvmStore from '@philly/vue-mapping/src/store';
import mergeDeep from './util/merge-deep';

Vue.use(Vuex);

const rfStore = {
  state: {

  },
  mutations: {

  },
  actions: {

  },
}

const mergeStore = mergeDeep(pvmStore, rfStore);

export default new Vuex.Store({
  state: mergeStore.state,
  getters: mergeStore.getters,
  mutations: mergeStore.mutations,
});
