import { test, expect } from '@playwright/test';

test.describe('Lesson 01 — SELECT smoke test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lessons/01-select');

    // Verify we landed on the right page
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Introduction to SELECT'
    );

    // The exercises are rendered by a client:only Svelte island.
    // Wait for the island to mount by waiting for the exercise header to appear.
    const exerciseHeader = page.locator('.exercise-header').first();
    await expect(exerciseHeader).toBeVisible();

    // Exercise 1 opens by default (openIndex = 0), but the Playground island
    // inside may need a moment to mount. Click to ensure it opens, then wait.
    const cmContent = page.locator('.cm-content').first();
    const isVisible = await cmContent.isVisible().catch(() => false);
    if (!isVisible) {
      // If it's already open (aria-expanded=true) we close then reopen to force mount.
      const isExpanded = await exerciseHeader.getAttribute('aria-expanded');
      if (isExpanded === 'true') {
        // Already open but cm-content not found yet — just wait a tick more
        await page.waitForTimeout(500);
      } else {
        await exerciseHeader.click();
      }
    }

    // Wait for CodeMirror to render
    await expect(cmContent).toBeVisible();

    // Wait for PGlite to boot: Run button must be enabled and no DB error.
    const runBtn = page.getByRole('button', { name: 'Run' });
    await expect(runBtn).toBeEnabled();
    await expect(page.locator('.db-status.db-error')).not.toBeVisible();
  });

  test('grade path: correct SQL gets "Correct! Well done."', async ({ page }) => {
    // Set editor content via CM6-safe approach: click → select-all → type
    const cmContent = page.locator('.cm-content').first();
    await cmContent.click();
    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.type('SELECT first_name, last_name, email FROM customers;');

    // Click Grade
    const gradeBtn = page.getByRole('button', { name: 'Grade' });
    await gradeBtn.click();

    // Assert grade pass
    const gradePass = page.locator('.grade-pass');
    await expect(gradePass).toBeVisible();
    await expect(gradePass).toContainText('Correct! Well done.');
  });

  test('run path: query returns result table with correct columns and rows', async ({
    page,
  }) => {
    // Set editor content
    const cmContent = page.locator('.cm-content').first();
    await cmContent.click();
    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.type(
      'SELECT first_name, last_name, email FROM customers LIMIT 5;'
    );

    // Click Run
    const runBtn = page.getByRole('button', { name: 'Run' });
    await runBtn.click();

    // Assert result table is visible
    const resultTable = page.locator('.result-table');
    await expect(resultTable).toBeVisible();

    // Assert column headers
    const headers = resultTable.locator('thead th');
    await expect(headers.nth(0)).toHaveText('first_name');
    await expect(headers.nth(1)).toHaveText('last_name');
    await expect(headers.nth(2)).toHaveText('email');

    // Assert at least one data row
    const rows = resultTable.locator('tbody tr');
    await expect(rows).toHaveCount(4); // customers table has exactly 4 rows
  });
});
