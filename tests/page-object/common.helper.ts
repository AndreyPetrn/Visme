import { Locator } from "@playwright/test";

export abstract class CommonHelper {

    static async setValue(element: Locator, value: string): Promise<void> {
        await element.click({clickCount: 3});
        await element.press('Backspace');
        await element.click();
        await element.type(value);
    }

    static async waitForLocator(element: Locator): Promise<void> {
        await element.waitFor({ state: "visible", timeout: 10000 })
    };
}