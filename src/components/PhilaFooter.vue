<template>
  <footer class="app-footer">
    <div class="grid-x align-middle">
      <div class="cell">
        <nav>
          <ul class="footer-nav">
            <li>City of Philadelphia</li>
            <li>How To Use</li>
            <li>Feedback</li>
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
  },
}
</script>
<style lang="scss">

.app-footer{
  vertical-align: middle;
  background: color(dark-ben-franklin);
  text-align: center;
}

.footer-nav {
  margin: 0;
  padding: 0;
}

.footer-nav li{
  display: inline-block;
  color: white;

}


</style>
