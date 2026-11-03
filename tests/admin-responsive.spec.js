import { test, expect } from '@playwright/test';
import { loadEnv } from 'vite';

const env = loadEnv('production', process.cwd(), 'VITE_');
const projectUrl = env.VITE_SUPABASE_URL;
if (!projectUrl) throw new Error('VITE_SUPABASE_URL is required for the admin browser test.');
const projectRef = new URL(projectUrl).hostname.split('.')[0];
const storageKey = `sb-${projectRef}-auth-token`;
const testUserId = 'c0a80123-4567-489a-8abc-0123456789ab';
const testCourseId = 'f0a80123-4567-489a-8abc-0123456789ab';
const now = new Date().toISOString();

const mockData = {
  courses: [{ id: testCourseId, title: 'Cours de démonstration', level: 'L1', published: true, created_at: now }],
  resources: [],
  library_items: [],
  announcements: [],
  profiles: [{ id: testUserId, email: 'admin@example.test', full_name: 'Administrateur test', track: 'fullstack', created_at: now }],
  user_roles: [{ user_id: testUserId, role: 'admin' }],
  progress: [],
  audit_logs: [{ id: 'a0a80123-4567-489a-8abc-0123456789ab', user_id: testUserId, action: 'test.open', details: {}, created_at: now }],
};

test('admin layout has no page overflow at supported viewport sizes in light and dark modes', async ({ page }) => {
  test.setTimeout(90_000);
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.route('**/rest/v1/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (request.method() === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'apikey,authorization,content-type,prefer,range',
        },
      });
      return;
    }

    const table = url.pathname.split('/').pop();
    const rows = mockData[table] || [];
    const start = request.headers().range?.split('-')[0] || '0';
    const count = request.method() === 'HEAD' ? rows.length : rows.length;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Range': `${rows.length ? `${start}-${Math.max(Number(start), rows.length - 1)}` : '*'}/${count}`,
      },
      body: request.method() === 'HEAD' ? '' : JSON.stringify(rows),
    });
  });

  await page.addInitScript(({ key, userId }) => {
    if (sessionStorage.getItem('skip-auth-seed') === '1') return;
    const nowSeconds = Math.floor(Date.now() / 1000);
    const session = {
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: nowSeconds + 3600,
      user: {
        id: userId,
        aud: 'authenticated',
        role: 'authenticated',
        email: 'admin@example.test',
        app_metadata: { provider: 'email', providers: ['email'] },
        user_metadata: {},
        created_at: new Date().toISOString(),
      },
    };
    localStorage.setItem(key, JSON.stringify(session));
  }, { key: storageKey, userId: testUserId });

  for (const colorScheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme });
    for (const width of [360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/admin');
      await expect(page.getByRole('heading', { name: 'Vue d’ensemble' })).toBeVisible();
      await expect(page.getByText('Cours de démonstration')).toBeVisible();
      await page.getByRole('button', { name: /Voir les cours/ }).click();
      await expect(page.getByRole('heading', { name: 'Cours' }).last()).toBeVisible();
      await expect(page.getByLabel('Filtrer par niveau')).toBeVisible();
      await expect(page.getByLabel('Filtrer par publication')).toBeVisible();

      const dimensions = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }));
      expect(dimensions.document, `${colorScheme} at ${width}px: document overflow`).toBeLessThanOrEqual(dimensions.viewport);
      expect(dimensions.body, `${colorScheme} at ${width}px: body overflow`).toBeLessThanOrEqual(dimensions.viewport);

      await page.screenshot({
        path: `test-results/admin-${colorScheme}-${width}.png`,
        fullPage: true,
      });
    }
  }

  mockData.user_roles[0].role = 'student';
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Accès refusé' })).toBeVisible();

  mockData.user_roles[0].role = 'editor';
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Accès refusé' })).toBeVisible();
  expect(pageErrors).toEqual([]);

  await page.evaluate(() => sessionStorage.setItem('skip-auth-seed', '1'));
  await page.evaluate(() => localStorage.clear());
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/connexion$/);
});

