import {test, expect} from '@playwright/test';

// TODO: Improve test design using Page object models
// TODO: Seperate utility methods and constants
test.describe('Azure Video Indexer Tests', () => {

  test.beforeEach(async ({ page }) => {  
    await page.goto('https://videoindexer.ai');
  });

  test('User Story 1 – Add A Video', async ({page}) => {
    
      await page.click('id=galleryUploadtabs');

      // The page allows the selection of a file for uploading or the user can supply a url to a video for indexing
      const elementHandle = await page.waitForSelector('id=enterUrlAction');
      const isVisible = await elementHandle.isVisible();

      await page.click('id=browseForFileAction');

      // Replace '[your_videoPath]' with the path to your video
      const videoPath = '[your_videoPath]';
      const inputSelector = 'input[type="file"]';
      await page.setInputFiles(inputSelector, videoPath);

      // The page allows privacy to be set for the video insight to Public
      const privacySelector = 'div#indexingPrivacy p-dropdown'; 
      const privacyToSelect = 'Public'; 

      await page.waitForSelector(privacySelector);
      await page.click(privacySelector);

      const priSelector = `${privacySelector} li[aria-label="${privacyToSelect}"]`;
      await page.click(priSelector);

      // The video source language can be specific to Chinese (Simplified)
      const lanSelector = 'div#indexingLanguage p-dropdown'; 
      const lanToSelect = 'Chinese (Simplified)'; 

      await page.waitForSelector(lanSelector);
      await page.click(lanSelector);

      const indexingLanguageInput = await page.$(lanSelector);
      if (indexingLanguageInput) {
        await indexingLanguageInput.type(lanToSelect);
      }

      const optionSelector = `${lanSelector} li[aria-label="${lanToSelect}"]`;
      await page.click(optionSelector);

      // An advanced options section should be able to to allow user to choose additional options for uploading
      await page.click('id=advancedSettingsButton');
      await page.click('id=backToBasic');

      // Clicking the upload button will start the indexing process
      await page.locator('.c-checkbox').click();
      await page.click('id=uploadButtonAction');
      await expect(page.locator('.progress-title')).toBeVisible();
      await page.click('id=close');
      
      // TODO: remove hard code since time for video indexing to complete is unkown
      test.setTimeout(120000);
      
      // A notification is received when indexing has completed and the video will be visible in your Library

      // TODO: improve logic to identify success or failure
       const toastContainerSelector = 'id=toast-container'; 
       await page.waitForSelector(toastContainerSelector);
       await expect(page.locator(toastContainerSelector)).toBeVisible();
  });

  test('User Story 2 – View Video Insights', async ({page}) => {

    //TODO: Remove hard code of video title
    await page.locator('[title=TWVB]').first().click();

    //TODO: Handle video which might not have any insights detected.
    const insightsHandle = await page.waitForSelector('id=capsuleListItemId1_labels_undefined');
    const isVisible = await insightsHandle.isVisible();

    // There should be an option to download the completed insights in 3 formats
    await page.click('id=download-insights');
    const ulSelector = 'id=submenu-download-insights'; 
    const ulElement = await page.waitForSelector(ulSelector);
    const liElements = await ulElement.$$('li');

    const expectedOptions = [
      'Insights (JSON)',
      'Artifacts (ZIP)',
      'Source video',
      'Closed captions'
    ];
    
    for (const li of liElements) {
      const option = await li.innerText();
      // for debugging
      // console.log(text); 
      await expect(expectedOptions).toContain(option);
    }

});

  test('User Story 3 – Search Videos with Insights', async ({page}) => {

    // The page displays a search box where a search query can be entered
    const searchSelector = 'id=viFilterSearchInput'; 
    await page.click(searchSelector);
        
    // Clicking ‘Search’ will perform the search query and display relevant search results
    const searchInput = await page.$(searchSelector);
    const searchText = 'shoes';
    if (searchInput) {
      await searchInput.type(searchText);
      await page.press(searchSelector, 'Enter');
    }

    // When a search is performed, the page will display a listing of videos that have been indexed
    const resultSelector = '.highlight'; 
    const resultContent = await page.textContent(resultSelector);
    expect(resultContent).toBe(searchText);

    // The search query bar allows the filtering of search results 
    const filterSelector = 'id=filterGalleryButton'; 
    await page.click(filterSelector);

    const scopeSelector = 'id=scope-filter-id'; 
    const scopeHandle = await page.$(scopeSelector);
    
    if (scopeHandle) {
      const isVisible = await scopeHandle.isVisible();
      expect(isVisible).toBe(true); 
    } 

    // TODO: improve logic to identify dynamic num of 4
    const insightSelector = 'id=filterActions_4';  
    const insightHandle = await page.$(insightSelector);
    
    if (insightHandle) {
      const isVisible = await insightHandle.isVisible();
      expect(isVisible).toBe(true);
    } 

    // Users can toggle between a tiled view and list view
    const viewSelector = 'id=gallery-view-menu'; 
    await page.click(viewSelector);

    const listToSelect = 'id=list-view'; 
    await page.click(listToSelect);

    await page.click(viewSelector);
          
    const gridToSelect = 'id=grid-view'; 
    await page.click(gridToSelect);

});

  test.afterEach(async ({ page,context }) => {
    await page.close();
    await context.close();
});
  
});
