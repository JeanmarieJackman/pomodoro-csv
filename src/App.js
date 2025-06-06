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

    const workDuration = 25;
    const shortBreak = 5;
    const longBreak = 15;
    const cycleLength = 4;

    const dateStr = date;
    let current = new Date(`${dateStr}T${startTime}`);
    const end = new Date(`${dateStr}T${endTime}`);

    const apptBlocks = appointments
      .filter(a => a.start && a.end)
      .map(a => ({
        start: new Date(`${dateStr}T${a.start}`),
        end: new Date(`${dateStr}T${a.end}`),
        subject: a.subject || 'Appointment'
      }))
      .sort((a, b) => a.start - b.start);

    let entries = [];
    let pomoCount = 0;

    // Add appointments to CSV first
    for (let appt of apptBlocks) {
      entries.push({
        subject: appt.subject,
        date: dateStr,
        start: appt.start,
        end: appt.end
      });
    }

    // Schedule pomodoros around appointments
    while (current < end) {
      // Check if in an appointment
      const conflict = apptBlocks.some(a => current >= a.start && current < a.end);
      if (conflict) {
        current = new Date(current.getTime() + 60000); // skip 1 min
        continue;
      }

      const next = new Date(current.getTime() + workDuration * 60000);
      // Check if pomodoro would overlap any appointment or go past end
      const overlaps = apptBlocks.some(a => next > a.start && current < a.end);
      if (overlaps || next > end) {
        current = new Date(current.getTime() + 60000); // skip 1 min
        continue;
      }

      // Add pomodoro
      entries.push({
        subject: `Pomodoro ${++pomoCount}`,
        date: dateStr,
        start: current,
        end: next
      });

      current = next;

      // Skip break time (not added to CSV yet)
      let breakMin = (pomoCount % cycleLength === 0) ? longBreak : shortBreak;
      current = new Date(current.getTime() + breakMin * 60000);
    }

    // Sort entries by start time
    entries.sort((a, b) => a.start - b.start);

    const csvRows = [['Subject', 'Start Date', 'Start Time', 'End Time']];
    for (let row of entries) {
      const startStr = row.start.toTimeString().slice(0, 5);
      const endStr = row.end.toTimeString().slice(0, 5);
      csvRows.push([row.subject, row.date, startStr, endStr]);
    }

    // Download CSV
    const csvContent = csvRows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `pomodoro_${dateStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
