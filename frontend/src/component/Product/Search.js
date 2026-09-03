

import React, { Fragment, useState } from "react";
import "./Search.css";
import MetaData from "../layout/MetaData";

const Search = ({ history }) => {
  // Fix 1: State variable casing (Keyword -> keyword)
  const [keyword, setKeyword] = useState("");

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      // Fix 2: Router navigation method (history.pushState -> history.push)
      history.push(`/products/${keyword}`);
    } else {
      history.push("/products");
    }
  };

  return (
    <Fragment>
      <MetaData title="Search A Product -- Ecommerce" />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a product..."
          // Fix 3: Controlled input value property added
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
    </Fragment>
  );
};

export default Search;