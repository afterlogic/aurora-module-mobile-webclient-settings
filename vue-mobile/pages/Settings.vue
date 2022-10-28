<template>
  <MainLayout>
    <template v-slot:header>
      <SettingsHeader />
    </template>

    <router-view />
  </MainLayout>
</template>

<script>
import MainLayout from 'src/layouts/MainLayout'
import SettingsHeader from '../components/SettingsHeader'

export default {
  name: 'Settings',

  components: {
    MainLayout,
    SettingsHeader,
  },
}
</script>

<style scoped></style>
