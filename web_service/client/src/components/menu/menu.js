import React from "react";
import { connect } from "react-redux";
import { interActions, userActions, newsActions} from "../../actions/index";
import { Button, Dropdown, Form, Icon, Image, Input } from "semantic-ui-react";
import Logo from "../../assets/Logo.png";
import "./menu.css";
import { bindActionCreators } from "redux";
import { Link, withRouter } from "react-router-dom";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: false,
      term: ""
    };
    this.toggleHidden = this.toggleHidden.bind(this);
    this.onSubmission = this.onSubmission.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  // componentDidMount() {
  //   console.log(this.props.location);
  // }

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    });
  }

  onInputChange(e) {
    this.setState({ term: e.target.value });
  }

  onSubmission(e) {
    e.preventDefault();
    const queryKey = this.state.term;
    const spaceless = queryKey.trim();
    // Normalized text without any punctuation and extra spaces betwen words
    const punctuationless = spaceless.replace(/[.,/#!$%^&*;:{}=\-_`~()[\]]/g, "");
    const finalQuery = punctuationless.replace(/\s{2,}/g, " ");
    // Handle the empty search query
    if (finalQuery.length === 0) {
      this.props.history.push('/');
      return;
    }
    this.props.clearSearch();
    this.props.loadBySearchKey(queryKey);
    this.props.history.push(`/result?q=${queryKey}`);
  }

  render() {
    return (
      <div className="menu-container">
        <div className={this.state.isHidden ? "mobile-search" : "back-arrow"}>
          <Button className="yn-button" onClick={this.toggleHidden}>
            <Icon name="arrow left" size="large" />
          </Button>
        </div>

        <div
          id="guide-bar"
          className={this.state.isHidden ? "hidden" : "guide-bar"}>
          <Button
            className="yn-button"
            onClick={() => this.props.toggleDrawer()}>
            <Icon id="guide-icon" name="sidebar" size="large" />
          </Button>
        </div>

        <div
          id="logo"
          className={this.state.isHidden ? "hidden" : "yu-logo-smash"}>
          <Link
            id="logo-container"
            to="/"
            onClick={() => this.setState({ term: "" })}>
            <Image className="logo-image" src={Logo} alt="" />
          </Link>
        </div>

        <div
          id="search"
          className={this.state.isHidden ? "mobile-search" : "yu-search-smash"}>
          <Form className="search-box" onSubmit={this.onSubmission}>
            <Input
              className="search-box-input"
              value={this.state.term}
              onChange={this.onInputChange}
            />
            <Button id="search-icon" type="submit">
              <Icon name="search" className="yn-icon" />
            </Button>
          </Form>
        </div>

        <div id="end" className={this.state.isHidden ? "hidden" : "end"}>
          <Button className="yn-search-end" onClick={this.toggleHidden}>
            <Icon name="search" />
          </Button>
          {!this.props.loggedIn && (
            <Button className="end-login" as={Link} to="/login">
              Login
            </Button>
          )}
          {!this.props.loggedIn && (
            <Button className="end-signup" as={Link} to="/signup">
              Sign Up
            </Button>
          )}
          {/* login success */
          this.props.loggedIn && (
            <Dropdown
              button
              className="icon"
              floating
              labeled
              icon="user"
              text={this.props.name}>
              <Dropdown.Menu>
                <Dropdown.Item
                  icon="sign-out"
                  text="logout"
                  onClick={() => {
                    this.props.logout();
                  }}
                />
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      toggleDrawer: interActions.toggleDrawer,
      logout: userActions.logout,
      loadBySearchKey: newsActions.loadBySearchKey,
      clearSearch: newsActions.clearSearchResult
    },
    dispatch
  );
}

function mapStateToProps(state) {
  const { loggedIn, user } = state.authentication;
  if (user === null) {
    return {
      loggedIn
    };
  }

  const name = user.username;
  return {
    loggedIn,
    name
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Menu));
