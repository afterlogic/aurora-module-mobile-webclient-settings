<template>
  <div>
    <q-toolbar class="text-black flex justify-center" style="height: 55px; font-size: 16px; padding: 0">
      <q-card-actions align="left" class="col-1">
        <q-btn v-if="showBackAction" flat color="black" round dense icon="chevron_left" @click="onPreviousPath"/>
      </q-card-actions>
      <div class="col-10 text-center text-bold">{{ headerText }}</div>
      <q-card-actions align="right" class="col-1">
        <q-btn flat color="black" round dense icon="more_horiz" />
      </q-card-actions>
    </q-toolbar>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

import eventBus from 'src/event-bus'

export default {
  name: 'SettingsHeader',

  data () {
    return {
      settingsHeaderTitles: []
    }
  },

  computed: {
    ...mapGetters('openpgpmobile', ['currentKeys']),

    showBackAction() {
      const path = this.$route.fullPath.split('/')
      return path[2] !== 'menu'
    },

    headerText () {
      const matchedCount = this.$route.matched.length
      if (matchedCount > 0) {
        const lastMatched = this.$route.matched[matchedCount - 1]
        const title = this.settingsHeaderTitles.find(title => title.settingsPath === lastMatched.path)
        if (title) {
          return title.settingsTitle
        }
      }
      return 'Settings'
    },
  },

  mounted () {
    const params = {}
    eventBus.$emit('SettingsMobileWebclient::GetSettingsHeaderTitles', params)
    this.settingsHeaderTitles = params.settingsHeaderTitles
  },

  methods: {
    onPreviousPath() {
      this.$router.back()
    },
  },
}
</script>

<style scoped></style>
