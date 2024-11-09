import { KeyboardEvent, RefObject } from 'react';
import { Search, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  inputRef: RefObject<HTMLInputElement>;
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export const SearchBar = ({
  inputRef,
  query,
  onQueryChange,
  onSearch,
  onKeyDown
}: SearchBarProps) => {
  return (
    <div className="relative w-full mt-4">
      <Search className="absolute top-3 w-10 left-1 h-6 rounded-full opacity-50 sm:left-3 sm:top-4 sm:h-8" />
      <input 
        ref={inputRef}
        className="h-12 w-full rounded-full border border-zinc-600 pr-12 pl-11 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 sm:h-16 sm:py-2 sm:pr-16 sm:pl-16 sm:text-lg"
        type="text"
        placeholder="What are you looking for?"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <button>
        <ArrowRight 
          onClick={onSearch}
          className="absolute right-2 top-2.5 h-7 w-7 rounded-full bg-blue-500 p-1 hover:cursor-pointer hover:bg-blue-600 sm:right-3 sm:top-3 sm:h-10 sm:w-10 text-white"
        />
      </button>
    </div>
  );
};