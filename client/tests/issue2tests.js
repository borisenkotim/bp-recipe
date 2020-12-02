import { Selector } from 'testcafe';

fixture `BP Recipe Tests`
    .page `http://127.0.0.1:8081/index.html`;

//Test to make sure serving count goes up
test('TestAddingServing', async t => {
    await t
        .setNativeDialogHandler(() => true)
        .typeText('#emailInput', 'test@email.com', { replace: true })
        .typeText('#passwordInput', 'Abcd1234', { replace: true })
        .click('#loginBtn')
        .expect(Selector('#recipe-table-page').visible).eql(true)
        .click('#recipe-0')
        .click('#addservingbutton')
        .expect(Selector('#servings').innerText).eql('2')
});

//Test to see calories increase as servings increase
test('TestCaloriesIncrease', async t => {
    await t
        .setNativeDialogHandler(() => true)
        .typeText('#emailInput', 'test@email.com', { replace: true })
        .typeText('#passwordInput', 'Abcd1234', { replace: true })
        .click('#loginBtn')
        .expect(Selector('#recipe-table-page').visible).eql(true)
        .click('#recipe-0')
        .click('#addservingbutton')
        .expect(Selector('#ingredient-0').innerText).eql('220 calories')
});

//Test to remove a serving
test('TestRemoveServing', async t => {
    await t
        .setNativeDialogHandler(() => true)
        .typeText('#emailInput', 'test@email.com', { replace: true })
        .typeText('#passwordInput', 'Abcd1234', { replace: true })
        .click('#loginBtn')
        .expect(Selector('#recipe-table-page').visible).eql(true)
        .click('#recipe-0')
        .click('#addservingbutton')
        .expect(Selector('#servings').innerText).eql('2')
        .click('#removeservingbutton')
        .expect(Selector('#servings').innerText).eql('1')
});

