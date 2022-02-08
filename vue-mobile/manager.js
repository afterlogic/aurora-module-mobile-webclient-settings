import _ from 'lodash'

import eventBus from 'src/event-bus'
import settings from './settings'

export default {
  moduleName: 'SettingsMobileWebclient',

  requiredModules: [],

  init (appdata) {
    settings.init(appdata)
  },

  getNormalUserPages () {
    const params = {}
    eventBus.$emit('SettingsMobileWebclient::GetSettingsPageChildren', params)
    const settingsPageChildren = _.isArray(params.settingsPageChildren) ? params.settingsPageChildren : []

    return [
      {
        pageName: 'settings',
        pagePath: '/settings',
        pageComponent: () => import('./pages/Settings'),
        pageHeaderComponent: () => import('./components/SettingsHeader'),
        pageFooterComponent: () => import('./components/SettingsFooter'),
        pageChildren: [
          {
            path: '/settings',
            component: () => import('./components/SettingsMenu'),
          },
        ].concat(settingsPageChildren),
      },
    ]
  },

  getPageFooterButtons () {
    return [
      {
        pageName: 'settings',
        pagePath: '/settings',
        highlightPaths: ['/settings'],
        getIconComponent: () => import('./components/icons/SettingsFooterIcon'),
      },
    ]
  },
}
