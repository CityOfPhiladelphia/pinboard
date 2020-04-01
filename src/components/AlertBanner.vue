<template>
  <div class="alert">
    <p class="side-padding no-margin">
      <b>Until further notice:</b> Please call ahead or check hours of operation while business restrictions are still in effect.
    </p>
  </div>
</template>

<script>

export default {
  name: 'AlertBanner',
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
