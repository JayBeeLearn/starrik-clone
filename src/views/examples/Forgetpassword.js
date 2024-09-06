import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setResetSuccess("Password reset email sent successfully");
      setResetError("");
    } catch (error) {
      setResetError(error.message);
      setResetSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Reset your password</small>
            </div>
            <Form role="form" onSubmit={handleResetPassword}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email for reset"
                    type="email"
                    autoComplete="new-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                {resetError && (
                  <div className="text-center text-danger mb-3">
                    {resetError}
                  </div>
                )}
                {resetSuccess && (
                  <div className="text-center text-success mb-3">
                    <p>{resetSuccess} </p>
                    <p>
                      <Link to={'/auth/login'} > Back to Login </Link>
                    </p>
                  </div>
                )}
                <Button
                  className="my-4"
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Reset Password"}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        {/* <Row className="mt-3">
          <Col xs="6">
            <a className="text-light" href="login">
              <small>Back to login</small>
            </a>
          </Col>
        </Row> */}
      </Col>
    </>
  );
};

export default PasswordReset;
