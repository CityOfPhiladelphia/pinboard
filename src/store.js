/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

import Vue from 'vue';
import Vuex from 'vuex';

import isMobileDevice from './util/is-mobile-device';
import pvdStore from '@phila/vue-datafetch/src/store';
import pvmStore from '@phila/vue-mapping/src/store';
import mergeDeep from './util/merge-deep';
import { format } from 'date-fns';

Vue.use(Vuex);

function createStore(config) {
  const sources = pvdStore.createSources(config);
  const rfStore = {
    state: {
      searchDistance: null,
      zipcodeCenter: [],
      printCheckboxes: [],
      lastPinboardSearchMethod: null,
      shouldShowGreeting: true,
      currentSearch: null,
      isMobileOrTablet: isMobileDevice(),
      sources,
      map: {
        center: [ -75.163471, 39.953338 ],
        zoom: 12,
        latestSelectedResourceFromMap: null,
        popupCoords: null,
        selectedPopupLayer: null,
      },
      bufferList: null,
      databaseWithoutHiddenItems: [],
      currentData: [],
      // selectedServices: [],
      // selectedKeywords: [],
      selectedResources: [],
      latestSelectedResourceFromExpand: null,
      refineOpen: false,
      fullScreen: {},
      subsections: {},
      alertResponse: null,
      gtag: {
        category: 'unspecified-pinboard-app'
      },
      zipcodeBufferShape: null,
      refineList: {},
    },
    mutations: {
      setDatabaseWithoutHiddenItems(state, payload) {
        state.databaseWithoutHiddenItems = payload;
      },
      setSearchDistance(state, payload) {
        state.searchDistance = payload;
      },
      setRefineList(state, payload) {
        state.refineList = payload;
      },
      setZipcodeCenter(state, payload) {
        state.zipcodeCenter = payload;
      },
      setPrintCheckboxes(state, payload) {
        state.printCheckboxes = payload;
      },
      setZipcodeBufferShape(state, payload) {
        state.zipcodeBufferShape = payload;
      },
      setLastPinboardSearchMethod(state, payload) {
        state.lastPinboardSearchMethod = payload;
      },
      setMapBounds(state, payload) {
        console.log('mapboard store.js setMapBounds is running');
        // const { northEast, southWest } = payload || {};
        // state.map.bounds.northEast = northEast;
        // state.map.bounds.southWest = southWest;
        state.map.bounds = payload;
      },
      setMapBoundsBasedOnShape(state, payload) {
        state.map.boundsBasedOnShape = payload;
      },
      // setSelectedServices(state, payload) {
      //   state.selectedServices = payload;
      // },
      setShouldShowGreeting(state, payload) {
        state.shouldShowGreeting = payload;
      },
      setCurrentSearch(state, payload) {
        state.currentSearch = payload;
      },
      setGtagCategory(state, payload) {
        state.gtag.category = payload;
      },
      setIsMobileOrTablet(state, payload) {
        state.isMobileOrTablet = payload;
      },
      setalertResponse(state, payload) {
        state.alertResponse = payload;
      },
      setSubsections(state, payload) {
        state.subsections = payload;
      },
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
      async alertCheck({ commit }, hc) {

        let alertHours = hc.filter(i => i.type === 'alertHours');
        let alertAPI = hc.filter(i => i.type === 'alertAPI');

        // let isalert = document.location.href.indexOf('alert') !== -1;
        let isalertHours = false;

        const fullDate = new Date();
        const year = fullDate.getFullYear();
        const month = fullDate.getMonth();
        const date = fullDate.getDate();
        const day = fullDate.getDay();
        const t = format(fullDate,'k:mm');

        // console.log('store.js alertCheck, hc:', hc, 'alertHours:', alertHours, 'fullDate:', fullDate, 'year', year, 'month', month, 'date', date, 'day:', day, 't:', t);
        // console.log('store.js alertCheck, hc:', hc, 'alertHours:', alertHours, 'isalert:', isalert, 'fullDate:', fullDate, 'year', year, 'month', month, 'date', date, 'day:', day, 't:', t);
        let response = {};

        if (alertHours.length === 1) {
          // console.log('alertCheck if is running');
          for (let period of alertHours[0].condition) {
            // console.log('format(fullDate, "k:mm")', format(fullDate,'k:mm'), 'period.day:', period.day, 'period.startTime:', period.startTime, 'period.endTime:', period.endTime);
            if (day === period.day) {
              let startTime = period.startTime.split(':');
              let periodStartTime = new Date(format(new Date(year, month, date, startTime[0], startTime[1]), "MMMM d, yyyy k:mm") + ' GMT-04:00');
              let endTime = period.endTime.split(':');
              let periodEndTime = new Date(format(new Date(year, month, date, endTime[0], endTime[1]), "MMMM d, yyyy k:mm") + ' GMT-04:00');
              console.log('startTime:', startTime, 'endTime:', endTime, 'periodEndTime:', periodEndTime, 'Date.parse(periodStartTime):', Date.parse(periodStartTime), 'Date.parse(fullDate):', Date.parse(fullDate), 'Date.parse(periodEndTime):', Date.parse(periodEndTime));
              if (Date.parse(periodStartTime) <= Date.parse(fullDate) && Date.parse(fullDate) <= Date.parse(periodEndTime)) {
                console.log('fullDate is between start and end time');
                isalertHours = true;
                commit('setalertResponse', 'alertHours');
                // if (!isalert) {
                //   window.location.href = process.env.VUE_APP_PUBLIC_PATH + '#/alert';
                //   return;
                // }
                return;
                // continue;
              }
            }
          }
        }

        // sometimes the system is not on alert, it is just offline connection
        // if (navigator.onLine === false) {
        //   if (isalert) {
        //     window.location.href = '/';
        //     return;
        //   }
        //   return true;
        // }

        try {

          if (alertAPI.length === 1) {
            response = await axios.get(alertAPI[0].condition);
            console.log('Alert-Check response:', response);
            if (response.data && response.data.alert || response.status !== 200) {
              commit('setalertResponse', 'alertAPI');
              if (!isalert) {
                window.location.href = process.env.VUE_APP_PUBLIC_PATH + '#/alert';
                return;
              }
            } else {
              console.log('alert check has a good response');
              commit('setalertResponse', null);
              if (isalert) {
                console.log('isalert is null');
                window.location.href = process.env.VUE_APP_PUBLIC_PATH;
                return;
              } else {
                console.log('isalert is null');
              }
            }
          }

        } catch (err) {
          console.log('Alert-Check-Reponse error:', err);
          commit('setalertResponse', 'alertAPI');

          if (!isalert) {
            window.location.href = process.env.VUE_APP_PUBLIC_PATH + '#/alert';
            return;
          }
        }
        // console.log('after try/catch');
      },
    },
  };

  // let mergeStore = mergeDeep(pvcStore, pvdStore.store);
  let mergeStore = mergeDeep(pvdStore.store, pvmStore);
  mergeStore = mergeDeep(mergeStore, rfStore);

  return new Vuex.Store({
    state: mergeStore.state,
    getters: mergeStore.getters,
    mutations: mergeStore.mutations,
    actions: mergeStore.actions,
  });
}

export default createStore;
