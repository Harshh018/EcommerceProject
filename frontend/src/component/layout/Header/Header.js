import React from "react";
import { ReactNavbar } from "overlay-navbar";

import logo from "../../../images/logo.png";

import { MdAccountCircle, MdSearch, MdAddShoppingCart } from "react-icons/md";

const Header = () => {
  const options = {
    burgerColor: "#eb4034",
    burgerColorHover: "#a62d24",

    logo: logo,
    logoWidth: "20vmax",

    navColor1: "white",

    logoHoverSize: "10px",
    logoHoverColor: "#eb4034",

    link1Text: "Home",
    link2Text: "Products",
    link3Text: "Contact",
    link4Text: "About",

    link1Url: "/",
    link2Url: "/product",
    link3Url: "/contact",
    link4Url: "/about",

    link1Size: "1.2vmax",
    link2Size: "1.2vmax",
    link3Size: "1.2vmax",
    link4Size: "1.2vmax",

    link1Color: "rgba(35,35,35,0.8)",
    link2Color: "rgba(35,35,35,0.8)",
    link3Color: "rgba(35,35,35,0.8)",
    link4Color: "rgba(35,35,35,0.8)",

    link1ColorHover: "#eb4034",
    link2ColorHover: "#eb4034",
    link3ColorHover: "#eb4034",
    link4ColorHover: "#eb4034",

    link1Margin: "1vmax",
    link2Margin: "1vmax",
    link3Margin: "1vmax",
    link4Margin: "1vmax",

    nav1justifyContent: "flex-end",
    nav2justifyContent: "flex-end",
    nav3justifyContent: "flex-start",
    nav4justifyContent: "flex-start",

    /* PROFILE */
    profileIcon: true,
    ProfileIconElement: MdAccountCircle,
    profileIconUrl: "/login",
    profileIconColor: "rgba(35,35,35,0.8)",
    profileIconColorHover: "#eb4034",
    profileIconSize: "2.5vmax",
    profileIconMargin: "1vmax",

    /* SEARCH */
    searchIcon: true,
    SearchIconElement: MdSearch,
    searchIconUrl: "/search",
    searchIconColor: "rgba(35,35,35,0.8)",
    searchIconColorHover: "#eb4034",
    searchIconSize: "2vmax",
    searchIconMargin: "1vmax",

    /* CART */
    cartIcon: true,
    CartIconElement: MdAddShoppingCart,
    cartIconUrl: "/cart",
    cartIconColor: "rgba(35,35,35,0.8)",
    cartIconColorHover: "#eb4034",
    cartIconSize: "2vmax",
    cartIconMargin: "1vmax",
  };

  return <ReactNavbar {...options} />;
};

export default Header;