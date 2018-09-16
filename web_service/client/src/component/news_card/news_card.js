import React from "react";
import { Card, Label, Icon, Image } from "semantic-ui-react";
import "./news_card.css";

class NewsCard extends React.Component {
  render() {
    return (
      <Card>
        <Image src={this.props.report.urlToImage} />
        <Card.Content>
          <Card.Header as="h3" className="fade">
            {this.props.report.title}
          </Card.Header>
          <Card.Meta>
            <span className="text">{this.props.report.source}</span>
          </Card.Meta>
          <Card.Meta>
            <span className="date">{this.props.report.publishedAt}</span>
          </Card.Meta>
          {/*
      <Card.Description>
        In the end, Andrew Puzder had too much baggage -- both personal and professional -- to be confirmed as President Donald Trump's Cabinet.
      </Card.Description>
      */}
        </Card.Content>
        <Card.Content extra>
          <Label.Group>
            <Label as="a">
              {this.props.report.category}
              <Icon name="close" />
            </Label>
            <Label as="a" color="red">
              {this.props.report.reason}
            </Label>
          </Label.Group>
        </Card.Content>
      </Card>
    );
  }
}

export default NewsCard;
