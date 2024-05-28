import ReactPaginate from 'react-paginate';

import caretLeft from '/icons/caret-left-red.svg';
import caretRight from '/icons/caret-right-red.svg';
import { ITEMS_PER_PAGE } from '../../../utils/pagination';
import './Pagination.scss'

interface IPaginationProps {
  totalItems?: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

export default function Pagination({ totalItems, onPageChange }: IPaginationProps): JSX.Element {
  const pageCount = totalItems ? Math.ceil(totalItems / ITEMS_PER_PAGE) : 0;

  return (
    <ReactPaginate
      pageCount={pageCount}
      onPageChange={onPageChange}
      className='pagination'
      pageClassName='pagination-page'
      previousClassName='pagination-previous'
      previousLabel={<img src={caretLeft} alt='Caret left icon'/>}
      nextClassName='pagination-next'
      nextLabel={<img src={caretRight} alt='Caret right icon'/>}
      activeClassName='pagination-page-active'
      breakClassName='pagination-break'
      marginPagesDisplayed={0}
      pageRangeDisplayed={3}
    />
  )
}