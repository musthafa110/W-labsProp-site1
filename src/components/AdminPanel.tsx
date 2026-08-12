import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trash2, 
  Download, 
  Search, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Database, 
  RefreshCw,
  Heart,
  ArrowLeft,
  Lock
} from "lucide-react";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { db } from "../lib/firebase";

export default function AdminPanel() {
  // Responses states
  const [responses, setResponses] = useState<any[]>([]);
  const [responsesLoading, setResponsesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "yes" | "time">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch responses in real-time unconditionally
  useEffect(() => {
    setResponsesLoading(true);
    const q = query(collection(db, "responses"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResponses(data);
      setResponsesLoading(false);
    }, (error) => {
      console.error("Error loading responses:", error);
      setResponsesLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Delete Response Handler
  const handleDeleteResponse = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "responses", deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting response. You might not have sufficient permissions.");
    } finally {
      setDeleting(false);
    }
  };

  // Export Responses to CSV
  const handleExportCSV = () => {
    if (responses.length === 0) return;

    const headers = ["Response", "Date", "Time", "Optional Message"];
    const rows = responses.map(r => [
      r.response || "",
      r.date || "",
      r.time || "",
      r.message || ""
    ]);

    const csvLines = [
      headers.join(","),
      ...rows.map(row => row.map(val => {
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(","))
    ];

    const csvContent = csvLines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `afra_proposal_responses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExitAdmin = () => {
    window.location.hash = "";
  };

  const getRelativeTime = (r: any) => {
    if (!r.timestamp) return "";
    try {
      const date = r.timestamp && typeof r.timestamp.toDate === "function" 
        ? r.timestamp.toDate() 
        : new Date(r.timestamp);
      
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch (e) {
      return "";
    }
  };

  // Filter and Search Logic
  const filteredResponses = responses.filter(r => {
    const matchesSearch = 
      (r.response || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.message || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.date || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.time || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = 
      filterType === "all" || 
      (filterType === "yes" && (r.response || "").toLowerCase().includes("yes")) ||
      (filterType === "time" && (r.response || "").toLowerCase().includes("time"));

    return matchesSearch && matchesFilter;
  });

  const totalResponses = responses.length;
  const yesResponses = responses.filter(r => (r.response || "").toLowerCase().includes("yes")).length;
  const timeResponses = responses.filter(r => (r.response || "").toLowerCase().includes("time")).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#111827] text-slate-100 font-sans relative overflow-x-hidden p-6">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* HEADER BAR */}
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-slate-800/60 mb-8 gap-4 relative z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Heart className="w-5 h-5 fill-rose-500/20" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight bg-gradient-to-r from-rose-200 via-rose-300 to-amber-200 bg-clip-text text-transparent">
              Proposal Control Center
            </h1>
            <p className="text-xs text-slate-400 font-sans uppercase tracking-widest mt-0.5">
              Secure Private Administrator Dashboard
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handleExitAdmin}
            className="btn-liquid-crystal-dark px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase cursor-pointer flex items-center space-x-2 shadow-sm text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Proposal</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto relative z-20">
        <div className="space-y-8">
            {/* METRICS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Card Total */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-6 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden"
              >
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Total Responses</span>
                  <div className="font-serif text-4xl font-bold text-white">{totalResponses}</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <Database className="w-6 h-6" />
                </div>
              </motion.div>

              {/* Card Yes */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-6 rounded-2xl flex items-center justify-between shadow-sm"
              >
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-rose-400 uppercase tracking-widest">💖 Yes Responses</span>
                  <div className="font-serif text-4xl font-bold text-rose-400">{yesResponses}</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Heart className="w-6 h-6 fill-rose-500/20" />
                </div>
              </motion.div>

              {/* Card More Time */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-6 rounded-2xl flex items-center justify-between shadow-sm"
              >
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-amber-300 uppercase tracking-widest">🌸 More Time</span>
                  <div className="font-serif text-4xl font-bold text-amber-300">{timeResponses}</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Clock className="w-6 h-6" />
                </div>
              </motion.div>
            </div>

            {/* CONTROLS BAR */}
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4.5 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 items-center">
                {/* Search */}
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search messages, dates, times..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950/40 border border-slate-800/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-550 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/10 font-sans"
                  />
                </div>

                {/* Filter Selector */}
                <div className="flex bg-slate-950/50 p-1 border border-slate-800/40 rounded-xl w-full sm:w-auto">
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex-1 sm:flex-initial ${
                      filterType === "all" 
                        ? "bg-slate-800 text-slate-100" 
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterType("yes")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex-1 sm:flex-initial flex items-center justify-center space-x-1 ${
                      filterType === "yes" 
                        ? "bg-rose-500/15 border border-rose-500/25 text-rose-300" 
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    <span>Yes</span>
                  </button>
                  <button
                    onClick={() => setFilterType("time")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex-1 sm:flex-initial flex items-center justify-center space-x-1 ${
                      filterType === "time" 
                        ? "bg-amber-500/15 border border-amber-500/25 text-amber-300" 
                        : "text-slate-400 hover:text-slate-200 border border-transparent"
                    }`}
                  >
                    <span>More Time</span>
                  </button>
                </div>
              </div>

              {/* CSV Export Button */}
              <button
                onClick={handleExportCSV}
                disabled={filteredResponses.length === 0}
                className="btn-liquid-crystal-dark w-full md:w-auto px-5 py-2.5 rounded-xl cursor-pointer flex items-center justify-center space-x-2 text-xs font-semibold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export to CSV</span>
              </button>
            </div>

            {/* RESPONSES VIEW */}
            {responsesLoading ? (
              <div className="bg-slate-900/20 border border-slate-800/40 rounded-3xl py-16 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-8 h-8 animate-spin text-rose-500" />
                <p className="text-slate-400 text-sm font-sans tracking-wide">Retrieving responses from Firestore...</p>
              </div>
            ) : filteredResponses.length === 0 ? (
              <div className="bg-slate-900/20 border border-slate-800/40 rounded-3xl py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center text-slate-500 mx-auto">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-medium text-slate-300">No responses found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans leading-relaxed">
                  {responses.length === 0 
                    ? "We haven't received any responses yet. The dashboard will automatically update in real-time as soon as a visitor responds."
                    : "No responses match your search or filter criteria. Try adjusting your search query."}
                </p>
              </div>
            ) : (
              /* RESPONSIVE RESPONSES TABLE & CARD CAROUSEL */
              <div className="space-y-4">
                {/* Desktop/Tablet Table View */}
                <div className="hidden lg:block bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse font-sans text-sm">
                    <thead>
                      <tr className="bg-slate-950/40 border-b border-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                        <th className="px-6 py-4.5 w-[160px]">Response</th>
                        <th className="px-6 py-4.5 w-[130px]">Date</th>
                        <th className="px-6 py-4.5 w-[130px]">Time</th>
                        <th className="px-6 py-4.5">Optional Message</th>
                        <th className="px-6 py-4.5 w-[100px] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      <AnimatePresence initial={false}>
                        {filteredResponses.map((r) => (
                          <motion.tr
                            key={r.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="hover:bg-slate-800/20 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                                (r.response || "").toLowerCase().includes("yes")
                                  ? "bg-rose-500/10 border-rose-500/20 text-rose-300"
                                  : "bg-amber-500/10 border-amber-500/20 text-amber-300"
                              }`}>
                                <Heart className={`w-3.5 h-3.5 ${
                                  (r.response || "").toLowerCase().includes("yes") ? "fill-rose-300 text-rose-400 animate-pulse" : "text-amber-400"
                                }`} />
                                <span>{r.response}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-300 font-medium">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                <span>{r.date}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                              <div className="flex flex-col">
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                                  <span>{r.time}</span>
                                </div>
                                {getRelativeTime(r) && (
                                  <span className="text-[10px] text-rose-400/80 mt-1 ml-5 font-sans font-medium bg-rose-500/10 border border-rose-500/10 px-1.5 py-0.5 rounded-md w-fit">
                                    {getRelativeTime(r)}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-200">
                              {r.message ? (
                                <div className="flex items-start space-x-2.5 max-w-xl">
                                  <MessageSquare className="w-4 h-4 text-rose-400/50 shrink-0 mt-0.5" />
                                  <p className="font-serif leading-relaxed italic text-slate-200 text-sm">
                                    "{r.message}"
                                  </p>
                                </div>
                              ) : (
                                <span className="text-slate-600 italic text-xs">No message left</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => setDeleteId(r.id)}
                                className="p-2 bg-slate-950/40 border border-slate-800 hover:border-rose-900/40 hover:bg-rose-950/30 text-slate-500 hover:text-rose-400 rounded-xl transition-all duration-300 cursor-pointer inline-flex items-center justify-center shadow-sm"
                                title="Delete response"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Mobile/Tablet Card Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                  <AnimatePresence initial={false}>
                    {filteredResponses.map((r) => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-5 space-y-4 relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start">
                          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                            (r.response || "").toLowerCase().includes("yes")
                              ? "bg-rose-500/10 border-rose-500/20 text-rose-300"
                              : "bg-amber-500/10 border-amber-500/20 text-amber-300"
                          }`}>
                            <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-400" />
                            <span>{r.response}</span>
                          </span>

                          <button
                            onClick={() => setDeleteId(r.id)}
                            className="p-2 bg-slate-950/40 border border-slate-800 hover:border-rose-900/40 hover:bg-rose-950/30 text-slate-500 hover:text-rose-400 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800/30">
                          <div className="flex items-center space-x-2 text-slate-300 text-xs">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>{r.date}</span>
                          </div>
                          <div className="flex flex-col space-y-1 text-slate-400 text-xs font-mono">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              <span>{r.time}</span>
                            </div>
                            {getRelativeTime(r) && (
                              <span className="text-[10px] text-rose-400/80 ml-5.5 font-sans font-medium bg-rose-500/10 border border-rose-500/10 px-1.5 py-0.5 rounded-md w-fit">
                                {getRelativeTime(r)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="bg-slate-950/30 rounded-xl p-3.5 border border-slate-800/40">
                          {r.message ? (
                            <div className="flex items-start space-x-2">
                              <MessageSquare className="w-3.5 h-3.5 text-rose-400/50 shrink-0 mt-0.5" />
                              <p className="font-serif leading-relaxed italic text-slate-200 text-xs">
                                "{r.message}"
                              </p>
                            </div>
                          ) : (
                            <span className="text-slate-600 italic text-[11px]">No message left</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Bottom Back Button */}
                <div className="flex justify-center pt-8 pb-4">
                  <button
                    onClick={handleExitAdmin}
                    className="group relative px-6 py-3.5 rounded-2xl bg-slate-800/85 hover:bg-slate-750 border border-slate-700/80 text-sm font-semibold tracking-wide shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center space-x-2.5 text-slate-200 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-rose-400" />
                    <span>Exit Admin & Back to Proposal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
      </main>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-6 shadow-2xl relative"
            >
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-white">Delete Response?</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Are you absolutely sure you want to delete this response? This action cannot be undone, and the response will be permanently removed from Firestore.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteId(null)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-55"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteResponse}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 border border-rose-500 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-55"
                >
                  {deleting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Delete</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
