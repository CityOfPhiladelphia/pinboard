<template>
  <div class="alert">
    <p
      class="side-padding no-margin"
      v-html="alertContent"
    />
  </div>
</template>

<script>

export default {
  name: 'AlertBanner',
  computed: {
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

.alert {
  background: #cc3000;
  font-size: 16px;
  color: white;
}

.no-margin {
  margin-bottom: 0px;
}

.side-padding {
  padding-left: 10px;
  padding-right: 10px;
}

</style>
