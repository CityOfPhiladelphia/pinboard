<script>
import transforms from '../../util/transforms.js';

export default {
  methods: {
    getSiteName(item) {
      // console.log('in getSiteName, transforms:', transforms);
      let valOrGetter = this.$config.locationInfo.siteName;
      const valOrGetterType = typeof valOrGetter;
      let val;

      if (valOrGetterType === 'function') {
        const state = this.$store.state;
        const getter = valOrGetter;
        if (item) {
          val = getter(item, transforms);
        } else {
          val = getter(state);
        }
      } else {
        val = item[valOrGetter];
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
