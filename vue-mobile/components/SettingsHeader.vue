<template>
  <div>
    <q-toolbar class="text-black flex justify-center" style="height: 55px; font-size: 16px; padding: 0">
      <q-card-actions align="left" class="col-1">
        <q-btn v-if="showBackAction" flat color="black" round dense icon="chevron_left" @click="onPreviousPath"/>
      </q-card-actions>

      <div class="col-10 text-center text-bold">
        {{ headerText }}
      </div>

      <q-card-actions align="right" class="col-1">
        <actions-dropdown />
      </q-card-actions>
    </q-toolbar>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import ActionsDropdown from "../../../OpenPgpMobileWebclient/vue-mobile/components/common/ActionsDropdown";

import eventBus from 'src/event-bus'

export default {
  name: 'SettingsHeader',
  components: {
    ActionsDropdown
  },

  data () {
    return {
      settingsHeaderTitles: []
    }
  },

  computed: {
    ...mapGetters('openpgpmobile', ['currentKeys']),
    actions() {
      return [
        {
          name: 'Copy text'
        }
      ]
    },
    showBackAction() {
      const path = this.$route.fullPath.split('/')
      return path.length > 2
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
      return this.$t('COREWEBCLIENT.HEADING_SETTINGS_TABNAME')
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