test('login screen is readable and has no horizontal page overflow across tested sizes', async ({ page }) => {
  for (const colorScheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme });
    for (const width of [360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/connexion');
      await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();
      await expect(page.getByLabel('Adresse e-mail')).toBeVisible();
      await expect(page.getByLabel('Mot de passe')).toBeVisible();
      await expect(page.getByRole('button', { name: /Recevoir un lien de connexion/ })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Continuer avec Google' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Créer un compte' })).toBeVisible();
      const dimensions = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }));
      expect(dimensions.document, `${colorScheme} login at ${width}px`).toBeLessThanOrEqual(dimensions.viewport);
      expect(dimensions.body, `${colorScheme} login at ${width}px`).toBeLessThanOrEqual(dimensions.viewport);
      await page.screenshot({ path: `test-results/login-${colorScheme}-${width}.png`, fullPage: true });

      await page.getByRole('button', { name: 'Créer un compte' }).click();
      await expect(page.getByRole('heading', { name: 'Créer un compte' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'S’inscrire avec Google' })).toBeVisible();
      const signupDimensions = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }));
      expect(signupDimensions.document, `${colorScheme} signup at ${width}px`).toBeLessThanOrEqual(signupDimensions.viewport);
      expect(signupDimensions.body, `${colorScheme} signup at ${width}px`).toBeLessThanOrEqual(signupDimensions.viewport);
    }
  }
});

test('email signup requests account creation and shows email confirmation guidance', async ({ page }) => {
  let signupPayload;
  await page.route('**/auth/v1/signup**', async (route) => {
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
          'Access-Control-Allow-Headers': 'apikey,authorization,content-type,x-client-info',
        },
      });
      return;
    }
    signupPayload = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        id: testUserId,
        aud: 'authenticated',
        role: 'authenticated',
        email: signupPayload.email,
        app_metadata: { provider: 'email', providers: ['email'] },
        user_metadata: {},
        created_at: now,
      }),
    });
  });

  await page.goto('/connexion');
  await page.getByRole('button', { name: 'Créer un compte' }).click();
  await expect(page.getByRole('heading', { name: 'Créer un compte' })).toBeVisible();
  await page.getByLabel('Adresse e-mail').fill('nouveau@example.test');
  await page.getByLabel('Mot de passe').fill('motdepasse-test-123');
  await page.getByRole('button', { name: 'Créer mon compte' }).click();

  await expect(page.getByRole('status')).toContainText('Vérifiez votre boîte e-mail');
  expect(signupPayload).toMatchObject({
    email: 'nouveau@example.test',
    password: 'motdepasse-test-123',
  });
});

test('invalid email/password login explains the likely Google account path', async ({ page }) => {
  await page.route('**/auth/v1/token**', async (route) => {
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
          'Access-Control-Allow-Headers': 'apikey,authorization,content-type,x-client-info',
        },
      });
      return;
    }
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        code: 'invalid_credentials',
        message: 'Invalid login credentials',
      }),
    });
  });

  await page.goto('/connexion');
  await page.getByLabel('Adresse e-mail').fill('utilisateur@example.test');
  await page.getByLabel('Mot de passe').fill('motdepasse-test-123');
  await page.getByRole('button', { name: 'Se connecter' }).click();

  await expect(page.getByRole('alert')).toContainText('Adresse e-mail ou mot de passe incorrect');
  await expect(page.getByRole('alert')).toContainText('utilisez le bouton');
});

