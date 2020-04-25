import React from "react";
import AppMode from "../AppMode.js"

// This component is for a card of a recipe that is displayed on the
// home page of the site.
class Card extends React.Component {

  constructor(props) {
    super(props);

    this.state = this.props.data;
  }
  
  //Update the favorited field in database
  favoriteClicked = (event) => {
    event.preventDefault();
    var newData = this.state;
    if (this.state.favorited) {
      this.setState({ favorited: false });
      newData.favorited = false;
    } else {
      this.setState({ favorited: true });
      newData.favorited = true;
    }

    this.props.saveRecipe(newData, this.props.id, AppMode.RECIPES);
  };

  // changes the source to a default image if the provided recipe image is not found
  renderRecipeImageError = (e) =>{
    e.target.src = 'https://www.boilersupplies.com/img/no_image.png'
  }

  render() {
    return (
      <div className="recipe-card shadow mb-5 bg-white rounded">
    {/* shows the image of the recipe on the page */}
        <img
          className="recipe-card-img"
          src={this.state.pictureURL}
          height="230"
          width="270"
          className="rounded-top"
          alt="No Image Found"
          onError={this.renderRecipeImageError}
        />
    {/* shows the name of recipe */}
        <p className="recipe-card-name">{this.state.name}</p>
    {/* shows favorite button */}
        <h2>
        <span 
          className={"fav-btn fa fa-star recipe-card-favorite " + (this.state.favorited ? "favorited" : "unfavorited")}
          onClick={(event) => this.favoriteClicked(event)}></span>
        </h2>
      </div>
    );
  }
}

export default Card;
