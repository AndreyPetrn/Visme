import { test, expect, Page } from '@playwright/test';
import { LoginPage          } from "../page-object/login/login.page";
import { UserDataHelper     } from "../helpers/data-helpers/user.data.helper";
import { ProjectsPage       } from "../page-object/my-projects/projects.page";

const user = UserDataHelper.getUser('default_user');
const invalidUser = UserDataHelper.getUser('new_user');
const data = require('../page-object/data-page.json');
let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test("Log in",async ({ page }) => {
  const loginPage = new LoginPage(page);
  const universesNav = new ProjectsPage(page);

  await test.step("Open log in page", async() => {
    await loginPage.openLoginPage();
  });

  await test.step("Log in using only email", async() => {
    await loginPage.fillUserData('email', await user);
    await loginPage.clickLogin();
  });

  await test.step("Check the message about an empty password field", async() => {
    await expect(await loginPage.errorMessage).toHaveText(data.LogIn.passwordRequired);
    await loginPage.clearEmailField();
  });

  await test.step("Log in using only password", async() => {
    await loginPage.fillUserData('password', await user);
    await loginPage.clickLogin();
  });

  await test.step("Check the message about an empty email field", async() => {
    await expect(await loginPage.errorMessage).toHaveText(data.LogIn.emailRequired);
  });

  await test.step("Log in using invalid data", async() => {
    await loginPage.fillUserData('email', await invalidUser);
    await loginPage.fillUserData('password', await invalidUser);
    await loginPage.clickLogin();
  });

  await test.step("Check the message about an empty email field", async() => {
    await expect(await loginPage.errorMessage).toHaveText(data.LogIn.invalidEmailOrPassword);
  });

  await test.step("Log in using valid data", async() => {
    await loginPage.fillUserData('email', await user);
    await loginPage.fillUserData('password', await user);
    await loginPage.clickLogin();
  });

  await test.step("Check that the user is logged in", async() => {
    await universesNav.waitForPageTitle();
    await expect(await universesNav.titlePage).toHaveText(data.Projects.title);
  });
});