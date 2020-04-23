<template>
  <div class="banner">
    <!-- <table class="fixed centered no-margin-bottom"> -->
    <table class="fixed centered bottom-padding bottom-margin">
      <th
        v-for="(lang, key) in this.i18nMessages"
        @click="handleTableHeaderClick(key)"
        :class="{ selected: isSelected === key, 'bottom-padding': true }"
      >
        <a
          :class="{ selected: isSelected === key, 'underlined': true }"
          target="_blank"
        >
          {{ lang.language }}
        </a>
      </th>
    </table>
  </div>
</template>

<script>

export default {
  name: 'i18nBanner',
  data() {
    return {
      isSelected: 'en-US',
    };
  },
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
  },
  methods: {
    handleTableHeaderClick(key) {
      this.$i18n.locale = key;
      this.$data.isSelected = key;
    }
  }
};

</script>

<style>

.banner {
  background-color: #ffffff;
  color: #0f4d90 !important;
  font-size: 16px;
}

.selected {
  background-color: #0f4d90;
  color: #ffffff !important;
}

.no-margin-bottom {
  margin-bottom: 0px;
}

.bottom-padding {
  padding-bottom: 4px !important;
  /* cursor: pointer; */
}

/* .bottom-margin {
  margin-bottom: 2px !important;
} */

.fixed {
  table-layout: fixed;
}

.centered {
  width: 85%;
  margin: 0 auto;
}

.underlined {
  text-decoration: underline;
}

</style>
