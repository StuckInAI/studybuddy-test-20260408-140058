'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ScheduleItem {
  id: string;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  color: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface Deadline {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  description: string;
}

interface AppContextType {
  scheduleItems: ScheduleItem[];
  notes: Note[];
  deadlines: Deadline[];
  addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => void;
  updateScheduleItem: (id: string, item: Omit<ScheduleItem, 'id'>) => void;
  deleteScheduleItem: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteNote: (id: string) => void;
  addDeadline: (deadline: Omit<Deadline, 'id'>) => void;
  updateDeadline: (id: string, deadline: Partial<Deadline>) => void;
  deleteDeadline: (id: string) => void;
  toggleDeadline: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultSchedule: ScheduleItem[] = [
  { id: '1', subject: 'Mathematics', day: 'Monday', startTime: '09:00', endTime: '10:30', location: 'Room 101', color: '#4f46e5' },
  { id: '2', subject: 'Physics', day: 'Tuesday', startTime: '11:00', endTime: '12:30', location: 'Lab 2', color: '#06b6d4' },
  { id: '3', subject: 'English Literature', day: 'Wednesday', startTime: '14:00', endTime: '15:30', location: 'Room 205', color: '#10b981' },
  { id: '4', subject: 'Computer Science', day: 'Thursday', startTime: '09:00', endTime: '11:00', location: 'Computer Lab', color: '#f59e0b' },
  { id: '5', subject: 'History', day: 'Friday', startTime: '13:00', endTime: '14:30', location: 'Room 310', color: '#ef4444' },
];

const defaultNotes: Note[] = [
  {
    id: '1',
    title: 'Calculus Integration Techniques',
    content: 'Integration by parts: u dv = uv - v du\n\nSubstitution method: Replace complex expressions with simpler variables.\n\nPartial fractions: Decompose rational functions.',
    subject: 'Mathematics',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ['calculus', 'integration', 'formulas']
  },
  {
    id: '2',
    title: 'Newton\'s Laws of Motion',
    content: '1st Law: An object at rest stays at rest unless acted upon by an external force.\n\n2nd Law: F = ma (Force equals mass times acceleration)\n\n3rd Law: For every action, there is an equal and opposite reaction.',
    subject: 'Physics',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    tags: ['newton', 'mechanics', 'laws']
  },
];

const defaultDeadlines: Deadline[] = [
  {
    id: '1',
    title: 'Math Problem Set #5',
    subject: 'Mathematics',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    priority: 'high',
    completed: false,
    description: 'Complete problems 1-20 from Chapter 8'
  },
  {
    id: '2',
    title: 'Physics Lab Report',
    subject: 'Physics',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    priority: 'medium',
    completed: false,
    description: 'Write up the results from the pendulum experiment'
  },
  {
    id: '3',
    title: 'Essay on Shakespeare',
    subject: 'English Literature',
    dueDate: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
    priority: 'low',
    completed: false,
    description: 'Analyze themes in Hamlet, 1500 words'
  },
  {
    id: '4',
    title: 'Algorithm Assignment',
    subject: 'Computer Science',
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
    priority: 'high',
    completed: true,
    description: 'Implement sorting algorithms in Python'
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(defaultSchedule);
  const [notes, setNotes] = useState<Note[]>(defaultNotes);
  const [deadlines, setDeadlines] = useState<Deadline[]>(defaultDeadlines);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedSchedule = localStorage.getItem('study_schedule');
      const savedNotes = localStorage.getItem('study_notes');
      const savedDeadlines = localStorage.getItem('study_deadlines');
      if (savedSchedule) setScheduleItems(JSON.parse(savedSchedule));
      if (savedNotes) setNotes(JSON.parse(savedNotes));
      if (savedDeadlines) setDeadlines(JSON.parse(savedDeadlines));
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem('study_schedule', JSON.stringify(scheduleItems));
    } catch (e) {
      console.error('Failed to save schedule', e);
    }
  }, [scheduleItems, loaded]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem('study_notes', JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes', e);
    }
  }, [notes, loaded]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem('study_deadlines', JSON.stringify(deadlines));
    } catch (e) {
      console.error('Failed to save deadlines', e);
    }
  }, [deadlines, loaded]);

  const addScheduleItem = (item: Omit<ScheduleItem, 'id'>) => {
    setScheduleItems(prev => [...prev, { ...item, id: generateId() }]);
  };

  const updateScheduleItem = (id: string, item: Omit<ScheduleItem, 'id'>) => {
    setScheduleItems(prev => prev.map(s => s.id === id ? { ...item, id } : s));
  };

  const deleteScheduleItem = (id: string) => {
    setScheduleItems(prev => prev.filter(s => s.id !== id));
  };

  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setNotes(prev => [{ ...note, id: generateId(), createdAt: now, updatedAt: now }, ...prev]);
  };

  const updateNote = (id: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...note, id, createdAt: n.createdAt, updatedAt: new Date().toISOString() } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const addDeadline = (deadline: Omit<Deadline, 'id'>) => {
    setDeadlines(prev => [...prev, { ...deadline, id: generateId() }]);
  };

  const updateDeadline = (id: string, deadline: Partial<Deadline>) => {
    setDeadlines(prev => prev.map(d => d.id === id ? { ...d, ...deadline } : d));
  };

  const deleteDeadline = (id: string) => {
    setDeadlines(prev => prev.filter(d => d.id !== id));
  };

  const toggleDeadline = (id: string) => {
    setDeadlines(prev => prev.map(d => d.id === id ? { ...d, completed: !d.completed } : d));
  };

  return (
    <AppContext.Provider value={{
      scheduleItems, notes, deadlines,
      addScheduleItem, updateScheduleItem, deleteScheduleItem,
      addNote, updateNote, deleteNote,
      addDeadline, updateDeadline, deleteDeadline, toggleDeadline
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
