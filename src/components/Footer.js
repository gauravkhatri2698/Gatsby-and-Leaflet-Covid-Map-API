import React from "react";

import { useSiteMetadata } from "hooks";

import Container from "components/Container";

const Footer = () => {
  const { authorName } = useSiteMetadata();

  const styling = {
    color: "white",
    textDecoration: "underline",
  };

  return (
    <footer>
      <Container>
        <p>
          &copy; {new Date().getFullYear()}, <p style={styling}>{authorName}</p>
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
