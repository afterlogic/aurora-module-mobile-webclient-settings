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
    <q-item
      v-for="item in getVisiblePreLogoutItems()"
      :key="item.labelLangConst"
      clickable
      @click="onPreLogoutItemClick(item)"
    >
      <q-item-section avatar>
        <component :is="item.iconComponent" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-dark">{{ $t(item.labelLangConst) }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-item clickable @click="logout">
      <q-item-section avatar>
        <LogoutIcon />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-subtitle1 text-dark">{{ $t('COREWEBCLIENT.ACTION_LOGOUT') }}</q-item-label>
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

function loadIconComponents(items, itemsRef) {
  for (const item of items) {
    if (_.isFunction(item?.getIconComponent)) {
      item.getIconComponent().then((component) => {
        if (component?.default) {
          item.iconComponent = component.default
        }
        delete item.getIconComponent
        triggerRef(itemsRef)
      })
    }
  }
}

export default {
  name: 'SettingsMenu',

  components: {
    LogoutIcon,
  },

  setup() {
    const tabsParams = {
      settingsTabs: [],
    }
    eventBus.$emit('SettingsMobileWebclient::GetSettingsTabs', tabsParams)
    const settingsTabs = shallowRef(_.isArray(tabsParams.settingsTabs) ? tabsParams.settingsTabs : [])
    loadIconComponents(settingsTabs.value, settingsTabs)

    const preLogoutParams = {
      preLogoutItems: [],
    }
    eventBus.$emit('SettingsMobileWebclient::GetSettingsPreLogoutItems', preLogoutParams)
    const preLogoutItems = shallowRef(
      _.isArray(preLogoutParams.preLogoutItems) ? preLogoutParams.preLogoutItems : []
    )
    loadIconComponents(preLogoutItems.value, preLogoutItems)

    return {
      settingsTabs,
      preLogoutItems,
    }
  },

  methods: {
    getVisiblePreLogoutItems() {
      return this.preLogoutItems.filter((item) => {
        if (_.isFunction(item?.getVisible)) {
          return item.getVisible()
        }
        return item.visible !== false
      })
    },

    onPreLogoutItemClick(item) {
      if (_.isFunction(item?.onClick)) {
        item.onClick(this.$router)
        return
      }
      if (item.routerPath) {
        this.$router.push(item.routerPath)
      }
    },

    logout() {
      coreWebApi.logout()
    },
  },
}
</script>
