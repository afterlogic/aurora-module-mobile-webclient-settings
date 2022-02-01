<template>
  <div class="q-mt-lg">
    <q-item clickable v-for="tab in settingsTabs" @click="() => $router.push(tab.routerPath)">
      <q-item-section avatar>
        <component :is="tab.iconComponent" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-dark">{{ $t(tab.labelLangConst) }}</q-item-label>
      </q-item-section>
    </q-item>
    <settings-menu-item :action="logout" label="Log out" icon="LogoutIcon" />
  </div>
</template>

<script>
import _ from 'lodash'
import EventBus from 'src/event-bus'

import SettingsMenuItem from './main/SettingsMenuItem'

export default {
  name: 'SettingsMenu',

  components: {
    SettingsMenuItem,
  },

  data: () => ({
    settingsTabs: [],
  }),

  async mounted () {
    const params = {
      settingsTabs:[
        {
          routerPath: '/settings',
          labelLangConst: 'COREWEBCLIENT.LABEL_COMMON_SETTINGS_TABNAME',
          getIconComponent: () => import('./icons/CommonIcon'),
        },
        {
          routerPath: '/settings/paranoid-encryption',
          labelLangConst: 'COREPARANOIDENCRYPTIONWEBCLIENTPLUGIN.LABEL_SETTINGS_TAB',
          getIconComponent: () => import('./icons/ParanoidIcon'),
        },
      ]
    }
    EventBus.$emit('SettingsMobileWebclient::GetSettingsTabs', params)
    const settingsTabs = _.isArray(params.settingsTabs) ? params.settingsTabs : []
    for (const tab of settingsTabs) {
      if (_.isFunction(tab?.getIconComponent)) {
        const component = await tab.getIconComponent()
        if (component?.default) {
          tab.iconComponent = component.default
        }
        delete tab.getIconComponent
      }
    }
    this.settingsTabs = settingsTabs
  },

  methods: {
    logout() {
      this.$store.dispatch('user/logout')
    },
  },
}
</script>

<style scoped></style>
