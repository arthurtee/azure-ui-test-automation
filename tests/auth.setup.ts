import { BrowserContext, test as setup, chromium , expect} from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

async function createAuthenticatedContext(sessionValue: string): Promise<BrowserContext> {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      storageState: {
        cookies: [
          {
            name: 'vi.session',  
            value: sessionValue,
            domain: 'www.videoindexer.ai', 
            path: '/',
            expires: -1,
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
          },
        ],
      },
    });
  
    return context;
  }

setup('authenticate', async () => {

    // TODO: update '...' with your account sessionValue after login.
    const sessionValue = '...';

    const context = await createAuthenticatedContext(sessionValue);

    const page = await context.newPage();

    await page.goto('https://videoindexer.ai');

    await page.context().storageState({ path: authFile });

    const elementHandle = await page.waitForSelector('id=userButton');
    const isVisible = await elementHandle.isVisible();

    await page.context().storageState({ path: authFile });
});

