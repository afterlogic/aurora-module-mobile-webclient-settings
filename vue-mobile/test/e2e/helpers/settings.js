const path = require('path')
const { sharedHelper, fixturePath } = require(path.join(
  process.env.AURORA_MOBILE_E2E_ROOT,
  'test/e2e/helpers/paths'
))
const { expect } = require('@playwright/test')
const { clickReady } = sharedHelper('ready')

async function openSettings(page) {
  await clickReady(page.getByTestId('nav-settings'))
  await expect(page.getByTestId('settings-menu')).toBeVisible({
    timeout: 30000,
  })
}

async function openSettingsTab(page, routerPath) {
  const tab = page.locator(
    `[data-test-id="settings-tab"][data-settings-path="${routerPath}"]`
  )
  await expect(tab).toBeVisible({ timeout: 15000 })
  await clickReady(tab)
}

async function goBackToSettingsMenu(page) {
  for (let i = 0; i < 6; i++) {
    if (await page.getByTestId('settings-menu').isVisible().catch(() => false)) {
      return
    }
    const back = page.getByTestId('settings-back')
    if (await back.isVisible().catch(() => false)) {
      await clickReady(back)
      await page.waitForTimeout(200)
      continue
    }
    await clickReady(page.getByTestId('nav-settings'))
    break
  }
  await expect(page.getByTestId('settings-menu')).toBeVisible({
    timeout: 30000,
  })
}

async function logoutToLoginForm(page) {
  await openSettings(page)
  await clickReady(page.getByTestId('settings-logout'))
  await expect(page.getByTestId('login-email')).toBeVisible({
    timeout: 45000,
  })
  await expect(page.getByTestId('app-shell')).not.toBeVisible({
    timeout: 15000,
  })
}

module.exports = {
  openSettings,
  openSettingsTab,
  goBackToSettingsMenu,
  logoutToLoginForm,
  clickReady,
}
