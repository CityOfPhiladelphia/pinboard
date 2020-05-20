<template>
  <footer class="app-footer cell shrink">
    <div class="grid-x align-middle">
      <div class="cell">
        <nav>
          <ul class="footer-nav">
            <li>
              <a href="https://www.phila.gov">
                City of Philadelphia
              </a>
            </li>

            <li>
              <a
                v-if="!i18nEnabled"
                href="."
              >
                About This Finder
              </a>
              <a
                v-if="i18nEnabled"
                href="."
                v-html="$t('app.about')"
              />
            </li>

            <li v-if="howToUseEnabled">
              <a
                href=""
                @click.prevent="$emit('howToUseLink')"
              >
                How to use
              </a>
            </li>

            <li>
              <a
                v-if="!i18nEnabled"
                :href="feedbackLink"
                target="_blank"
              >
                Feedback
              </a>
              <a
                v-if="i18nEnabled"
                :href="feedbackLink"
                target="_blank"
                v-html="$t('app.feedback')"
              />
            </li>

          </ul>
        </nav>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  props: {
    feedbackLink: {
      type: String,
      default: 'https://www.phila.gov/feedback/',
    },
  },
  computed: {
    i18nEnabled(){
      if (this.$config.i18n && this.$config.i18n.enabled) {
        return true;
      } else {
        return false;
      }
    },
    howToUseEnabled() {
      if (this.$config.footer && this.$config.footer.HowToUse === false) {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>

<style lang="scss">

.app-footer{
  vertical-align: middle;
  background: color(dark-ben-franklin);
  text-align: center;
  /*needed for IE11*/
  z-index: 1000;
  a:link, a:visited{
    color: white;
  }
  a:hover, a:active{
    color: color(electric-blue);
  }

  a {
    font-weight: normal;
    text-decoration: none;
  }

  .footer-nav {
    margin: .5rem 0;
    padding: 0;
  }

  .footer-nav li{
    display: inline-block;
    padding: 0 1rem;
    border-right: solid 1px #fff;
    &:last-of-type{
      border: none;
    }
  }
}

</style>
