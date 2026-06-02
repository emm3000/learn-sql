/**
 * e2e test for the M1.6 IndexedDB snapshot cache HIT path.
 *
 * On the first load PGlite boots from scratch (MISS), seeds the DB, and
 * stores a snapshot in IndexedDB. On reload (same browser context, same
 * IndexedDB origin) PGlite boots from the cached snapshot (HIT), which must
 * produce a fully functional playground identical to the first load.
 *
 * This is the first automated coverage of the cache-hit restore code path.
 */

import { test, expect } from '@playwright/test';

test.describe('M1.6 — snapshot cache HIT path', () => {
  test('playground is ready and queryable after a page reload (cache HIT)', async ({
    page,
  }) => {
    // ------------------------------------------------------------------ //
    // First load — MISS path: seeds the DB and writes snapshot to IDB.    //
    // ------------------------------------------------------------------ //
    await page.goto('/lessons/01-select');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Introduction to SELECT'
    );

    // Wait for the exercise island to mount.
    const exerciseHeader = page.locator('.exercise-header').first();
    await expect(exerciseHeader).toBeVisible();

    // Ensure exercise 1 is expanded so the Playground island mounts.
    const isExpanded = await exerciseHeader.getAttribute('aria-expanded');
    if (isExpanded !== 'true') {
      await exerciseHeader.click();
    }

    // Wait for PGlite to be ready on first load.
    const runBtn = page.getByRole('button', { name: 'Run' });
    await expect(runBtn).toBeEnabled();
    await expect(page.locator('.db-status.db-error')).not.toBeVisible();

    // ------------------------------------------------------------------ //
    // Reload — HIT path: should restore from the IndexedDB snapshot.      //
    // ------------------------------------------------------------------ //
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Introduction to SELECT'
    );

    // Re-locate elements after reload.
    const exerciseHeaderAfterReload = page.locator('.exercise-header').first();
    await expect(exerciseHeaderAfterReload).toBeVisible();

    const isExpandedAfterReload =
      await exerciseHeaderAfterReload.getAttribute('aria-expanded');
    if (isExpandedAfterReload !== 'true') {
      await exerciseHeaderAfterReload.click();
    }

    // PGlite must be ready again after restoring from the cached snapshot.
    const runBtnAfterReload = page.getByRole('button', { name: 'Run' });
    await expect(runBtnAfterReload).toBeEnabled();
    await expect(page.locator('.db-status.db-error')).not.toBeVisible();

    // ------------------------------------------------------------------ //
    // Verify the restored DB is fully functional: run a query.            //
    // ------------------------------------------------------------------ //
    const cmContent = page.locator('.cm-content').first();
    await cmContent.click();
    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.type(
      'SELECT first_name, last_name FROM customers LIMIT 1;'
    );

    await runBtnAfterReload.click();

    // Assert the result table is visible and contains the expected columns.
    const resultTable = page.locator('.result-table');
    await expect(resultTable).toBeVisible();

    const headers = resultTable.locator('thead th');
    await expect(headers.nth(0)).toHaveText('first_name');
    await expect(headers.nth(1)).toHaveText('last_name');

    // At least one row must come back — confirms the seeded data survived
    // the snapshot round-trip.
    const rows = resultTable.locator('tbody tr');
    await expect(rows.first()).toBeVisible();
  });
});
