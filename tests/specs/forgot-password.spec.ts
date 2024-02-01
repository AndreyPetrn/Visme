import { expect, Page, test } from '@playwright/test';
import { LoginPage          } from "../page-object/login/login.page";
import { UserDataHelper     } from "../helpers/data-helpers/user.data.helper";
import { ProjectsPage       } from "../page-object/my-projects/projects.page";

const user = UserDataHelper.getUser('aut_user');
const data = require('../page-object/data-page.json');
let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
});

test.afterAll(async () => {
    await page.close();
});

test("Forgot password",async ({page}) => {
    const loginPage = new LoginPage(page);
    const universesNav = new ProjectsPage(page);

    await test.step("Open log in page", async() => {
        await loginPage.openLoginPage();
    });

    await test.step("Go to forgot password", async() => {
        await loginPage.clickForgotPassword();
    });

    await test.step("Fill in the email to reset password", async() => {
        await loginPage.fillUserData('email', await user);
        await loginPage.clickLogin();
        await expect(await loginPage.resetPasswordMessage).toHaveText(data.LogIn.ForgotPassword.resetPassword);
    });

    await test.step("Open the link from the email", async() => {
        await loginPage.openEmailLink(await user);
    });

    await test.step("Reset password", async() => {
        await universesNav.waitForResetPasswordContainer();
        await universesNav.fillNewPassword(await user);
        await universesNav.clickUpdatePassword();
        // await expect(await universesNav.passwordUpdatedMessage).toHaveText(data.LogIn.passwordUpdated); - todo - the message fades quickly
    });

    await test.step("Log in using new password", async() => {
        await loginPage.fillUserData('email', await user);
        await loginPage.fillUserData('password', await user);
        await loginPage.clickLogin();
    });

    await test.step("Check that the user is logged in", async() => {
        await universesNav.waitForPageTitle();
        await expect(await universesNav.titlePage).toHaveText(data.Projects.title);
    });
});