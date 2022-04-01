<script>
export default {
  props: {
    backgroundColor: {
      type: String,
      default: '#0000ff'
    }
  },
}
</script>

<template>
<g transform="translate(0 -0) scale(10)">
   <defs>
     <linearGradient id="linearGradient2461">
      <stop
         stop-color="#000000"
         stop-opacity="1"
         offset="0"
         id="stop63912" />
      <stop
         stop-color="#e6e6e6"
         stop-opacity="0"
         offset="1"
         id="stop63914" />
    </linearGradient>
   </defs>
   <g
     :fill="backgroundColor"
     fill-rule="evenodd"
     stroke="#000000"
     stroke-width="0.366152"
     stroke-linecap="round"
     stroke-linejoin="round"
     inkscape:groupmode="layer"
     inkscape:label="Layer 1">
    <path
       fill="#00ff0000"
       d="M -5.2916667,-0.52916667 H 5.2916667 L 4.2333334,2.6458334 -1e-8,6.8791668 -4.2333334,2.6458334 Z"
       style=""
       id="rect2437" />
    <path
       id="path2455"
       fill="url(#linearGradient2461)"
       style=""
       d="M -5.2916667,-0.52916667 H 5.2916667 L 4.2333334,2.6458334 -1e-8,6.8791668 -4.2333334,2.6458334 Z"
       sodipodi:nodetypes="cccccc" />
    <path
       sodipodi:nodetypes="cccccc"
       d="m -0.03760664,-3.96875 v 0 L 5.1405717,-0.68026153 6e-8,4.2333334 -5.2157849,-0.68026153 Z"
       style=""
       id="rect2435" />
  </g>


</g>
</template>