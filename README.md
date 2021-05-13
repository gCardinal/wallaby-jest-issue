# WallabyJS Issue with Jest

Sample repository to illustrate an issue when using WallabyJS.

When running the tests, Jest will fail on the `bootstrap.spec.ts` test, however, Wallaby won't. All tests will be green for Wallaby.

To fix the tests, simply uncomment the `LoggingModule` import in `app/app.module.ts`.
