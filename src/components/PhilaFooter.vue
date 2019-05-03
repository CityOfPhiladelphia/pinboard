<template>
  <footer class="app-footer cell shrink">
    <div class="grid-x align-middle">
      <div class="cell">
        <nav>
          <ul class="footer-nav">
            <li><a href="https://www.phila.gov">City of Philadelphia</a></li>
            <li><a :href="howToUseLink">How To Use</a></li>
            <li><a :href="feedbackLink">Feedback</a></li>
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
      default: '/feedback',
    },
    howToUseLink: {
      type: String,
      default: '/how',
    },
  },
}
</script>
<style lang="scss">

.app-footer{
  vertical-align: middle;
  background: color(dark-ben-franklin);
  text-align: center;
  a:link, a:visited{
    color: white;
  }
  a:hover, a:active{
    color: color(electric-blue);
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
