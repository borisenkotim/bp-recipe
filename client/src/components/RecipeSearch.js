import React from "react";
import ReactDOM from "react-dom";

class RecipeSearch extends React.Component {
  constructor(props) {
    super(props);
    // visible represents whether the search text input is shown or not
    this.state = {
      visible: false,
      filter: "",
    };
  }

  // adds the event listener for handling a click outside of the component
  componentDidMount() {
    document.addEventListener("click", this.handleClickOutside, true);
  }

  // removes the event listener for handling a click outside of the component
  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside, true);
  }

  toggleVisible = () => {
    this.setState((prevState) => ({ visible: !prevState.visible }));
  };

  handleChangeFilter = (e) => {
    // this.state.filter = e.target.value;
    this.setState({ filter: e.target.value });
  };

  // updates the filtered recipes upon search input change
  handleSearchChange = (e) => {
    let search = e.target.value;
    let filteredList = [];
    // can add search caching in the future for faster searches
    if (this.state.filter == "Recipes") {
      if (search !== "") {
        // convert search term and item names to lowercase because includes is case sensitve
        let lowerSearch = search.toLowerCase();
        filteredList = this.props.allRecipes.filter((item) => {
          let lowerItem = item.name.toLowerCase();
          return lowerItem.includes(lowerSearch);
        });
      }
    } else if (this.state.filter == "Ingredients") {
      let i = 0;
      let x = 0;
      if (search !== "") {
        let lowerSearch = search.toLowerCase();
        filteredList = this.props.allRecipes.filter((item) => {
          for (
            i = 0;
            i < item.ingredients.length;
            ++i // searches through all the ingredients
          ) {
            let lowerItem = item.ingredients[i].name.toLowerCase();
            if (lowerItem.includes(lowerSearch)) {
              // returns true, and shows the whole recipe if there is an ingredient match
              return lowerItem.includes(lowerSearch);
            }
          }
        });
      }
    } // search term is empty
    else {
      filteredList = this.props.allRecipes;
    }

    this.props.updateFilteredRecipes(filteredList);
  };

  // closes search bar upon click outside of the component
  handleClickOutside = (e) => {
    let domNode = ReactDOM.findDOMNode(this);

    if (!domNode || (!domNode.contains(e.target) && this.state.visible))
      this.setState({ visible: false });
  };

  render() {
    return (
      <div style={{ display: "inline-block" }}>
        <button
          onClick={this.toggleVisible}
          className="recipe-search-icon fa fa-search"
          id="searchButton"
          style={{
            background: "none",
            border: "none",
            fontSize: "25px",
            paddingBottom: "20px",
            paddingTop: "10px",
            paddingRight: "15px",
          }}
        />
        <input
          type="search"
          onChange={this.handleSearchChange}
          hidden={!this.state.visible}
          placeholder="Search..."
          id="searchBar"
          style={{
            borderRadius: "10px",
            border: "1.4px solid",
            paddingLeft: "8px",
            width: "15vw",
            outline: "none",
          }}
        />
        <input
          placeholder="Filter Search"
          className="ingredient-input-filter"
          type="text"
          list="filters"
          id="filterSearch"
          onChange={this.handleChangeFilter}
          value={this.state.filter}
        />
        <datalist id="filters">
          <option>Recipes</option>
          <option>Ingredients</option>
        </datalist>
      </div>
    );
  }
}

export default RecipeSearch;
