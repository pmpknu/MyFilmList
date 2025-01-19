import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils"

export interface MoviePosterProps {
  posterUrl: string | undefined;
  title: string;
  aspectRatio?: "portrait" | "square";
  onClick?: () => void;
}

const Poster: React.FC<MoviePosterProps> = ({ posterUrl, title, aspectRatio = "portrait", onClick}) => {
  return (
    <Card className="col-span-12 sm:col-span-4 h-[300px] max-w-xs" onClick={onClick}>
      {posterUrl && (
      <div className="overflow-hidden rounded-md">
        <Image
          src={posterUrl}
          alt="Card background"
          fill
          className={cn(
            "h-auto w-auto object-cover transition-all hover:scale-105",
            aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
          )}

        />
      </div>
      )}
      <CardFooter className="flex-col !items-start">
      <h4 className="text-red font-medium text-large">{title}</h4>
      </CardFooter>
    </Card>
  )
}

export default Poster;
