<script>
export default {
  methods: {
    getSiteName(item) {
      let valOrGetter = this.$config.locationInfo.siteName;
      const valOrGetterType = typeof valOrGetter;
      let val;

      if (valOrGetterType === 'function') {
        const state = this.$store.state;
        const getter = valOrGetter;
        if (item) {
          val = getter(item);
        } else {
          val = getter(state);
        }
      } else {
        val = item[valOrGetter];
      }
      return val;
    },
    getProjection(item) {
      let valOrGetter = this.$config.projection;
      const valOrGetterType = typeof valOrGetter;
      let val;

      if (valOrGetterType === 'function') {
        const state = this.$store.state;
        const getter = valOrGetter;
        if (item) {
          val = getter(item);
        } else {
          val = getter(state);
        }
      } else {
        val = item[valOrGetter];
      }
      return val;
    },
  }
}
</script>
