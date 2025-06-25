import React from 'react';
import JournalForm from './components/JournalForm';
import Timeline from './components/Timeline';
import './App.css';

export default function App() {
  return (
    <div className="body">
      <div className="container">
        <h1 className="title">My Journal</h1>
        <JournalForm />
        <hr />
        <Timeline />
      </div>
    </div>
  );
}
