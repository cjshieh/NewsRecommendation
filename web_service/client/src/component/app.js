import React, { Component } from "react";
import { connect } from "react-redux";
import { interActions } from "../actions/index";
import YuMenu from "./menu/menu";
import NewsPanel from "./news_panel/news_panel";
import NewsFeed from "./news_feed/news_feed";
import { Icon, Menu, Sidebar, Segment, Sticky } from "semantic-ui-react";
import { bindActionCreators } from "redux";
import { Link ,Route, Switch } from "react-router-dom";

import "./app.css";

class App extends Component {
  state = {};

  handleContextRef = contextRef => this.setState({ contextRef });
  // state = { visible: false };

  // handleButtonClick = () => this.setState({ visible: !this.state.visible });

  // handleSidebarHide = () => this.setState({ visible: false });

  render() {
    const { visible } = this.props.toggle;
    const { contextRef } = this.state;
    return (
      <React.Fragment>
        <Sticky context={contextRef}>
          <YuMenu />
        </Sticky>

        <div className="inner" ref={this.handleContextRef}>
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
                    Popular
                  </Menu.Item>
                </Menu.Menu>
              </Menu.Item>

              <Menu.Item>
                <Menu.Header>Category</Menu.Header>
                <Menu.Menu>
                  <Menu.Item as={Link} to="/business">
                    <Icon name="briefcase" />
                    Business
                  </Menu.Item>
                  <Menu.Item as="a">
                    <Icon name="futbol outline" />
                    Sports
                  </Menu.Item>
                  <Menu.Item as="a">
                    <Icon name="cubes" />
                    Tech
                  </Menu.Item>
                  <Menu.Item as="a">
                    <Icon name="heartbeat" />
                    Health
                  </Menu.Item>
                </Menu.Menu>
              </Menu.Item>
{/*
              <Menu.Item as="div" style={{ height: "15em" }}>
                Powers by NEWS API
              </Menu.Item>
*/}
            </Sidebar>

            <Sidebar.Pusher dimmed={visible}>
              <Switch>
                <Route path='/business' component={NewsFeed} />
                <Route path='/' component={NewsPanel} />
              </Switch>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ hideDrawer: interActions.hideDrawer }, dispatch);
}

function mapStateToProps(state) {
  const obj = { toggle: state.toggle };
  // console.group();
  // console.log("Get from component mapStateToProps");
  // console.log(obj.toggle);
  // console.groupEnd();
  return obj;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
