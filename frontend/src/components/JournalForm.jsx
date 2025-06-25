import React, { useState } from 'react';
import axios from 'axios';
import './journalform.css'; // ← make sure this path is correct

const JournalForm = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const submitEntry = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/journal`, { content });
      alert("🧠 Mood detected:\n" + res.data.mood);
      setContent('');
      window.location.reload(); 
    } catch (err) {
      alert("❌ Error saving entry");
    }
    setLoading(false);
  };

  return (
    <div className="journal-form">
      <h3 className="journal-title">📝 Today's Thought</h3>
      <textarea
        rows="5"
        className="journal-textarea"
        placeholder="Type your journal entry here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={submitEntry}
        disabled={loading}
        className="journal-button"
      >
        {loading ? "Thinking..." : "Submit Entry"}
      </button>
    </div>
  );
};

export default JournalForm;
