import { Locator, Page } from '@playwright/test';
import { CommonHelper  } from "../common.helper";
import { EmailHelper   } from "../../helpers/api-helpers/email.helper";

const data = require('../../../config/config.data.json');

export class LoginPage {

    readonly page: Page;
    readonly loginBtn: Locator;
    readonly errorMessage: Locator;
    readonly registerBtn: Locator;
    readonly forgotPasswordBtn: Locator;
    readonly codeEntered: Locator;
    readonly resetPasswordMessage: Locator;
    readonly registeredWarningMessage: Locator;
    readonly passwordTip: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginBtn = page.locator('.login-btn');
        this.errorMessage = page.locator('.error-message');
        this.registerBtn = page.locator('.register');
        this.forgotPasswordBtn = page.locator('.restore.right');
        this.codeEntered = page.locator('.pin-code.ok');
        this.resetPasswordMessage = page.locator('.el-message__content');
        this.registeredWarningMessage = page.locator('.email-registered-warning div');
        this.passwordTip = page.locator('.tip');
    };

    private input(value: string) {
        return this.page.locator(`h4 + div [type="${value}"]`);
    };

    async openLoginPage(): Promise<void> {
        await this.page.goto(data.LOGIN.URL, {waitUntil: "load"});
    };

    async validationErrorCount(): Promise<number> {
        return (await this.page.$$('.validation-error')).length;
    }

    async fillUserData(value: string, user: any): Promise<void> {
        let input, userData;
        switch (value) {
            case 'name':
                input = this.input('text');
                userData = user.username;
                break
            case 'email':
                input = this.input('email');
                userData = user.email;
                break
            case 'password':
                input = this.input('password');
                userData = user.password;
                break
            default:
                throw new Error(`Cannot find value! - ${value}`);
        }
        await CommonHelper.setValue(await input, await userData);
    };

    async clickLogin(): Promise<void> {
        await this.loginBtn.click();
    };

    async clickRegister(): Promise<void> {
        await this.registerBtn.click();
    };

    async clickForgotPassword(): Promise<void> {
        await this.forgotPasswordBtn.click();
    };

    async clearEmailField(): Promise<void> {
        const emailInput = this.input('email');
        await emailInput.click({clickCount: 3});
        await emailInput.press('Backspace');
    };

    async fillRegistrationCode(user: any): Promise<void> {
        await this.page.waitForTimeout(2000); // wait for the email
        await (await this.input('text').first()).type(await EmailHelper.getEmailCode(await user, 'signup'));
        await CommonHelper.waitForLocator(this.codeEntered);
    };

    async openEmailLink(user: any): Promise<void> {
        await this.page.waitForTimeout(2000); // wait for the email
        const hash = (await EmailHelper.getEmailCode(await user, 'reset password')).replace(/=[\s\S]*?\n/g, '');
        await this.page.goto(data.RESETPASSWORD.URL + hash);
    };

    async fillWrongPassword(value: string): Promise<void> {
        await CommonHelper.setValue(await this.input('password'), value);
    };
}