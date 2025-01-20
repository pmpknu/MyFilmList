'use client';

import React, { useEffect, useState } from 'react';
import { MovieWithAdditionalInfoDto } from '@/interfaces/movie/dto/MovieWithAdditionalInfoDto';
import { CommentDto } from '@/interfaces/comment/dto/CommentDto';
import CommentService from '@/services/CommentService';
import MovieService from '@/services/MovieService';
import CommentCard from './comment-card';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';

interface MovieCommentsViewProps {
  movieId: number;
}

export default function MovieCommentsView({ movieId }: MovieCommentsViewProps) {
  const [movie, setMovie] = useState<MovieWithAdditionalInfoDto | null>(null);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [newComment, setNewComment] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieResponse, commentsResponse] = await Promise.all([
          MovieService.getMovieById(movieId),
          CommentService.getCommentsForMovie(movieId, 0, 20, ['createdAt,desc']),
        ]);

        setMovie(movieResponse.data);
        setComments(commentsResponse.data.content);
        setTotalPages(commentsResponse.data.totalPages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching movie or comments:', error);
      }
    };

    fetchData();
  }, [movieId]);

  const fetchMoreComments = async () => {
    try {
      const nextPage = page + 1;
      const response = await CommentService.getCommentsForMovie(movieId, nextPage, 20, [
        'createdAt,desc',
      ]);
      setComments((prev) => [...prev, ...response.data.content]);
      setPage(nextPage);
    } catch (error) {
      console.error('Error fetching more comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!user) return;

    try {
      const response = await CommentService.addCommentToMovie(movieId, {
        text: newComment,
        user: user,
        visible: false,
        date: new Date().toISOString().split('T')[0],
        id: 0
      });
      setComments((prev) => [response.data, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleCommentDeleted = (id: number) => {
    setComments((prev) => prev.filter((comment) => comment.id !== id));
  };

  const handleCommentUpdated = (updatedComment: CommentDto) => {
    setComments((prev) =>
      prev.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment))
    );
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  }

  return (
    <div className="movie-comments-view container mx-auto p-4 space-y-6 min-h-screen">
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardHeader>
          <h1 className="text-4xl font-bold">{movie?.title}</h1>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{movie?.description}</p>
        </CardContent>
      </Card>

      <div className="comments-section space-y-4">
        {/* Комментарий для добавления */}
        <Card className="p-4 border border-gray-300 bg-white shadow">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Напишите комментарий..."
            className="w-full p-2 border rounded resize-none"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <Button
              onClick={handleAddComment}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Добавить
            </Button>
          </div>
        </Card>
        {/* Список комментариев */}
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onCommentDeleted={handleCommentDeleted}
            onCommentUpdated={handleCommentUpdated}
          />
        ))}
        {page + 1 < totalPages && (
          <button
            onClick={fetchMoreComments}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Загрузить еще
          </button>
        )}
      </div>
    </div>
  );
}
