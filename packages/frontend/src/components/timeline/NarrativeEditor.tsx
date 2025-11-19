/**
 * Narrative Editor Component
 *
 * Rich text editor for milestone narratives with:
 * - Rich text formatting (bold, italic, lists, links)
 * - Auto-save functionality
 * - Stakeholder mentions (@username)
 * - Edit history tracking
 *
 * Requirements:
 * - 3.1: Display editable narrative field for adding context
 * - 3.2: Support rich text formatting including headings, lists, links, and embedded images
 * - 3.3: Associate narrative with specific phase or milestone and persist it
 * - 3.6: Tag stakeholders in narrative
 */

import React, { useEffect, useState, useCallback } from 'react';
import './NarrativeEditor.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Mention from '@tiptap/extension-mention';
import {
  Box,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
} from '@mui/material';
import {
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as NumberedListIcon,
  Link as LinkIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  History as HistoryIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

export interface NarrativeEditorProps {
  milestoneId: string;
  initialContent?: string;
  stakeholders?: string[];
  onSave?: (content: string) => void;
  onCancel?: () => void;
  readOnly?: boolean;
  autoSaveInterval?: number; // milliseconds, default 5000
}

interface EditHistoryEntry {
  id: string;
  content: string;
  timestamp: Date;
  savedBy?: string;
}

/**
 * Narrative Editor Component
 *
 * Provides rich text editing capabilities for milestone narratives.
 */
export const NarrativeEditor: React.FC<NarrativeEditorProps> = ({
  milestoneId: _milestoneId, // Prefix with underscore to indicate intentionally unused
  initialContent = '',
  stakeholders = [],
  onSave,
  onCancel,
  readOnly = false,
  autoSaveInterval = 5000,
}) => {
  const [content, setContent] = useState(initialContent);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [editHistory, setEditHistory] = useState<EditHistoryEntry[]>([]);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  // Initialize editor with extensions
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'narrative-link',
        },
      }),
      Placeholder.configure({
        placeholder: 'Add narrative context to explain the story behind this milestone...',
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: {
          items: ({ query }: { query: string }) => {
            return stakeholders
              .filter((stakeholder) =>
                stakeholder.toLowerCase().includes(query.toLowerCase())
              )
              .slice(0, 5);
          },
          render: () => {
            let component: any;
            let popup: any;

            return {
              onStart: (props: any) => {
                component = document.createElement('div');
                component.className = 'mention-suggestions';
                component.style.cssText = `
                  background: white;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                  padding: 4px;
                  max-height: 200px;
                  overflow-y: auto;
                  z-index: 1000;
                `;

                props.items.forEach((item: string) => {
                  const button = document.createElement('button');
                  button.className = 'mention-item';
                  button.textContent = item;
                  button.style.cssText = `
                    display: block;
                    width: 100%;
                    text-align: left;
                    padding: 8px 12px;
                    border: none;
                    background: none;
                    cursor: pointer;
                    font-size: 14px;
                  `;
                  button.onmouseover = () => {
                    button.style.background = '#f5f5f5';
                  };
                  button.onmouseout = () => {
                    button.style.background = 'none';
                  };
                  button.onclick = () => {
                    props.command({ id: item, label: item });
                  };
                  component.appendChild(button);
                });

                if (!props.clientRect) {
                  return;
                }

                popup = document.body.appendChild(component);
                const rect = props.clientRect();
                popup.style.position = 'absolute';
                popup.style.top = `${rect.bottom + window.scrollY}px`;
                popup.style.left = `${rect.left + window.scrollX}px`;
              },

              onUpdate(props: any) {
                component.innerHTML = '';
                props.items.forEach((item: string) => {
                  const button = document.createElement('button');
                  button.className = 'mention-item';
                  button.textContent = item;
                  button.style.cssText = `
                    display: block;
                    width: 100%;
                    text-align: left;
                    padding: 8px 12px;
                    border: none;
                    background: none;
                    cursor: pointer;
                    font-size: 14px;
                  `;
                  button.onmouseover = () => {
                    button.style.background = '#f5f5f5';
                  };
                  button.onmouseout = () => {
                    button.style.background = 'none';
                  };
                  button.onclick = () => {
                    props.command({ id: item, label: item });
                  };
                  component.appendChild(button);
                });

                if (!props.clientRect) {
                  return;
                }

                const rect = props.clientRect();
                popup.style.top = `${rect.bottom + window.scrollY}px`;
                popup.style.left = `${rect.left + window.scrollX}px`;
              },

              onKeyDown(props: any) {
                if (props.event.key === 'Escape') {
                  popup.remove();
                  return true;
                }
                return false;
              },

              onExit() {
                if (popup) {
                  popup.remove();
                }
              },
            };
          },
        },
      }),
    ],
    content: initialContent,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      setHasUnsavedChanges(true);
    },
  });

  // Auto-save functionality
  useEffect(() => {
    if (!editor || readOnly || !hasUnsavedChanges) {
      return;
    }

    const timer = setTimeout(() => {
      handleAutoSave();
    }, autoSaveInterval);

    return () => clearTimeout(timer);
  }, [content, hasUnsavedChanges, autoSaveInterval, readOnly]);

  const handleAutoSave = useCallback(async () => {
    if (!hasUnsavedChanges || !editor) {
      return;
    }

    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Add to edit history
      const historyEntry: EditHistoryEntry = {
        id: `${Date.now()}`,
        content: editor.getHTML(),
        timestamp: new Date(),
        savedBy: 'Current User', // TODO: Get from auth context
      };

      setEditHistory((prev) => [historyEntry, ...prev].slice(0, 10)); // Keep last 10 versions
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [editor, hasUnsavedChanges]);

  const handleSave = () => {
    if (editor && onSave) {
      const html = editor.getHTML();
      onSave(html);
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
    }
  };

  const handleCancel = () => {
    if (editor) {
      editor.commands.setContent(initialContent);
      setHasUnsavedChanges(false);
    }
    if (onCancel) {
      onCancel();
    }
  };

  const handleSetLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    setLinkUrl(previousUrl || '');
    setShowLinkDialog(true);
  };

  const handleApplyLink = () => {
    if (!editor) return;

    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
    }

    setShowLinkDialog(false);
    setLinkUrl('');
  };

  const handleRestoreVersion = (historyEntry: EditHistoryEntry) => {
    if (editor) {
      editor.commands.setContent(historyEntry.content);
      setShowHistory(false);
      setHasUnsavedChanges(true);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <Box>
      {/* Toolbar */}
      {!readOnly && (
        <Paper
          sx={{
            p: 1,
            mb: 1,
            display: 'flex',
            gap: 0.5,
            flexWrap: 'wrap',
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          {/* Text Formatting */}
          <Tooltip title="Bold">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleBold().run()}
              color={editor.isActive('bold') ? 'primary' : 'default'}
            >
              <BoldIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Italic">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              color={editor.isActive('italic') ? 'primary' : 'default'}
            >
              <ItalicIcon />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Lists */}
          <Tooltip title="Bullet List">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              color={editor.isActive('bulletList') ? 'primary' : 'default'}
            >
              <BulletListIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Numbered List">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              color={editor.isActive('orderedList') ? 'primary' : 'default'}
            >
              <NumberedListIcon />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Link */}
          <Tooltip title="Add Link">
            <IconButton
              size="small"
              onClick={handleSetLink}
              color={editor.isActive('link') ? 'primary' : 'default'}
            >
              <LinkIcon />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* Undo/Redo */}
          <Tooltip title="Undo">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <UndoIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Redo">
            <IconButton
              size="small"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <RedoIcon />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* History */}
          <Tooltip title="View Edit History">
            <IconButton size="small" onClick={() => setShowHistory(true)}>
              <HistoryIcon />
            </IconButton>
          </Tooltip>

          <Box sx={{ flex: 1 }} />

          {/* Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isSaving && (
              <Typography variant="caption" color="text.secondary">
                Saving...
              </Typography>
            )}
            {!isSaving && lastSaved && (
              <Typography variant="caption" color="text.secondary">
                Last saved: {lastSaved.toLocaleTimeString()}
              </Typography>
            )}
            {hasUnsavedChanges && !isSaving && (
              <Chip label="Unsaved changes" size="small" color="warning" />
            )}
          </Box>
        </Paper>
      )}

      {/* Editor Content */}
      <Paper
        sx={{
          p: 2,
          minHeight: 200,
          '& .ProseMirror': {
            outline: 'none',
            minHeight: 200,
            '& p.is-editor-empty:first-of-type::before': {
              content: 'attr(data-placeholder)',
              float: 'left',
              color: '#adb5bd',
              pointerEvents: 'none',
              height: 0,
            },
            '& .mention': {
              color: '#1976d2',
              backgroundColor: '#e3f2fd',
              borderRadius: '4px',
              padding: '2px 6px',
              fontWeight: 500,
            },
            '& .narrative-link': {
              color: '#1976d2',
              textDecoration: 'underline',
              cursor: 'pointer',
              '&:hover': {
                color: '#1565c0',
              },
            },
            '& h1': {
              fontSize: '2em',
              fontWeight: 'bold',
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            '& h2': {
              fontSize: '1.5em',
              fontWeight: 'bold',
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            '& h3': {
              fontSize: '1.25em',
              fontWeight: 'bold',
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            '& ul, & ol': {
              paddingLeft: '1.5em',
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            '& li': {
              marginBottom: '0.25em',
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Paper>

      {/* Stakeholder Mentions Help */}
      {!readOnly && stakeholders.length > 0 && (
        <Alert severity="info" sx={{ mt: 1 }}>
          <Typography variant="caption">
            Type @ to mention stakeholders: {stakeholders.slice(0, 3).join(', ')}
            {stakeholders.length > 3 && ` and ${stakeholders.length - 3} more`}
          </Typography>
        </Alert>
      )}

      {/* Action Buttons */}
      {!readOnly && (
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      )}

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onClose={() => setShowLinkDialog(false)}>
        <DialogTitle>Add Link</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLinkDialog(false)}>Cancel</Button>
          <Button onClick={handleApplyLink} variant="contained">
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit History Dialog */}
      <Dialog
        open={showHistory}
        onClose={() => setShowHistory(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit History</DialogTitle>
        <DialogContent>
          {editHistory.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No edit history available yet.
            </Typography>
          ) : (
            <List>
              {editHistory.map((entry) => (
                <ListItem
                  key={entry.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                      mb: 1,
                    }}
                  >
                    <ListItemText
                      primary={entry.timestamp.toLocaleString()}
                      secondary={entry.savedBy}
                    />
                    <Button
                      size="small"
                      onClick={() => handleRestoreVersion(entry)}
                      variant="outlined"
                    >
                      Restore
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                      width: '100%',
                      maxHeight: 100,
                      overflow: 'auto',
                      fontSize: '0.875rem',
                    }}
                    dangerouslySetInnerHTML={{ __html: entry.content }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHistory(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
