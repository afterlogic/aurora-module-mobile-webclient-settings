const path = require('path')
const { sharedHelper, moduleHelper, fixturePath } = require(path.join(
  process.env.AURORA_MOBILE_E2E_ROOT,
  'test/e2e/helpers/paths'
))
const { test, expect } = require('@playwright/test')
const { loginAsTestUser, step, attachScreenshot } = sharedHelper('login')
const { clickReady } = sharedHelper('ready')

const hasCredentials = !!(process.env.E2E_LOGIN && process.env.E2E_PASSWORD)

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
  const back = page.getByTestId('settings-back')
  if (await back.isVisible().catch(() => false)) {
    await clickReady(back)
  } else {
    await clickReady(page.getByTestId('nav-settings'))
  }
  await expect(page.getByTestId('settings-menu')).toBeVisible({
    timeout: 30000,
  })
}

test.describe('Mobile settings actions', () => {
  test.skip(!hasCredentials, 'Set E2E_LOGIN and E2E_PASSWORD in .env.e2e')

  test('opens every settings tab and returns to menu', async ({ page }) => {
    test.setTimeout(180000)
    await loginAsTestUser(page)
    await openSettings(page)

    const tabs = page.getByTestId('settings-tab')
    const count = await tabs.count()
    console.log(`  → Settings tabs: ${count}`)
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      await step(`Open settings tab #${i + 1}`, async () => {
        await openSettings(page)
        const tab = tabs.nth(i)
        const path = (await tab.getAttribute('data-settings-path')) || ''
        const label = (
          await tab.locator('.text-subtitle1').innerText().catch(() => '')
        ).trim()
        await clickReady(tab)
        await expect(page.getByTestId('settings-menu')).toBeHidden({
          timeout: 15000,
        })
        await expect(page.getByTestId('settings-header-title')).toBeVisible({
          timeout: 15000,
        })
        console.log(`  → Opened tab: ${label || path || i}`)
        await attachScreenshot(page, `settings-tab-${i + 1}`)
        await goBackToSettingsMenu(page)
      })
    }
  })

  test('opens OpenPGP settings and My keys list', async ({ page }) => {
    test.setTimeout(180000)
    await loginAsTestUser(page)
    await openSettings(page)

    const openPgpTab = page.locator(
      '[data-test-id="settings-tab"][data-settings-path="/settings/open-pgp"]'
    )
    test.skip(
      (await openPgpTab.count()) === 0,
      'OpenPGP settings tab is not available on this stand'
    )

    await step('Open OpenPGP settings tab', async () => {
      await openSettingsTab(page, '/settings/open-pgp')
      await expect(page.getByTestId('settings-openpgp')).toBeVisible({
        timeout: 30000,
      })
      await expect(page.getByTestId('settings-openpgp-my-keys')).toBeVisible()
      await expect(
        page.getByTestId('settings-openpgp-external-keys')
      ).toBeVisible()
      await attachScreenshot(page, 'settings-openpgp-01')
    })

    await step('Open My keys', async () => {
      await clickReady(page.getByTestId('settings-openpgp-my-keys'))
      await expect(page.getByTestId('settings-openpgp-my-keys-page')).toBeVisible(
        { timeout: 30000 }
      )
      await attachScreenshot(page, 'settings-openpgp-02-my-keys')
    })

    await step('Back to OpenPGP then menu', async () => {
      await clickReady(page.getByTestId('settings-back'))
      await expect(page.getByTestId('settings-openpgp')).toBeVisible({
        timeout: 15000,
      })
      await goBackToSettingsMenu(page)
    })
  })

  test('opens Paranoid Encryption settings', async ({ page }) => {
    test.setTimeout(120000)
    await loginAsTestUser(page)
    await openSettings(page)

    const paranoidTab = page.locator(
      '[data-test-id="settings-tab"][data-settings-path="/settings/paranoid-encryption"]'
    )
    test.skip(
      (await paranoidTab.count()) === 0,
      'Paranoid Encryption tab is not available on this stand'
    )

    await step('Open Paranoid Encryption tab', async () => {
      await openSettingsTab(page, '/settings/paranoid-encryption')
      await expect(page.getByTestId('settings-paranoid')).toBeVisible({
        timeout: 30000,
      })
      await expect(page.getByTestId('settings-paranoid-enable')).toBeVisible()
      await attachScreenshot(page, 'settings-paranoid-01')
    })

    await step('Back to settings menu', async () => {
      await goBackToSettingsMenu(page)
    })
  })

  test('opens Add account form when available', async ({ page }) => {
    test.setTimeout(120000)
    await loginAsTestUser(page)
    await openSettings(page)

    const addAccount = page.locator(
      '[data-test-id="settings-prelogout-item"][data-settings-path="/settings/add-account"]'
    )
    test.skip(
      (await addAccount.count()) === 0,
      'Add account is hidden (multi-account disabled or already has account)'
    )

    await step('Open Add account', async () => {
      await clickReady(addAccount)
      await expect(page.getByTestId('settings-add-account')).toBeVisible({
        timeout: 30000,
      })
      await expect(page.getByTestId('settings-add-account-email')).toBeVisible()
      await expect(
        page.getByTestId('settings-add-account-password')
      ).toBeVisible()
      await attachScreenshot(page, 'settings-add-account-01')
    })

    await step('Back without submitting', async () => {
      await goBackToSettingsMenu(page)
    })
  })
})
