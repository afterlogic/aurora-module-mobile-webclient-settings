const path = require('path')
const { sharedHelper, moduleHelper, fixturePath } = require(path.join(
  process.env.AURORA_MOBILE_E2E_ROOT,
  'e2e/helpers/paths'
))
const { test, expect } = require('@playwright/test')
const { loginAsTestUser, step, attachScreenshot } = sharedHelper('login')
const { clickReady } = sharedHelper('ready')

const hasCredentials = !!(process.env.E2E_LOGIN && process.env.E2E_PASSWORD)

test.describe('Mobile settings', () => {
  test.skip(!hasCredentials, 'Set E2E_LOGIN and E2E_PASSWORD in .env.e2e')

  test('opens settings menu and logs out', async ({ page }) => {
    test.setTimeout(90000)

    await loginAsTestUser(page)

    await step('Open Settings from footer nav', async () => {
      await clickReady(page.getByTestId('nav-settings'))
      await expect(page.getByTestId('settings-menu')).toBeVisible({
        timeout: 30000,
      })
      console.log('  → Settings menu is open')
      await attachScreenshot(page, 'settings-01-menu')
    })

    await step('Expect settings header and logout action', async () => {
      await expect(page.getByTestId('settings-header-title')).toBeVisible()
      const title = (
        await page.getByTestId('settings-header-title').innerText()
      ).trim()
      console.log(`  → Settings header: ${title}`)

      await expect(page.getByTestId('settings-logout')).toBeVisible()
      console.log('  → Logout item is visible')

      const tabs = await page.getByTestId('settings-tab').count()
      console.log(`  → Settings tabs count: ${tabs}`)
      await attachScreenshot(page, 'settings-02-ready')
    })

    const tabCount = await page.getByTestId('settings-tab').count()
    if (tabCount > 0) {
      await step('Open first settings tab', async () => {
        const firstTab = page.getByTestId('settings-tab').first()
        const label = (
          await firstTab.locator('.text-subtitle1').innerText().catch(() => '')
        ).trim()
        await clickReady(firstTab)
        console.log(`  → Opened settings tab: ${label || '(unknown)'}`)
        await expect(page.getByTestId('settings-header-title')).toBeVisible({
          timeout: 15000,
        })
        await attachScreenshot(page, 'settings-03-tab')
      })

      await step('Return to settings menu', async () => {
        // Tab screens keep the same header title; use footer nav to re-open menu.
        await clickReady(page.getByTestId('nav-settings'))
        await expect(page.getByTestId('settings-menu')).toBeVisible({
          timeout: 15000,
        })
        await expect(page.getByTestId('settings-logout')).toBeVisible()
      })
    }

    await step('Logout and land on login form', async () => {
      await clickReady(page.getByTestId('settings-logout'))
      await expect(page.getByTestId('login-email')).toBeVisible({
        timeout: 45000,
      })
      await expect(page.getByTestId('app-shell')).not.toBeVisible({
        timeout: 15000,
      })
      console.log('  → Logged out, login form is visible')
      await attachScreenshot(page, 'settings-04-after-logout')
    })
  })
})
