"use client";

import { memo, useRef } from "react";
import { Clock, StopCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchRedirectProps = {
  countdown: number;
  autoRedirectEnabled: boolean;
  onCancelAutoRedirect: () => void;
  onSearch: (value: string) => void;
};

function SearchRedirectComponent({ countdown, autoRedirectEnabled, onCancelAutoRedirect, onSearch }: SearchRedirectProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    const val = inputRef.current?.value.trim() || "";
    if (val) onSearch(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Search for a product and jump directly to matching results.
        </p>
        {autoRedirectEnabled ? (
          <div className="relative inline-flex">
            <span className="absolute -top-1.5 -right-1.5 z-10 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {countdown}
            </span>
            <Button variant="outline" size="sm" onClick={onCancelAutoRedirect}>
              <Clock className="h-4 w-4 mr-2" />
              Cancel Auto Redirect
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <StopCircle className="h-4 w-4 mr-2" />
            Auto Redirect Paused
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          ref={inputRef}
          className="h-11"
          placeholder="Search tables, desks, dining sets..."
          onKeyDown={handleKeyDown}
        />
        <Button className="h-11 px-5" onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Search Products
        </Button>
      </div>
    </div>
  );
}

const SearchRedirect = memo(SearchRedirectComponent);
export default SearchRedirect;
