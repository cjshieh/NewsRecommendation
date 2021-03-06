import React, { Component } from "react";
import { connect } from "react-redux";
import { interActions } from "../actions/index";
import YuMenu from "./menu/menu";
import NewsPanel from "./news_panel/news_panel";
import NewsFeed from "./news_feed/news_feed";
import { Icon, Menu, Sidebar, Segment, Sticky } from "semantic-ui-react";
import { bindActionCreators } from "redux";
import { Link, Route, Switch } from "react-router-dom";

import "./app.css";

class App extends Component {
  state = {};

  handleContextRef = contextRef => {
    this.setState({ contextRef });
  };

  render() {
    const { visible } = this.props.toggle;
    const { contextRef } = this.state;
    return (
      <React.Fragment>
        <Sticky context={contextRef}>
          <YuMenu />
        </Sticky>

        <div
          className="inner"
          ref={this.handleContextRef}
          onClick={() => {
            this.props.hideSearchForm();
          }}>
          <Sidebar.Pushable as={Segment} className="yn-sidebar">
            <Sidebar
              as={Menu}
              animation="overlay"
              icon="labeled"
              inverted
              onHide={() => this.props.hideDrawer()}
              onClick={() => this.props.hideDrawer()}
              vertical
              visible={visible}
              width="thin">
              <Menu.Item>
                <Menu.Menu>
                  <Menu.Item as={Link} to="/">
                    <Icon name="home" />
                    Home
                  </Menu.Item>
                  <Menu.Item as="a">
                    <Icon name="fire" />
                    Today
                  </Menu.Item>
                </Menu.Menu>
              </Menu.Item>
            </Sidebar>

            <Sidebar.Pusher dimmed={visible}>
              <Switch>
                <Route path="/business" component={NewsFeed} />
                <Route path="/result" component={NewsPanel} />
                <Route path="/" component={NewsPanel} />
              </Switch>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      hideDrawer: interActions.hideDrawer,
      hideSearchForm: interActions.hideSearchMobie
    },
    dispatch
  );
}

function mapStateToProps({ interaction }) {
  return { toggle: interaction.drawer_visible };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
