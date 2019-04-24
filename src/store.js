import Vue from 'vue';
import Vuex from 'vuex';

import pvmStore from '@philly/vue-mapping/src/store';
import mergeDeep from './util/merge-deep';

Vue.use(Vuex);

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

const rfStore = {
  state: {
    map: {
      resourceMarkers: dummyMarkers,
    },
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
