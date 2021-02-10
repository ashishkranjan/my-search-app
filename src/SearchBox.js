import React, { Component } from 'react';
import SearchResult from "./SearchReasult";

class SearchBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            query: null,
            geonames: null,
            isLoading: false,
            error: null,
            inputSearched: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange = (e) => {
        const { value } = e.target;
        this.setState({
            query: value
        });
    }

    handleClick = () => {
        //state to monitor what is the last 5 searches user performed
        if (this.state.inputSearched.length < 5) {
            this.state.inputSearched.push(this.state.query);
            let inputSearched = [...new Set(this.state.inputSearched)];
            this.setState({inputSearched: inputSearched});
        }

        this.setState({isLoading: true, error: null});
        this.searchGeoNames(this.state.query);
    }

    searchGeoNames = (query) => {
        let username = "ashishkranjan";
        const apiUrl = "http://api.geonames.org/searchJSON?q=" + query + "&username=" + username;
        if (query) {
            fetch(apiUrl, {
                method: 'GET'
            }).then(res => {
                if (res.status >= 400) {
                    throw new Error("Server responds with error!");
                }
                return res.json();
            }).then(data => {
                console.log(data.geonames);
                let geonameData = null;
                if(data.geonames.length > 0) {
                    geonameData = data.geonames.filter((geoname) => {
                                    if(geoname.countryName) {
                                        return geoname.countryName.toLowerCase() === query.toLowerCase();
                                    }
                                }).map((geoname, index) => {
                                    return (
                                        <SearchResult geoname={geoname} index={index} />
                                        )
                                });
                } else {
                    geonameData = "No Record Found...";
                }
                console.log(geonameData);
                this.setState({ geonames: geonameData, isLoading: false });
            }, err => {
                console.log("Error....");
                this.setState({ error: "API Error Occurred. Please Try Again...", isLoading: false });
            });
        }
    }

    componentDidMount = () => {
        this.searchGeoNames(this.state.query);
    }

    render() {
        let {geonames, error, isLoading, inputSearched} = this.state;

        return (
            <form>
                <div>
                    {inputSearched.map((element, index) => {
                        return (index+1) + ".  " + element + "    ";
                    })}
                </div>
                <div style={{textAlign:'center'}}>
                    <h1>Geo Location Search</h1>
                    <label>Enter Country Name:</label> &nbsp;
                    <input type="text"
                           placeholder="Enter Country Name..."
                           onChange={this.handleChange}
                    /> &nbsp;
                    <input
                        type="button"
                        value="Search"
                        onClick={this.handleClick}
                    />

                </div>
                <div style={{textAlign:'center'}}>
                    {isLoading ? 'Loading....' : geonames }
                    <span>{error ? error : '' }</span>
                </div>
            </form>
        )
    }
}

export default SearchBox;