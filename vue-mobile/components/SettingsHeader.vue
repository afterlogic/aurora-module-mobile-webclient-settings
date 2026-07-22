<template>
  <q-toolbar class="text-black flex justify-center" style="height: 55px; font-size: 16px; padding: 0">
    <q-card-actions align="left" class="col-1">
      <q-btn
        v-if="showBackAction"
        data-test-id="settings-back"
        flat
        color="black"
        round
        dense
        icon="chevron_left"
        @click="onPreviousPath"
      />
    </q-card-actions>

    <div
      data-test-id="settings-header-title"
      :class="headerAction ? 'col-9' : 'col-10'"
      class="text-center header-title"
    >
      {{ headerText }}
    </div>

    <q-card-actions v-if="headerAction" align="right" class="col-2 settings-header__actions">
      <q-btn
        data-test-id="settings-header-action"
        flat
        dense
        no-caps
        color="primary"
        class="settings-header__action"
        :label="headerActionLabel"
        :loading="isHeaderActionSaving"
        @click="onHeaderAction"
      />
    </q-card-actions>
    <q-card-actions v-else align="right" class="col-1" />
  </q-toolbar>
</template>

<script>
import eventBus from 'src/event-bus'

export default {
  name: 'SettingsHeader',

  data () {
    return {
      settingsHeaderTitles: [],
      settingsHeaderActions: [],
      isHeaderActionSaving: false,
    }
  },

  computed: {
    showBackAction() {
      const path = this.$route.fullPath.split('/')
      return path.length > 2
    },

    headerText () {
      const matchedCount = this.$route.matched.length
      if (matchedCount > 0) {
        const lastMatched = this.$route.matched[matchedCount - 1]
        const title = this.settingsHeaderTitles?.find(title => title.settingsPath === lastMatched.path)
        if (title) {
          return title.settingsTitle
        }
      }
      return this.$t('COREWEBCLIENT.HEADING_SETTINGS_TABNAME')
    },

    headerAction () {
      const matchedCount = this.$route.matched.length
      if (matchedCount > 0) {
        const lastMatched = this.$route.matched[matchedCount - 1]
        return this.settingsHeaderActions?.find(action => action.settingsPath === lastMatched.path)
      }
      return null
    },

    headerActionLabel () {
      if (!this.headerAction) {
        return ''
      }
      if (this.headerAction.labelLangConst) {
        return this.$t(this.headerAction.labelLangConst)
      }
      return this.headerAction.label || ''
    },
  },

  mounted () {
    const params = {}
    eventBus.$emit('SettingsMobileWebclient::GetSettingsHeaderTitles', params)
    this.settingsHeaderTitles = params.settingsHeaderTitles

    const actionsParams = {}
    eventBus.$emit('SettingsMobileWebclient::GetSettingsHeaderActions', actionsParams)
    this.settingsHeaderActions = actionsParams.settingsHeaderActions

    eventBus.$on('SettingsMobileWebclient::SetHeaderActionSaving', this.setHeaderActionSaving)
  },

  beforeUnmount () {
    eventBus.$off('SettingsMobileWebclient::SetHeaderActionSaving', this.setHeaderActionSaving)
  },

  methods: {
    onPreviousPath() {
      this.$router.back()
    },

    onHeaderAction () {
      if (this.headerAction?.eventName) {
        eventBus.$emit(this.headerAction.eventName)
      }
    },

    setHeaderActionSaving (isSaving) {
      this.isHeaderActionSaving = !!isSaving
    },
  },
}
</script>

<style scoped>
.settings-header__actions {
  justify-content: flex-end;
  padding-right: 8px;
}

.settings-header__action {
  font-size: 14px;
  font-weight: 500;
  min-height: 28px;
  padding: 0 4px;
}
</style>
