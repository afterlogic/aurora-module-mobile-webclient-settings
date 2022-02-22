<template>
  <main-layout>
    <router-view />
  </main-layout>
</template>

<script>
import MainLayout from 'src/layouts/MainLayout'

export default {
  name: 'Settings',
  components: {
    MainLayout,
  },
}
</script>

<style scoped></style>
