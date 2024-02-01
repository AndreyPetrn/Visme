import { Page, test     } from '@playwright/test';
import { LoginPage      } from "../page-object/login/login.page";
import { UserDataHelper } from "../helpers/data-helpers/user.data.helper";
import { ProjectsPage   } from "../page-object/my-projects/projects.page";

const newUser = UserDataHelper.getUser('new_user');
let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
});

test.afterAll(async () => {
    await page.close();
});

test("Sign up",async ({page}) => {
    const loginPage = new LoginPage(page);
    const universesNav = new ProjectsPage(page);

    await test.step("Open log in page", async() => {
        await loginPage.openLoginPage();
    });

    await test.step("Go to registration", async() => {
        await loginPage.clickRegister();
        await loginPage.clickLogin();
    });

    await test.step("Fill in the data for registration", async() => {
        await loginPage.fillUserData('name', await newUser);
        await loginPage.fillUserData('email', await newUser);
        await loginPage.fillUserData('password', await newUser);
        await loginPage.clickLogin();
    });

    await test.step("Fill in the registration code", async() => {
        await loginPage.fillRegistrationCode(await newUser);
        await loginPage.clickLogin();
    });

    await test.step("Check that the user is registered and logged into the account", async() => {
        await universesNav.waitForSegmentationPopup();
    });
});