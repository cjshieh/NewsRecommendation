import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { interActions, userActions, newsActions } from "../../actions/index";
import { Button, Dropdown, Form, Icon, Image, Input } from "semantic-ui-react";
import Logo from "../../assets/Logo.png";
import "./menu.css";
import { bindActionCreators } from "redux";
import { Link, withRouter } from "react-router-dom";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: ""
    };
    this.toggleHidden = this.toggleHidden.bind(this);
    this.onSubmission = this.onSubmission.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    window.addEventListener('resize', _.debounce(() => {
      const width = window.innerWidth;
      if (width > 656 && this.props.isHidden) {
        this.props.hideSearchBar();
      }
    }, 50));
  }
  // menu component handle first time querying
  componentDidMount() {
    if (this.props.location.pathname === "/result") {
      // console.log(this.props.location);
      this.props.loadFirstRequest();
      const queryKey = this.props.location.search.match(/\?q=(.+)/i)[1];
      this.setState({ term: queryKey });
      this.props.loadBySearchKey(queryKey);
      return;
    }
  }

  toggleHidden() {
    this.props.toggleSearchBar();
  }

  onInputChange(e) {
    this.setState({ term: e.target.value });
  }

  onSubmission(e) {
    e.preventDefault();

    const queryKey = this.state.term;
    const spaceless = queryKey.trim();
    // Normalized text without any punctuation and extra spaces betwen words
    const punctuationless = spaceless.replace(
      /^[.,/#!$%^&*;:{}=\-_`~()[\]]/g,
      ""
    );
    console.log(punctuationless);
    const finalQuery = punctuationless.replace(/\s{2,}/g, " ");
    // Handle the empty search query
    if (finalQuery.length === 0) {
      this.props.history.push("/");
      return;
    }
    this.props.clearSearch();
    this.props.loadFirstRequest();
    this.props.loadBySearchKey(queryKey);
    // this.setState({isHidden: !this.props.isHidden});
    this.props.history.push(`/result?q=${queryKey}`);
    // this.setState({isHidden: true});
  }

  render() {
    return (
      <div className="menu-container">
        <div className={this.props.isHidden ? "mobile-search" : "back-arrow"}>
          <Button className="yn-button" onClick={this.toggleHidden}>
            <Icon name="arrow left" size="large" />
          </Button>
        </div>

        <div
          id="guide-bar"
          className={this.props.isHidden ? "hidden" : "guide-bar"}>
          <Button
            className="yn-button"
            onClick={() => this.props.toggleDrawer()}>
            <Icon id="guide-icon" name="sidebar" size="large" />
          </Button>
        </div>

        <div
          id="logo"
          className={this.props.isHidden ? "hidden" : "yu-logo-smash"}>
          <Link
            id="logo-container"
            to="/"
            onClick={() => this.setState({ term: "" })}>
            <Image className="logo-image" src={Logo} alt="" />
          </Link>
        </div>

        <div
          id="search"
          className={this.props.isHidden ? "mobile-search" : "yu-search-smash"}>
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

        <div id="end" className={this.props.isHidden ? "hidden" : "end"}>
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
                    this.props.history.push("/");
                    this.props.logout();
                    this.setState({ term: "" });
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
      clearSearch: newsActions.clearSearchResult,
      hideSearchBar: interActions.hideSearchMobie,
      logout: userActions.logout,
      loadBySearchKey: newsActions.loadBySearchKey,
      loadFirstRequest: newsActions.loadFirstRequest,
      toggleDrawer: interActions.toggleDrawer,
      toggleSearchBar: interActions.toggleSearchMobie
    },
    dispatch
  );
}

function mapStateToProps({authentication, interaction}) {
  const { loggedIn, user } = authentication;
  const isHidden = interaction.search_form_visible;
  if (user === null) {
    return {
      loggedIn,
      isHidden
    };
  }

  const name = user.username;
  return {
    isHidden,
    loggedIn,
    name
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Menu));
