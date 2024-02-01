## Setting for start test:
1. Install node `https://nodejs.org/en/`
2. Add dependency - `npm install`                        
3. Install supported browsers - `npm init playwright@latest`

## Running  the tests

### All tests
`npx playwright test --config=chrome.config.ts --headed`

### Debug
`npx playwright test --config=chrome.config.ts --headed --debug`

