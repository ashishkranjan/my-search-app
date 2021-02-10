import React from "react";

const SearchResult = (props) => {
    return <ul key={props.geoname.geonameId}>
             <li key={props.geoname.countryId}>{props.index + 1}. {props.geoname.name} - {props.geoname.countryName}</li>
           </ul>;
};

export default SearchResult;