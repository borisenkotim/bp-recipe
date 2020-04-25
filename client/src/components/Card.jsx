import React from "react";

// This component is for a card of a recipe that is displayed on the
// home page of the site.
class Card extends React.Component {

  constructor(props) {
    super(props);
  }

  // changes the source to a default image if the provided recipe image is not found
  renderRecipeImageError = (e) =>{
    e.target.src = 'https://www.boilersupplies.com/img/no_image.png'
  }

  render() {
    return (
      <div className="recipe-card shadow mb-5 bg-white rounded">
    {/* shows the image of the recipe on the page */}
        <img
          src={this.props.pictureURL}
          height="230"
          width="270"
          className="rounded-top"
          alt="No Image Found"
          onError={this.renderRecipeImageError}
        />
    {/* shows the name of recipe */}
        <p className="recipe-card-name">{this.props.name}</p>
    {/* shows favorite button */}
        <span className={"fav-btn fa fa-star recipe-card-favorite"}></span>
      </div>
    );
  }
}

export default Card;
