import React from "react";
import { connect } from "react-redux";
import { Card, Label, Image } from "semantic-ui-react";
import { Markup } from 'interweave';
import { newsActions } from '../../actions';
import "./news_card.css";


class NewsCard extends React.Component {
  redirectToUrl(url) {
    window.open(url, '_blank');
  }

  storeBehaviour(newsId) {
    this.props.dispatch(newsActions.storeBehaviour(newsId));
  }

  handleClick(url, newsId) {
    this.redirectToUrl(url);
    this.storeBehaviour(newsId);
  } 

  render() {
    return (
      <Card as="a" onClick={() => this.handleClick(this.props.report.url, this.props.report.digest)}>
        <Image src={this.props.report.urlToImage} />
        <Card.Content>
          <Card.Header as="h3" className="fade">
            <Markup content={this.props.report.title} />
            {/*["And the winner of " , <em>Big Brother</em>, " season 20 is…"]*/}
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

function mapStateToProps({ preference }) {
  return { preference }
}
export default connect(mapStateToProps)(NewsCard);
