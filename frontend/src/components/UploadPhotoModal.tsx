import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useDropzone } from "react-dropzone";

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoFile: File | null;
  setPhotoFile: React.Dispatch<React.SetStateAction<File | null>>;
  handlePhotoSave: () => void;
}

const UploadPhotoModal: React.FC<UploadPhotoModalProps> = ({
  isOpen,
  onClose,
  photoFile,
  setPhotoFile,
  handlePhotoSave,
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setPhotoFile(acceptedFiles[0]);
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <h4>Upload Photo</h4>
      </ModalHeader>
      <ModalBody>
        {photoFile ? (
          <div style={{ textAlign: "center" }}>
            <p>File: {photoFile.name}</p>
          </div>
        ) : (
          <div
            {...getRootProps()}
            style={{
              border: "1px dashed #ccc",
              padding: "10px",
              textAlign: "center",
            }}
          >
            <input {...getInputProps()} />
            <h3>Drag and drop a photo here, or click to select one</h3>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose} color="default">
          Cancel
        </Button>
        {photoFile && (
          <Button onClick={handlePhotoSave} color="primary">
            Save
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default UploadPhotoModal;
