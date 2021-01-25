<template>
  <footer class="app-footer cell shrink">
    <div class="grid-x align-middle">
      <div class="cell">
        <nav>
          <ul class="footer-nav">
            <li
              v-if="cityLinkEnabled"
              @click="clickedCityLink"
            >
              <a
                v-if="!i18nEnabled"
                href="https://www.phila.gov"
                target="_blank"
              >
                City of Philadelphia
              </a>
              <a
                v-if="i18nEnabled"
                href="https://www.phila.gov"
                v-html="$t('cityOfPhiladelphia')"
                target="_blank"
              />
            </li>

            <li
              v-if="aboutFinderEnabled"
              @click="clickedAboutFinder"
            >
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

            <li
              v-if="feedbackEnabled"
              @click="clickedFeedback"
            >
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
                v-if="!i18nEnabled"
                :href="link.link"
                target="_blank"
                v-html="link.text"
                @click="clickedOtherLink(link.text)"
              >
                <!-- {{ link.text }} -->
              </a>
              <a
                v-if="i18nEnabled"
                :href="link.link"
                target="_blank"
                v-html="$t(link.text)"
                @click="clickedOtherLink($i18n.messages['en-US'][link.text])"
              >
                <!-- {{ $t(link.text) }} -->
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
  },
  methods: {
    clickedCityLink() {
      this.$gtag.event('footer-click', {
        'event_category': this.$store.state.gtag.category,
        'event_label': 'City of Philadelphia',
      })
    },
    clickedAboutFinder() {
      this.$gtag.event('footer-click', {
        'event_category': this.$store.state.gtag.category,
        'event_label': 'About this finder',
      })
    },
    clickedFeedback() {
      this.$gtag.event('footer-click', {
        'event_category': this.$store.state.gtag.category,
        'event_label': 'Feedback',
      })
    },
    clickedOtherLink(label) {
      this.$gtag.event('footer-click', {
        'event_category': this.$store.state.gtag.category,
        'event_label': label,
      })
    },
  }
};
</script>

<style lang="scss">

.app-footer{
  vertical-align: middle;
  background: $dark-ben-franklin;
  text-align: center;
  /*needed for IE11*/
  z-index: 1000;
  a:link, a:visited{
    color: white;
  }
  a:hover, a:active{
    color: $electric-blue;
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
