import { Locator, Page, ElementHandle } from '@playwright/test';
import { CommonHelper                 } from "../common.helper";

export class ProjectsPage {
    readonly page: Page;
    readonly titlePage: Locator;
    readonly segmentationPopup: Locator;
    readonly updatePasswordContainer: Locator;
    readonly updatePasswordBtn: Locator;
    readonly passwordUpdatedMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.titlePage = page.locator('.current-section');
        this.segmentationPopup = page.locator('.segmentation-popup');
        this.updatePasswordContainer = page.locator('[aria-label="Please Update Your Password"]');
        this.updatePasswordBtn = page.locator('.buttons .el-button--primary');
        this.passwordUpdatedMessage = page.locator('.el-message__content');
    };

    private async resetPasswordInput(): Promise<ElementHandle<Element>[]> {
        return await this.page.$$('[type="password"]');
    }

    async waitForPageTitle(): Promise<void> {
        await CommonHelper.waitForLocator(this.titlePage);
    };

    async waitForSegmentationPopup(): Promise<void> {
        await CommonHelper.waitForLocator(this.titlePage);
    };

    async waitForResetPasswordContainer(): Promise<void> {
        await CommonHelper.waitForLocator(this.updatePasswordContainer);
    };

    async fillNewPassword(user: any): Promise<void> {
        const inputFields = await this.resetPasswordInput();
        await inputFields[0].type(user.password);
        await inputFields[1].type(user.password);
    }

    async clickUpdatePassword(): Promise<void> {
        await this.updatePasswordBtn.click();
    };
}