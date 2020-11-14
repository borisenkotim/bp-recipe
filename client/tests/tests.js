import { Selector } from 'testcafe';

fixture `BP Recipe Tests`
    .page `http://127.0.0.1:8081/index.html`;


//Test to check login page displayed first
test('TestLoginPageDisplay', async t => {
    await t
        .setNativeDialogHandler(() => true)
        .expect(Selector('#login-mode-div').visible).eql(true)
});

// //Test to make sure logging in works
// test('TestLoggingIn', async t => {
//     await t
//         .setNativeDialogHandler(() => true)
//         .expect(Selector('#login-mode-div').visible).eql(true)
//         .typeText('#emailInput', 'test@email.com', { replace: true })
//         .typeText('#passwordInput', '12345678', { replace: true })
//         .click('#submitButton')
//         .expect(Selector('#loginpage').visible).eql(false)
//         .expect(Selector('#mealstablepage').visible).eql(true)
// });

// //Test to make sure default location weather is displayed
// test('FloatingButtonActive', async t => {
//     await t
//     .setNativeDialogHandler(() => true)
//     .expect(Selector('#login-mode-div').visible).eql(true)
//     .typeText('#emailInput', 'test@email.com', { replace: true })
//     .typeText('#passwordInput', '12345678', { replace: true })
//     .click('#submitButton')
//     .expect(Selector('#floatbutton').visible).eql(true)
// });

// //Test to see if modal shows after clicking add
// test('SideMenuExpands', async t => {
//     await t
//         .setNativeDialogHandler(() => true)
//         .expect(Selector('#login-mode-div').visible).eql(true)
//         .typeText('#emailInput', 'test@email.com', { replace: true })
//         .typeText('#passwordInput', '12345678', { replace: true })
//         .click('#submitButton')
//         .wait(5000) //wait 5 seconds for page to load
//         .click('#menuBtnIcon')
//         .expect(Selector('#sidemenupage').visible).eql(true)
// });

// //Test to confirm adding a location displays another weather jumbotron
// test('AddNewMealPage', async t => {
//     await t
//     .setNativeDialogHandler(() => true)
//     .expect(Selector('#login-mode-div').visible).eql(true)
//     .typeText('#emailInput', 'test@email.com', { replace: true })
//     .typeText('#passwordInput', '12345678', { replace: true })
//     .click('#submitButton')
//     .wait(5000)
//     .click('#floatbutton')
//     .expect(Selector('#mealformpage').visible).eql(true)
// });

// test('AddingNewMeal', async t => {
//     await t
//     .setNativeDialogHandler(() => true)
//     .expect(Selector('#login-mode-div').visible).eql(true)
//     .typeText('#emailInput', 'test@email.com', { replace: true })
//     .typeText('#passwordInput', '12345678', { replace: true })
//     .click('#submitButton')
//     .wait(5000)
//     .click('#floatbutton')
//     .typeText('#mealname', 'temporary meal name', { replace: true })
//     .typeText('#mealcalories', '123', { replace: true })
//     .click('#submitMeal')
//     .expect(Selector('#edit-1').visible).eql(true)
// });

// test('DeletingMeal', async t => {
//     await t
//     .setNativeDialogHandler(() => true)
//     .expect(Selector('#login-mode-div').visible).eql(true)
//     .typeText('#emailInput', 'test@email.com', { replace: true })
//     .typeText('#passwordInput', '12345678', { replace: true })
//     .click('#submitButton')
//     .wait(5000)
//     .click('#floatbutton')
//     .typeText('#mealname', 'temporary meal name', { replace: true })
//     .typeText('#mealcalories', '123', { replace: true })
//     .click('#submitMeal')
//     .wait(5000)
//     .click('#delete-1')
//     .expect(Selector('#edit-1').visible).eql(false)
// });
