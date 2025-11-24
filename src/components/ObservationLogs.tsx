import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Search, Calendar, Plus, Eye, Trash2, BookOpen, AlertCircle } from 'lucide-react';
import type { Page, User } from '../App';
import { logAPI, ObservationLog } from '../services/api';

interface ObservationLogsProps {
  user: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const seeingConditions = ['All', 'Excellent', 'Good', 'Moderate', 'Poor'];

export function ObservationLogs({ user, onNavigate, onLogout }: ObservationLogsProps) {
  const [logs, setLogs] = useState<ObservationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedLog, setExpandedLog] = useState<number | null>(null);

  // Load logs from API on mount
  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const logsData = await logAPI.getAll();
      setLogs(logsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (id: number) => {
    if (!confirm('Are you sure you want to delete this log?')) return;
    try {
      await logAPI.delete(id);
      setLogs(logs.filter(log => log.LogID !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete log');
    }
  };

  const filteredLogs = logs.filter(log => {
    const objectName = (log.ObjectName || '').toLowerCase();
    const notes = (log.Notes || '').toLowerCase();
    const matchesSearch = objectName.includes(searchTerm.toLowerCase()) ||
                         notes.includes(searchTerm.toLowerCase());
    const matchesCondition = selectedCondition === 'All' || log.SeeingCondition === selectedCondition;
    const matchesDate = (!startDate || log.ObservationDate >= startDate) && 
                       (!endDate || log.ObservationDate <= endDate);
    return matchesSearch && matchesCondition && matchesDate;
  });

  const getConditionColor = (condition: string | undefined) => {
    switch (condition) {
      case 'Excellent': return 'text-green-400 bg-green-400/10';
      case 'Good': return 'text-cyan-400 bg-cyan-400/10';
      case 'Moderate': return 'text-yellow-400 bg-yellow-400/10';
      case 'Poor': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar user={user} currentPage="observation-logs" onNavigate={onNavigate} onLogout={onLogout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading observation logs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} currentPage="observation-logs" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="mb-2">Observation Logs</h2>
              <p className="text-gray-400">Document and review your celestial observations</p>
            </div>
            <button
              onClick={() => onNavigate('observation-log-form')}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all cosmic-glow hover:cosmic-glow-strong"
            >
              <Plus className="w-5 h-5" />
              Add Observation
            </button>
          </div>

          {/* Filters */}
          <div className="cosmic-card p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Search */}
              <div>
                <label className="block text-sm mb-2 text-gray-300">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search logs..."
                    className="w-full pl-10 pr-4 py-2 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Seeing Conditions */}
              <div>
                <label className="block text-sm mb-2 text-gray-300">Seeing Conditions</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                >
                  {seeingConditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm mb-2 text-gray-300">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm mb-2 text-gray-300">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-400">
              Showing {filteredLogs.length} of {logs.length} observations
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Logs List */}
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.LogID} className="cosmic-card hover:cosmic-glow transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="mb-1">{log.ObjectName}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span>{log.ObservationDate}</span>
                          <span>•</span>
                          {log.SeeingCondition && (
                            <>
                              <span className={`px-2 py-1 rounded-md ${getConditionColor(log.SeeingCondition)}`}>
                                {log.SeeingCondition}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setExpandedLog(expandedLog === log.LogID ? null : log.LogID)}
                        className="p-2 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-lg transition-all border border-purple-600/30"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteLog(log.LogID || 0)}
                        className="p-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-all border border-red-600/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-300 line-clamp-2">
                      {log.Notes}
                    </p>
                  </div>

                  {expandedLog === log.LogID && (
                    <div className="border-t border-[var(--cosmic-border)] pt-4 mt-4 space-y-3">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Full Notes:</p>
                        <p className="text-gray-300">{log.Notes}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {log.Equipment && (
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Equipment:</p>
                            <p className="text-gray-300">{log.Equipment}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <div className="cosmic-card p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h4 className="mb-2 text-gray-400">No observation logs found</h4>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
