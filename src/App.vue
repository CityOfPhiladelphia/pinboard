<template>
  <div id="app">
    <div class="grid-x">
      <div class="cell small-24">
        header
      </div>
      <div class="grid-x">
        <div class="cell small-24">
          refine
        </div>
      </div>
      <div class="grid-x">
        <div class="cell small-12">
          nav
        </div>
        <div class="cell small-12">
          map
        </div>
      </div>
      <div class="grid-x">
        <div class="cell small-24">
          footer
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "styles/global.scss";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
