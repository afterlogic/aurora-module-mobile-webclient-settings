<template>
  <q-item clickable v-bind="$attrs" @click="action">
    <q-item-section avatar>
      <settings-menu-icon :icon="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-subtitle1 text-dark">{{ label }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import SettingsMenuIcon from './SettingsMenuIcon'

export default {
  name: 'SettingsMenuItem',
  components: {
    SettingsMenuIcon,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    action: { type: Function, default: null },
    icon: { type: String, default: '' },
  },
}
</script>

<style scoped></style>
