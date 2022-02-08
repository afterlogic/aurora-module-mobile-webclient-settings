<template>
  <default-footer v-if="showFooter"></default-footer>
</template>

<script>

import DefaultFooter from 'src/components/main/DefaultFooter'

export default {
  name: 'SettingsFooter',

  components: {
    DefaultFooter,
  },

  computed: {
    showFooter() {
      const path = this.$route.fullPath.split('/')
      return path.length === 2
    },
  },
}
</script>

<style scoped></style>
