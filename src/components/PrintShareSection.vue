<template>
  <div>
    <div
        v-if="showPrintAndShare"
        style="text-align:right;"
      >
        <button
          class="button is-small card-button"
          @click="clickedShare"
        >
          <font-awesome-icon icon="share-alt" />
          <span class="card-button-text">Share</span>
        </button>
        <button
          v-if="!isMobile"
          class="button is-small card-button"
          @click="clickedPrint"
        >
          <font-awesome-icon icon="print" />
          <span class="card-button-text">Print</span>
        </button>
      </div>
  </div>
</template>

<script>

export default {
  name: 'PrintShareSection',
  props: {
    'item': {
      type: Object,
      default: {},
    },
  },
  computed: {
    showPrintAndShare() {
      let value = false;
      if (this.$route.name == 'home') {
        value = true;
      }
      return value;
    },
    copiedUrl() {
      return this.$i18n.messages[this.i18nLocale]['copiedUrl'];
    },
    isMobileOrTablet() {
      return this.$store.state.isMobileOrTablet;
    },
    i18nLocale() {
      return this.$i18n.locale;
    },
    i18nEnabled() {
      if (this.$config.i18n && this.$config.i18n.enabled) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    clickedShare() {
      console.log('clickedShare is running');
      var dummy = document.createElement('input'),
        text = window.location.href;

      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);

      this.$success(this.copiedUrl, {
        duration: 3000,
        closeOnClick: true,
      });
    },
    clickedPrint() {
      console.log('clickedPrint is running');
      this.$store.commit('setPrintCheckboxes', [ this.item._featureId ]);
      this.$router.push({ name: 'printView'  });
    },
  },
};

</script>

<style>

.card-button {
  border-width: 0px;
  color: #0f4d90;
}

.card-button:hover {
  color: black;
}

.card-button:focus:not(:active), .card-button.is-focused:not(:active) {
  box-shadow: none !important;
}
.card-button-text {
  font-family: "OpenSans-Regular", "Open Sans", sans-serif;
  font-size: 14px;
  padding-left: 5px;
  text-transform: none;
}

</style>
