// src/components/App.tsx

import css from './App.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import type { Note } from '../../types/note.ts';
import { useMutation } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import Loader from '../Loader/Loader.tsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';
import SearchBox from '../SearchBox/SearchBox.tsx';
import Pagination from '../Pagination/Pagination.tsx';
import NoteList from '../NoteList/NoteList.tsx';
import NoteModal from '../NoteModal/NoteModal.tsx';

import {
  fetchNotes,
  createNote,
  deleteNote,
} from '../../services/noteService.ts';

import {
  useQuery,
  keepPreviousData,
  useQueryClient,
} from '@tanstack/react-query';

export default function App() {
  const [isClickedCreateNote, setIsClickedCreateNote] =
    useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearchValue] = useDebounce(searchValue, 1000);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const queryClient = useQueryClient();

  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ['notes', debouncedSearchValue, currentPage],
    queryFn: () => fetchNotes(currentPage, debouncedSearchValue),
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success('Note created successfully!');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleCreateNote = (note: Note) => {
    createMutation.mutate(note);
    setIsClickedCreateNote(false);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      toast.success('Note deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleDeleteNote = (id: number | undefined) => {
    if (id) {
      deleteMutation.mutate(id);
    } else {
      toast.error('Note ID is required for deletion.');
    }
  };

  const handleSearch = async (searchValue: string) => {
    setSearchValue(searchValue);
    setCurrentPage(1);
  };

  const handleOpenModal = () => {
    setIsClickedCreateNote(true);
  };

  const handleCloseModal = () => {
    setIsClickedCreateNote(false);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" reverseOrder={true} />
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={handleOpenModal}>
          Create Note +
        </button>
      </header>
      {isFetching && <Loader />}
      {isError && <ErrorMessage />}
      {data && isSuccess && data.notes.length > 0 && (
        <NoteList notes={data.notes} onDelete={handleDeleteNote} />
      )}
      {isClickedCreateNote && (
        <NoteModal onSubmit={handleCreateNote} onClose={handleCloseModal} />
      )}
    </div>
  );
}
