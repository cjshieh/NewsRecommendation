import "./login_form.css";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment
} from "semantic-ui-react";

import Logo from "../../assets/logo_login.png";
import PropTypes from 'prop-types';
import React from "react";
import { Link } from "react-router-dom";

const LoginForm = ({
  onSubmit,
  onChange,
  errors,
  user
}) => (
  <div className="login-form">
    <Grid textAlign="center" className="yn-login-elements" verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="grey" textAlign="center">
          <Image src={Logo} /> Log-in to your account
        </Header>
        <Form size="large" onSubmit={onSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              name="email"
              placeholder="E-mail address"
              onChange={onChange}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              name="password"
              placeholder="Password"
              type="password"
              onChange={onChange}
            />
            <Message
              className="errorMsg"
              // style={{display: "block"}}
              error
              header="Action Forbidden"
              content="You can only sign up for an account once with a given e-mail address."
            />
            <Button color="grey" fluid size="large">
              Login
            </Button>
          </Segment>
        </Form>
        <Message>
          New to us? <Link to="/signup">Sign Up</Link>
        </Message>
      </Grid.Column>
    </Grid>
  </div>
);

LoginForm.prototype = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

export default LoginForm;
