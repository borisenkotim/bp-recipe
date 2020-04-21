import React from 'react'
import ReactDOM from 'react-dom'

class RecipeSearch extends React.Component {
    constructor(props) {
        super(props)
        // open represents whether the search text input is shown or not
        this.state = {
            open: false
        }
    }
    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    toggleOpen = () => {
        this.setState(prevState => ({ open: !prevState.open }))
    }

    handleSearchChange = e => {
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

    handleClickOutside = e => {
        let domNode = ReactDOM.findDOMNode(this)

        if (!domNode || !domNode.contains(e.target) && this.state.open)
            this.setState({ open: false })
    }
    
    render() {
        return (
            <div style={{display: "inline-block"}}>
                <button
                    onClick={this.toggleOpen} className="recipe-search-icon fa fa-search"
                    style={{background: "none", border: "none", fontSize: "25px", paddingBottom: "20px",
                            paddingTop: "10px", paddingRight: "15px"}}
                />
                <input
                    type="search" onChange={(e) => this.handleSearchChange(e)} hidden={!this.state.open}
                    placeholder="Search..." style={{borderRadius: "10px", border: "1.4px solid", paddingLeft: "5px",
                                                    width: "15vw"}}
                />
            </div>
        )
    }
}

export default RecipeSearch