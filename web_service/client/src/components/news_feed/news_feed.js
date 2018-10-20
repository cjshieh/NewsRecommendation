import React from "react";
import { Container, Icon, Item, Label } from "semantic-ui-react";
import "./news_feed.css";

const items = {
  _id: { $oid: "5bb2f7e1453ccb996c1287af" },
  source: { id: null, name: "Marketwatch.com" },
  author: "Mike Murphy",
  title:
    "Hector \u0026 Lalo's A Backstory On 'Better Call Saul' Is Sure To Please 'Breaking Bad' Fans",
  description:
    "Much of the criticism of the movie was “deliberate, organized political influence measures disguised as fan arguments,” a researcher found.",
  url:
    "https://www.marketwatch.com/story/russian-trolls-stoked-star-wars-the-last-jedi-fan-outrage-study-finds-2018-10-01",
  urlToImage:
    "http://s.marketwatch.com/public/resources/MWimages/MW-GA907_lastje_ZG_20171231171744.jpg",
  publishedAt: "2018-10-02",
  content:
    "Do not underestimate the power of the dark side. A new academic study found that Russian online trolls and bots likely stoked fan dissent after the release of “Star Wars: The Last Jedi” last year. While the movie, from Walt Disney Co.’s DIS, -0.60% Lucasfilm,… [+2549 chars]",
  category: "entertainment",
  digest: "LXwByG8gdZ/KQ9xlSpfDfQ==",
  class: "business"
};

function redirectToUrl(url) {
  window.open(url, '_blank');
}

const ItemExampleProps = ({report}) => (
  <Item.Group divided>
    <Item onClick={() => redirectToUrl(report.url)}>
      <Item.Image src={report.urlToImage} />

      <Item.Content>
        <Item.Header as="a" src={report.url}>{report.title}</Item.Header>
        <Item.Meta>
          <Icon name="clock outline" /> {report.publishedAt}
        </Item.Meta>
        <Item.Description>{report.description}</Item.Description>
        <Item.Extra>
          <Label>{report.class}</Label>
        </Item.Extra>
      </Item.Content>
    </Item>
    </Item.Group>
);

export default ItemExampleProps;
