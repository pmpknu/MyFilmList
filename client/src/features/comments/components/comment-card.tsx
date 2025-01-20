'use client';

import React, { useState } from 'react';
import { CommentDto } from '@/interfaces/comment/dto/CommentDto';
import { Role } from '@/interfaces/role/model/UserRole';
import CommentService from '@/services/CommentService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CommentCardProps {
  comment: CommentDto;
  onCommentDeleted: (id: number) => void;
  onCommentUpdated: (updatedComment: CommentDto) => void;
}

export default function CommentCard({ comment, onCommentDeleted, onCommentUpdated }: CommentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [visible, setVisible] = useState(comment.visible);

  const isAdmin = comment.user.roles.includes('ROLE_ADMIN' as Role);
  const isModerator = comment.user.roles.includes('ROLE_MODERATOR' as Role);
  const isCreator = comment.user.id === 1;

  const cardClass = isAdmin
    ? 'border-red-500 bg-red-20'
    : isModerator
      ? 'border-blue-500 bg-blue-20'
      : 'border-gray-300 bg-transparent';

  const toggleVisibility = async () => {
    try {
      const updatedComment = await CommentService.updateComment(comment.id, {
        text: comment.text,
        visible: !visible,
      });
      setVisible(updatedComment.data.visible);
    } catch (error) {
      console.error('Failed to update visibility', error);
    }
  };

  const handleEdit = async () => {
    try {
      const updatedComment = await CommentService.updateComment(comment.id, {
        text: editedText,
      });
      onCommentUpdated(updatedComment.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update comment', error);
    }
  };

  const handleDelete = async () => {
    try {
      await CommentService.deleteComment(comment.id);
      onCommentDeleted(comment.id);
    } catch (error) {
      console.error('Failed to delete comment', error);
    }
  };

  const router = useRouter();

  return (
    <Card className={`flex gap-4 p-4 border ${cardClass}`}>
      <div className="flex-shrink-0">
        <Avatar className="w-12 h-12" onClick={()=>{router.push(`/users/${comment.user.id}`)}}>
          <AvatarImage src={comment.user.photo} alt={comment.user.username} />
          <AvatarFallback>{comment.user.username.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-semibold">{comment.user.username}</h3>
            <p className="text-xs text-muted-foreground">{comment.user.email}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={toggleVisibility}>
                {visible ? 'Сделать приватным' : 'Сделать публичным'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEditing(true)}>Изменить</DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="hover:bg-red-100 focus:bg-red-100"
              >
                {isCreator ? 'Удалить' : 'Удалить'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>


        <div className="mt-2 text-sm text-gray-700">
          <p>{isExpanded ? comment.text : `${comment.text.slice(0, 150)}`}</p>
          {comment.text.length > 150 && (
            <Button variant="link" size="sm" onClick={() => setIsExpanded((prev) => !prev)}>
              {isExpanded ? 'Скрыть' : 'Читать дальше'}
            </Button>
          )}
        </div>

        <p className="mt-4 text-right text-xs text-muted-foreground self-end">
        {new Date(comment.date).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
        </p>
      </div>

      {isEditing && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать комментарий</DialogTitle>
            </DialogHeader>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full h-32 p-2 border rounded"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Отмена
              </Button>
              <Button onClick={handleEdit}>Сохранить</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
