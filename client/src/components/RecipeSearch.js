import React from 'react'
import ReactDOM from 'react-dom'

class RecipeSearch extends React.Component {
    constructor(props) {
        super(props)
        // visible represents whether the search text input is shown or not
        this.state = {
            visible: false
        }
    }

    // adds the event listener for handling a click outside of the component
    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    // removes the event listener for handling a click outside of the component
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    toggleVisible = () => {
        this.setState(prevState => ({ visible: !prevState.visible }))
    }

    // updates the filtered recipes upon search input change
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

    // closes search bar upon click outside of the component
    handleClickOutside = e => {
        let domNode = ReactDOM.findDOMNode(this)

        if (!domNode || !domNode.contains(e.target) && this.state.visible)
            this.setState({ visible: false })
    }
    
    render() {
        return (
            <div style={{display: "inline-block"}}>
                <button
                    onClick={this.toggleVisible} className="recipe-search-icon fa fa-search"
                    style={{background: "none", border: "none", fontSize: "25px", paddingBottom: "20px",
                            paddingTop: "10px", paddingRight: "15px"}}
                />
                <input
                    type="search" onChange={(e) => this.handleSearchChange(e)} hidden={!this.state.visible} placeholder="Search..."
                    style={{borderRadius: "10px", border: "1.4px solid", paddingLeft: "8px",
                            width: "15vw", outline: "none"}}
                />
            </div>
        )
    }
}

export default RecipeSearch