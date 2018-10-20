import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Card, Container, Segment } from "semantic-ui-react";
import NewsCard from "../news_card/news_card";
import NewsFeed from "../news_feed/news_feed";
import Spiner from "../util/spinner";
import "./news_panel.css";

import { newsClass } from "../../constants";
import { newsActions } from "../../actions";

class NewsPanel extends Component {
  constructor() {
    // super(props);
    super();
    this.state = { pageNum: 1, showResult: false };
    this.handleScroll = this.handleScroll.bind(this);
    this.disableScroll = this.disableScroll.bind(this);
    this.enableScroll = this.enableScroll.bind(this);
    this.preventDefault = this.preventDefault.bind(this);
    this.preventDefaultForScrollKeys = this.preventDefaultForScrollKeys.bind(
      this
    );
  }

  componentDidMount() {
    // if reloading happens in the search, show it.
    if (this.props.location.pathname === "/result") {
      // console.log(this.props.location);
      // this.props.dispatch(newsActions.requestSearch());
      // const queryKey = this.props.location.search.match(/\?q=(.+)/i)[1];
      // this.props.dispatch(newsActions.loadBySearchKey(queryKey));
      this.setState({ showResult: true });
      return;
    }
    if (!this.props.loggedIn) {
      this.props.dispatch(newsActions.loadNewsByDefault());
      return;
    }
    this.loadMoreNews();
    this.loadMoreNews = _.debounce(this.loadMoreNews, 1000);
    window.addEventListener("scroll", this.handleScroll);
  }

  componentDidUpdate(prevProps) {
    // watch for whether a user is logged out
    if (!this.props.loggedIn && this.props.loggedIn !== prevProps.loggedIn) {
      // console.log("someone is logged out");
      this.props.dispatch(newsActions.loadNewsByDefault());
      return;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      // if routing to search result, show it
      if (nextProps.location.pathname === "/result") {
        // console.log("Show results");
        this.setState({ showResult: true });
        return;
      } else {
        console.log("page transfer, clear");
        this.props.dispatch(newsActions.clearSearchResult());
        this.props.dispatch(
          this.props.loggedIn ? newsActions.loadByPageForUser() : newsActions.loadNewsByDefault()
        );
        this.setState({ showResult: false });
      }
    }
  }

  handleScroll() {
    // FIXME: prevent background scrolling
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
    if (this.props.allLoaded || !this.props.loggedIn) {
      return;
    }

    this.props.dispatch(newsActions.loadByPageForUser(this.state.pageNum));
    this.setState({ pageNum: this.state.pageNum + 1 });
  }

  renderNews() {
    this.enableScroll();
    if (this.state.showResult) {
      console.log(this.props.results.length);
      return this.props.results.map(report => {
        return <NewsFeed report={report} key={report.digest} />;
      });
    }

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
    if (
      this.props.loadingSearch ||
      (!this.props.newsDefault && !this.props.newsForUser)
    ) {
      this.disableScroll();
      return <Spiner />;
    }
    return (
      <Container className="yu-news-panel">
        <Card.Group>{this.renderNews()}</Card.Group>
        {this.showEndingMessage()}
      </Container>
    );
  }

  showEndingMessage() {
    // TODO: if the length of search result is < 20 don't show
    if (this.state.showResult) {
      if (this.props.results.length === 0) {
        return (
          <Segment vertical className="panel-message">
            No results
          </Segment>
        );
      }
    }
    if (!this.props.loggedIn && this.props.newsDefault.length !== 0) {
      return (
        <Segment vertical className="panel-message">
          Want More? Please&#160;
          <Link to="/login"> Log in</Link>
        </Segment>
      );
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
  const results = loader[newsClass.SEARCH]["news"];
  const loadingSearch = loader[newsClass.SEARCH]["loading"];
  return {
    allLoadedForUser,
    loggedIn,
    loadingSearch,
    newsDefault,
    newsForUser,
    results,
    toggle
  };
}

export default connect(mapStateToProps)(NewsPanel);
