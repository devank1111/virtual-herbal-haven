import { useState, useEffect, useCallback } from "react";

const BOOKMARKS_KEY = "ayush-garden-bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = useCallback((plantId: string) => {
    setBookmarks((prev) =>
      prev.includes(plantId)
        ? prev.filter((id) => id !== plantId)
        : [...prev, plantId]
    );
  }, []);

  const isBookmarked = useCallback(
    (plantId: string) => bookmarks.includes(plantId),
    [bookmarks]
  );

  return { bookmarks, toggleBookmark, isBookmarked };
}
