<template>
  <router-view />
</template>

<script>

export default {
  name: 'App',
  created () {
    console.log('route', this.$route.path)
    this.$router.replace(this.$route.query.redirect || '/')
  }
};

</script>
