<script>
import backgroundPathSvg from './background-path.svg.vue'
import BackgroundPath from './background-path.svg.vue'

export default {
  components: { backgroundPathSvg },
  props: {
    backgroundColor: {
      type: String,
      default: '#0000ff'
    }
  },
}
</script>

<template>
<g transform="translate(0 -0) scale(1)">
  <defs >
    <filter
       style="color-interpolation-filters:sRGB"
       id="blur"
       x="-0.0094531421"
       y="-0.0082647294"
       width="1.0189063"
       height="1.0165295">
      <feGaussianBlur
         stdDeviation="0.53908528"/>
    </filter>
    <linearGradient id="shadowyness" gradientTransform="rotate(90)">
      <stop
         stop-color="#ffffff"
         stop-opacity="1"
         offset="0%"/>
      <stop
         stop-color="#ffffff"
         stop-opacity="0.2"
         offset="10%"/>
      <stop
         stop-color="#ffffff"
         stop-opacity="0.4"
         offset="45%"/>
      <stop
         stop-color="#000000"
         stop-opacity="0.25"
         offset="75%"/>
      <stop
         stop-color="#666666"
         stop-opacity="1"
         offset="100%"/>
    </linearGradient>
  </defs>
  <g stroke-width="0.1" stroke="#ffffff">
    <g>
      <background-path-svg
        :fill="backgroundColor"
        fill-opacity="1"
        stroke-width="0.5"
        :stroke="backgroundColor"
        filter="url(#blur)"
         />
      <background-path-svg
        :fill="backgroundColor"
        fill-opacity="1"
        stroke-width="0.1"
        d="m 81.298833,83.89775 14.66907,0.0172 c 0.077,9e-5 0.0733,0.0985 0.13884,0.13885 l 2.71138,1.66947 c 0.0655,0.0403 -0.0619,0.13885 -0.13884,0.13885 l -20.5061,-3e-5 c -0.0769,0 -0.20656,-0.1023 -0.13884,-0.13885 l 3.12565,-1.68668 c 0.0677,-0.0365 0.13884,-0.21589 0.13884,-0.13885 z m -4.22814,3.19931 22.986057,-0.0507 c 0.077,-1.7e-4 0.14803,0.0624 0.13884,0.13885 l -2.360327,19.65071 c -0.009,0.0764 -0.0619,0.13933 -0.13884,0.13885 l -18.37045,-0.11396 c -0.0769,-4.8e-4 -0.12999,-0.0624 -0.13884,-0.13885 l -2.25528,-19.48608 c -0.009,-0.0764 0.0618,-0.13868 0.13884,-0.13885 z" />
      <background-path-svg
        :stroke="backgroundColor"
        fill-opacity="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter"
        stroke-width="0.1"
        stroke-opacity="0.5" />
      <background-path-svg
        fill="url(#shadowyness)"
        filter="url(#blur)"
        opacity="0.65" />
    </g>
  </g>
</g>
</template>