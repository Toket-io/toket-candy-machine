import { Button, Row, Spinner } from "react-bootstrap";

export type PendingTransactionProps = {
  id: string;
  transactionHash: string;
  tokenId: string;
};

export default function PendingTransaction(props: PendingTransactionProps) {
  const { id, transactionHash, tokenId } = props;

  return (
    <div className="w-full sm:w-[400px] rounded-xl shadow-md relative bg-gray-700 text-white px-4 py-5">
      <div>
        <h4 className="mb-3 font-bold text-white text-center">Mint Result</h4>
      </div>

      <Row className="mb-3">
        <h6 className="text-l text-white">Mint ID</h6>
        <h6 className="text-l text-white font-bold">{id}</h6>
      </Row>

      <Row className="mb-3">
        <h6 className="text-l text-white">Transaction Hash</h6>

        {transactionHash ? (
          <h6 className="text-l text-white font-bold">
            {`${transactionHash.substring(0, 10)}...${transactionHash.substring(
              transactionHash.length - 10
            )}`}
          </h6>
        ) : (
          <div>
            <Spinner size="sm" />
          </div>
        )}
      </Row>

      <Row className="mb-3">
        <h6 className="text-l text-white">
          {tokenId ? "Token ID" : "Token ID - Transaction pending"}
        </h6>

        {tokenId ? (
          <h6 className="text-l text-white font-bold">{tokenId}</h6>
        ) : (
          <div>
            <Spinner size="sm" />
          </div>
        )}
      </Row>

      {transactionHash && (
        <Row className="mb-3">
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
            <Button variant="primary" type="submit">
              {!transactionHash ? <Spinner size="sm" /> : "Open Explorer"}
            </Button>
          </a>
        </Row>
      )}
    </div>
  );
}
