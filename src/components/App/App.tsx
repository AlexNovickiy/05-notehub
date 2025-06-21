// src/components/App.tsx

import css from './App.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import type { Note } from '../../types/note.ts';

import Loader from '../Loader/Loader.tsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';
import SearchBox from '../SearchBox/SearchBox.tsx';
import Pagination from '../Pagination/Pagination.tsx';
import NoteForm from '../NoteForm/NoteForm.tsx';
import NoteList from '../NoteList/NoteList.tsx';
import NoteModal from '../NoteModal/NoteModal.tsx';

import {
  fetchNotes,
  createNote,
  deleteNote,
} from '../../services/noteService.ts';
import ReactPaginate from 'react-paginate';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export default function App() {
  const [isClickedCreateNote, setIsClickedCreateNote] =
    useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['notes', searchValue, currentPage],
    queryFn: () => fetchNotes(currentPage, searchValue),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.notes.length === 0 && isSuccess) {
      toast.error('No notes found for your request.');
    }
    if (isError) {
      toast.error('An error occurred while fetching notes.');
    }
  }, [data, isSuccess, isError]);

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
        <SearchBox onSubmit={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        <button onClick={handleOpenModal}>Create Note +</button>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {isClickedCreateNote && <NoteModal onClose={handleCloseModal} />}
    </div>
  );
}
