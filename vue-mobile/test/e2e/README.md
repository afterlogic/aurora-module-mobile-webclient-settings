# Mobile E2E (Playwright)

Scenarios for **SettingsMobileWebclient**.

Full docs (run / UI Mode / filters / env):

- Install root: [`README-e2e-mobile.md`](../../../../../README-e2e-mobile.md)
- Runner: [`CoreMobileWebclient/vue-mobile/test/e2e/README.md`](../../../../CoreMobileWebclient/vue-mobile/test/e2e/README.md)

```bash
# from Aurora install root
npm run test:e2e-mobile -- --setup "SettingsMobileWebclient iPhone13"
npm run test:e2e-mobile:ui -- --setup "SettingsMobileWebclient iPhone13"

# from modules/CoreMobileWebclient/vue-mobile
npm run test:e2e -- --setup "SettingsMobileWebclient iPhone13"
npm run test:e2e:ui -- --setup "SettingsMobileWebclient iPhone13"
```

`--setup "<modules> <devices>"` (like desktop). Comma-separate multiple modules/devices.
`*` = all modules: `--setup "* iPhone13"`. Device aliases: `"iPhone 13"` → `iPhone13`.

Shared helpers: Core `test/e2e/helpers/` (`AURORA_MOBILE_E2E_ROOT`). Domain helpers: `./helpers/` here.

