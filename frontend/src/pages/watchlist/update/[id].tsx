import React, { useEffect } from "react";
import { Card, CardHeader } from "@nextui-org/react";
import UploadPhotoModal from "@/components/UploadPhotoModal";
import WatchListService from "@/services/WatchListService";
import { WatchListDto } from "@/interfaces/watchlist/dto/WatchListDto";
import InputWatchListInfo from "@/components/InputWatchlistInfo";
import { useRouter } from "next/router";
import WatchListPoster from "@/components/MoviePoster";
import { WatchListUpdateDto } from "@/interfaces/watchlist/dto/WatchListUpdateDto";

const UpdateWatchListPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [watchList, setWatchList] = React.useState<WatchListDto | null>(null);

  useEffect(() => {
    if (!id) return;
    const watchListId = parseInt(String(id), 10);
    if (!watchListId) return;

    WatchListService.getWatchListById(watchListId)
      .then((response) => {
        setWatchList(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch watchlist details", error);
      });
  }, [id]);

  const handlePhotoSave = async () => {
    if (photoFile && watchList) {
      const formData = new FormData();
      formData.append("file", photoFile);
      try {
        const response = await WatchListService.uploadWatchListPhoto(watchList.id, formData);
        setWatchList(response.data);
      } catch (error) {
        console.error("Failed to upload photo", error);
      } finally {
        setIsModalOpen(false);
      }
    }
  };

  const handleWatchListSubmit = (data: WatchListUpdateDto) => {
    if (!id) return;
    const watchListId = parseInt(String(id), 10);
    if (!watchListId) return;

    WatchListService.updateWatchList(watchListId, data)
      .then((response) => {
        setWatchList(response.data);
        router.push(`/watchlist/${response.data.id}`);
      })
      .catch((error) => {
        console.error("Failed to update watchlist", error);
      });
  };

  if (!watchList) return <div>Loading watchlist...</div>;

  return (
    <>
      <h2>Update Watchlist</h2>
      <Card>
        <CardHeader>
          <WatchListPoster
            posterUrl={watchList.photo}
            title={watchList.name}
            handleFunction={() => setIsModalOpen(true)}
          />
        </CardHeader>
        <InputWatchListInfo onSubmit={handleWatchListSubmit} initialData={watchList} />
        <UploadPhotoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          photoFile={photoFile}
          setPhotoFile={setPhotoFile}
          handlePhotoSave={handlePhotoSave}
        />
      </Card>
    </>
  );
};

export default UpdateWatchListPage;
