import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { createDiscussionThread } from '@/routes/projects';

const THREAD_TYPES = [
  { value: 'feature', label: 'Feature Request' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'fix', label: 'Fix' },
  { value: 'improvement', label: 'Improvement' },
  { value: 'question', label: 'Question' },
  { value: 'discussion', label: 'Discussion' },
  { value: 'documentation', label: 'Documentation' },
];

interface DiscussionCreateProps {
  isOpen: boolean;
  onClose: () => void;
  projectSlug: string;
  onSuccess: () => void;
}

export const DiscussionCreate = ({
  isOpen,
  onClose,
  projectSlug,
  onSuccess,
}: DiscussionCreateProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [threadType, setThreadType] = useState('discussion');
  const [labels, setLabels] = useState<string[]>([]);
  const [labelInput, setLabelInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddLabel = () => {
    if (labelInput.trim() && !labels.includes(labelInput.trim())) {
      setLabels([...labels, labelInput.trim()]);
      setLabelInput('');
    }
  };

  const handleRemoveLabel = (label: string) => {
    setLabels(labels.filter(l => l !== label));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createDiscussionThread(projectSlug, {
        title: title.trim(),
        description: description.trim(),
        thread_type: threadType,
        labels: labels,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success('Discussion created successfully');
      setTitle('');
      setDescription('');
      setThreadType('discussion');
      setLabels([]);
      onClose();
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create discussion';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Discussion</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="What's your discussion about?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select value={threadType} onValueChange={setThreadType} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {THREAD_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Help others understand the nature of your discussion
            </p>
          </div>

          {/* Description/Reason */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description / Reason</label>
            <Textarea
              placeholder="Provide details, context, or explain your reason for this discussion..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Be as detailed as possible to help others understand your point
            </p>
          </div>

          {/* Labels */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Labels (Optional)</label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a label and press Enter"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddLabel();
                  }
                }}
                disabled={isLoading}
              />
              <Button
                onClick={handleAddLabel}
                variant="outline"
                disabled={isLoading || !labelInput.trim()}
              >
                Add
              </Button>
            </div>

            {labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {labels.map((label) => (
                  <span
                    key={label}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center gap-1"
                  >
                    {label}
                    <button
                      onClick={() => handleRemoveLabel(label)}
                      className="ml-1 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !title.trim() || !description.trim()}
            >
              {isLoading ? 'Creating...' : 'Create Discussion'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
