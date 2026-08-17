const path = require('path')
const { sharedHelper, moduleHelper, fixturePath } = require(path.join(
  process.env.AURORA_MOBILE_E2E_ROOT,
  'test/e2e/helpers/paths'
))
const { test, expect } = sharedHelper('fixtures')
const { loginAsTestUser, step, attachScreenshot } = sharedHelper('login')
const { clickReady } = sharedHelper('ready')
const {
  openSettings,
  openSettingsTab,
  goBackToSettingsMenu,
} = require('./helpers/settings')

const hasCredentials = !!(process.env.E2E_LOGIN && process.env.E2E_PASSWORD)

test.describe('Mobile settings auth surfaces', () => {
  test.skip(!hasCredentials, 'Set E2E_LOGIN and E2E_PASSWORD in .env.e2e')

  test('OpenPGP: external keys + generate dialog (cancel)', async ({
    page,
  }) => {
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

    await step('Open OpenPGP → External keys', async () => {
      await openSettingsTab(page, '/settings/open-pgp')
      await expect(page.getByTestId('settings-openpgp')).toBeVisible({
        timeout: 30000,
      })
      await clickReady(page.getByTestId('settings-openpgp-external-keys'))
      await expect(
        page.getByTestId('settings-openpgp-external-keys-page')
      ).toBeVisible({ timeout: 30000 })
      console.log('  → External keys page')
      await attachScreenshot(page, 'settings-auth-pgp-external')
      await clickReady(page.getByTestId('settings-back'))
      await expect(page.getByTestId('settings-openpgp')).toBeVisible({
        timeout: 15000,
      })
    })

    await step('My keys → Generate dialog → close without creating', async () => {
      await clickReady(page.getByTestId('settings-openpgp-my-keys'))
      await expect(page.getByTestId('settings-openpgp-my-keys-page')).toBeVisible(
        { timeout: 30000 }
      )
      await expect(page.getByTestId('settings-openpgp-generate')).toBeVisible()
      await expect(page.getByTestId('settings-openpgp-import-text')).toBeVisible()
      await clickReady(page.getByTestId('settings-openpgp-generate'))
      await expect(
        page.getByTestId('settings-openpgp-generate-dialog')
      ).toBeVisible({ timeout: 15000 })
      await expect(
        page.getByTestId('settings-openpgp-generate-email')
      ).toBeVisible()
      await expect(
        page.getByTestId('settings-openpgp-generate-password')
      ).toBeVisible()
      await expect(
        page.getByTestId('settings-openpgp-generate-submit')
      ).toBeVisible()
      console.log('  → Generate key dialog open')
      await attachScreenshot(page, 'settings-auth-pgp-generate')
      const dialog = page.getByTestId('settings-openpgp-generate-dialog')
      await page.locator('.cancel-icon').click({ force: true }).catch(() => undefined)
      if (await dialog.isVisible().catch(() => false)) {
        await page.keyboard.press('Escape').catch(() => undefined)
      }
      await expect(dialog).toBeHidden({ timeout: 15000 })
    })

    await step('Back to settings menu', async () => {
      await goBackToSettingsMenu(page)
    })
  })

  test('OpenPGP: toggle mail option and save', async ({ page }) => {
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

    await step('Open OpenPGP and toggle Enable in mail', async () => {
      await openSettingsTab(page, '/settings/open-pgp')
      await expect(page.getByTestId('settings-openpgp')).toBeVisible({
        timeout: 30000,
      })
      const enable = page.getByTestId('settings-openpgp-enable-mail')
      const save = page.getByTestId('settings-header-action')
      test.skip(
        (await enable.count()) === 0,
        'Enable OpenPGP in mail control not shown (Mail unavailable)'
      )
      test.skip((await save.count()) === 0, 'No Save action on OpenPGP header')

      // OpenPgp.mounted() copies getOpenPgpSettings() into data (defaults are
      // false). Clicking before hydration flips the box, then mount resets it
      // and hasChanges stays false → Save stays disabled.
      await expect(save).toBeDisabled({ timeout: 15000 })
      await expect
        .poll(
          async () => {
            const a = await enable.isChecked()
            await page.waitForTimeout(200)
            return (await enable.isChecked()) === a ? a : null
          },
          { timeout: 15000, intervals: [200, 400] }
        )
        .not.toBeNull()

      const before = await enable.isChecked()
      await enable.setChecked(!before)
      await expect(enable).toBeChecked({ checked: !before })
      // Real dirty signal for this screen — do not click Save while disabled.
      await expect(save).toBeEnabled({ timeout: 15000 })
      console.log(`  → Enable OpenPGP in mail toggled from ${before}`)
      await attachScreenshot(page, 'settings-auth-pgp-toggle')
    })

    await step('Save via header action', async () => {
      const save = page.getByTestId('settings-header-action')
      await expect(save).toBeEnabled({ timeout: 10000 })
      await save.click()
      await expect(save).toBeDisabled({ timeout: 30000 })
      await expect(page.getByTestId('settings-openpgp')).toBeVisible({
        timeout: 30000,
      })
      console.log('  → Save clicked')
      await attachScreenshot(page, 'settings-auth-pgp-saved')
    })

    await step('Restore previous toggle value', async () => {
      const enable = page.getByTestId('settings-openpgp-enable-mail')
      const save = page.getByTestId('settings-header-action')
      const current = await enable.isChecked()
      await enable.setChecked(!current)
      await expect(save).toBeEnabled({ timeout: 15000 })
      await save.click()
      await expect(save).toBeDisabled({ timeout: 30000 })
      await goBackToSettingsMenu(page)
    })
  })

  test('Paranoid Encryption shows enable controls', async ({ page }) => {
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

    await step('Open tab and expect toggles', async () => {
      await openSettingsTab(page, '/settings/paranoid-encryption')
      await expect(page.getByTestId('settings-paranoid')).toBeVisible({
        timeout: 30000,
      })
      await expect(page.getByTestId('settings-paranoid-enable')).toBeVisible()
      await expect(page.getByTestId('settings-paranoid-personal')).toBeVisible()
      console.log('  → Paranoid controls visible (no mutation)')
      await attachScreenshot(page, 'settings-auth-paranoid')
    })

    await step('Back to menu', async () => {
      await goBackToSettingsMenu(page)
    })
  })
})
