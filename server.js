const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// In-memory storage for events and RSVPs
let events = [];

// Get all events with RSVP counts
app.get('/api/events', (req, res) => {
  res.json(events);
});

// Create a new event
app.post('/api/events', (req, res) => {
  const { title, date, location } = req.body;
  if (!title || !date || !location) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const newEvent = {
    id: Date.now(),
    title,
    date,
    location,
    yesCount: 0,
    noCount: 0,
    responses: []
  };
  events.push(newEvent);
  res.json(newEvent);
});

// RSVP to an event
app.post('/api/events/:id/rsvp', (req, res) => {
  const event = events.find(e => e.id == req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const { name, response } = req.body;
  if (!name || !response) {
    return res.status(400).json({ error: 'Name and response are required' });
  }

  event.responses.push({ name, response });
  if (response === 'yes') event.yesCount++;
  else event.noCount++;

  res.json(event);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});