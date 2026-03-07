"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import {
  FileText,
  Download,
  Trash2,
  Search,
  Loader2,
  MoreVertical,
  Eye,
  MessageSquare,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  HardDrive
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { documentService, AnalysisFile } from '@/services/documentService';

type SortField = 'createdAt' | 'filename' | 'sizeBytes';
type SortOrder = 'asc' | 'desc';

export default function DocumentsPage() {
  const router = useRouter();
  const [files, setFiles] = useState<AnalysisFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await documentService.listAnalysisFiles();
      setFiles(data);
    } catch (err: any) {
      console.error('Failed to load files:', err);
      setError(err.response?.data?.error || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleteId(id);
      await documentService.deleteAnalysisFile(id);
      setFiles(prev => prev.filter(f => f.id !== id));
    } catch (err: any) {
      console.error('Delete failed:', err);
      setError(err.response?.data?.error || 'Failed to delete document');
    } finally {
      setDeleteId(null);
      setOpenMenu(null);
    }
  };

  const handleDownload = async (file: AnalysisFile) => {
    try {
      const { url } = await documentService.getDownloadUrl(file.id);
      window.open(url, '_blank');
    } catch (err: any) {
      console.error('Download failed:', err);
      setError(err.response?.data?.error || 'Failed to download document');
    }
    setOpenMenu(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return 'bg-red-soft text-red-text';
    if (mimeType.includes('image')) return 'bg-blue-soft text-blue-text';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'bg-primary/10 text-primary';
    return 'bg-gray-100 text-gray-600';
  };

  const filteredFiles = files
    .filter(f => f.filename.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === 'filename') {
        comparison = a.filename.localeCompare(b.filename);
      } else if (sortField === 'sizeBytes') {
        comparison = a.sizeBytes - b.sizeBytes;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const totalSize = files.reduce((sum, f) => sum + f.sizeBytes, 0);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <>
      <Header
        title="Documents"
        subtitle="View and manage your uploaded files"
      />

      <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-8 bg-background-light scrollbar-thin">
        <div className="max-w-6xl mx-auto">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-surface-light border border-border-default rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-text-heading">{files.length}</p>
                  <p className="text-sm text-text-sub">Total Documents</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-light border border-border-default rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <HardDrive className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-text-heading">{formatSize(totalSize)}</p>
                  <p className="text-sm text-text-sub">Storage Used</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-light border border-border-default rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-soft rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-text" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-text-heading">
                    {files.length > 0 ? formatDate(files[0]?.createdAt).split(',')[0] : '-'}
                  </p>
                  <p className="text-sm text-text-sub">Last Upload</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-surface-light border border-border-default rounded-2xl p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-background-light border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-text-sub">Sort by:</span>
                <button
                  onClick={() => toggleSort('createdAt')}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${sortField === 'createdAt'
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'border-border-default text-text-sub hover:bg-background-light'
                    }`}
                >
                  Date {sortField === 'createdAt' && (sortOrder === 'asc' ? <SortAsc className="inline w-3 h-3 ml-1" /> : <SortDesc className="inline w-3 h-3 ml-1" />)}
                </button>
                <button
                  onClick={() => toggleSort('filename')}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${sortField === 'filename'
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'border-border-default text-text-sub hover:bg-background-light'
                    }`}
                >
                  Name {sortField === 'filename' && (sortOrder === 'asc' ? <SortAsc className="inline w-3 h-3 ml-1" /> : <SortDesc className="inline w-3 h-3 ml-1" />)}
                </button>
                <button
                  onClick={() => toggleSort('sizeBytes')}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${sortField === 'sizeBytes'
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'border-border-default text-text-sub hover:bg-background-light'
                    }`}
                >
                  Size {sortField === 'sizeBytes' && (sortOrder === 'asc' ? <SortAsc className="inline w-3 h-3 ml-1" /> : <SortDesc className="inline w-3 h-3 ml-1" />)}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
              <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
            </div>
          )}

          {/* Documents List */}
          <div className="bg-surface-light border border-border-default rounded-2xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-3 text-text-sub">Loading documents...</span>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-text-sub">
                <FileText className="w-12 h-12 mb-4 text-text-light" />
                <p className="text-lg font-medium text-text-heading mb-1">
                  {searchQuery ? 'No matching documents' : 'No documents yet'}
                </p>
                <p className="text-sm mb-6">
                  {searchQuery ? 'Try a different search term' : 'Upload a document to get started'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => router.push('/workspace/intake')}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-medium transition-all"
                  >
                    Upload Document
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-background-light border-b border-border-default">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-text-sub">Document</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-text-sub hidden md:table-cell">Size</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-text-sub hidden lg:table-cell">Uploaded</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-text-sub">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filteredFiles.map((file) => (
                    <tr
                      key={file.id}
                      className="hover:bg-background-light/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => router.push(`/workspace/chat?docId=${file.id}`)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-75 ${getFileIcon(file.mimeType)}`}
                            title="Open in Agentic Analysis"
                          >
                            <FileText className="w-5 h-5" />
                          </button>
                          <div className="min-w-0">
                            <button
                              onClick={() => router.push(`/workspace/chat?docId=${file.id}`)}
                              className="font-medium text-text-heading truncate max-w-[300px] hover:text-primary transition-colors text-left"
                              title="Open in Agentic Analysis"
                            >
                              {file.filename}
                            </button>
                            <p className="text-xs text-text-light md:hidden">
                              {formatSize(file.sizeBytes)} • {formatDate(file.createdAt)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-sub hidden md:table-cell">
                        {formatSize(file.sizeBytes)}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-sub hidden lg:table-cell">
                        {formatDate(file.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/workspace/chat?docId=${file.id}`)}
                            className="p-2 text-text-light hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title="Analyze with AI"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(file)}
                            className="p-2 text-text-light hover:text-secondary hover:bg-secondary/10 rounded-lg transition-all"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(file.id)}
                            disabled={deleteId === file.id}
                            className="p-2 text-text-light hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                            title="Delete"
                          >
                            {deleteId === file.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Upload CTA */}
          {!loading && files.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => router.push('/workspace/intake')}
                className="text-primary hover:text-primary-hover text-sm font-medium transition-colors"
              >
                + Upload More Documents
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
