import { useState } from 'react';
import { DiscussionList } from './DiscussionList';
import { DiscussionDetail } from './DiscussionDetail';
import { DiscussionCreate } from './DiscussionCreate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, X } from 'lucide-react';

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

interface DiscussionsViewProps {
  projectSlug: string;
}

export const DiscussionsView = ({ projectSlug }: DiscussionsViewProps) => {
  const [selectedThread, setSelectedThread] = useState<DiscussionThread | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const handleSelectThread = (thread: DiscussionThread) => {
    setSelectedThread(thread);
  };

  const handleCreateSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setSelectedThread(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Discussions</h2>
        <Button
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Discussion
        </Button>
      </div>

      {/* Create Discussion Dialog */}
      <DiscussionCreate
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        projectSlug={projectSlug}
        onSuccess={handleCreateSuccess}
      />

      {/* Search and Filter Bar */}
      <div className="flex gap-2 items-center flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-9"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-1 flex-wrap">
          {['all', 'open', 'feature', 'bug', 'question', 'discussion'].map((f) => (
            <Button
              key={f}
              variant={selectedFilter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(f)}
              className="capitalize"
            >
              {f === 'all' ? 'All' : f}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid Layout */}
      {selectedThread ? (
        /* Detail View */
        <div className="space-y-4">
          <Button variant="outline" size="sm" onClick={() => setSelectedThread(null)}>
            ← Back to Discussions
          </Button>
          <DiscussionDetail
            projectSlug={projectSlug}
            threadId={selectedThread.id}
            onBackClick={() => setSelectedThread(null)}
          />
        </div>
      ) : (
        /* Grid View */
        <DiscussionList
          key={refreshKey}
          projectSlug={projectSlug}
          selectedThreadId={selectedThread?.id}
          onSelectThread={handleSelectThread}
          searchTerm={searchTerm}
          filterType={selectedFilter}
          isGridView={true}
        />
      )}
    </div>
  );
};
