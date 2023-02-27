import { Button, Row, Spinner, Col } from "react-bootstrap";

export type PendingTransactionProps = {
  id: string;
  transactionHash: string;
  tokenId: string;
  contractAddress: string;
};

export default function PendingTransaction(props: PendingTransactionProps) {
  const { id, transactionHash, tokenId, contractAddress } = props;

  return (
    <div className="w-full sm:w-[400px] rounded-xl shadow-md relative bg-dark text-white px-4 py-5 border border-toket border-3">
      <div>
        <h4 className="mb-3 font-bold text-white text-center">Mint Result</h4>
      </div>

      <Row className="mb-3">
        <h6 className="text-l text-white">Mint ID</h6>
        <h6 className="text-l text-white font-bold">{id}</h6>
      </Row>

      <Row className="mb-3">
        <Col sm={8}>
          <h6 className="text-l text-white">Transaction Hash</h6>

          {transactionHash ? (
            <h6 className="text-l text-white font-bold">
              {`${transactionHash.substring(
                0,
                10
              )}...${transactionHash.substring(transactionHash.length - 10)}`}
            </h6>
          ) : (
            <div>
              <Spinner size="sm" />
            </div>
          )}
        </Col>
        {transactionHash && (
          <Col sm={4}>
            <a
              style={{
                textDecoration: "none",
                color: "white",
              }}
              className="d-grid gap-2"
              target="_blank"
              href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="secondary">
                Open Polygonscan
              </Button>
            </a>
          </Col>
        )}
      </Row>

      <Row className="mb-3">
        <Col sm={8}>
          <h6 className="text-l text-white">
            {tokenId ? "Token ID" : "Transaction pending"}
          </h6>

          {tokenId ? (
            <h6 className="text-l text-white font-bold">{tokenId}</h6>
          ) : (
            <div>
              <Spinner size="sm" />
            </div>
          )}
        </Col>

        {tokenId && (
          <Col sm={4}>
            <a
              style={{
                textDecoration: "none",
                color: "white",
              }}
              className="d-grid gap-2"
              target="_blank"
              href={`https://testnets.opensea.io/assets/mumbai/${contractAddress}/${tokenId}`}
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="primary">
                Open OpenSea
              </Button>
            </a>
          </Col>
        )}
      </Row>
    </div>
  );
}
