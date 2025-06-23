// src/components/App.tsx

import css from './App.module.css';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Toaster } from 'react-hot-toast';

import Loader from '../Loader/Loader.tsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';
import SearchBox from '../SearchBox/SearchBox.tsx';
import Pagination from '../Pagination/Pagination.tsx';
import NoteList from '../NoteList/NoteList.tsx';
import NoteModal from '../NoteModal/NoteModal.tsx';

import { fetchNotes } from '../../services/noteService.ts';

import { useQuery, keepPreviousData } from '@tanstack/react-query';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearchValue] = useDebounce(searchValue, 1000);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ['notes', debouncedSearchValue, currentPage],
    queryFn: () => fetchNotes(currentPage, debouncedSearchValue),
    placeholderData: keepPreviousData,
  });

  const handleSearch = (searchValue: string) => {
    setSearchValue(searchValue);
    setCurrentPage(1);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
        <NoteList notes={data.notes} />
      )}
      {isModalOpen && <NoteModal onClose={handleCloseModal} />}
    </div>
  );
}
