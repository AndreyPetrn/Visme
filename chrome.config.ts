import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {

  testDir: './tests',
  reporter: [['list'], ['allure-playwright']],
  timeout: 250000,
  
  use: {
    contextOptions: {
      ignoreHTTPSErrors: true,
   },
    
    screenshot: 'on',
  },

  workers: 1,

  projects: [
    {
      name: 'Google Chrome',
      use: {
        channel: 'chrome',
      }
    }
  ],

  retries: 0

};
export default config;