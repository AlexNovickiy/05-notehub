import axios from 'axios';
import type { Note } from '../types/note';

const API_KEY = import.meta.env.VITE_NOTEHUB_TOKEN;
const BASE_URL = 'https://notehub-public.goit.study';
const NOTES_URL = `${BASE_URL}/notes`;

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  page: number = 1,
  searchValue: string = ''
): Promise<FetchNotesResponse> {
  const response = await axios.get<FetchNotesResponse>(`${NOTES_URL}`, {
    params: {
      page,
      search: searchValue,
      perPage: 12,
    },
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return response.data;
}

export async function createNote(note: Note): Promise<Note> {
  const response = await axios.post<Note>(`${NOTES_URL}`, note, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return response.data;
}

export async function deleteNote(id: number): Promise<Note> {
  const response = await axios.delete<Note>(`${NOTES_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return response.data;
}
