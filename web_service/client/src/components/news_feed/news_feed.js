import React from "react";
import { Icon, Item, Label } from "semantic-ui-react";
import "./news_feed.css";

function redirectToUrl(url) {
  window.open(url, "_blank");
}

const NewsItemProps = ({ report }) => (
  <Item onClick={() => redirectToUrl(report.url)}>
    <Item.Image
      src={report.urlToImage}
      onLoad={() => {
        console.log("image loaded success");
      }}
    />

    <Item.Content>
      <Item.Header as="a" src={report.url}>
        {report.title}
      </Item.Header>
      <Item.Meta>
        <Icon name="clock outline" /> {report.publishedAt} &middot;{" "}
        {report.source.name}
      </Item.Meta>
      <Item.Description>{report.description}</Item.Description>
      <Item.Extra>
        <Label>{report.class}</Label>
      </Item.Extra>
    </Item.Content>
  </Item>
);

export default NewsItemProps;
