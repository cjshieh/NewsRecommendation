import React, { Component } from "react";
import { Card, Container } from "semantic-ui-react";
import NewsCard from "../news_card/news_card";
import Spiner from "../util/spinner";
import "./news_panel.css";
import _ from "lodash";
import { connect } from "react-redux";
import { loadActions } from "../../actions";

class NewsPanel extends Component {
  constructor() {
    // super(props);
    super();
    this.state = { news: null };
    this.handleScroll = this.handleScroll.bind(this);
    this.disableScroll = this.disableScroll.bind(this);
    this.enableScroll = this.enableScroll.bind(this);
    this.preventDefault = this.preventDefault.bind(this);
    this.preventDefaultForScrollKeys = 
      this.preventDefaultForScrollKeys.bind(this);
  }

  componentDidMount() {
    this.loadMoreNews();
    this.loadMoreNews = _.debounce(this.loadMoreNews, 1000);
    console.log("control");
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
      console.log("Loading more news");
      this.loadMoreNews();
    }
  }

  loadMoreNews() {
    this.props.dispatch(loadActions.loadAll());
  }

  renderNews() {
    return this.props.loader.map((report, index) => {
      return <NewsCard report={report} key={index} />;
    });
  }

  render() {
    if (this.props.loader) {
      return (
        <Container>
          <Card.Group>{this.renderNews()}</Card.Group>
        </Container>
      );
    } else {
      {
        this.disableScroll();
      }
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

function mapStateToProps({ toggle, loader }) {
  return { toggle, loader };
}

export default connect(mapStateToProps)(NewsPanel);
