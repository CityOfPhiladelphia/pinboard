<script>
import transforms from '../../util/transforms.js';

export default {
  computed: {
    i18nLocale() {
      return this.$i18n.locale;
    },
  },
  methods: {
    getSiteName(item) {
      // console.log('in getSiteName, item:', item, 'transforms:', transforms, 'this.$i18n.messages:', this.$i18n.messages, 'this.i18nLocale:', this.i18nLocale);
      if (!item) {
        return;
      }
      let valOrGetter = this.$config.locationInfo.siteName;
      const valOrGetterType = typeof valOrGetter;
      let val;

      let currentQuery = { ...this.$route.query };
      let currentQueryKeys = Object.keys(currentQuery);

      if (valOrGetterType === 'function') {
        const state = this.$store.state;
        const getter = valOrGetter;
        if (currentQueryKeys.includes('address') || currentQueryKeys.includes('zipcode') || this.$store.state.map.watchPositionOn) {
          // console.log('item:', item);
          if (item && item.distance) {
            val = '(' + item.distance.toFixed(2) + ' ' + this.$i18n.messages[this.i18nLocale]['miles'] + ') ' + getter(item, transforms);
          } else {
            // console.log('getSiteName else is running');
            // val = '(' + item.distance.toFixed(2) + ' miles) ' + getter(state);
            // val = getter(state);
            val = getter(item, transforms);
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
          // console.log('item:', item);
          if (item.distance) {
            val = item.distance.toFixed(2) + ' miles - ' + item[valOrGetter];
          } else {
            val = item[valOrGetter];
          }
        } else {
          val = item[valOrGetter];
        }
      }
      // console.log('getSiteName val:', val);
      return val;
    },
    getProjection(item) {
      let val;
      if (this.$config && this.$config.projection) {
        let valOrGetter = this.$config.projection;
        const valOrGetterType = typeof valOrGetter;
        
  
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
      }
      return val;
    },
  }
}
</script>
