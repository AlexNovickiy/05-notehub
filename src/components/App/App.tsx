// src/components/App.tsx

import css from './App.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import type { Movie } from '../../types/movie.ts';
import SearchBar from '../SearchBar/SearchBar.tsx';
import MovieGrid from '../MovieGrid/MovieGrid.tsx';
import Loader from '../Loader/Loader.tsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';
import MovieModal from '../MovieModal/MovieModal.tsx';
import { fetchMovies } from '../../services/movieService.ts';
import ReactPaginate from 'react-paginate';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [topic, setTopic] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', topic, currentPage],
    queryFn: () => fetchMovies(topic, currentPage),
    enabled: topic !== '',
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.results.length === 0 && isSuccess) {
      toast.error('No movies found for your request.');
    }
    if (isError) {
      toast.error('An error occurred while fetching movies.');
    }
  }, [data, isSuccess, isError]);

  const handleSearch = async (query: string) => {
    setTopic(query);
    setCurrentPage(1);
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleClose = () => {
    setSelectedMovie(null);
  };

  const totalPages = data ? Math.ceil(data.total_results / 20) : 0;

  return (
    <div className={css.app}>
      <Toaster position="top-center" reverseOrder={true} />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && data.total_results > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {data && data.results.length > 0 && (
        <MovieGrid onSelect={handleSelect} movies={data.results} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleClose} />
      )}
    </div>
  );
}
