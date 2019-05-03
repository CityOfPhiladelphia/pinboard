import Vue from 'vue';
import controllerMixin from '@philly/vue-datafetch/src/controller/index';
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
}

// if there is a baseConfig, it is merged with the clientConfig here
// in the parameters of mergeDeep, whichever one comes second
// will have overwrite power over the first
const config = mergeDeep(baseConfig, clientConfig);

const store = createStore(config);

Vue.use(controllerMixin, { config, store });
Vue.use(configMixin, config);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
