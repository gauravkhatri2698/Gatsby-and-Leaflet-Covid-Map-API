import React from "react";

import { useSiteMetadata } from "hooks";

import Container from "components/Container";

const Footer = () => {
  const { authorName } = useSiteMetadata();

  return (
    <footer>
      <Container>
        <p>
          &copy; {new Date().getFullYear()},{" "}
          <p style="color: white;">{authorName}</p>
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
