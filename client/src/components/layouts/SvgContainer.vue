<script>
export default {
  data () {
    return {
      height: 1024,
      width: 768
    }
  }
}
</script>

<template>
  <svg
    version="1.1"
    id="dice-client"
    shape-rendering="geometricPrecision"
    text-rendering="geometricPrecision"
    image-rendering="optimizeQuality"
    fill-rule="evenodd"
    clip-rule="evenodd"
    :width="width"
    :height="height"
    :viewBox="(width / -2 ) + ' ' + (height / -2 ) + ' ' + width + ' ' + height">
    <defs>
      <linearGradient id="background" gradientTransform="rotate(100)">
        <stop offset="30%" stop-color="#1f1f66" stop-opacity="1" />
        <stop offset="90%" stop-color="#160a1e" stop-opacity="1" />
      </linearGradient>
    </defs>
    <defs>
      <linearGradient id="tabletop" gradientTransform="rotate(90)">
        <stop offset="25%" stop-color="#160a1e" stop-opacity="0" />
        <stop offset="40%" stop-color="#160a1e" stop-opacity="0" />
        <stop offset="70%" stop-color="#5b52a2" stop-opacity="0.4" />
        <stop offset="80%" stop-color="#160a1e" stop-opacity="0" />
      </linearGradient>
    </defs>
    <rect :x="width / -2" :y="height / -2" :width="width" :height="height" fill="url(#background)" stroke="#661f66" stroke-opacity="1" stroke-width="2" rx="25" ry="25" />

    <rect :x="width / -2" :y="height / -10" :width="width" :height="height/2" fill="url(#tabletop)" stroke="#661f66" stroke-opacity="0" stroke-width="5" />

    <g>
      <slot />
    </g>

  </svg>
</template>


<style>
svg {
}
</style>
