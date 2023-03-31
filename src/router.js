import Vue from 'vue';
import Router from 'vue-router';

// import ResourceView from './pages/ResourceView';
// import Main from './pages/Main';

Vue.use(Router);

let publicPath = '';
// if (config.publicPath) {
if (process.env.VUE_APP_PUBLIC_PATH) {
  // publicPath = config.publicPath;
  publicPath = process.env.VUE_APP_PUBLIC_PATH;
// }
}

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: publicPath + '/',
      name: 'home',
      component: () => import('./pages/Main'),
      // component: Main,
    },
    // {
    //   path: '/resource-view/:resource?',
    //   name: 'resourceView',
    //   component: () => import('./pages/ResourceView'),
    //   // component: ResourceView,
    //   // meta: {
    //   //   layout: 'full-height',
    //   // },
    // },
    {
      path: publicPath + '/print-view/',
      name: 'printView',
      component: () => import('./pages/PrintView'),
    },
  ],
});

function hasQueryParams(route) {
  return !!Object.keys(route.query).length
}

router.beforeEach((to, from, next) => {
   if(!hasQueryParams(to) && hasQueryParams(from)){
    next({name: to.name, query: from.query});
  } else {
    next()
  }
})



export default router;
