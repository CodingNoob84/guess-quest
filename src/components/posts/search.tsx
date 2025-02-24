"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { Movie, searchMovies } from "@/lib/fetch-tmdb";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    console.log("query", query);

    try {
      const results = await searchMovies(query);
      console.log(results);
      setMovies(results);
      setOpen(true);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-[300px]">
      <Popover open={open} onOpenChange={setOpen}>
        {/* PopoverTrigger wraps Input to position popover correctly */}
        <PopoverAnchor>
          <div className="flex flex-row">
            <Input
              placeholder="Search for a movie..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSearch}
                disabled={!query.trim() || loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </div>
        </PopoverAnchor>

        <PopoverContent
          className="w-full max-w-[300px] p-0"
          align="start"
          side="bottom"
          alignOffset={8}
          avoidCollisions={true} // Ensures better positioning
        >
          <Command>
            <CommandEmpty>No movies found.</CommandEmpty>
            <CommandList>
              {movies.map((movie) => (
                <CommandItem
                  key={movie.id}
                  onSelect={() => {
                    setSelectedMovie(movie);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedMovie?.id === movie.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {movie.title} ({movie.year})
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
