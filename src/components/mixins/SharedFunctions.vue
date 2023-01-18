<script>
import transforms from '../../util/transforms.js';

export default {
  methods: {
    getSiteName(item) {
      // console.log('in getSiteName, transforms:', transforms);
      let valOrGetter = this.$config.locationInfo.siteName;
      const valOrGetterType = typeof valOrGetter;
      let val;

      let currentQuery = { ...this.$route.query };
      let currentQueryKeys = Object.keys(currentQuery);

      if (valOrGetterType === 'function') {
        const state = this.$store.state;
        const getter = valOrGetter;
        if (currentQueryKeys.includes('address')) {
          if (item && item.distance) {
            val = '(' + item.distance.toFixed(2) + ' miles) ' + getter(item, transforms);
          } else {
            val = '(' + item.distance.toFixed(2) + ' miles) ' + getter(state);
          }
        } else {
          if (item) {
            val = getter(item, transforms);
          } else {
            val = getter(state);
          }
        }

      } else {
        if (currentQueryKeys.includes('address')) {
          val = item.distance.toFixed(2) + ' miles - ' + item[valOrGetter];
        } else {
          val = item[valOrGetter];
        }
      }
      // console.log('getSiteName val:', val);
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
        val = valOrGetter;
      }
      return val;
    },
  }
}
</script>
