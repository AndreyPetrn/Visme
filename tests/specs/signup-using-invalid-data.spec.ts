import { test, Page, expect } from '@playwright/test';
import { LoginPage          } from "../page-object/login/login.page";
import { UserDataHelper     } from "../helpers/data-helpers/user.data.helper";

const oldUser = UserDataHelper.getUser('aut_user');
const signUpData = require('../page-object/data-page.json').LogIn.SignUp;
let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
});

test.afterAll(async () => {
    await page.close();
});

test("Sign up using invalid data",async ({page}) => {
    const loginPage = new LoginPage(page);

    await test.step("Open log in page", async() => {
        await loginPage.openLoginPage();
    });

    await test.step("Go to registration", async() => {
        await loginPage.clickRegister();
        await loginPage.clickLogin();
    });

    await test.step("Try creating a new user without filling in any data", async() => {
        await loginPage.clickLogin();
        await expect(await loginPage.errorMessage).toHaveText(signUpData.requiredName);
        await expect(await loginPage.validationErrorCount()).toBe(2);
    });

    await test.step("Try creating a new user by filling in the name only", async() => {
        await loginPage.fillUserData('name', await oldUser);
        await loginPage.clickLogin();
        await expect(await loginPage.errorMessage).toHaveText(signUpData.requiredEmail);
        await expect(await loginPage.validationErrorCount()).toBe(1);
    });

    await test.step("Try creating a new user without filling in the password field", async() => {
        await loginPage.fillUserData('name', await oldUser);
        await loginPage.fillUserData('email', await oldUser);
        await loginPage.clickLogin();
        await expect(await loginPage.errorMessage).toHaveText(signUpData.requiredPassword);
        await expect(await loginPage.validationErrorCount()).toBe(0);
    });

    await test.step("Check the password tips", async() => {
        await loginPage.fillWrongPassword(signUpData.Password.sequences);
        await expect(await loginPage.passwordTip).toHaveText(signUpData.Password.sequencesMessage);

        await loginPage.fillWrongPassword(signUpData.Password.repeats);
        await expect(await loginPage.passwordTip).toHaveText(signUpData.Password.repeatsMessage);

        await loginPage.fillWrongPassword(signUpData.Password.ease);
        await expect(await loginPage.passwordTip).toHaveText(signUpData.Password.easeMessage);

        await loginPage.fillWrongPassword(signUpData.Password.top);
        await expect(await loginPage.passwordTip).toHaveText(signUpData.Password.topMessage);

        await loginPage.fillWrongPassword(signUpData.Password.short);
        await expect(await loginPage.passwordTip).toHaveText(signUpData.Password.shortMessage);

        await loginPage.fillWrongPassword(signUpData.Password.popular);
        await expect(await loginPage.passwordTip).toHaveText(signUpData.Password.popularMessage);

        await loginPage.fillWrongPassword(signUpData.Password.commonlyUsed);
        await expect(await loginPage.passwordTip).toHaveText(signUpData.Password.commonlyUsedMessage);
    });

    await test.step("Try creating a new user using the old user's data", async() => {
        await loginPage.fillUserData('password', await oldUser);
        await loginPage.clickLogin();
    });

    await test.step("Fill in the registration code", async() => {
        await loginPage.fillRegistrationCode(await oldUser);
        await loginPage.clickLogin();
    });

    await test.step("Check that the user cannot use the mail for re-registration", async() => {
        await expect(await loginPage.registeredWarningMessage).toHaveText(signUpData.reRegistrationImpossible);
    });
});