<template>
  <div>
    <q-toolbar
      class="text-black flex justify-center"
      style="height: 55px; font-size: 16px; padding: 0"
    >
      <q-card-actions align="left" class="col-1">
        <q-btn
          v-if="showBackAction"
          flat
          color="black"
          round
          dense
          icon="chevron_left"
          @click="onPreviousPath"
        />
      </q-card-actions>
      <div class="col-10 text-center text-bold">{{ header }}</div>
      <q-card-actions align="right" class="col-1">
        <q-btn flat color="black" round dense icon="more_horiz" />
      </q-card-actions>
    </q-toolbar>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

import { settingsHeaderTittle } from 'src/utils/enums'

export default {
  name: 'SettingsHeader',
  computed: {
    ...mapGetters('openPGP', ['currentKeys']),
    showBackAction() {
      const patch = this.$route.fullPath.split('/')
      return patch[2] !== 'menu'
    },
    header() {
      if (this.currentKeys) {
        const keys = this.currentKeys.keys
        if (keys.length === 1) {
          if (this.currentKeys.type === 'external' || this.currentKeys.type === 'public') {
            return 'View public key'
          }
        }
      }
      const patch = this.$route.fullPath.split('/')
      return settingsHeaderTittle[patch[patch.length - 1]]
    },
  },
  methods: {
    onPreviousPath() {
      this.$router.back()
    },
  },
}
</script>

<style scoped></style>
