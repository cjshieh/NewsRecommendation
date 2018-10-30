import React from "react";
import { connect } from "react-redux";
import { alertActions, userActions } from "../../actions";
import SignUpForm from "./signup_form";

class SignUpPage extends React.Component {
  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      errors: {},
      user: {
        email: "",
        password: "",
        confirm_password: ""
      }
    };
    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(alertActions.clear());
  }

  // Pre-submission.
  processForm(event) {
    event.preventDefault();

    const email = this.state.user.email;
    const password = this.state.user.password;
    const confirm_password = this.state.user.confirm_password;

    if (password !== confirm_password) {
      return;
    }

    const user = { username: email, password };
    const { dispatch } = this.props;
    dispatch(
      userActions.register(user, () => {
        this.props.history.push("/");
      })
    );

    // TODO; post signup data.
  }

  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
    // user['email'] = '123@123.com'
    // user['password'] = '12345678'
    // user['confirm_password'] = '12345678'

    this.setState({ user });

    if (this.state.user.password !== this.state.user.confirm_password) {
      const errors = this.state.errors;
      errors.password = "Password and Confirm Password don't match.";
      this.setState({ errors });
    } else {
      const errors = this.state.errors;
      errors.password = "";
      this.setState({ errors });
    }
  }

  render() {
    return (
      <SignUpForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        validation={this.state.errors}
        alert={this.props.alert}
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

export default connect(mapStateToProps)(SignUpPage);
