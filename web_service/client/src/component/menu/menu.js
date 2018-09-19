import React from "react";
import { connect } from "react-redux";
import { toggleDrawer } from "../../actions/index";
import { Button, Form, Icon, Image, Input } from "semantic-ui-react";
import Logo from "../../assets/Logo.png";
import "./menu.css";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";

class Menu extends React.Component {
  constructor() {
    super();
    this.state = {
      isHidden: false
    };
    this.toggleHidden = this.toggleHidden.bind(this);
  }

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    });
  }

  render() {
    return (
      <div className="menu-container">
        <div className={this.state.isHidden ? "mobile-search" : "back-arrow"}>
          <Button className="yn-button" onClick={this.toggleHidden}>
            <Icon name="arrow left" size="large" />
          </Button>
        </div>

        <div id="guide-bar" className={this.state.isHidden ? 'hidden' : 'guide-bar'}>
          <Button className="yn-button" onClick={() => this.props.toggleDrawer()}>
            <Icon id="guide-icon" name="sidebar" size="large" />
          </Button>
        </div>

        <div id="logo" className={this.state.isHidden ? 'hidden' : 'yu-logo-smash'}>
          <div id="logo-container">
            <Image className="logo-image" src={Logo} alt="" />
          </div>
        </div>

        <div id="search" className={this.state.isHidden ? 'mobile-search' : 'yu-search-smash'}>
          <Form className="search-box">
            <Input className="search-box-input" />
            <Button id="search-icon">
              <Icon name="search" className="yn-icon" />
            </Button>
          </Form>
        </div>

        <div id="end" className={this.state.isHidden ? 'hidden' : 'end'}>
          <Button className="yn-search-end" onClick={this.toggleHidden}>
            <Icon name="search" />
          </Button>
          <Button className="end-login" as={Link} to="/login">Login</Button>
          <Button className="end-signup" as={Link} to="/signup">Sign Up</Button>
          {/* login success */
          /*
          <Dropdown
            button
            className="icon"
            floating
            labeled
            icon="user"
            options={languageOptions}
            text="Bob Shen"
          />
          */}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({toggleDrawer: toggleDrawer}, dispatch);
}

export default connect(null, mapDispatchToProps)(Menu);
