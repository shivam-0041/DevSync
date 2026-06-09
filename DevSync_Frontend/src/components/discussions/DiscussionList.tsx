import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, formatDistanceToNow } from 'date-fns';
import { fetchDiscussionThreads } from '@/routes/projects';
import { toast } from 'sonner';
import { ChevronRight, MessageCircle } from 'lucide-react';

const THREAD_TYPE_COLORS: Record<string, string> = {
  feature: 'bg-blue-100 text-blue-800',
  bug: 'bg-red-100 text-red-800',
  fix: 'bg-green-100 text-green-800',
  improvement: 'bg-purple-100 text-purple-800',
  question: 'bg-yellow-100 text-yellow-800',
  discussion: 'bg-gray-100 text-gray-800',
  documentation: 'bg-indigo-100 text-indigo-800',
};

interface DiscussionThread {
  id: number;
  thread_id: string;
  title: string;
  thread_type: string;
  created_by_username: string;
  created_at: string;
  labels: string[];
  is_closed: boolean;
  comment_count: number;
  last_activity: string;
  latest_comment?: {
    id: number;
    user: string;
    content: string;
    created_at: string;
  };
}

interface DiscussionListProps {
  projectSlug: string;
  selectedThreadId?: number;
  onSelectThread: (thread: DiscussionThread) => void;
  searchTerm?: string;
  filterType?: string;
  isGridView?: boolean;
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

export const DiscussionList = ({
  projectSlug,
  selectedThreadId,
  onSelectThread,
  searchTerm = '',
  filterType = 'all',
  isGridView = false,
}: DiscussionListProps) => {
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchThreads();
  }, [projectSlug]);

  const fetchThreads = async () => {
    try {
      setIsLoading(true);
      const result = await fetchDiscussionThreads(projectSlug);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      let filtered = result.data;

      // Apply filter
      if (filterType !== 'all') {
        if (filterType === 'open') {
          filtered = filtered.filter((t: DiscussionThread) => !t.is_closed);
        } else {
          filtered = filtered.filter((t: DiscussionThread) => t.thread_type === filterType);
        }
      }

      // Apply search
      if (searchTerm.trim()) {
        const lowerSearch = searchTerm.toLowerCase();
        filtered = filtered.filter((t: DiscussionThread) =>
          t.title.toLowerCase().includes(lowerSearch) ||
          t.created_by_username.toLowerCase().includes(lowerSearch) ||
          t.labels.some((label: string) => label.toLowerCase().includes(lowerSearch))
        );
      }

      setThreads(filtered);
    } catch (error) {
      toast.error('Failed to load discussions');
    } finally {
      setIsLoading(false);
    }
  };

  // Re-filter when search term or filter type changes
  useEffect(() => {
    fetchThreads();
  }, [searchTerm, filterType]);

  if (isLoading) {
    return (
      <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center">
          <MessageCircle className="mx-auto mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm text-muted-foreground">
            {searchTerm ? 'No discussions match your search' : 'No discussions yet. Start one!'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
      {/* Grid/List View of Discussion threads */}
      {threads.map((thread) => (
        <Card
          key={thread.id}
          className={`cursor-pointer transition-all hover:shadow-lg ${isGridView ? 'h-full flex flex-col' : ''} ${
            selectedThreadId === thread.id ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => onSelectThread(thread)}
        >
          <CardHeader className={isGridView ? 'pb-2' : 'pb-3'}>
            <div className={isGridView ? 'flex flex-col gap-2' : 'flex items-start justify-between gap-2'}>
              <div className={isGridView ? '' : 'flex-1 min-w-0'}>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge className={`capitalize ${THREAD_TYPE_COLORS[thread.thread_type]}`}>
                    {thread.thread_type}
                  </Badge>
                  {thread.is_closed && (
                    <Badge variant="secondary" className="bg-gray-200">
                      Closed
                    </Badge>
                  )}
                </div>
                <CardTitle className={isGridView ? 'text-sm line-clamp-2' : 'text-base truncate'}>{thread.title}</CardTitle>
              </div>
              {!isGridView && <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />}
            </div>
          </CardHeader>
          <CardContent className={isGridView ? 'flex-1 flex flex-col py-0' : ''}>
            <div className={isGridView ? 'space-y-1 flex-1 flex flex-col justify-between' : 'space-y-2'}>
              <div className={isGridView ? 'flex flex-col gap-1' : 'flex items-center justify-between text-xs text-muted-foreground'}>
                <span className={isGridView ? 'text-xs text-muted-foreground line-clamp-1' : ''}>by {thread.created_by_username}</span>
                <span className={isGridView ? 'text-xs text-muted-foreground' : ''}>{formatSafeDate(thread.created_at)}</span>
              </div>

              {thread.labels && thread.labels.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {thread.labels.slice(0, isGridView ? 2 : undefined).map((label) => (
                    <Badge key={label} variant="outline" className="text-xs">
                      {label}
                    </Badge>
                  ))}
                  {isGridView && thread.labels.length > 2 && (
                    <span className="text-xs text-muted-foreground">+{thread.labels.length - 2}</span>
                  )}
                </div>
              )}

              {!isGridView && thread.latest_comment && (
                <div className="pt-2 border-t text-xs">
                  <p className="text-muted-foreground">
                    Latest: <span className="font-medium">{thread.latest_comment.user}</span>
                  </p>
                  <p className="text-muted-foreground truncate italic">
                    "{thread.latest_comment.content}"
                  </p>
                </div>
              )}

              <div className={isGridView ? 'flex items-center gap-2 pt-2 border-t' : 'flex items-center justify-between pt-2'}>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  {isGridView ? <span>{thread.comment_count}</span> : <span>{thread.comment_count} comments</span>}
                </div>
                {!isGridView && (
                  <span className="text-xs text-muted-foreground">
                    {formatSafeDate(thread.last_activity)}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
