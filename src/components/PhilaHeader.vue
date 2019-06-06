<template>
  <header class="app-header cell shrink">
    <div class="grid-x grid-padding-x grid-padding-y align-middle">
      <div class="cell mobile-menu show-for-small-only small-2">
        <font-awesome-icon
          v-show="!isOpen"
          icon="bars"
          size="2x"
          :style="{ color: 'white' }"
          @click="toggleMenu"
        />
        <font-awesome-icon
          v-show="isOpen"
          icon="times"
          size="2x"
          :style="{ color: 'white' }"
          @click="toggleMenu"
        />
      </div>
      <div class="cell medium-auto small-21">
        <div class="grid-x grid-padding-x align-middle">
          <div class="cell shrink hide-for-small-only">
            <a
              :href="appLogoLink"
              class="logo flex-child-auto"
            >
              <img
                :src="appLogo"
                :alt="appLogoAlt"
                class="app-logo"
              >
            </a>
          </div>
          <div class="cell shrink hide-for-small-only">
            <div class="app-divide flex-child-auto" />
          </div>
          <div class="cell shrink">
            <section class="title-container flex-child-auto">
              <router-link
                :to="appLink"
                class="app-title"
              >
                <h1 class="title">
                  {{ appTitle }}
                </h1>
                <h2 class="h6 hide-for-small-only tagline">
                  {{ appTagLine }}
                </h2>
              </router-link>
            </section>
          </div>
          <div class="cell large-auto small-auto small-centered text-center">
            <combo-search
              :dropdown="dropdownData"
            />
            <div class="search">
              <slot name="search" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-show="!isOpen"
      class="stripe"
    />
    <div
      v-show="isOpen"
      class="mobile-menu-content-container show-for-small-only"
    >
      <div class="mobile-menu-content">
        <a
          :href="appLogoLink"
          class="logo flex-child-auto"
        >
          <img
            :src="appLogo"
            :alt="appLogoAlt"
            class="app-logo"
          >
        </a>
        <slot name="mobile-menu" />
      </div>
    </div>
    <slot name="after-stripe" />
  </header>
</template>

<script>
// TODO: move logo, link etc to app config.
import Logo from '@/assets/city-of-philadelphia-logo.png';
// import AddressInput from '@philly/vue-comps/src/components/AddressInput.vue'
// import Paragraph from '@philly/vue-comps/src/components/Paragraph.vue'
// import '@philly/vue-comps'

export default {
  components: {
    ComboSearch: () => import(/* webpackChunkName: "pvc_ComboSearch" */'@philly/vue-comps/src/components/ComboSearch.vue'),
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
  data() {
    return {
      dropdownData: {
        address: {
          text: 'Address',
          data: null,
        },
        keyword: {
          text: 'Keyword',
          data: null,
        },
      },
      isOpen: false,
    };
  },
  computed: {
    address() {
      let value;
      if (this.$store.state.geocode.data) {
        if (this.$store.state.geocode.data.properties) {
          value = this.$store.state.geocode.data.properties.street_address;
        }
      } else {
        value = '';
      }
      return value;
    },
    keywords() {
      return this.$store.state.selectedKeywords;
    },
  },
  watch: {
    address(nextAddress) {
      this.dropdownData.address.data = nextAddress;
    },
    keywords(nextKeywords) {
      this.dropdownData.keyword.data = nextKeywords;
    },
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
      this.toggleBodyClass('no-scroll');
    },
    // TODO: make generic toggle class
    toggleBodyClass(className) {
      const el = document.body;
      return this.isOpen ? el.classList.add(className) : el.classList.remove(className);
    },
  },
};
</script>

<style lang="scss">
.app-header{
  vertical-align: middle;
  background: color(dark-ben-franklin);

  @media screen and (max-width: 749px) {
    position: fixed;
    top:0;
    z-index: 1020;
  }

  .app-logo{
    width: 170px;
    height: 45px;
  }
  .logo{
    opacity: 1;
    transition: opacity .25s ease-in-out;
    &:hover {
      opacity: .6;
    }
  }

  .title-container{
    display: inline-flex;
    word-break: break-word;

    h1, h2{
      padding:0;
    }
    a {
      color: white;
    }
  }
  .app-title{
    opacity: 1;
    transition: opacity .25s ease-in-out;
    &:hover {
      opacity: .6;
    }
  }
  .title{
    @media screen and (max-width: 20rem) {
      max-width: 20rem;
    }

    line-height: 2rem;
  }
}
.mobile-menu-content-container{
  margin-top:1rem;
  overflow: hidden;
  color: white;
  z-index: 100;
  background: color(dark-ben-franklin);
  height: 100vh;
  width:100%;

  .mobile-menu-content{
    text-align: center;
  }
}

.app-divide{
  display: inline-block;
  min-height:4rem;
  vertical-align: middle;
  margin-bottom: 1rem;

  @media screen and (min-width: 40em) {
    border-left:1px solid white;
  }
}
.stripe {
  min-height: 5px;
  background: color(electric-blue);
}
</style>
