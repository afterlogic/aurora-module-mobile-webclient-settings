<template>
  <div class="q-mt-lg">
    <q-item clickable v-for="tab in settingsTabs" @click="() => $router.push(tab.routerPath)">
      <q-item-section avatar>
        <component :is="tab.iconComponent" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-dark">{{ $t(tab.tabNameLangConst) }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-item clickable @click="logout">
      <q-item-section avatar>
        <logout-icon></logout-icon>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-dark">{{ $t('Log out') }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { shallowRef, triggerRef } from 'vue'
import _ from 'lodash'

import coreWebApi from '/src/api/core-web-api'
import eventBus from 'src/event-bus'

import LogoutIcon from './icons/LogoutIcon'

export default {
  name: 'SettingsMenu',

  components: {
    LogoutIcon,
  },

  setup() {
    const params = {
      settingsTabs:[
        {
          routerPath: '/settings',
          tabNameLangConst: 'COREWEBCLIENT.LABEL_COMMON_SETTINGS_TABNAME',
          getIconComponent: () => import('./icons/CommonIcon'),
        },
      ]
    }
    eventBus.$emit('SettingsMobileWebclient::GetSettingsTabs', params)
    const settingsTabs = shallowRef(_.isArray(params.settingsTabs) ? params.settingsTabs : [])
    for (const tab of settingsTabs.value) {
      if (_.isFunction(tab?.getIconComponent)) {
        tab.getIconComponent().then(component => {
          if (component?.default) {
            tab.iconComponent = component.default
          }
          delete tab.getIconComponent
          triggerRef(settingsTabs)
        })
      }
    }
    return {
      settingsTabs,
    }
  },

  methods: {
    logout() {
      coreWebApi.logout()
    },
  },
}
</script>

<style scoped></style>
