import React from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowUp,
  faFileImage,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Alert, Row } from "react-bootstrap";

const baseStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
};

const focusedStyle = {
  backgroundColor: "#222",
};

const acceptStyle = {
  backgroundColor: "#00e676",
};

const rejectStyle = {
  backgroundColor: "#ff1744",
};

export type DropZoneProps = {
  loading: boolean;
  file: File | null;
  onUpload: (result: File, url: string) => void;
};

function DropZone(props: DropZoneProps) {
  const { onUpload } = props;

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: { "image/*": [] },
    onDropRejected: (files) => console.log("onDropRejected: ", files),
    onDropAccepted: (files) => onDropAccepted(files),
    multiple: false,
  });

  const style = React.useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  function onDropAccepted(acceptedFiles) {
    const file = acceptedFiles[0];
    onUpload(file, URL.createObjectURL(file));
  }

  function onDropRejected(rejectedFiles) {
    console.log("onDropRejected: ", rejectedFiles);
  }

  return (
    <div {...getRootProps({ style })}>
      <input {...getInputProps()} />
      <Row className="d-flex text-white align-items-center justify-content-center rounded-xl">
        <FontAwesomeIcon
          icon={
            isDragActive
              ? isDragReject
                ? faXmarkCircle
                : faFileImage
              : faCloudArrowUp
          }
          size="10x"
        />
        <h1 className="text-4xl tracking-tighter pb-2 pt-10 font-bold text-white text-center">
          Drop your image here
        </h1>
        <h6 className="text-1xl tracking-tighter text-white text-center">
          Or click to open file explorer
        </h6>
      </Row>
    </div>
  );
}

export default DropZone;
