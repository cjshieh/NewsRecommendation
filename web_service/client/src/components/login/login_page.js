import React, { Component } from "react";
import { connect } from "react-redux";
import { alertActions, userActions } from "../../actions";
import LoginForm from "./login_form";
import { createBrowserHistory } from 'history';



class LoginPage extends Component {
  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      user: {
        email: "",
        password: ""
      }
    };
    const history = createBrowserHistory();
    history.listen(() => {
      this.props.dispatch(alertActions.clear());
    });
    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  // Pre-submission.
  processForm(event) {
    event.preventDefault();

    const { email, password } = this.state.user;
    const { dispatch } = this.props;

    if (email && password) {
      dispatch(
        userActions.login(email, password, () => {
          this.props.history.push("/");
        })
      );
    }
  }

  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
    

    this.setState({ user });
  }

  render() {
    return (
      <LoginForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.props.alert}
      />
    );
  }
}

function mapStateToProps(state) {
  const {alert} = state;
  return {
    alert
  };
}

export default connect(mapStateToProps)(LoginPage);