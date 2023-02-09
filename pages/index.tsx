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

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [mintLoading, setMintLoading] = useState(false);
  const [canShowImage, setCanShowImage] = useState(false);
  const [mintId, setMintId] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);

  useInterval(
    async () => {
      try {
        const res = await fetch(`/api/getMintedNft?id=${mintId}`);
        const json = await res.json();

        if (res.status === 200) {
          console.log("*AC fetched mint: ", json.transactionHash);
          setTransactionHash(json.transactionHash);
        }
      } catch (error) {
        toast.error("Something went wrong...", { position: "top-center" });
      }
    },
    mintId && !transactionHash ? 1000 : null
  );

  const formSubmit = async (formValue) => {
    const { file, name, description, wallet } = formValue;

    toast("Uploading image...", { position: "top-center" });

    setLoading(true);

    // Reset mint state
    setTransactionHash(null);
    setMintId(null);

    // Reset image state
    // setImage(null);
    setCanShowImage(false);

    setLoading(true);
    toast("Generating your image...", { position: "top-center" });

    try {
      const response = await fetch(`/api/image?prompt=${prompt}`);
      const json = await response.json();

      if (response.status === 202) {
        console.log("*AC jsonData: ", json.data[0].url);
        setLoading(false);
        // setImage(json.data[0].url);
      }
    } catch (error) {
      toast.error("Something went wrong...", { position: "top-center" });
    }
  };

  // async function mintNft(result: React.FormEventHandler) {
  //   toast("Minting your NFT...", { position: "top-center" });
  //   // setMintLoading(true);

  //   const { name, description, wallet } = result;

  //   console.log("name: ", name);
  //   console.log("description: ", description);
  //   console.log("wallet: ", wallet);

  //   // Reset mint state
  //   setTransactionHash(null);
  //   setMintId(null);

  //   const url = "/api/mintNft";
  //   const data = {
  //     name,
  //     description,
  //     wallet,
  //     imageUrl: image,
  //     prompt,
  //   };

  //   try {
  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     const json = await response.json();

  //     if (response.status === 200) {
  //       console.log("*AC jsonData: ", json);
  //       setMintId(json.id);
  //     }
  //   } catch (error) {
  //     toast.error("Something went wrong...", { position: "top-center" });
  //   }

  //   setMintLoading(false);
  // }

  const showLoadingState = loading || (image && !canShowImage);

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
                                loading={loading}
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

          {1 == 1 && (
            <PendingTransaction
              id={mintId ?? ""}
              transactionHash={transactionHash}
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

const styles = {
  transactionHash: {
    backgroundColor: "#292D32",
    padding: "10px 30px",
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  transactionHashMob: {
    backgroundColor: "#292D32",
    padding: 15,
    borderRadius: 18,
    display: "flex",
    alignItems: "center",
    width: "100%",
    flexDirection: "column",
    marginBottom: "40px",
  },
  transactionHashTexts: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    overflow: "hidden",
  },
  transactionHashTextsMob: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    width: "90%",
  },
  transactionHashTitle: {
    fontSize: "18px",
    lineHeight: "24px",
  },
  transactionHashValue: {
    fontSize: "18px",
    fontWeight: 700,
    lineHeight: "24px",
    // overflow: "scroll",
    // backgroundColor: "red",
  },
  pendingTransaction: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 18,
  },
};
