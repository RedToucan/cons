'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, FormEvent, Suspense } from 'react';

function SearchInputInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentParam = searchParams.get('q') || '';

  const [query, setQuery] = useState(currentParam);
  const [prevParam, setPrevParam] = useState(currentParam);

  if (prevParam !== currentParam) {
    setPrevParam(currentParam);
    setQuery(currentParam);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/');
    }
  };

  const handleClear = () => {
    setQuery('');
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="노트 전체에서 검색..."
          className="search-input"
          aria-label="에세이 검색"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="search-clear-btn"
            aria-label="검색어 지우기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="clear-icon-svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <button type="submit" className="search-submit-btn" aria-label="검색">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="search-icon-svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}

export default function SearchInput() {
  return (
    <Suspense fallback={
      <div className="search-form">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="노트 전체에서 검색..."
            className="search-input"
            disabled
          />
          <button type="button" className="search-submit-btn" disabled>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="search-icon-svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z"
              />
            </svg>
          </button>
        </div>
      </div>
    }>
      <SearchInputInner />
    </Suspense>
  );
}