test('unconfirmed email account prompts the learner to confirm their address', async ({ page }) => {
  await page.route('**/auth/v1/token**', async (route) => {
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
          'Access-Control-Allow-Headers': 'apikey,authorization,content-type,x-client-info',
        },
      });
      return;
    }
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        code: 'email_not_confirmed',
        message: 'Email not confirmed',
      }),
    });
  });

  await page.goto('/connexion');
  await page.getByLabel('Adresse e-mail').fill('utilisateur@example.test');
  await page.getByLabel('Mot de passe').fill('motdepasse-test-123');
  await page.getByRole('button', { name: 'Se connecter' }).click();

  await expect(page.getByRole('alert')).toContainText('Confirmez votre adresse');
});

test('student password login opens the learning menu instead of administration', async ({ page }) => {
  await page.route('**/auth/v1/token**', async (route) => {
    if (route.request().method() === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
          'Access-Control-Allow-Headers': 'apikey,authorization,content-type,x-client-info',
        },
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        access_token: 'test-access-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'test-refresh-token',
        user: {
          id: testUserId,
          aud: 'authenticated',
          role: 'authenticated',
          email: 'student@example.test',
          app_metadata: { provider: 'email', providers: ['email'] },
          user_metadata: {},
          created_at: now,
        },
      }),
    });
  });
  await page.route('**/rest/v1/**', async (route) => {
    const table = new URL(route.request().url()).pathname.split('/').pop();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Range': '*/0' },
      body: JSON.stringify(table === 'user_roles' ? [{ role: 'student' }] : []),
    });
  });

  await page.goto('/connexion');
  await page.getByLabel('Adresse e-mail').fill('student@example.test');
  await page.getByLabel('Mot de passe').fill('motdepasse-test-123');
  await page.getByRole('button', { name: 'Se connecter' }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('navigation', { name: 'Navigation principale' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Explorer/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Vue d’ensemble' })).toHaveCount(0);
  await expect(page.getByText('Espace administration')).toHaveCount(0);
});

test('Google OAuth starts with the learning site homepage as callback', async ({ page }) => {
  let authorizationUrl;
  await page.route('**/auth/v1/authorize**', async (route) => {
    authorizationUrl = new URL(route.request().url());
    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: '<title>OAuth redirect mocked</title>',
    });
  });

  await page.goto('/connexion');
  await page.getByRole('button', { name: 'Continuer avec Google' }).click();
  await expect(page).toHaveURL(/auth\/v1\/authorize/);
  expect(authorizationUrl.searchParams.get('provider')).toBe('google');
  expect(authorizationUrl.searchParams.get('redirect_to')).toBe('http://127.0.0.1:4173/');
});

test('public pages require authentication before showing published content', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/connexion$/);
  await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();
});

test('authenticated homepage shows only published announcements as escaped text', async ({ page }) => {
  let publishedFilter = '';
  await page.route('**/rest/v1/**', async (route) => {
    const url = new URL(route.request().url());
    const table = url.pathname.split('/').pop();
    if (table === 'announcements') publishedFilter = url.searchParams.get('published') || '';
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Range': '0-0/1' },
      body: JSON.stringify(table === 'user_roles'
        ? [{ role: 'student' }]
        : [{
            id: 'b0a80123-4567-489a-8abc-0123456789ab',
            title: 'Annonce publique de test',
            content: '<img src=x onerror=alert(1)>',
            created_at: new Date().toISOString(),
          }]),
    });
  });

  await page.addInitScript(({ key, userId }) => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    localStorage.setItem(key, JSON.stringify({
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: nowSeconds + 3600,
      user: {
        id: userId,
        aud: 'authenticated',
        role: 'authenticated',
        email: 'student@example.test',
        app_metadata: { provider: 'email', providers: ['email'] },
        user_metadata: {},
        created_at: new Date().toISOString(),
      },
    }));
  }, { key: storageKey, userId: testUserId });

  await page.goto('/');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText('Annonce publique de test')).toBeVisible();
  await expect(page.getByText('<img src=x onerror=alert(1)>')).toBeVisible();
  expect(publishedFilter).toBe('eq.true');
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
});
