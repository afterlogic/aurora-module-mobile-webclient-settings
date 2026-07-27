<template>
  <q-toolbar class="text-black flex justify-center" style="height: 55px; font-size: 16px; padding: 0">
    <q-card-actions align="left" class="col-1">
      <AppHeaderButton
        v-if="showBackAction"
        data-test-id="settings-back"
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
      <AppHeaderButton
        data-test-id="settings-header-action"
        variant="text"
        :label="headerActionLabel"
        :loading="isHeaderActionSaving"
        :disable="isHeaderActionDisabled"
        @click="onHeaderAction"
      />
    </q-card-actions>
    <q-card-actions v-else align="right" class="col-1" />
  </q-toolbar>
</template>

<script>
import eventBus from 'src/event-bus'
import AppHeaderButton from 'src/components/common/AppHeaderButton'

export default {
  name: 'SettingsHeader',

  components: {
    AppHeaderButton,
  },

  data () {
    return {
      settingsHeaderTitles: [],
      settingsHeaderActions: [],
      isHeaderActionSaving: false,
      isHeaderActionDisabled: false,
    }
  },

  watch: {
    '$route.fullPath'() {
      this.isHeaderActionDisabled = false
      this.isHeaderActionSaving = false
    },
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
    eventBus.$on('SettingsMobileWebclient::SetHeaderActionDisabled', this.setHeaderActionDisabled)
  },

  beforeUnmount () {
    eventBus.$off('SettingsMobileWebclient::SetHeaderActionSaving', this.setHeaderActionSaving)
    eventBus.$off('SettingsMobileWebclient::SetHeaderActionDisabled', this.setHeaderActionDisabled)
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

    setHeaderActionDisabled (isDisabled) {
      this.isHeaderActionDisabled = !!isDisabled
    },
  },
}
</script>

<style scoped>
.settings-header__actions {
  justify-content: flex-end;
  padding-right: 16px;
}
</style>
