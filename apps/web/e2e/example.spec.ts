import { test, expect } from "@playwright/test";

test("homepage should load and display content", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Blueprint/);
});
