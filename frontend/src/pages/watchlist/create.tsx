import React from "react";
import { Card } from "@nextui-org/react";
import UploadPhotoModal from "@/components/UploadPhotoModal";
import WatchListService from "@/services/WatchListService";
import { WatchListCreateDto } from "@/interfaces/watchlist/dto/WatchListCreateDto";
import InputWatchListInfo from "@/components/InputWatchlistInfo";
import router from "next/router";

const CreateWatchListPage = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [watchListId, setWatchListId] = React.useState<number | null>(null);

  const handlePhotoSave = async () => {
    if (photoFile && watchListId) {
      const formData = new FormData();
      formData.append("file", photoFile);
      try {
        const response = await WatchListService.uploadWatchListPhoto(watchListId, formData);
        router.push(`/watchlist/${response.data.id}`);
      } catch (error) {
        console.error("Failed to upload photo", error);
      } finally {
        setIsModalOpen(false);
      }
    }
  };

  const handleWatchListSubmit = (data: WatchListCreateDto) => {
    WatchListService.createWatchList(data)
      .then((response) => {
        setWatchListId(response.data.id);
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error("Failed to create watchlist", error);
      });
  };

  return (
    <Card>
      <h2>Create Watchlist</h2>
      <InputWatchListInfo onSubmit={handleWatchListSubmit} />
      <UploadPhotoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        photoFile={photoFile}
        setPhotoFile={setPhotoFile}
        handlePhotoSave={handlePhotoSave}
      />
    </Card>
  );
};

export default CreateWatchListPage;
