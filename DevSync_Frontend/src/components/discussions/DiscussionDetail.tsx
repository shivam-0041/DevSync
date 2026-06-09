import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format, formatDistanceToNow } from 'date-fns';
import { fetchDiscussionThread, addDiscussionComment, updateDiscussionComment, deleteDiscussionComment, closeDiscussionThread, fetchProjectMembers } from '@/routes/projects';
import { toast } from 'sonner';
import { MessageCircle, Trash2, Edit2, X, Lock } from 'lucide-react';

const THREAD_TYPE_COLORS: Record<string, string> = {
  feature: 'bg-blue-100 text-blue-800',
  bug: 'bg-red-100 text-red-800',
  fix: 'bg-green-100 text-green-800',
  improvement: 'bg-purple-100 text-purple-800',
  question: 'bg-yellow-100 text-yellow-800',
  discussion: 'bg-gray-100 text-gray-800',
  documentation: 'bg-indigo-100 text-indigo-800',
};

interface DiscussionComment {
  id: number;
  comment_id: string;
  user: number;
  user_details: {
    id: number;
    username: string;
    email: string;
    full_name: string;
  };
  content: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  is_pinned: boolean;
}

interface DiscussionThread {
  id: number;
  thread_id: string;
  title: string;
  description: string;
  thread_type: string;
  created_by: number;
  created_by_details: {
    id: number;
    username: string;
    email: string;
    full_name: string;
  };
  created_at: string;
  updated_at: string;
  labels: string[];
  is_closed: boolean;
  comment_count: number;
  last_activity: string;
  comments: DiscussionComment[];
}

interface DiscussionDetailProps {
  projectSlug: string;
  threadId?: number;
  onBackClick?: () => void;
}

// Helper function to safely format dates
const formatSafeDate = (dateString: string | undefined | null): string => {
    if (!dateString) return "unknown"
    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return "unknown"
        return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
        return "unknown"
    }
}

export const DiscussionDetail = ({
  projectSlug,
  threadId,
  onBackClick,
}: DiscussionDetailProps) => {
  const [thread, setThread] = useState<DiscussionThread | null>(null);
  const [comments, setComments] = useState<DiscussionComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user).username);
    }
    // Fetch current user's role in project
    fetchProjectMembers(projectSlug).then((result) => {
      if (result.success && result.data) {
        const currentUsername = JSON.parse(localStorage.getItem('user') || '{}').username;
        const member = result.data.find((m: any) => m.username === currentUsername);
        if (member) {
          setCurrentUserRole(member.role);
        }
      }
    });
  }, [projectSlug]);

  useEffect(() => {
    if (threadId) {
      fetchThreadDetail();
    }
  }, [projectSlug, threadId]);

  const fetchThreadDetail = async () => {
    if (!threadId) return;

    try {
      setIsLoading(true);
      const result = await fetchDiscussionThread(projectSlug, threadId);

      if (!result.success) {
        throw new Error(result.error);
      }

      setThread(result.data);
      setComments(result.data.comments || []);
    } catch (error) {
      toast.error('Failed to load discussion details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !threadId) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await addDiscussionComment(projectSlug, threadId, newComment.trim());

      if (!result.success) {
        throw new Error(result.error);
      }

      setComments([...comments, result.data]);
      setNewComment('');
      toast.success('Comment posted');

      // Update comment count
      if (thread) {
        setThread({ ...thread, comment_count: thread.comment_count + 1 });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to post comment';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: number) => {
    if (!editingContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await updateDiscussionComment(
        projectSlug,
        threadId!,
        commentId,
        editingContent.trim()
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      setComments(comments.map((c) => (c.id === commentId ? result.data : c)));
      setEditingCommentId(null);
      setEditingContent('');
      toast.success('Comment updated');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update comment';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      const result = await deleteDiscussionComment(projectSlug, threadId!, commentId);

      if (!result.success) {
        throw new Error(result.error);
      }

      setComments(comments.filter((c) => c.id !== commentId));
      if (thread) {
        setThread({ ...thread, comment_count: thread.comment_count - 1 });
      }
      toast.success('Comment deleted');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete comment';
      toast.error(message);
    }
  };

  const handleCloseThread = async () => {
    if (!threadId) return;

    try {
      setIsSubmitting(true);
      const result = await closeDiscussionThread(projectSlug, threadId);

      if (!result.success) {
        throw new Error(result.error);
      }

      setThread({ ...thread!, is_closed: !thread!.is_closed });
      toast.success(thread!.is_closed ? 'Discussion reopened' : 'Discussion closed');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update discussion';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!threadId) {
    return (
      <Card className="border-dashed col-span-3">
        <CardContent className="pt-6 text-center">
          <MessageCircle className="mx-auto mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm text-muted-foreground">
            Select a discussion to view details
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-muted-foreground">Loading discussion...</p>
        </CardContent>
      </Card>
    );
  }

  if (!thread) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-red-600">Failed to load discussion</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Thread Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge className={`capitalize ${THREAD_TYPE_COLORS[thread.thread_type]}`}>
                  {thread.thread_type}
                </Badge>
                {thread.is_closed && <Badge variant="secondary">Closed</Badge>}
              </div>
              <CardTitle>{thread.title}</CardTitle>
              <CardDescription>
                by {thread.created_by_details?.full_name || 'Unknown'}{' '}
                {formatSafeDate(thread.created_at)}
              </CardDescription>
            </div>
            {(currentUserRole === 'admin' || currentUserRole === 'maintainer') && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={thread.is_closed ? 'outline' : 'secondary'}
                  onClick={() => handleCloseThread()}
                  disabled={isSubmitting}
                >
                  {thread.is_closed ? 'Reopen' : 'Close'} Discussion
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-sm text-gray-700">{thread.description}</p>
          </div>

          {thread.labels && thread.labels.length > 0 && (
            <div className="flex gap-1 flex-wrap pt-2">
              {thread.labels.map((label) => (
                <Badge key={label} variant="outline">
                  {label}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
            <span>
              <MessageCircle className="inline h-4 w-4 mr-1" />
              {thread.comment_count} comments
            </span>
            <span>Updated {formatSafeDate(thread.last_activity)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comments ({thread.comment_count})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Comment Form */}
          {!thread.is_closed && (
            <div className="space-y-2 pb-4 border-b">
              <label className="text-sm font-medium">Add a comment</label>
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isSubmitting}
                rows={4}
                className="resize-none"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewComment('')}
                  disabled={isSubmitting}
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={isSubmitting || !newComment.trim()}
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          )}

          {thread.is_closed && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              This discussion is closed. No new comments can be added.
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border rounded-lg p-3 space-y-2 hover:bg-gray-50"
                >
                  {editingCommentId === comment.id ? (
                    // Edit mode
                    <div className="space-y-2">
                      <Textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCommentId(null)}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleEditComment(comment.id)}
                          disabled={isSubmitting}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Comment header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">
                            {comment.user_details?.full_name || 'Unknown'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatSafeDate(comment.created_at)}
                            {comment.is_edited && ' (edited)'}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {currentUser === comment.user_details?.username && (
                            <button
                              onClick={() => {
                                setEditingCommentId(comment.id);
                                setEditingContent(comment.content);
                              }}
                              className="p-1 hover:bg-gray-200 rounded"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4 text-gray-600" />
                            </button>
                          )}
                          {(currentUser === comment.user_details?.username ||
                            currentUserRole === 'admin' ||
                            currentUserRole === 'maintainer') && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="p-1 hover:bg-red-100 rounded"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Comment content */}
                      <p className="text-sm whitespace-pre-wrap text-gray-700">
                        {comment.content}
                      </p>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
