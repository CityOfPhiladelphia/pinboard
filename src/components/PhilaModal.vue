<template>
  <div id="modal">
    <div class="modal-container">
      <div class="modal-wrapper">
        <div class="modal-container-inner">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              @click="close"
              aria-label="Close modal"
              >x</button>
            <slot name="header"></slot>
          </div>
          <div class="modal-body">
            <slot name="body"></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
      <div class="modal-bg"
        @click="close"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'modal',
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss">
  .modal-container {
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: table;
    }

  .modal-bg {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
  }


  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
    position: fixed;
    z-index: 9998;
    top: 30vh;
    left: 50vh;
    right: 50vh;
  }

  .modal-container-inner {
    width: 300px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-body {
    margin: 2rem 0;
  }

</style>
