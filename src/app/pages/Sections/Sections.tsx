import { useState } from "react";

import listRed from '/icons/list-red.svg';
import listGrey from '/icons/list-grey.svg';
import tileRed from '/icons/tile-red.svg';
import tileGrey from '/icons/tile-grey.svg';
import { useAppSelector } from "../../../hooks/store";
import { useFetchSectionsQuery } from '../../../store/features/section/section.query';
import { RENDERING_MODE } from '../../../utils/card';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from '../../components/Loader/Loader';
import SectionCard, { ISectionCard } from "../../components/Cards/SectionCard/SectionCard";
import SectionsSidebar from "../../components/Sidebars/SectionsSidebar/SectionsSidebar";
import Pagination from "../../components/Pagination/Pagination";
import Tag from "../../components/Tag/Tag";
import './Sections.scss';

export default function Sections(): JSX.Element {
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const [currentPage, setCurrentPage] = useState(1);
  const [mode, setMode] = useState(RENDERING_MODE.LIST);

  // TODO: remove mocks
  // TODO: type hint filters in src/types ?
  const [filters, setFilters] = useState([
    {
      id: 1,
      title: 'Types of document',
      choices: [
        { id: 1, label: 'Sections', isChecked: false },
        { id: 2, label: 'Data papers', isChecked: false },
        { id: 3, label: 'Software', isChecked: false }
      ]
    },
    {
      id: 2,
      title: 'Sections',
      choices: [
        { id: 1, label: 'Awards', isChecked: false },
        { id: 2, label: 'Special issues', isChecked: false },
        { id: 3, label: 'To be published', isChecked: false },
        { id: 4, label: 'Online first', isChecked: false },
        { id: 5, label: 'Varia', isChecked: false }
      ]
    },
    // TODO : years from util
    {
      id: 3,
      title: 'Years',
      choices: [
        { id: 1, label: '2023', isChecked: false },
        { id: 2, label: '2022', isChecked: false },
        { id: 3, label: '2021', isChecked: false }
      ]
    },
  ]);

  const { data: sections, isFetching } = useFetchSectionsQuery({ rvcode: rvcode!, page: currentPage }, { skip: !rvcode })

  const handlePageClick = (selectedItem: { selected: number }): void => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const getActiveFiltersChoices = (): { id: number; label: string; filterId: number }[] => {
    const activeChoices: { id: number; label: string; filterId: number }[] = [];

    filters.forEach((filter) => {
      filter.choices.forEach((choice) => {
        if (choice.isChecked) {
          activeChoices.push({
            id: choice.id,
            label: choice.label,
            filterId: filter.id
          })
        }
      })
    });

    return activeChoices;
  }

  const onCheckFilterChoice = (filterId: number, choiceId: number): void => {
    const updatedFilters = filters.map((filter) => {
      if (filter.id === filterId) {
        const updatedChoices = filter.choices.map((choice) => {
          if (choice.id === choiceId) {
            return { ...choice, isChecked: !choice.isChecked };
          }

          return choice;
        });

        return { ...filter, choices: updatedChoices };
      }

      return filter;
    });

    setFilters(updatedFilters);
  }

  const clearActiveFiltersChoices = (): void => {
    const updatedFilters = filters.map((filter) => {
      const updatedChoices = filter.choices.map((choice) => {
        return { ...choice, isChecked: false };
      });

      return { ...filter, choices: updatedChoices };
    });

    setFilters(updatedFilters);
  }

  const toggleAbstract = (sectionId: number): void => {
    // const updatedSections = sections.map((section) => {
    //   if (section.id === sectionId) {
    //     return { ...section, openedAbstract: !section.openedAbstract };
    //   }

    //   return section;
    // });

    // setSections(updatedSections);
  }

  return (
    <main className='sections'>
      <Breadcrumb />
      <div className='sections-title'>
        <h1>Sections</h1>
        <div className='sections-title-count'>
          <div className='sections-title-count-text'>1550 sections</div>
          <div className='sections-title-icons'>
            <div className='sections-title-icons-icon' onClick={(): void => setMode(RENDERING_MODE.TILE)}>
              <div className={`${mode === RENDERING_MODE.TILE ? 'sections-title-icons-icon-row-red' : 'sections-title-icons-icon-row'}`}>
                <img src={mode === RENDERING_MODE.TILE ? tileRed : tileGrey} alt='Tile icon' />
                <span>Tile</span>
              </div>
            </div>
            <div className='sections-title-icons-icon' onClick={(): void => setMode(RENDERING_MODE.LIST)}>
              <div className={`${mode === RENDERING_MODE.LIST ? 'sections-title-icons-icon-row-red' : 'sections-title-icons-icon-row'}`}>
                <img src={mode === RENDERING_MODE.LIST ? listRed : listGrey} alt='List icon' />
                <span>List</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sections-filters">
        <div className="sections-filters-tags">
          {getActiveFiltersChoices().map((choice, index) => (
            <Tag key={index} text={choice.label} onCloseCallback={(): void => onCheckFilterChoice(choice.filterId, choice.id)}/>
          ))}
          <div className="sections-filters-tags-clear" onClick={clearActiveFiltersChoices}>Clear all filters</div>
        </div>
      </div>
      {isFetching ? (
        <Loader />
      ) : (
        <div className='sections-content'>
          <div className='sections-content-results'>
            <SectionsSidebar filters={filters} onCheckFilterChoiceCallback={onCheckFilterChoice} />
            <div className='sections-content-results-cards'>
              {sections?.data.map((section, index) => (
                <SectionCard key={index} {...section as ISectionCard} toggleAbstractCallback={(): void => toggleAbstract(section.id)} />
              ))}
            </div>
          </div>
          <Pagination totalItems={sections?.totalItems} onPageChange={handlePageClick} />
        </div>
      )}
    </main>
  )
}