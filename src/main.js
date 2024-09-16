import "./assets/scss/main.scss";
import "./assets/scss/expandCollapse.scss";
// import "./assets/scss/customGreeting.scss";
import 'animate.css/animate.min.css';
import 'vue-good-table/dist/vue-good-table.css';

import Vue from 'vue';
import VueI18n from 'vue-i18n'

import axios from 'axios';
import controllerMixin from '@phila/vue-datafetch/src/controller.js';
/* eslint-disable import/no-extraneous-dependencies */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import fonts from './fa';

import App from './App.vue';
// import router from './router';
import Router from 'vue-router';

import ResponsiveHelpers from './plugins/ResponsiveHelpers.js';

import createStore from './store';

import VueGtag from 'vue-gtag';

// importing util helpers for creating the config
// and making it available to all components as "this.$config"
import mergeDeep from './util/merge-deep';
import configMixin from './util/config-mixin';

import notifications from './components/notifications';

import zipcodes from './data-sources/zipcodes';
import holidays from './data-sources/holidays';


// baseConfig is right now coming in from within the project
// if we definitely need one, we can move it outside the project
// and do an axios call to get it
// import baseConfig from './config';
import i18n from './i18n/i18n';
console.log('i18n:', i18n);


// any config specific to this project only can go here
const clientConfig = {
  // map: '',
  i18n
};

function initPinboard(clientConfig) {
  console.log('clientConfig:', clientConfig);
  let pinboardMessages = i18n.i18n.data.messages;
  let clientMessages;
  if (clientConfig.i18n.enabled) {
    clientMessages = clientConfig.i18n.data.messages;

    for (let key of Object.keys(pinboardMessages)) {
      // console.log('key:', key);
      if (!clientMessages[key]) {
        // console.log('clientMessages[key]:', clientMessages[key]);
        // pinboardMessages[key] = mergeDeep(pinboardMessages[key], clientMessages[key]);
        delete pinboardMessages[key];
      } //else {
      // }
    }
  }

  console.log('initPinboard is running 1, clientMessages:', clientMessages, 'pinboardMessages:', pinboardMessages, 'clientConfig:', clientConfig, 'i18n:', i18n, 'zipcodes:', zipcodes, 'holidays:', holidays);
    
  clientConfig.pinboard = true;
  clientConfig = mergeDeep(i18n, clientConfig);
  if (clientConfig.searchBar.searchTypes.includes('zipcode')) {
    clientConfig = mergeDeep(zipcodes, clientConfig);
  }
  clientConfig = mergeDeep(holidays, clientConfig);
  const baseConfigUrl = clientConfig.baseConfig;
  console.log('initPinboard is running 2, clientConfig:', clientConfig, 'baseConfigUrl:', baseConfigUrl);

  if (!baseConfigUrl || baseConfigUrl === null) {
    console.log('about to call finishInit');
    finishInit(clientConfig);
  } else {
    // get base config
    return axios.get(baseConfigUrl).then(response => {
      // console.log('in axios, clientConfig:', clientConfig);
      const data = response.data;
      // console.log('in axios, data:', data);

      // parse raw js. yes, it's ok to use eval :)
      // http://stackoverflow.com/a/87260/676001
      const baseConfigFn = eval(data);
      const { gatekeeperKey } = clientConfig;
      const baseConfig = baseConfigFn({ gatekeeperKey });
      // console.log('baseConfig:', baseConfig);

      // deep merge base config and client config
      const config = mergeDeep(baseConfig, clientConfig);
      // console.log('baseConfig section, config:', config);
      finishInit(config);
    }).catch(err => {
      console.error('Error loading base config:', err);
      var windowHeight = window.innerHeight;
      var appFooterHeightNum = parseInt(document.getElementsByClassName('app-footer')[0].getBoundingClientRect().height);
      var divHeight = windowHeight - appFooterHeightNum;
      console.log('windowHeight:', windowHeight, 'appFooterHeightNum:', appFooterHeightNum, 'divHeight:', divHeight);
      var element = document.getElementById('mapboard');
      element.innerHTML = '\
      <div style="width:100%;height:' + divHeight + ';">\
        <div style="max-width:300px;margin-left:auto;margin-right:auto;">\
          <h2>\
            Something has gone wrong with the site.<br>\
            Please try again later.\
          </h2>\
        </div>\
      </div>\
      ';
      // return 'return error';
    });
  }
}

function hasQueryParams(route) {
  return !!Object.keys(route.query).length
}

function finishInit(config) {
  console.log('finishInit is running, config:', config);

  // make config accessible from each component via this.$config
  Vue.use(configMixin, config);

  // create store
  const store = createStore(config);

  Vue.use(notifications, { store });

  // mix in controller
  Vue.use(controllerMixin, { config, store });
  // Vue.use(controllerMixin, { config, store, eventBus });

  if (config.alerts && config.alerts.alertChecks) {
    store.dispatch('alertCheck', config.alerts.alertChecks);
  }

  Vue.component('font-awesome-icon', FontAwesomeIcon);

  Vue.use(VueI18n)
  let i18nData;
  if (config.i18n && config.i18n.data) {
    i18nData = config.i18n.data;
  } else {
    i18nData = {};
  }
  const i18n = new VueI18n(i18nData);

  Vue.use(Router);

  // console.log('process.env.VUE_APP_PUBLIC_PATH:', process.env.VUE_APP_PUBLIC_PATH);

  let publicPath = '';
  if (config.publicPath) {
    publicPath = config.publicPath;
  }

  const router = new Router({
    mode: 'history',
    routes: [
      {
        path: publicPath + '/',
        name: 'home',
        component: () => import('./pages/Main'),
      },
      {
        path: publicPath + '/print-view/',
        name: 'printView',
        component: () => import('./pages/PrintView'),
      },
    ],
  });
  
  router.beforeEach((to, from, next) => {
    console.log('router.beforeEach is firing, to:', to, 'from:', from);
    if(to.name != from.name && !hasQueryParams(to) && hasQueryParams(from)){
      next({name: to.name, query: from.query});
    } else {
      next()
    }
  })


  Vue.use(VueGtag, {
    config:{
      id: 'G-NHET8T5XY8',
      appName: 'My application',
      pageTrackerScreenviewEnabled: true,
      params: {},
    }
  }, router);

  Vue.use(fonts);
  Vue.use(ResponsiveHelpers);
  Vue.config.productionTip = false;
  // Vue.prototype.$appType = 'immigrant';
  Vue.prototype.$appType = config.app.type;

  const customComps = config.customComps || [];
  for (let key of Object.keys(customComps)) {
    Vue.component(key, customComps[key]);
  }

  // mount main vue
  const vm = new Vue({
    el: config.el || '#app',
    render: h => h(App),
    router,
    i18n,
    store,
  });
}

export default initPinboard;
