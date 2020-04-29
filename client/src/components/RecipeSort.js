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
        this.asc = !this.props.selected ? true : this.asc
        return (
            <button
                className={`recipe-sort-button ${this.props.icon}${this.asc ? "-asc" : "-desc"}` + 
                            `${this.props.selected ? " selected" : ""}` + 
                            `${this.props.visible ? " visible" : ""}`}
                onClick={this.onClick}
                disabled={!this.props.visible}
            />
        )
    }
}

class RecipeSort extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedSort: null,
            visible: false
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

    toggleVisible = () => {
        this.setState(prevState => ({ visible: !prevState.visible }))
    }

    render() {
        return (
            <div style={{display: "inline-block", float: "right"}}>
                <SortBtn
                    selected={this.state.selectedSort === 0}
                    icon="fa fa-sort-alpha"
                    onClick={() => { this.onBtnClick(0) }}
                    sortFunction={this.nameSort}
                    visible={this.state.visible}
                />
                <SortBtn
                    selected={this.state.selectedSort === 1}
                    icon="fa fa-sort-numeric"
                    onClick={() => { this.onBtnClick(1) }}
                    sortFunction={this.timeSort}
                    visible={this.state.visible}
                />
                <button className="recipe-sort-toggle fa fa-filter" onClick={this.toggleVisible}/>
            </div>
        )
    }
}

export default RecipeSort