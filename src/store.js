/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

import Vue from 'vue';
import Vuex from 'vuex';

import pvdStore from '@phila/vue-datafetch/src/store';
import pvmStore from '@phila/vue-mapping/src/store';
import pvcStore from '@phila/vue-comps/src/store';
import mergeDeep from './util/merge-deep';

Vue.use(Vuex);

function createStore(config) {
  const sources = pvdStore.createSources(config);
  const rfStore = {
    state: {
      sources,
      map: {
        center: [ -75.163471, 39.953338 ],
        zoom: 12,
        latestSelectedResourceFromMap: null,
        popupCoords: null,
        selectedPopupLayer: null,
      },
      bufferList: null,
      currentData: [],
      // selectedServices: [],
      // selectedKeywords: [],
      selectedResources: [],
      latestSelectedResourceFromExpand: null,
      refineOpen: false,
    },
    mutations: {
      // setSelectedServices(state, payload) {
      //   state.selectedServices = payload;
      // },
      setRefineOpen(state, payload) {
        state.refineOpen = payload;
      },
      setBufferList(state, payload) {
        state.bufferList = payload;
      },
      setCurrentData(state, payload) {
        state.currentData = payload;
      },
      // setSelectedKeywords(state, payload) {
      //   state.selectedKeywords = payload;
      // },
      setSelectedResources(state, payload) {
        state.selectedResources = payload;
      },
      setLatestSelectedResourceFromExpand(state, payload) {
        state.latestSelectedResourceFromExpand = payload;
      },
      setLatestSelectedResourceFromMap(state, payload) {
        state.map.latestSelectedResourceFromMap = payload;
      },
      // setIntersectingFeatures(state, payload) {
      //   state.map.intersectingFeatures = payload;
      // },
      setPopupCoords(state, payload) {
        state.map.popupCoords = payload;
      },
      setSelectedPopupLayer(state, payload) {
        state.map.selectedPopupLayer = payload;
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
