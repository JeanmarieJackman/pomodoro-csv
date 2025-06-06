import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [appointments, setAppointments] = useState([
    { start: '', end: '', subject: '' }
  ]);

  const addAppointment = () =>
    setAppointments([...appointments, { start: '', end: '', subject: '' }]);

  const removeAppointment = (index) => {
    const updated = [...appointments];
    updated.splice(index, 1);
    setAppointments(updated);
  };

  const updateAppointment = (index, field, value) => {
    const updated = [...appointments];
    updated[index][field] = value;
    setAppointments(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ... your existing handleSubmit code unchanged ...
  };

  return (
    <div className="container app-container py-4">
      <h1 className="mb-4">Pomodoro Scheduler</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Date:</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Start Time:</label>
          <input
            type="time"
            className="form-control"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">End Time:</label>
          <input
            type="time"
            className="form-control"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Appointments:</label>
          {appointments.map((a, i) => (
            <div
              key={i}
              className="d-flex align-items-center gap-2 mb-2"
            >
              <input
                type="time"
                className="form-control"
                style={{ maxWidth: '100px' }}
                value={a.start}
                onChange={e => updateAppointment(i, 'start', e.target.value)}
                required
              />
              <input
                type="time"
                className="form-control"
                style={{ maxWidth: '100px' }}
                value={a.end}
                onChange={e => updateAppointment(i, 'end', e.target.value)}
                required
              />
              <input
                type="text"
                className="form-control"
                value={a.subject}
                onChange={e => updateAppointment(i, 'subject', e.target.value)}
                placeholder="Subject"
                required
              />
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => removeAppointment(i)}
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={addAppointment}
          >
            Add Appointment
          </button>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Generate CSV
        </button>
      </form>
    </div>
  );
}

export default App;
