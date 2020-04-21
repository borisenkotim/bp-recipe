import React from 'react'

class RecipeSearch extends React.Component {
    constructor(props) {
        super(props)
        // open represents whether the search text input is shown or not
        this.state = {
            open: false
        }
    }

    toggleOpen = () => {
        this.setState(prevState => ({ open: !prevState.open }))
    }

    handleSearchChange = (e) => {
        let search = e.target.value

        // can add search caching in the future for faster searches
        let filteredList = []
        if (search !== ""){
            // convert search term and item names to lowercase because includes is case sensitve
            let lowerSearch = search.toLowerCase()
            filteredList = this.props.allRecipes.filter(item => {
                let lowerItem = item.name.toLowerCase()
                return lowerItem.includes(lowerSearch)
            })
        }
        else // search term is empty
            filteredList = this.props.allRecipes

        this.props.updateFilteredRecipes(filteredList)
    }
    
    render() {
        return (
            <div style={{display: "inline-block"}}>
                <button
                    onClick={this.toggleOpen} className="fa fa-search"
                    style={{background: "none", border: "none", fontSize: "25px", paddingBottom: "20px",
                            paddingTop: "10px", paddingRight: "15px"}}
                />
                <input
                    type="search" onChange={(e) => this.handleSearchChange(e)} hidden={!this.state.open}
                    placeholder="Search..." style={{borderRadius: "10px", border: "1.4px solid", paddingLeft: "5px"}}
                />
            </div>
        )
    }
}

export default RecipeSearch