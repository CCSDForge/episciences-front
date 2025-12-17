import ReactPaginate from 'react-paginate';

import caretLeft from '/icons/caret-left-red.svg';
import caretRight from '/icons/caret-right-red.svg';
import caretLeftDisabled from '/icons/caret-left-grey-light.svg';
import caretRightDisabled from '/icons/caret-right-grey-light.svg';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/pagination';
import './Pagination.scss';

interface IPaginationProps {
  currentPage: number;
  itemsPerPage?: number;
  totalItems?: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

export default function Pagination({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}: IPaginationProps): JSX.Element {
  const perPage = itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE;
  const pageCount = totalItems ? Math.ceil(totalItems / perPage) : 0;

  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={onPageChange}
      className="pagination"
      pageClassName="pagination-page"
      previousClassName="pagination-previous"
      previousLabel={
        <img
          src={currentPage === 1 ? caretLeftDisabled : caretLeft}
          alt="Caret left icon"
        />
      }
      nextClassName="pagination-next"
      nextLabel={
        <img
          src={currentPage === pageCount ? caretRightDisabled : caretRight}
          alt="Caret right icon"
        />
      }
      activeClassName="pagination-page-active"
      breakClassName="pagination-break"
      disabledClassName="pagination-disabled"
      marginPagesDisplayed={0}
      pageRangeDisplayed={3}
      renderOnZeroPageCount={null}
    />
  );
}
