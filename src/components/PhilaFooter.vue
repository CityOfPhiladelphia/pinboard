<template>
  <footer class="app-footer cell shrink">
    <div class="grid-x align-middle">
      <div class="cell">
        <nav>
          <ul class="footer-nav">
            <li v-if="cityLinkEnabled">
              <a href="https://www.phila.gov">
                City of Philadelphia
              </a>
            </li>

            <li v-if="aboutFinderEnabled">
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

            <li v-if="feedbackEnabled">
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

            <li
              v-if="otherLinksEnabled"
              v-for="link in otherLinks"
            >
              <a
                :href="link.link"
                target="_blank"
                v-html="link.text"
              >
                <!-- {{ link }} -->
              </a>
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
    cityLinkEnabled() {
      if (this.$config.footer && this.$config.footer.cityLink === false) {
        return false;
      } else {
        return true;
      }
    },
    aboutFinderEnabled() {
      if (this.$config.footer && this.$config.footer.aboutFinder === false) {
        return false;
      } else {
        return true;
      }
    },
    howToUseEnabled() {
      if (this.$config.footer && this.$config.footer.HowToUse === false) {
        return false;
      } else {
        return true;
      }
    },
    feedbackEnabled() {
      if (this.$config.footer && this.$config.footer.feedback && this.$config.footer.feedback.enabled === false) {
        return false;
      } else {
        return true;
      }
    },
    otherLinksEnabled() {
      if (this.$config.footer && this.$config.footer.OtherLinks) {
        return true;
      } else {
        return false;
      }
    },
    otherLinks() {
      if (this.otherLinksEnabled) {
        return this.$config.footer.OtherLinks;
      } else {
        return null;
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
