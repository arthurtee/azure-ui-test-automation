# azure-ui-test-automation

This project aims to automate user stories on Azure Video Indexer cloud application. 

## Below tools are being used:
* [visualstudio](https://code.visualstudio.com/)
* [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright).


## How to run?
1) After Cloned the project, install Playwright and documentation can be found [here](https://playwright.dev/docs/getting-started-vscode)
```npm init playwright@latest```  

2) Login to your account in [Azure Video Indexer](https://videoindexer.ai). 

3) Locate your session value and update in tests/auth.setup.ts.

4) Update resource folder with videos to upload and replace '[your_videoPath]' in tests/azure.spec.ts

5) Run your tests with the below CMD:
    * CMD to run tests with the browser's UI: ```npx playwright test --headed```
    * CMD to run tests without loading the browser's UI: ```npx playwright test```