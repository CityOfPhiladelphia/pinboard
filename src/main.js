import Vue from 'vue';
import axios from 'axios';
import controllerMixin from '@philly/vue-datafetch/src/controller/index';
/* eslint-disable import/no-extraneous-dependencies */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import fonts from './fa';

import App from './App.vue';
import router from './router';
import createStore from './store';

// importing util helpers for creating the config
// and making it available to all components as "this.$config"
import mergeDeep from './util/merge-deep';
import configMixin from './util/config-mixin';


// baseConfig is right now coming in from within the project
// if we definitely need one, we can move it outside the project
// and do an axios call to get it
import baseConfig from './config';


// any config specific to this project only can go here
const clientConfig = {
  // map: '',
};

function initPinboard(clientConfig) {
  const baseConfigUrl = clientConfig.baseConfig;

  if (baseConfigUrl === null) {
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
      // console.log('config:', config);
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

function finishInit(config) {
  // console.log('finishInit is running, config:', config);

  // make config accessible from each component via this.$config
  Vue.use(configMixin, config);

  // create store
  const store = createStore(config);

  // mix in controller
  Vue.use(controllerMixin, { config, store });
  // Vue.use(controllerMixin, { config, store, eventBus });

  Vue.component('font-awesome-icon', FontAwesomeIcon);
  // Vue.config.productionTip = false

  const customComps = config.customComps || [];
  // console.log('mapboard main.js, customComps:', customComps);
  for (let key of Object.keys(customComps)) {
    Vue.component(key, customComps[key]);
  }

  // mount main vue
  const vm = new Vue({
    el: config.el || '#app',
    render: h => h(App),
    store,
  });
}

export default initPinboard;



// // if there is a baseConfig, it is merged with the clientConfig here
// // in the parameters of mergeDeep, whichever one comes second
// // will have overwrite power over the first
// const config = mergeDeep(baseConfig, clientConfig);

// const store = createStore(config);

// Vue.use(controllerMixin, { config, store });
// Vue.use(configMixin, config);
// Vue.use(fonts);
// Vue.component('font-awesome-icon', FontAwesomeIcon);

// Vue.config.productionTip = false;

// /* Change this depending on value in $store.state.sources */
// Vue.prototype.$appType = 'immigrant';

// new Vue({
//   router,
//   store,
//   render: h => h(App),
// }).$mount('#app');
