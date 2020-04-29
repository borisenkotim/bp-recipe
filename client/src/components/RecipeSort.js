import React from 'react'

class SortBtn extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            asc: true
        }
    }

    onClick = () => {
        if (this.props.selected)
            this.setState(prevState => ({asc: !prevState.asc}))

        this.props.onClick()
        this.props.sortFunction(this.state.asc)
    }

    render() {
        return (
            <button
                className={`recipe-sort-button ${this.props.icon}${this.state.asc ? "-asc" : "-desc"}`}
                onClick={this.onClick}
            />
        )
    }
}

class RecipeSort extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedSort: 0,
        }
    }

    nameSort = (asc) => { console.log("in alphasort") }
    timeSort = (asc) => { console.log("in timesort") }

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