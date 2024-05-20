import ReactPaginate from 'react-paginate';

import caretLeft from '/icons/caret-left-red.svg';
import caretRight from '/icons/caret-right-red.svg';
import './Pagination.scss'

interface IPaginationProps {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

export default function Pagination({ pageCount, onPageChange }: IPaginationProps): JSX.Element {
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