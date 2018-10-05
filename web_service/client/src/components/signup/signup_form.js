import "./signup_form.css";
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
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

const LoginForm = ({ onSubmit, onChange, validation, alert }) => {
  return (
    <div className="yn-signup-form">
      <Grid
        textAlign="center"
        className="yn-signup-elements"
        verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="grey" textAlign="center">
            <Image src={Logo} /> Sign Up for YouNews
          </Header>
          <Form
            onSubmit={onSubmit}
            error={alert.type ? true : false}
            warning={ validation.password !== undefined && validation.password !== ""}>
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                name="email"
                placeholder="E-mail address"
                onChange={onChange}
                required
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                name="password"
                placeholder="Password"
                type="password"
                onChange={onChange}
                required
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                name="confirm_password"
                placeholder="Confirm Password"
                type="password"
                onChange={onChange}
                required
              />
              <Message
                className="warningMsg"
                warning
                header="Could you check something!"
                list={[validation.password]}
              />
              <Message
                className={alert.type ? "errorMsg" : ""}
                // style={{display: "block"}}
                error
                header="Action Forbidden"
                content={alert.message}
              />
              <Button color="blue" fluid size="large">
                Signup
              </Button>
            </Segment>
          </Form>
          <Message>
            Already sign up? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    </div>
  );
};

LoginForm.prototype = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired,
  alert: PropTypes.object.isRequired
};

export default LoginForm;
