/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

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
      bufferList: null,
      currentData: [],
      selectedServices: [],
      selectedKeywords: [],
      selectedResources: [],
      latestSelectedResourceFromExpand: null,
    },
    mutations: {
      setSelectedServices(state, payload) {
        state.selectedServices = payload;
      },
      setBufferList(state, payload) {
        state.bufferList = payload;
      },
      setCurrentData(state, payload) {
        state.currentData = payload;
      },
      setSelectedKeywords(state, payload) {
        state.selectedKeywords = payload;
      },
      setSelectedResources(state, payload) {
        // console.log('store.js setSelectedResources is running, payload:', payload);
        state.selectedResources = payload;
      },
      setLatestSelectedResourceFromExpand(state, payload) {
        state.latestSelectedResourceFromExpand = payload;
      },
    },
    actions: {

    },
  };

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
