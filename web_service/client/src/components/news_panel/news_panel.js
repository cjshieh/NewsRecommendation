import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Card, Container, Item, Segment } from "semantic-ui-react";
import NewsCard from "../news_card/news_card";
import NewsFeed from "../news_feed/news_feed";
import Spiner from "../util/spinner";
import "./news_panel.css";

import { newsClass, newsConstants } from "../../constants";
import { newsActions } from "../../actions";

class NewsPanel extends Component {
  constructor() {
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
  // when component first time loaded, it will be triggered.
  componentDidMount() {
    // if reloading happens in the search, show it.
    if (this.props.location.pathname === "/result") {
      this.setState({ showResult: true });
    }
    // first we do request news
    this.props.dispatch(newsActions.loadFirstRequest());

    // if user is not logged in, we won't provide infinite scroll service
    if (!this.props.loggedIn) {
      this.props.dispatch(newsActions.loadNewsByDefault());
      return;
    }

    this.loadMoreNews();
    window.addEventListener("scroll", _.throttle(this.handleScroll, 500));
  }

  componentDidUpdate(prevProps, prevState) {
    // watch for whether a user is logged out
    if (!this.props.loggedIn && this.props.loggedIn !== prevProps.loggedIn) {
      this.props.dispatch(newsActions.loadFirstRequest());
      this.props.dispatch(newsActions.loadNewsByDefault());
      // reset pageNum to 1
      this.setState({ pageNum: 1 });
      return;
    }
    // if page routes, clear and request load
    if (this.props.location !== prevProps.location) {
      this.setState({ pageNum: 1 });
      if (this.props.location.pathname === "/result") {
        this.setState({ showResult: true });
        return;
      } else {
        this.props.dispatch(newsActions.clearSearchResult());
        this.setState({ showResult: false });
        this.props.dispatch(newsActions.loadFirstRequest());
      }
    }
    // we need to dispatch action in here since we update state on location changes
    if(!this.state.showResult && this.state.showResult !== prevState.showResult) {
      this.props.loggedIn ?
        this.loadMoreNews() : this.props.dispatch(newsActions.loadNewsByDefault()); 
    }
  }

  handleScroll() {
    if (this.props.interaction.drawer_visible) {
      return;
    }
    let scrollY =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop;

    if (window.innerHeight + scrollY >= document.body.offsetHeight - 500) {
      if (this.props.loadingNews) {
        return;
      }
      this.loadMoreNews();
    }
  }

  loadMoreNews() {
    if (this.props.allLoaded || !this.props.loggedIn) {
      return;
    }
    console.log(this.state.pageNum);
    this.props.dispatch(
      this.state.showResult
        ? // search page number's has an offset 1 because the first query request is from menu component
          newsActions.loadBySearchKey(
            this._gettQueryKey(),
            this.state.pageNum + 1
          )
        : newsActions.loadByPageForUser(this.state.pageNum)
    );
    this.setState({ pageNum: this.state.pageNum + 1 });
  }

  renderNews() {
    this.enableScroll();
    if (this.state.showResult) {
      return (
        <Item.Group>
          {Object.keys(this.props.results).map(digest => {
            return (
              <NewsFeed report={this.props.results[digest]} key={digest} />
            );
          })}
        </Item.Group>
      );
    }
    return (
      <Card.Group>
        {!this.props.loggedIn
          ? this.props.newsDefault.map(report => {
              return <NewsCard report={report} key={report.digest} />;
            })
          : Object.keys(this.props.newsForUser).map(digest => {
              return (
                <NewsCard
                  report={this.props.newsForUser[digest]}
                  key={digest}
                />
              );
            })}
      </Card.Group>
    );
  }

  render() {
    if (
      this.props.firstLoadingNews ||
      (!this.props.newsDefault && !this.props.newsForUser)
    ) {
      this.disableScroll();
      return <Spiner firstLoad={true} />;
    }
    return (
      <Container className="yu-news-panel">
        {this.renderNews()}
        {this.showEndingMessage()}
        {this.props.loadingNews && <Spiner firstLoad={false} />}
      </Container>
    );
  }

  showEndingMessage() {
    let zeroResults = true;
    if (this.state.showResult) {
      zeroResults = Object.keys(this.props.results).length === 0;
      if (zeroResults) {
        return (
          <Segment vertical className="panel-message">
            No results
          </Segment>
        );
      }
    }
    if (
      !this.props.loggedIn &&
      (this.props.newsDefault.length !== 0 || !zeroResults)
    ) {
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

  _gettQueryKey() {
    const queryKey = this.props.location.search.match(/\?q=(.+)/i)[1];
    return queryKey;
  }
}

function mapStateToProps({ interaction, loader, authentication }) {
  const { loggedIn } = authentication;
  const newsForUser = loader[newsClass.USER]["news"];
  const allLoaded =
    loader[newsClass.USER]["allLoaded"] ||
    loader[newsClass.SEARCH]["allLoaded"];
  const newsDefault = loader[newsClass.DEFAULT]["news"];
  const results = loader[newsClass.SEARCH]["news"];
  const firstLoadingNews = loader[newsConstants.FIRST_LOAD_REQUEST];
  const loadingNews =
    loader[newsClass.SEARCH]["loading"] || loader[newsClass.USER]["loading"];
  return {
    allLoaded,
    firstLoadingNews,
    loggedIn,
    loadingNews,
    newsDefault,
    newsForUser,
    results,
    interaction
  };
}

export default connect(mapStateToProps)(NewsPanel);
