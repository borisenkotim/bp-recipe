import React from 'react'

// each button the user will be able to click on to sort
class SortBtn extends React.Component {
    constructor(props){
        super(props)
    }

    // keeps track of if sorting is ascending or descending
    asc = true
    
    onClick = () => {
        if (this.props.selected)
            this.asc = !this.asc // toggle asc

        // call the parents onClick function and the sort function for this button
        this.props.onClick()
        this.props.sortFunction(this.asc)
    }

    // styling in index.css for selected and visible
    render() {
        this.asc = !this.props.selected ? true : this.asc
        return (
            <button
                className={`recipe-sort-button ${this.props.icon}${this.asc ? this.props.switch[0] : this.props.switch[1]}` + 
                            `${this.props.selected ? " selected" : ""}` + 
                            `${this.props.visible ? " visible" : ""}`}
                onClick={this.onClick}
                disabled={!this.props.visible}
            />
        )
    }
}

// wrapper component for sorting buttons 
class RecipeSort extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedSort: null,
            visible: false
        }
    }

    // sorts by the name of the recipes
    nameSort = (asc) => {
        // create a deep copy of the recipe list
        let recipes = [...this.props.recipeList]
        
        recipes.sort((a, b) =>{
            let nameA = a.name.toLowerCase();
            let nameB = b.name.toLowerCase();
            
            let result = 0
            if(nameA < nameB)
                result = -1
            if(nameA > nameB)
                result = 1
            if(!asc) // flip the order if sorting is descending
                result *= -1
            
            return result
        })

        // update recipes in recipe table to reflect sorted list
        this.props.updateFilteredRecipes(recipes)
    }

    // sorts by the time of the recipes
    timeSort = (asc) => {
        // create a deep copy of the recipe list
        let recipes = [...this.props.recipeList]
        
        recipes.sort((a, b) => {
            let timeA = a.cookTime;
            let timeB = b.cookTime;

            let result = 0
            if (timeA < timeB)
                result = -1
            if (timeA > timeB)
                result = 1
            if (!asc) // flip the order if sorting is descending
                result *= -1

            return result
        })

        // update recipes in recipe table to reflect sorted list
        this.props.updateFilteredRecipes(recipes)
    }

    // sorts by whether a recipe is favorited or not
    favoriteSort = (asc) => {
        // create a deep copy of the recipe list
        let recipes = [...this.props.recipeList]

        recipes.sort((a, b) => {
            let favA = a.favorited;
            let favB = b.favorited;

            let result = 0
            if (favA && !favB)
                result = -1
            if (!favA && favB)
                result = 1
            if (!asc) // flip the order if sorting is descending
                result *= -1

            return result
        })

        // update recipes in recipe table to reflect sorted list
        this.props.updateFilteredRecipes(recipes)
    }

    // switches the selected sort button index on click 
    onBtnClick = (btnIndex) => {
        this.setState({selectedSort: btnIndex})
    }

    // toggles the visibility of the sort buttons (animated in css)
    toggleVisible = () => {
        this.setState(prevState => ({ visible: !prevState.visible }))
    }

    render() {
        return (
            <div style={{display: "inline-block", float: "right"}}>
                <SortBtn
                    selected={this.state.selectedSort === 0}
                    icon="fa fa-sort-alpha"
                    switch={["-asc", "-desc"]}
                    onClick={() => { this.onBtnClick(0) }}
                    sortFunction={this.nameSort}
                    visible={this.state.visible}
                />
                <SortBtn
                    selected={this.state.selectedSort === 1}
                    icon="custom-icon-sort-time"
                    switch={["-asc", "-desc"]}
                    onClick={() => { this.onBtnClick(1) }}
                    sortFunction={this.timeSort}
                    visible={this.state.visible}
                />
                <SortBtn
                    selected={this.state.selectedSort === 2}
                    icon="fa fa-star"
                    switch={["", "-o"]}
                    onClick={() => { this.onBtnClick(2) }}
                    sortFunction={this.favoriteSort}
                    visible={this.state.visible}
                />
                <button className="recipe-sort-toggle fa fa-filter" onClick={this.toggleVisible}/>
            </div>
        )
    }
}

export default RecipeSort