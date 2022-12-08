import Vue from 'vue';
import Router from 'vue-router';

import ResourceView from './pages/ResourceView';
import Main from './pages/Main';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Main,
    },
    {
      path: '/resource-view/:resource?',
      name: 'resourceView',
      // component: () => import('./components/ResourceView'),
      component: ResourceView,
      // meta: {
      //   layout: 'full-height',
      // },
    },
  ],
});
