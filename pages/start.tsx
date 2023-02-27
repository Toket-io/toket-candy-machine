import { NextPage } from "next";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import getDescriptiveErrorMessage from "../utils/getDescriptiveErrorMessage";

const Login: NextPage = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string>("");
  const { signInAnonymously } = useAuth();

  const startDemo = async () => {
    setSubmitting(true);
    setErrorText("");

    try {
      await signInAnonymously();

      setSubmitting(false);
      router.push("/");
    } catch (error) {
      setErrorText(getDescriptiveErrorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-row align-items-center dark:bg-transparent">
      <Container>
        <Row className="justify-content-center align-items-center px-3">
          <Col lg={8}>
            <Row className="bg-dark text-white d-flex align-items-center justify-content-center p-5 rounded-xl border border-toket border-3">
              <div className="text-center">
                <h2>Welcome</h2>
                <p>
                  This is a Demo of the <b>Toket NFT API</b>. Feel free to play
                  with it and let us know if you have any questions or feedback.
                </p>
                {errorText != "" && (
                  <Alert variant={"danger"}>{errorText}</Alert>
                )}
                <div className="mt-4">
                  <button
                    className="button-85"
                    role="button"
                    onClick={startDemo}
                    type="submit"
                  >
                    {submitting ? <Spinner size="sm" /> : "Start Demo"}
                  </button>
                </div>
              </div>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
