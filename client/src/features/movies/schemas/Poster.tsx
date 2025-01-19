import Image from "next/image";
import { PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Card } from "@/components/ui/card";

export interface MoviePosterProps extends React.HTMLAttributes<HTMLDivElement> {
  posterUrl: string | undefined;
  title: string;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
  description?: string;
  onAddToLibrary?: () => void;
  onPlayNext?: () => void;
  onPlayLater?: () => void;
}

const Poster: React.FC<MoviePosterProps> = ({
  posterUrl,
  title,
  aspectRatio,
  width,
  height,
  description,
  className,
  onAddToLibrary,
  onPlayNext,
  onPlayLater,
  ...props
}) => {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
        <Card className={cn(`h-[${height}px] w-[${width}px]`, "col-span-12 sm:col-span-4 max-w-xs rounded-lg overflow-hidden")}>
          {posterUrl && (
            <div className="overflow-hidden rounded-lg">
              <Image
              src={posterUrl}
              alt={title}
              width={width}
              height={height}
              className={cn(
                "z-0 w-full h-full object-cover transition-all hover:scale-105",
                aspectRatio === "portrait" ? "aspect-[3/4]" : aspectRatio === "square" ? "aspect-square" : ""
              )}
              />
            </div>
          )}
        </Card>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem onClick={onAddToLibrary}>Add to Library</ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Playlist
              </ContextMenuItem>
              <ContextMenuSeparator />
              {/* Example hardcoded playlists, replace with dynamic content if needed */}
              {["Favorites", "Watch Later", "Comedy"].map((playlist) => (
                <ContextMenuItem key={playlist}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 15V6M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM12 12H3M16 6H3M12 18H3" />
                  </svg>
                  {playlist}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={onPlayNext}>Play Next</ContextMenuItem>
          <ContextMenuItem onClick={onPlayLater}>Play Later</ContextMenuItem>
          <ContextMenuItem>Create Station</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Like</ContextMenuItem>
          <ContextMenuItem>Share</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{title}</h3>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
};

export default Poster;
