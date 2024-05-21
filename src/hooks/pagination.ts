import { useState, useEffect } from 'react';

import { IArticle } from '../types/article';
import { IAuthor } from '../types/author';

export const ITEMS_PER_PAGE = 10;

export interface PaginatedResults {
  data: IArticle[] | IAuthor[];
  totalPages: number;
}

type FetchArticlesFunction = (currentPage: number) => Promise<PaginatedResults>;

function usePagination(apiFunction: FetchArticlesFunction) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [paginatedItems, setPaginatedItems] = useState<IArticle[] | IAuthor[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await apiFunction(currentPage);

      setPaginatedItems(result.data);
      setPageCount(result.totalPages);
    };

    fetchData();
  }, [currentPage, apiFunction]);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  return { paginatedItems, handlePageClick, pageCount };
}

export default usePagination;