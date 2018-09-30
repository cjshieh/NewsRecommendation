import React from "react";
import { Card, Label, Image } from "semantic-ui-react";
import "./news_card.css";

class NewsCard extends React.Component {
  redirectToUrl(url) {
    window.open(url, '_blank');
  }

  render() {
    return (
      <Card as="a" onClick={() => this.redirectToUrl(this.props.report.url)}>
        <Image src={this.props.report.urlToImage} />
        <Card.Content>
          <Card.Header as="h3" className="fade">
            {this.props.report.title}
          </Card.Header>
          <Card.Meta>
            <span className="text">{this.props.report.source.name}</span>
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
            <Label as="div">{this.props.report.category}</Label>
            {this.props.report.reason !== undefined && (
              <Label as="div" color="red">
                {this.props.report.reason}
              </Label>
            )}
          </Label.Group>
        </Card.Content>
      </Card>
    );
  }
}

export default NewsCard;
