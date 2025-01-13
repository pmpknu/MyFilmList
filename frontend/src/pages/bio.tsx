import React, { useState, useEffect } from "react";
import AuthService from "@/services/AuthService";
import UserService from "@/services/UserService";
import { UserDto } from "@/interfaces/user/dto/UserDto";
import {
  Button,
  Card,
  Input,
  Avatar,
  Spacer,
  CardHeader,
  CardBody,
  CardFooter,
  Textarea,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
} from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import { UserUpdateDto } from "@/interfaces/user/dto/UserUpdateDto";
import { useRouter } from "next/router";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/styles/Icons";
import { set } from "store";

const BioPage: React.FC = () => {
  const router = useRouter();

  const [user, setUser] = useState<UserDto>();
  const [isEditing, setIsEditing] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [passwordUpdate, setPasswordUpdate] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const fetchCurrentUser = async () => {
    try {
      const response = await AuthService.getCurrentUser();
      if (!response.data.user) {
        router.push('/login');
      }
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch current user", error);
      router.push('/login');
    }
  };

  const handleEditMode = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    try {
      if (user.bio) {
        await UserService.updateUser(user.id,{
          username: user.username,
          email: user.email,
          bio: user.bio
       } as UserUpdateDto);
      } else {
        await UserService.updateUser(user.id, {
          username: user.username,
          email: user.email,
        } as UserUpdateDto);
      }

      if (photoFile) {
        const formData = new FormData();
        formData.append("file", photoFile);
        await UserService.uploadPhoto(formData);
      }

      setIsEditing(false);
      fetchCurrentUser();
    } catch (error) {
      console.error("Failed to save changes", error);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setPhotoFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const toggleNewPasswordVisibility = () => setIsNewPasswordVisible(!isNewPasswordVisible);

  useEffect(() => {
    if (!user) return;
    if (!user.username) {
      setUsernameError('Username is required');
    } else {
      setUsernameError(
        user.username.length < 3 || user.username.length > 63
          ? 'Username must be between 3 and 63 characters'
          : ''
      );
    }
  }, [user?.username]);

  useEffect(() => {
    if (!user) return;
    if (!user.email) setEmailError('Email is required');
    setEmailError(
      user.email.length > 0 && (user.email.length < 3 || user.email.length > 127)
        ? 'Email must be between 3 and 127 characters'
        : ''
    );
  }, [user?.email]);

  useEffect(() => {
      setPasswordError(
        passwordUpdate.currentPassword.length > 0 && passwordUpdate.currentPassword.length < 6 || passwordUpdate.currentPassword.length > 127
          ? 'Password must be between 6 and 127 characters'
          : ''
      );
  }, [passwordUpdate.currentPassword]);

  useEffect(() => {
      setNewPasswordError(
        passwordUpdate.newPassword.length > 0 && passwordUpdate.newPassword.length < 6 || passwordUpdate.newPassword.length > 127
          ? 'Password must be between 6 and 127 characters'
          : ''
      );
  }, [passwordUpdate.newPassword]);

  const isSaveDisabled: boolean | undefined = isEditing ?
      !user || !!usernameError || !!emailError || !!passwordError || !!newPasswordError : 
      false;

  const saveButtonColor: 'default' | 'primary' = isSaveDisabled ? 'default' : 'primary';

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePhotoSave = async () => {
    if (photoFile) {
      const formData = new FormData();
      formData.append("file", photoFile);
      try {
        await UserService.uploadPhoto(formData);
        setIsModalOpen(false);
        fetchCurrentUser();
      } catch (error) {
        console.error("Failed to upload photo", error);
      }
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      {user && (
        <Card>
          <CardHeader>
            <Avatar
                size="lg"
                src={photoFile ? URL.createObjectURL(photoFile) : user.photo || undefined}
                alt="User Photo"
                onClick={() => setIsModalOpen(true)}
              />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <ModalContent>
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
                      style={{ border: "1px dashed #ccc", padding: "10px", textAlign: "center" }}
                    >
                      <input {...getInputProps()} />
                      <h3>Drag and drop a photo here, or click to select one</h3>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    onClick={() => {
                      setPhotoFile(null);
                      setIsModalOpen(false);
                    }}
                    color="default"
                  >
                    Cancel
                  </Button>
                  {photoFile && (
                    <Button onClick={handlePhotoSave} color="primary">
                      Save
                    </Button>
                  )}
                </ModalFooter>
              </ModalContent>
            </Modal>
          </CardHeader>
          <CardBody>
            <Input
              isClearable
              label="Username"
              value={user.username}
              isReadOnly={!isEditing}
              isRequired={isEditing}
              onClear={() => 
                setUser({ ...user, username: '' })
              }
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              isInvalid={usernameError !== ''}
              errorMessage={usernameError}
            />
            <Spacer y={0.5} />
            <Input
              isClearable
              label="Email"
              value={user.email}
              isReadOnly={!isEditing}
              isRequired={isEditing}
              onClear={() => setUser({ ...user, email: '' })}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              isInvalid={emailError !== ''}
              errorMessage={emailError}
            />
            <Spacer y={0.5} />
            <Textarea
              label="Bio"
              value={user.bio || "No bio available"}
              isReadOnly={!isEditing}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
            />
            <Spacer y={0.5} />
            <Input
              className="max-w-xs"
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={togglePasswordVisibility}
                >
                  {isPasswordVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              label="Current Password"
              placeholder="Enter your password"
              type={isPasswordVisible ? 'text' : 'password'}
              value={passwordUpdate.currentPassword}
              isReadOnly={!isEditing}
              onChange={(e) =>
                setPasswordUpdate({ ...passwordUpdate, currentPassword: e.target.value })
              }
              isInvalid={passwordError !== ''}
              errorMessage={passwordError}
              onClick={() => setIsEditing(true)}
            />
            <Spacer y={0.5} />
            <Input
              className="max-w-xs"
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleNewPasswordVisibility}
                >
                  {isNewPasswordVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              label="New Password"
              placeholder="Enter new password"
              type={isNewPasswordVisible ? 'text' : 'password'}
              value={passwordUpdate.newPassword}
              isReadOnly={!isEditing}
              onChange={(e) =>
                setPasswordUpdate({ ...passwordUpdate, newPassword: e.target.value })
              }
              isInvalid={newPasswordError !== ''}
              errorMessage={newPasswordError}
              onClick={() => setIsEditing(true)}
            />
          </CardBody>
          <CardFooter>
            {isEditing ? (
              <Button
                onClick={handleSaveChanges}
                disabled={isSaveDisabled}
                color={saveButtonColor}
              >
                Save Changes</Button>
            ) : (
              <Button onClick={handleEditMode}>Enter Edit Mode</Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default BioPage;
