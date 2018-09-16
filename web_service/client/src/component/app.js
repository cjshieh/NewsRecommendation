import React, { Component } from "react";
import { connect } from "react-redux";
import { hideDrawer } from "../actions/index";
import YuMenu from "./menu/menu";
import NewsPanel from "./news_panel/news_panel";
import { Icon, Menu, Sidebar, Segment,Sticky } from "semantic-ui-react";
import { bindActionCreators } from "redux";
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
    console.group();
    console.log("Inside from component");
    console.log(this.props.toggle);
    console.groupEnd();
    // console.log("watch at component: " + visible);
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
              vertical
              visible={visible}
              width="thin">
              <Menu.Item as="a">
                <Icon name="home" />
                Home
              </Menu.Item>
              <Menu.Item as="a">
                <Icon name="gamepad" />
                Games
              </Menu.Item>
              <Menu.Item as="a">
                <Icon name="camera" />
                Channels
              </Menu.Item>
              <Menu.Item as="a">
                <Icon name="home" />
                Home
              </Menu.Item>
              <Menu.Item as="a">
                <Icon name="gamepad" />
                Games
              </Menu.Item>
              <Menu.Item as="a">
                <Icon name="camera" />
                Channels
              </Menu.Item>
              <Menu.Item as="a">
                <Icon name="home" />
                Home
              </Menu.Item>
              <Menu.Item as="a">
                <Icon name="gamepad" />
                Games
              </Menu.Item>
              <Menu.Item as="a">
                <Icon name="camera" />
                Channels
              </Menu.Item>
              <Menu.Item as="a">
                <Icon name="home" />
                Home
              </Menu.Item>
              <Menu.Item as="a">
                <Icon name="gamepad" />
                Games
              </Menu.Item>
              <Menu.Item as="a">
                <Icon name="camera" />
                Channels
              </Menu.Item>

              <Menu.Item as="a">
                <Icon name="gamepad" />
                Games
              </Menu.Item>
              <Menu.Item as="a">
                <Icon name="camera" />
                Channels
              </Menu.Item>
              <Menu.Item as="div" style={{height:"15em"}}>
                Powers by NEWS API
              </Menu.Item>
            </Sidebar>

            <Sidebar.Pusher dimmed={visible}>
              <NewsPanel />
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ hideDrawer: hideDrawer }, dispatch);
}

function mapStateToProps(state) {
  const obj = { toggle: state.toggle };
  console.group();
  console.log("Get from component mapStateToProps");
  console.log(obj.toggle);
  console.groupEnd();
  return obj;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
