import cn from "classnames";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import * as Yup from "yup";
import { Formik } from "formik";
import { Button, Col, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { useInterval } from "../utils/use-interval";
import MintForm, { MintFormResult } from "../components/MintForm";
import PendingTransaction from "../components/PendingTransaction";
import DropZone from "@/components/DropZone";
import { firebaseUploadNewBytes } from "@/api/firebase";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { currentUser } = useAuth();
  const [image, setImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [mintLoading, setMintLoading] = useState(false);
  const [canShowImage, setCanShowImage] = useState(false);
  const [mintId, setMintId] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [tokenId, setTokenId] = useState(null);

  useInterval(
    async () => {
      try {
        const res = await fetch(`/api/getMintedNft?id=${mintId}`);
        const json = await res.json();

        if (res.status === 200) {
          console.log("*AC fetched mint: ", json.transactionHash);
          setTransactionHash(json.transactionHash);
          setTokenId(json.tokenId);
        }
      } catch (error) {
        toast.error("Something went wrong...", { position: "top-center" });
      }
    },
    mintId && (!transactionHash || !tokenId) ? 1000 : null
  );

  const formSubmit = async (formValue) => {
    const { file, name, description, wallet } = formValue;

    setMintLoading(true);

    // Reset mint state
    setTransactionHash(null);
    setTokenId(null);
    setMintId(null);

    var safeUrl: string | undefined | null = uploadedImageUrl || null;
    try {
      if (!uploadedImageUrl) {
        toast("Uploading image...", { position: "top-center" });

        const imageUrl = await firebaseUploadNewBytes(
          `images/${currentUser.uid}-${file.name}`,
          file
        );
        safeUrl = imageUrl;
        setUploadedImageUrl(imageUrl);
      }

      toast("Minting your NFT...", { position: "top-center" });
      const url = "/api/mintNft";
      const data = {
        name,
        description,
        wallet,
        imageUrl: safeUrl,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (response.status === 200) {
        console.log("*AC jsonData: ", json);
        setMintId(json.id);
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error("Something went wrong...", { position: "top-center" });
    }
    setMintLoading(false);
  };

  return (
    <>
      <Head>
        <title>Toket NFT Generator</title>
      </Head>
      <div
        className="antialiased mx-auto px-4 py-20 h-100 bg-dark"
        style={{ minHeight: "30%" }}
      >
        <Toaster />
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl tracking-tighter pb-10 font-bold text-white">
            Toket NFT Generator
          </h1>
          <div className="w-full sm:w-[400px] relative">
            <Formik
              validationSchema={Yup.object(validationSchema())}
              onSubmit={formSubmit}
              validateOnChange={false}
              initialValues={{
                file: null,
                name: "",
                description: "NFT auto generated usign Toket's API",
                wallet: "",
              }}
            >
              {({
                handleSubmit,
                handleChange,
                setFieldValue,
                values,
                errors,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Form.Group as={Col} md="12" controlId="validationFormik01">
                      <InputGroup hasValidation>
                        <div className="relative flex w-full items-center justify-center mb-6">
                          <div className="w-full sm:w-[400px] h-[400px] rounded-xl shadow-md relative bg-gray-700 overflow-hidden">
                            {image ? (
                              <Image
                                alt={"Image uploaded by user"}
                                className={cn(
                                  "opacity-0 duration-1000 ease-in-out rounded-xl shadow-md h-full object-cover",
                                  { "opacity-100": canShowImage }
                                )}
                                src={image}
                                fill={true}
                                onLoadingComplete={() => {
                                  setCanShowImage(true);
                                }}
                              />
                            ) : (
                              <DropZone
                                file={values.file}
                                onUpload={(uploadedFile, url) => {
                                  setFieldValue("file", uploadedFile);
                                  setImage(url);
                                }}
                              />
                            )}
                          </div>
                        </div>

                        <Form.Control.Feedback type="invalid">
                          {errors.file}
                        </Form.Control.Feedback>

                        <Form.Control
                          hidden={true}
                          type="text"
                          isInvalid={!!errors.file}
                        />

                        <Form.Control.Feedback type="invalid">
                          {errors.file}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Row>

                  <div className="relative flex w-full items-center justify-center">
                    <div
                      hidden={values.file == null}
                      className="flex w-full sm:w-auto flex-col sm:flex-row"
                    >
                      <MintForm
                        values={values}
                        errors={errors}
                        handleChange={handleChange}
                        loading={mintLoading}
                      />
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          {mintId && (
            <PendingTransaction
              id={mintId ?? ""}
              transactionHash={transactionHash}
              tokenId={tokenId}
            />
          )}
        </div>
      </div>
    </>
  );
}

const TEXT_MIN_LENGTH = 10;
function validationSchema() {
  return {
    file: Yup.mixed()
      .required("Image is required")
      .test(
        "fileType",
        "File must be of type jpeg or png",
        (value) =>
          value === null ||
          (value instanceof File &&
            (value.type === "image/jpeg" || value.type === "image/png"))
      ),
    name: Yup.string()
      .min(
        TEXT_MIN_LENGTH,
        `Name must be at least ${TEXT_MIN_LENGTH} chareacters long`
      )
      .required("Name is required"),
    description: Yup.string()
      .min(
        TEXT_MIN_LENGTH,
        `Description must be at least ${TEXT_MIN_LENGTH} chareacters long`
      )
      .required("Description is required"),
    wallet: Yup.string()
      .required("Recipient address is required")
      .matches(/^0x[a-fA-F0-9]{40}$/, "Please use a valid a address"),
  };
}
