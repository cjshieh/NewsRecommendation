import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Card, Container, Segment } from "semantic-ui-react";
import NewsCard from "../news_card/news_card";
import Spiner from "../util/spinner";
import "./news_panel.css";

import { newsClass } from "../../constants";
import { newsActions } from "../../actions";

class NewsPanel extends Component {
  constructor() {
    // super(props);
    super();
    this.state = { pageNum: 1 };
    this.handleScroll = this.handleScroll.bind(this);
    this.disableScroll = this.disableScroll.bind(this);
    this.enableScroll = this.enableScroll.bind(this);
    this.preventDefault = this.preventDefault.bind(this);
    this.preventDefaultForScrollKeys = this.preventDefaultForScrollKeys.bind(
      this
    );
  }

  componentDidMount() {
    if (!this.props.loggedIn) {
      this.props.dispatch(newsActions.loadNewsByDefault());
      return;
    }
    this.loadMoreNews();
    this.loadMoreNews = _.debounce(this.loadMoreNews, 1000);
    this.enableScroll();
    window.addEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    // TODO: prevent background scrolling
    if (this.props.toggle.visible) {
      return;
    }
    let scrollY =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop;

    if (window.innerHeight + scrollY >= document.body.offsetHeight - 50) {
      this.loadMoreNews();
    }
  }

  loadMoreNews() {
    if (this.props.allLoaded) {
      return;
    }

    this.props.dispatch(newsActions.loadByPageForUser(this.state.pageNum));
    this.setState({ pageNum: this.state.pageNum + 1 });
  }

  renderNews() {
    if (!this.props.loggedIn) {
      return this.props.newsDefault.map(report => {
        return <NewsCard report={report} key={report.digest} />;
      });
    }
    return Object.keys(this.props.newsForUser).map(digest => {
      return <NewsCard report={this.props.newsForUser[digest]} key={digest} />;
    });
  }

  render() {
    // if (this.props.newsForUser) {
    if (this.props.newsDefault || this.props.newsForUser) {
      return (
        <Container>
          <Card.Group>{this.renderNews()}</Card.Group>
          {!this.props.loggedIn &&
            this.props.newsDefault.length !== 0 && (
              <Segment vertical className="panel-message">
                Want More? Please&#160;
                <Link to="/login"> Log in</Link>
              </Segment>
            )}
        </Container>
      );
    } else {
      this.disableScroll();
      return <Spiner />;
    }
  }

  // Control scrolling event
  preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) e.preventDefault();
    e.returnValue = false;
  }

  preventDefaultForScrollKeys(e) {
    const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
    if (keys[e.keyCode]) {
      this.preventDefault(e);
      return false;
    }
  }

  disableScroll() {
    window.onwheel = this.preventDefault; // modern standard
    window.ontouchmove = this.preventDefault; // mobile
    document.onkeydown = this.preventDefaultForScrollKeys;
    return true;
  }

  enableScroll() {
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
  }
}

function mapStateToProps({ toggle, loader, authentication }) {
  const { loggedIn } = authentication;
  const newsForUser = loader[newsClass.USER]["news"];
  const allLoadedForUser = loader[newsClass.USER]["allLoaded"];
  const newsDefault = loader[newsClass.DEFAULT]["news"];
  return { toggle, newsDefault, newsForUser, allLoadedForUser, loggedIn };
}

export default connect(mapStateToProps)(NewsPanel);
