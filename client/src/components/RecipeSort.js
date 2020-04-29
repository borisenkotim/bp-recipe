import React from 'react'

class SortBtn extends React.Component {
    constructor(props){
        super(props)
    }

    asc = true
    
    onClick = () => {
        if (this.props.selected)
            this.asc = !this.asc

        this.props.onClick()
        this.props.sortFunction(this.asc)
    }

    render() {
        return (
            <button
                className={`recipe-sort-button ${this.props.icon}${this.asc ? "-asc" : "-desc"}`}
                onClick={this.onClick}
            />
        )
    }
}

class RecipeSort extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedSort: null,
        }
    }

    nameSort = (asc) => {
        let recipes = [...this.props.recipeList]
        
        recipes.sort((a, b) =>{
            let nameA = a.name.toLowerCase();
            let nameB = b.name.toLowerCase();
            
            let result = 0
            if(nameA < nameB)
                result = -1
            if(nameA > nameB)
                result = 1
            if(!asc)
                result *= -1
            
            return result
        })

        this.props.updateFilteredRecipes(recipes)
    }

    timeSort = (asc) => {
        let recipes = [...this.props.recipeList]
        
        recipes.sort((a, b) => {
            let timeA = a.cookTime;
            let timeB = b.cookTime;

            let result = 0
            if (timeA < timeB)
                result = -1
            if (timeA > timeB)
                result = 1
            if (!asc)
                result *= -1

            return result
        })

        this.props.updateFilteredRecipes(recipes)
    }

    onBtnClick = (btnIndex) => {
        this.setState({selectedSort: btnIndex})
    }

    render() {
        return (
            <div style={{display: "inline-block", float: "right"}}>
                <SortBtn 
                    selected={this.state.selectedSort === 0}
                    icon="fa fa-sort-alpha"
                    onClick={() => { this.onBtnClick(0) }}
                    sortFunction={this.nameSort}
                />
                <SortBtn 
                    selected={this.state.selectedSort === 1}
                    icon="fa fa-sort-numeric"
                    onClick={() => { this.onBtnClick(1) }}
                    sortFunction={this.timeSort}
                />
            </div>
        )
    }
}

export default RecipeSort