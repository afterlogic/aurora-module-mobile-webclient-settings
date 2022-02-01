<template>
  <component :is="icon" />
</template>

<script>
import ParanoidIcon from '../icons/ParanoidIcon'
import GearIcon from '../icons/GearIcon'
import CommonIcon from '../icons/CommonIcon'
import LogoutIcon from '../icons/LogoutIcon'

export default {
  name: 'SettingsMenuIcon',
  components: {
    ParanoidIcon,
    GearIcon,
    CommonIcon,
    LogoutIcon,
  },
  props: {
    icon: { type: String, required: true },
  },
}
</script>

<style scoped></style>
