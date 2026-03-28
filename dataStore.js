/**
 * Data Store Service
 * Simple in-memory CRUD operations for hackathon demo.
 * Swap functions with Mongoose model calls for production MongoDB.
 */

const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');

// ── Meetings ──────────────────────────────────────────────────────────────────

function getAllMeetings(userId) {
  return db.meetings.filter(m => m.userId === userId || !userId);
}

function getMeetingById(id) {
  return db.meetings.find(m => m.id === id) || null;
}

function createMeeting(data) {
  const meeting = {
    id:          uuidv4(),
    title:       data.title || 'Untitled Meeting',
    transcript:  data.transcript || '',
    summary:     data.summary || '',
    tasks:       data.tasks || [],
    stakeholders:data.stakeholders || [],
    keyDecisions:data.keyDecisions || [],
    topicsDiscussed: data.topicsDiscussed || [],
    sentiment:   data.sentiment || 'neutral',
    followUpDate:data.followUpDate || null,
    userId:      data.userId || 'demo',
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
    duration:    data.duration || null,
    source:      data.source || 'text',   // 'text' | 'audio' | 'transcript'
  };
  db.meetings.push(meeting);
  return meeting;
}

function updateMeeting(id, updates) {
  const idx = db.meetings.findIndex(m => m.id === id);
  if (idx === -1) return null;
  db.meetings[idx] = { ...db.meetings[idx], ...updates, updatedAt: new Date().toISOString() };
  return db.meetings[idx];
}

function deleteMeeting(id) {
  const idx = db.meetings.findIndex(m => m.id === id);
  if (idx === -1) return false;
  db.meetings.splice(idx, 1);
  // also remove related tasks
  db.tasks = db.tasks.filter(t => t.meetingId !== id);
  return true;
}

// ── Tasks ─────────────────────────────────────────────────────────────────────

function getAllTasks(userId) {
  return db.tasks.filter(t => t.userId === userId || !userId);
}

function getTaskById(id) {
  return db.tasks.find(t => t.id === id) || null;
}

function getTasksByMeeting(meetingId) {
  return db.tasks.filter(t => t.meetingId === meetingId);
}

function createTask(data) {
  const task = {
    id:          data.id || uuidv4(),
    title:       data.title,
    description: data.description || '',
    assignee:    data.assignee || 'Unassigned',
    deadline:    data.deadline || null,
    priority:    data.priority || 'medium',
    status:      data.status || 'pending',
    tags:        data.tags || [],
    meetingId:   data.meetingId || null,
    userId:      data.userId || 'demo',
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  };
  db.tasks.push(task);
  return task;
}

function updateTask(id, updates) {
  const idx = db.tasks.findIndex(t => t.id === id);
  if (idx === -1) return null;
  db.tasks[idx] = { ...db.tasks[idx], ...updates, updatedAt: new Date().toISOString() };
  return db.tasks[idx];
}

function deleteTask(id) {
  const idx = db.tasks.findIndex(t => t.id === id);
  if (idx === -1) return false;
  db.tasks.splice(idx, 1);
  return true;
}

// ── Users (minimal for demo) ──────────────────────────────────────────────────

function getUserById(id) {
  return db.users.find(u => u.id === id) || null;
}

function getUserByEmail(email) {
  return db.users.find(u => u.email === email) || null;
}

function createUser(data) {
  const user = {
    id:        uuidv4(),
    name:      data.name,
    email:     data.email,
    password:  data.password,   // already hashed by auth controller
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  return user;
}

// ── Notifications ─────────────────────────────────────────────────────────────

function getNotifications(userId) {
  return db.notifications.filter(n => n.userId === userId || !userId);
}

function createNotification(data) {
  const notif = {
    id:       uuidv4(),
    userId:   data.userId || 'demo',
    type:     data.type || 'info',     // 'info' | 'reminder' | 'risk' | 'deadline'
    title:    data.title,
    message:  data.message,
    read:     false,
    taskId:   data.taskId || null,
    createdAt:new Date().toISOString(),
  };
  db.notifications.push(notif);
  return notif;
}

function markNotificationRead(id) {
  const notif = db.notifications.find(n => n.id === id);
  if (notif) notif.read = true;
  return notif;
}

module.exports = {
  getAllMeetings, getMeetingById, createMeeting, updateMeeting, deleteMeeting,
  getAllTasks, getTaskById, getTasksByMeeting, createTask, updateTask, deleteTask,
  getUserById, getUserByEmail, createUser,
  getNotifications, createNotification, markNotificationRead,
};
