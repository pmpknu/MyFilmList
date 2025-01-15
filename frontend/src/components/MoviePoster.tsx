import { Card, CardHeader, Image } from '@nextui-org/react';
import UploadPhotoModal from './UploadPhotoModal';

export interface MoviePosterProps {
  posterUrl: string;
  title: string;
  handleFunction: () => void;
}

const MoviePoster: React.FC<MoviePosterProps> = ({ posterUrl, title, handleFunction}) => {
  return (
    <Card className="col-span-12 sm:col-span-4 h-[300px] max-w-xs">
      <CardHeader className="absolute z-10 top-1 flex-col !items-start">
        <h4 className="text-white font-medium text-large">{title}</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt="Card background"
        className="z-0 w-full h-full object-cover"
        src={posterUrl}
        onClick={handleFunction}
      />
    </Card>
  )
}

export default MoviePoster;
