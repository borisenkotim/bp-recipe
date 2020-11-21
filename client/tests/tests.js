import { Selector } from 'testcafe';

fixture `BP Recipe Tests`
    .page `http://127.0.0.1:8081/index.html`;


//Test to check login page displayed first
test('TestLoginPageDisplay', async t => {
    await t
        .setNativeDialogHandler(() => true)
        .expect(Selector('#login-mode-div').visible).eql(true)
});

//Test to make sure logging in works
test('TestLoggingIn', async t => {
    await t
        .setNativeDialogHandler(() => true)
        .typeText('#emailInput', 'test@email.com', { replace: true })
        .typeText('#passwordInput', 'Abcd1234', { replace: true })
        .click('#loginBtn')
        .expect(Selector('#recipe-table-page').visible).eql(true)
});

//Test to make sure logging in works
test('TestFilteringRecipes', async t => {
    await t
        .setNativeDialogHandler(() => true)
        .typeText('#emailInput', 'test@email.com', { replace: true })
        .typeText('#passwordInput', 'Abcd1234', { replace: true })
        .click('#loginBtn')
        .expect(Selector('#recipe-table-page').visible).eql(true)
        .typeText('#filterSearch', 'Recipes', { replace: true })
        .click('#searchButton')
        .typeText('#searchBar', 'NoResult', { replace: true })
        .expect(Selector('#norecipes').visible).eql(true)
});

//Test to make sure logging in works
test('TestFilteringIngredients', async t => {
    await t
        .setNativeDialogHandler(() => true)
        .typeText('#emailInput', 'test@email.com', { replace: true })
        .typeText('#passwordInput', 'Abcd1234', { replace: true })
        .click('#loginBtn')
        .expect(Selector('#recipe-table-page').visible).eql(true)
        .typeText('#filterSearch', 'Ingredients', { replace: true })
        .click('#searchButton')
        .typeText('#searchBar', 'NoResult', { replace: true })
        .expect(Selector('#norecipes').visible).eql(true)
});
