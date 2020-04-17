<template>
  <div class="banner">
  <!-- <div> -->
    <table class="side-padding no-margin">
      <!-- <th>{{ $t('language') }}</th> -->
      <th
        v-for="(lang, key) in this.i18nMessages"
        @click="$i18n.locale = key"
      >
      <!-- v-html="lang.language" -->
        {{ lang.language }}
      </th>
      <!-- <th
        @click="$i18n.locale = 'es'"
      >
        Espanol
      </th> -->
    </table>
  </div>
</template>

<script>

export default {
  name: 'i18nBanner',
  computed: {
    i18nLocale() {
      return this.$i18n.locale;
    },
    i18nMessages() {
      return this.$i18n.messages;
    },
    i18nLanguages() {
      return Object.keys(this.$i18n.messages);
    },
  }
};

</script>

<style>

.banner {
  /* background: #cc3000; */
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
