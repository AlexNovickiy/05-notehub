import axios from 'axios';
import type { Note, CreateNote } from '../types/note';

const API_KEY = import.meta.env.VITE_NOTEHUB_TOKEN;
const BASE_URL = 'https://notehub-public.goit.study/api';
const NOTES_URL = `${BASE_URL}/notes`;

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface Params {
  page: number;
  perPage: number;
  search?: string;
}

export async function fetchNotes(
  page: number = 1,
  searchValue: string = '',
  perPage: number = 12
): Promise<FetchNotesResponse> {
  const params: Params = {
    page,
    perPage,
  };

  if (searchValue) {
    params.search = searchValue;
  }

  const response = await axios.get<FetchNotesResponse>(`${NOTES_URL}`, {
    params,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return response.data;
}

export async function createNote(note: CreateNote): Promise<Note> {
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
