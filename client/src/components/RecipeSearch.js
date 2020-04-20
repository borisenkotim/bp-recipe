import React from 'react'
import AppMode from "../AppMode.js";

class RecipeSearch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchTerm: "",
            open: false
        }
    }
    
    toggleOpen = () => {
        this.setState(prevState => ({ open: !prevState.open }))
    }

    handleSearchChange = (e) => {
        this.setState({ searchTerm: e.target.value })
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