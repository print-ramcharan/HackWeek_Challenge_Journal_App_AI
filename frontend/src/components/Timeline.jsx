import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './timeline.css';

const Timeline = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/journal`)
      .then((res) => setEntries(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="timeline">
      <h3>Your Journal Timeline</h3>

      {entries.length === 0 && (
        <p className="empty">No entries yet. Start journaling!</p>
      )}

      {entries.slice().reverse().map((entry) => (
        <div key={entry._id} className="timeline-entry">
          <div className="timeline-entry-header">
            <span>{formatDate(entry.timestamp)}</span>
            <span className="mood-tag">{entry.mood || "🧠 Neutral"}</span>
          </div>
          <p className="timeline-entry-content">{entry.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
