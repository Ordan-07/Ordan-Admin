import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const ContactResponses = ({ token }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/contact/list`, {
        headers: { token },
      });
      if (res.data.success) {
        setSubmissions(res.data.submissions);
        setLastUpdated(new Date());
      } else {
        toast.error(res.data.message || "Unable to fetch submissions");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to load contact submissions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    const interval = setInterval(fetchSubmissions, 15000);
    return () => clearInterval(interval);
  }, []);

  const quickStats = useMemo(() => {
    if (!submissions.length) return null;
    return {
      total: submissions.length,
      today: submissions.filter((sub) => {
        const createdAt = new Date(sub.createdAt);
        const now = new Date();
        return (
          createdAt.getDate() === now.getDate() &&
          createdAt.getMonth() === now.getMonth() &&
          createdAt.getFullYear() === now.getFullYear()
        );
      }).length,
    };
  }, [submissions]);

  const deleteSubmission = async (id) => {
    const confirmed = window.confirm('Delete this submission?');
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await axios.delete(`${backendUrl}/api/contact/delete/${id}`, {
        headers: { token },
      });
      if (res.data.success) {
        setSubmissions((prev) => prev.filter((s) => s._id !== id));
        toast.success(res.data.message || 'Deleted');
      } else {
        toast.error(res.data.message || 'Unable to delete');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete submission');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-2xl font-semibold text-gray-800">
            Contact Responses
          </p>
          <p className="text-sm text-gray-500">
            Track every message that lands through the website contact form.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSubmissions}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {quickStats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Total
            </p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {quickStats.total}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Today
            </p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {quickStats.today}
            </p>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1.2fr_1fr_1fr_2fr_0.7fr_0.6fr] gap-4 border-b px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 max-sm:hidden">
          <span>Name</span>
          <span>Email</span>
          <span>Subject</span>
          <span>Message</span>
          <span>Received</span>
          <span>Action</span>
        </div>
        {loading ? (
          <div className="px-4 py-10 text-center text-sm text-gray-500">
            Loading submissions...
          </div>
        ) : submissions.length ? (
          submissions.map((submission) => (
            <div
              key={submission._id}
              className="grid grid-cols-1 gap-3 border-b px-4 py-4 text-sm text-gray-700 sm:grid-cols-[1.2fr_1fr_1fr_2fr_0.7fr_0.6fr]"
            >
              <div>
                <p className="font-medium text-gray-900">{submission.name}</p>
                <p className="text-xs text-gray-500">#{submission._id}</p>
              </div>
              <p className="text-gray-600">{submission.email}</p>
              <p className="text-gray-600">{submission.subject}</p>
              <p className="text-gray-600">{submission.message}</p>
              <p className="text-xs text-gray-500">
                {new Date(submission.createdAt).toLocaleString()}
              </p>
              <div className="flex items-start">
                <button
                  onClick={() => deleteSubmission(submission._id)}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-60"
                  disabled={deletingId === submission._id}
                >
                  {deletingId === submission._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-10 text-center text-sm text-gray-500">
            No submissions yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactResponses;
