/* eslint-disable no-param-reassign */

import Vue from 'vue';
import Vuex from 'vuex';

import pvdStore from '@philly/vue-datafetch/src/controller/store';
import pvmStore from '@philly/vue-mapping/src/store';
import pvcStore from '@philly/vue-comps/src/store';
import mergeDeep from './util/merge-deep';

Vue.use(Vuex);

function createStore(config) {
  const dummyMarkers = [
    {
      latlng: [39.953338, -75.163471],
      color: 'purple',
      icon: {
        prefix: 'fas',
        icon: 'map-marker-alt',
        shadow: false,
        size: 20,
      },
    },
    {
      latlng: [39.951839, -75.160911],
      color: 'purple',
      icon: {
        prefix: 'fas',
        icon: 'map-marker-alt',
        shadow: false,
        size: 20,
      },
    },
    {
      latlng: [39.953205, -75.168776],
      color: 'purple',
      icon: {
        prefix: 'fas',
        icon: 'map-marker-alt',
        shadow: false,
        size: 20,
      },
    },
    {
      latlng: [39.949503, -75.157371],
      color: 'purple',
      icon: {
        prefix: 'fas',
        icon: 'map-marker-alt',
        shadow: false,
        size: 20,
      },
    },
    {
      latlng: [39.949397, -75.166866],
      color: 'purple',
      icon: {
        prefix: 'fas',
        icon: 'map-marker-alt',
        shadow: false,
        size: 20,
      },
    },
  ]

  const sources = pvdStore.createSources(config);

  const rfStore = {
    state: {
      sources,
      map: {
        resourceMarkers: dummyMarkers,
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
