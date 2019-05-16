/* eslint-disable no-param-reassign */

import Vue from 'vue';
import Vuex from 'vuex';

import pvdStore from '@philly/vue-datafetch/src/controller/store';
import pvmStore from '@philly/vue-mapping/src/store';
import pvcStore from '@philly/vue-comps/src/store';
import mergeDeep from './util/merge-deep';

Vue.use(Vuex);

function createStore(config) {
  const sources = pvdStore.createSources(config);
  const rfStore = {
    state: {
      sources,
      map: {
        center: [-75.163471, 39.953338],
        zoom: 12,
      },
      selectedServices: [],
    },
    mutations: {
      setSelectedServices(state, payload) {
        state.selectedServices = payload;
      },
    },
    actions: {

    },
  }

  let mergeStore = mergeDeep(pvcStore, pvdStore.store);
  mergeStore = mergeDeep(mergeStore, pvmStore);
  mergeStore = mergeDeep(mergeStore, rfStore);

  return new Vuex.Store({
    state: mergeStore.state,
    getters: mergeStore.getters,
    mutations: mergeStore.mutations,
  });
}

export default createStore;
