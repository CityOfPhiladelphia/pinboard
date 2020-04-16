<template>
  <div class="banner">
  <!-- <div> -->
    <table class="side-padding no-margin">
      <!-- <th>{{ $t('language') }}</th> -->
      <th
        @click="$i18n.locale = 'en-US'"
      >
        English
      </th>
      <th
        @click="$i18n.locale = 'es'"
      >
        Espanol
      </th>
      <th
      >
        Value 3
      </th>
      <th
      >
        Value 4
      </th>
      <th
      >
        Value 5
      </th>
    </table>
  </div>
</template>

<script>

export default {
  name: 'i18nBanner',
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
