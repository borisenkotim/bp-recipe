import { Selector } from 'testcafe';
fixture `BP Recipe Tests`
    .page `http://127.0.0.1:8081/index.html`;


test('TestGroceryManagement', async t => {

    const table = Selector('#groceryTable');
    await t
    .setNativeDialogHandler(() => true)
    .typeText('#emailInput', 'test@email.com', { replace: true })
    .typeText('#passwordInput', 'Abcd1234', { replace: true })
    .click('#loginBtn')
    .wait(1000)
    .click('#groceryNav')
    .click('#Header1')
    .wait(1000)
    .expect(Selector('#pantryTablePage').visible).eql(true)
    .expect(Selector('#groceryTablePage').visible).eql(true)
    .click('#groceryButton')
    .wait(1000)
    .typeText('#name', 'lettuce', {replace: true})
    .typeText('#calories', '100', {replace: true})
    .typeText('#pictureURL', 'N/A', {replace: true})
    .typeText('#quantity', '10', {replace: true})
    .typeText('#unit', 'kg', {replace: true})
    .typeText('#expiration', '12/20/2020', {replace: true})
    .click('#pantrySubmit')
    .wait(1000)
    .expect(Selector('#pantryTablePage').visible).eql(true)
    .expect(Selector('#groceryTablePage').visible).eql(true)
    .expect(table.find('#tableRow-0').find('td').nth(0).textContent).eql("lettuce")
})

test('TestGroceryDeletion', async t => {

    const table = Selector('#groceryTable');
    await t
    .setNativeDialogHandler(() => true)
    .typeText('#emailInput', 'test@email.com', { replace: true })
    .typeText('#passwordInput', 'Abcd1234', { replace: true })
    .click('#loginBtn')
    .wait(1000)
    .click('#groceryNav')
    .click("#Header1")
    .wait(1000)
    .expect(Selector('#pantryTablePage').visible).eql(true)
    .expect(Selector('#groceryTablePage').visible).eql(true)
    .wait(1000)
    .click("#button-0")
    .wait(1000)
    .expect(table.find('#tableRow-0').exists).eql(false)
})

test('TestPantryManagement', async t => {

    const table = Selector('#pantryTable');
    await t
    .setNativeDialogHandler(() => true)
    .typeText('#emailInput', 'test@email.com', { replace: true })
    .typeText('#passwordInput', 'Abcd1234', { replace: true })
    .click('#loginBtn')
    .wait(1000)
    .click('#groceryNav')
    .click("#Header1")
    .wait(1000)
    .expect(Selector('#pantryTablePage').visible).eql(true)
    .expect(Selector('#groceryTablePage').visible).eql(true)
    .wait(1000)
    .click(Selector('#pantryButton'))
    .typeText('#name', 'lettuce', {replace: true})
    .typeText('#calories', '100', {replace: true})
    .typeText('#pictureURL', 'N/A', {replace: true})
    .typeText('#quantity', '10', {replace: true})
    .typeText('#unit', 'kg', {replace: true})
    .typeText('#expiration', '12/20/2020', {replace: true})
    .click('#pantrySubmit')
    .wait(1000)
    .expect(Selector('#pantryTablePage').visible).eql(true)
    .expect(Selector('#groceryTablePage').visible).eql(true)
    .expect(table.find('#tableRow-0').find('td').nth(0).textContent).eql("lettuce")
    .click(Selector('#button2-0'))
    .typeText('#name', 'carrots', {replace: true})
    .typeText('#calories', '100', {replace: true})
    .typeText('#pictureURL', 'N/A', {replace: true})
    .typeText('#quantity', '10', {replace: true})
    .typeText('#unit', 'kg', {replace: true})
    .typeText('#expiration', '12/20/2020', {replace: true})
    .click('#pantrySubmit')
    .wait(1000)
    .expect(Selector('#pantryTablePage').visible).eql(true)
    .expect(Selector('#groceryTablePage').visible).eql(true)
    .expect(table.find('#tableRow-0').find('td').nth(0).textContent).eql("carrots")
})
 
test('TestPantryDeletion', async t => {

    const table = Selector('#pantryTable');
    await t
    .setNativeDialogHandler(() => true)
    .typeText('#emailInput', 'test@email.com', { replace: true })
    .typeText('#passwordInput', 'Abcd1234', { replace: true })
    .click('#loginBtn')
    .wait(1000)
    .click('#groceryNav')
    .click("#Header1")
    .wait(1000)
    .expect(Selector('#pantryTablePage').visible).eql(true)
    .expect(Selector('#groceryTablePage').visible).eql(true)
    .wait(1000)
    .click("#button3-0")
    .wait(1000)
    .expect(table.find('#tableRow-0').exists).eql(false)
})