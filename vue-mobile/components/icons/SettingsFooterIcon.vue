<template>
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2 20.6667L5.11111 17.5556V14.4444L2 11.3333L5.11111 6.66667L8.22222 7.44444L12.1111 5.11111V2H19.8889V5.11111L22.2222 7.44444L26.8889 6.66667L30 11.3333L26.8889 14.4444V17.5556L30 20.6667L26.8889 25.3333L23 24.5556L19.8889 26.8889L19.1111 30H12.8889L12.1111 26.8889L9.77778 24.5556L5.11111 26.1111L2 20.6667ZM16 21C18.7614 21 21 18.7614 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21Z"
      :fill="color"
    />
  </svg>
</template>

<script>
export default {
  name: 'SettingsFooterIcon',
  props: {
    color: {
      type: String,
      default: '#B6B5B5',
    },
  },
}
</script>
