<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    btnstyle: {
      type: String,
      default: 'default'
    },
    width: {
      type: Number,
      default: 260
    },
    height: {
      type: Number,
      default: 60
    }
  },
  data() {
    return {
      hover: false
    }
  },
  computed: {
    fillColor() {
      if (this.hover) {
        return this.buttonAttribs.fillColorHover
      }
      return this.buttonAttribs.fillColor
    },
    fillOpacity() {
      return this.buttonAttribs.fillOpacity
    },
    strokeColor () {
      return this.buttonAttribs.strokeColor
    },
    strokeOpacity () {
      return this.buttonAttribs.strokeOpacity
    },
    strokeWidth () {
      return this.buttonAttribs.strokeWidth
    },
    buttonAttribs () {
      let attribs = {
          fillColor: '#222222',
          fillColorHover: '#444444',
          fillOpacity: 1,
          strokeColor: '#444444',
          strokeWidth: 1,
          strokeOpacity: 1
      }
      switch(this.btnstyle) {
        case 'clear':
          attribs.fillColor = '#000000'
          attribs.strokeColor = '#ffffff'
          attribs.fillOpacity = 0.2
          attribs.strokeOpacity = 0.2
          break;
        case 'cornflower':
          attribs.fillColor = '#4444ff'
          attribs.fillColorHover = '#3333aa'
          attribs.fillOpacity = 0.5
          attribs.strokeColor = '#ffffff'
          attribs.strokeOpacity = 0.2
          attribs.strokeWidth = 2
          break;
        case 'pink':
          attribs.fillColor = '#ff44dd'
          attribs.fillColorHover = '#ee33aa'
          attribs.fillOpacity = 0.5
          attribs.strokeColor = '#ffffff'
          attribs.strokeOpacity = 0.2
          attribs.strokeWidth = 2
          break;
        case 'mint':
          attribs.fillColor = '#008800'
          attribs.fillColorHover = '#004400'
          attribs.fillOpacity = 0.5
          attribs.strokeColor = '#ffff00'
          attribs.strokeOpacity = 0.2
          attribs.strokeWidth = 2
          break;
        case 'red':
          attribs.fillColor = '#aa0000'
          attribs.fillColorHover = '#ff0000'
          break;
      }
      return attribs
    }
  }
}
</script>

<template>
  <g @mouseover="hover = true" @mouseleave="hover = false">
    <rect
      :x="width / -2"
      :y="height / -2"
      :width="width"
      :height="height"
      :fill="fillColor"
      :fill-opacity="fillOpacity"
      :stroke="strokeColor"
      :stroke-opacity="strokeOpacity"
      :stroke-width="strokeWidth"
      rx="15" ry="15" />
    <text>{{ label }}</text>
    <rect
      :x="width / -2"
      :y="height / -2"
      :width="width"
      :height="height"
      fill="#000000"
      fill-opacity="0"
      stroke-opacity="0"
      class="can-click" />
  </g>
</template>

<style>
</style>
