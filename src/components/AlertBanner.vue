<template>
  <div class="background-div">
    <div class="alert">
      <font-awesome-icon
        v-if="!isMobileOrTablet"
        icon="exclamation"
      />
      <p
        class="inline-paragraph no-margin"
        v-html="alertContent"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: 'AlertBanner',
  computed: {
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
    alertContent() {
      let value;
      if (this.i18nEnabled) {
        value = this.$i18n.messages[this.i18nLocale].app.bannerAlert;
      } else if (this.$config.alerts && this.$config.alerts.header && this.$config.alerts.header.content) {
        value = this.$config.alerts.header.content;
      } else {
        value = '<b>Until further notice:</b> Please call ahead or check hours of operation while business restrictions are still in effect.'
      }
      return value;
    }
  },
};

</script>

<style>

.background-div {
  background: #ffffff;
  padding: 10px;
}

.alert {
  background: #cc3000;
  font-size: 16px;
  color: white;
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 20px;
  padding-right: 20px;
}

.inline-paragraph {
  display: inline-block;
  margin-left: 20px;
}

.no-margin {
  margin-bottom: 0px;
}

.side-padding {
  padding-left: 10px;
  padding-right: 10px;
}

</style>
