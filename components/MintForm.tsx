import { Col, Form, InputGroup, Row, Spinner } from "react-bootstrap";

export type MintFormResult = {
  name: string;
  description: string;
  wallet: string;
};

export type MintFormProps = {
  values: MintFormResult;
  errors: MintFormResult;
  handleChange: React.ChangeEventHandler;
  loading: boolean;
};

export default function MintForm(props: MintFormProps) {
  const { values, errors, handleChange, loading } = props;

  return (
    <div className="w-full sm:w-[400px] rounded-xl shadow-md relative bg-gray-700 text-white px-4 py-5">
      <h4 className="mb-3 font-bold text-white text-center">Setup your NFT</h4>
      <Row className="mb-3">
        <Form.Group as={Col} md="12" controlId="validationFormik01">
          <Form.Label>NFT Name</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="text"
              placeholder="NFT Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
              disabled={loading}
            />

            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} md="12" controlId="validationFormik02">
          <Form.Label>NFT Description</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="text"
              placeholder="NFT Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              isInvalid={!!errors.description}
              disabled={loading}
            />

            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>

      <Row className="mb-4">
        <Form.Group as={Col} md="12" controlId="validationFormik03">
          <Form.Label>Wallet Address</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="text"
              placeholder="Recipient Address"
              name="wallet"
              value={values.wallet}
              onChange={handleChange}
              isInvalid={!!errors.wallet}
              disabled={loading}
            />

            <Form.Control.Feedback type="invalid">
              {errors.wallet}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>

      <Row>
        <div style={styles.buttonRow}>
          <button
            className="button-85"
            role="button"
            type="submit"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "Mint NFT"}
          </button>
        </div>
      </Row>
    </div>
  );
}

const styles = {
  titleContainer: {
    textAlign: "center",
  },
  buttonRow: {
    display: "flex",
    alignItems: "center",
    padding: 0,
    width: "100%",
    justifyContent: "center",
  },
};
