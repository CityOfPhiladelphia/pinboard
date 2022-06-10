<template>
  <!-- <div> -->
  <div
    :class="'inline has-tooltip-arrow ' + tooltipPosition"
    :data-tooltip="tip"
  >
    <!-- <button class="button" data-tooltip="Tooltip Text">top tooltip</button> -->
    <!-- :for="item" -->
    <!-- v-show="Object.keys(infoCirclesData).includes(item)" -->
    <font-awesome-icon
      v-if="circleType === 'hover'"
      :id="item + '-icon'"
      icon="info-circle"
      class="fa-infoCircle"
    />
    <!-- data-tooltip="Tooltip Text" -->
    <!-- @mouseover="infoOn" -->
    <!-- @mouseout="infoOff" -->

    <font-awesome-icon
      v-if="circleType === 'click'"
      :id="item + '-icon'"
      icon="info-circle"
      class="fa-infoCircle"
      @click="infoClick"
    />
    <!-- @click="infoClick" -->
    <div
      v-if="active"
      :id="item + '-tooltip'"
      :class="tipClass"
      :style="tooltipStyle"
      v-html="circleData.html"
    >
    </div>
  </div>
  <!-- </div> -->
</template>

<script>

// import '@creativebulma/bulma-tooltip'

export default {
  props: {
    item: {

    },
    tip: {

    },
    circleData: {

    },
    circleType: {
      type: String,
      default: 'hover',
    },
  },
  data() {
    return {
      active: false,
      tipClass: 'popup-tip',
      tooltipStyle: {},
    };
  },
  computed: {
    tooltipPosition() {
      let value;
      if (this.isMobile) {
        value = 'has-tooltip-bottom';
      } else {
        value = 'has-tooltip-right';
      }
      return value;
    }
  },
  methods: {
    infoClick(e) {
      this.active = !this.active;
      const thisId = this.$props.item + '-icon';
      const thisIcon = document.getElementById(thisId);
      const iconStyle = thisIcon.getBoundingClientRect();
      const rootElement = document.getElementById('app');
      const rootStyle = window.getComputedStyle(rootElement);
      const rootWidth = rootStyle.getPropertyValue('width');
      const rootWidthNum = parseInt(rootWidth.replace('px', ''));
      const gap = rootWidthNum - iconStyle.right;
      console.log('iconToolTip mounted, iconStyle:', iconStyle, 'rootWidthNum:', rootWidthNum, 'gap:', gap);
      if (gap < 250) {
        this.tooltipStyle = {
          'top': '-20px',
          // 'top': iconStyle.top + 20 + 'px',
          'right': '10px',
        };
      } else {
        this.tooltipStyle = {
          'top': '-20px',
          // 'top': iconStyle.top + 20 + 'px',
        };
      }
    },
    infoOn() {
      this.active = true;
      const thisId = this.$props.item + '-icon';
      const thisIcon = document.getElementById(thisId);
      const iconStyle = thisIcon.getBoundingClientRect();
      const rootElement = document.getElementById('app');
      const rootStyle = window.getComputedStyle(rootElement);
      const rootWidth = rootStyle.getPropertyValue('width');
      const rootWidthNum = parseInt(rootWidth.replace('px', ''));
      const gap = rootWidthNum - iconStyle.right;
      console.log('iconToolTip mounted, iconStyle:', iconStyle, 'rootWidthNum:', rootWidthNum, 'gap:', gap);
      if (gap < 250) {
        this.tooltipStyle = {
          'top': iconStyle.top + 20 + 'px',
          'right': '10px',
        };
      } else {
        this.tooltipStyle = {
          'top': iconStyle.top + 20 + 'px',
        };
      }
    },
    infoOff() {
      this.active = false;
    },
  },
};

</script>

<style lang="scss">

.inline {
  display: inline-block;
  padding-left: 4px;
}

.popup-tip {
  position: absolute;
  // display: inline-block;
  margin-left: 5px;
  width: 260px;
  background-color: rgb(15, 77, 144);
  color: white;
  z-index: 10002;
}

.right-side {
  right: 10px;
}

.full-div {
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
}

.half-div {
  position: relative;
  display: inline-block;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
  width: 130px;
  background-color: rgb(15, 77, 144);
  color: white;
}

ul {
  margin-bottom: 0px;
}

@media screen and (max-width: 749px) {
  .popup-tip {
    position: absolute;
    top: 10px !important;
    right: 10px !important;
    display: inline-block;
    margin-left: 5px;
    width: 220px;
    background-color: rgb(15, 77, 144);
    color: white;
    z-index: 10002;
  }
}

.has-tooltip-right::before {
  // position: relative !important;
  // height: 50px;
  // overflow: visible;
  height: 24px;
  padding-top: 0px !important;
}


</style>
