import { Selector, ClientFunction } from 'testcafe'
import {ReactSelector, waitForReact} from 'testcafe-react-selectors'

const search = ReactSelector('App Search')

fixture `App Test`.page `localhost`.beforeEach(async()=>{await waitForReact()})

test('test app', async t => {
    await t.click('.RecipeSearch')
    .expect(Selector('.RecipeMenu').visible).eql(true)
})

test('test view recipe page', async t =>{

    const recipeSearch = search.findReact('ViewRecipePage')
    
    await t
    .click(recipeSearch)
    .expect(recipeSearch.find('.recipeMenu').visible).eql(true)
    .click(recipeSearch.find('select'))
})