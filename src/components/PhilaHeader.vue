<template>
  <header class="app-header cell shrink">
    <div class="mobile-menu">
      <font-awesome-icon icon="bars" size="2x" class="show-for-small-only"/>
      <div class="menu-content">
        <a :href="appLogoLink" class="logo flex-child-auto">
          <img :src="appLogo" width="170" height="45" :alt="appLogoAlt">
        </a>
      </div>
    </div>
    <div class="grid-x grid-padding-x grid-padding-y align-middle">
      <div class="cell medium-14">
          <a :href="appLogoLink" class="logo flex-child-auto">
            <img :src="appLogo" :alt="appLogoAlt" class="app-logo hide-for-small-only">
          </a>

        <div class="app-divide hide-for-small-only flex-child-auto"></div>
        <div class="title flex-child-auto">
          <router-link :to="appLink">
            <h1 class="h2">{{ appTitle }}</h1>
            <h2 class="h6">{{ appTagLine }}</h2>
          </router-link>
        </div>
      </div>
      <div class="cell medium-auto small-centered text-center">
        <combo-search
          :dropdown="this.dropdownData"/>
        <div class="search">
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="stripe"></div>
  </header>
</template>

<script>
/* eslint-disable vue/no-unused-components */
/* eslint-disable max-len */

import Logo from '@/assets/city-of-philadelphia-logo.png'

// import AddressInput from '@philly/vue-comps/src/components/AddressInput.vue'
// import Paragraph from '@philly/vue-comps/src/components/Paragraph.vue'
// import '@philly/vue-comps'

export default {
  data() {
    return {
      dropdownData: {
        address: 'Address',
        keyword: 'Keyword',
      },
    }
  },
  props: {
    appLink: {
      type: String,
      default: '/',
    },
    appLogo: {
      type: String,
      default: Logo,
    },
    appLogoAlt: {
      type: String,
      default: 'City of Philadelphia',
    },
    appLogoLink: {
      type: String,
      default: 'https://www.phila.gov',
    },
    appTagLine: {
      type: String,
      default: 'App Tag Line',
    },
    appTitle: {
      type: String,
      default: 'App Title',
    },
  },
  components: {
    ComboSearch: () => import(/* webpackChunkName: "pvc_ComboSearch" */'@philly/vue-comps/src/components/ComboSearch.vue'),
  },

}
</script>

<style lang="scss">
.app-header{
  vertical-align: middle;
  background: color(dark-ben-franklin);

  .app-logo {
    width: 170px;
    height: 45px;
  }
  .title{
    display: inline-flex;
    word-break: break-word;
    h1, h2{
      margin:0;
      padding:0;
    }
    a {
      color: white;
    }
  }
}

.app-divide{
  display: inline-block;
  min-height:4rem;
  vertical-align: middle;
  @media screen and (min-width: 40em) {
    margin: 0 1rem;
    border-left:1px solid white;
  }
}
.stripe {
  min-height: 5px;
  background: color(electric-blue)
}
</style>
