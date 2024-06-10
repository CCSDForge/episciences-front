import { useState, useEffect } from "react";

import { useAppSelector } from "../../../hooks/store";
import { useFetchArticlesQuery } from '../../../store/features/article/article.query';
import { allYears } from '../../../utils/filter';
import { articleTypes, articleSections } from '../../../utils/types';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from '../../components/Loader/Loader';
import ArticleCard from "../../components/Cards/ArticleCard/ArticleCard";
import ArticlesSidebar, { IArticleTypeSelection, IArticleSectionSelection, IArticleYearSelection } from "../../components/Sidebars/ArticlesSidebar/ArticlesSidebar";
import Pagination from "../../components/Pagination/Pagination";
import Tag from "../../components/Tag/Tag";
import './Articles.scss';

type ArticleTypeFilter = 'type' | 'section' | 'year';

interface IArticleFilter {
  type: ArticleTypeFilter;
  value: string | number;
  label: string | number;
}

export default function Articles(): JSX.Element {
  const ARTICLES_PER_PAGE = 10;

  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const [currentPage, setCurrentPage] = useState(1);
  const [types, setTypes] = useState<IArticleTypeSelection[]>([])
  const [sections, setSections] = useState<IArticleSectionSelection[]>([]);;
  const [years, setYears] = useState<IArticleYearSelection[]>([]);
  const [taggedFilters, setTaggedFilters] = useState<IArticleFilter[]>([]);

  useEffect(() => {
    if (types.length === 0) {
      const initTypes = articleTypes.map((at) => ({
        label: at.label,
        value: at.value,
        isChecked: false
      }))

      setTypes(initTypes)
    }
  }, [types])

  useEffect(() => {
    if (sections.length === 0) {
      const initSections = articleSections.map((as) => ({
        label: as.label,
        value: as.value,
        isChecked: false
      }))

      setSections(initSections)
    }
  }, [years])

  useEffect(() => {
    if (years.length === 0) {
      const initYears = allYears().map((y) => ({
        year: y,
        isChecked: false
      }))

      setYears(initYears)
    }
  }, [years])

  const { data: articles, isFetching } = useFetchArticlesQuery({ rvcode: rvcode!, page: currentPage, itemsPerPage: ARTICLES_PER_PAGE, type: types.find(t => t.isChecked)?.value, section: sections.find(s => s.isChecked)?.value, year: years.find(y => y.isChecked)?.year }, { skip: !rvcode })

  const handlePageClick = (selectedItem: { selected: number }): void => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const onCheckType = (value: string): void => {
    const updatedTypes = types.map((t) => {
      if (t.value === value) {
        return { ...t, isChecked: !t.isChecked };
      }

      return { ...t, isChecked: false };
    });

    setTypes(updatedTypes);
  }

  const onCheckSection = (value: string): void => {
    const updatedSections = sections.map((s) => {
      if (s.value === value) {
        return { ...s, isChecked: !s.isChecked };
      }

      return { ...s, isChecked: false };
    });

    setSections(updatedSections);
  }

  const onCheckYear = (year: number): void => {
    const updatedYears = years.map((y) => {
      if (y.year === year) {
        return { ...y, isChecked: !y.isChecked };
      }

      return { ...y, isChecked: false };
    });

    setYears(updatedYears);
  }

  const setAllTaggedFilters = (): void => {
    const initFilters: IArticleFilter[] = []

    types.filter((t) => t.isChecked).forEach((t) => {
      initFilters.push({
        type: 'type',
        value: t.value,
        label: t.label
      })
    })

    sections.filter((s) => s.isChecked).forEach((s) => {
      initFilters.push({
        type: 'section',
        value: s.value,
        label: s.label
      })
    })

    years.filter((y) => y.isChecked).forEach((y) => {
      initFilters.push({
        type: 'year',
        value: y.year,
        label: y.year
      })
    })

    setTaggedFilters(initFilters)
  }

  const onCloseTaggedFilter = (type: ArticleTypeFilter, value: string | number) => {
    if (type === 'type') {
      const updatedTypes = types.map((t) => {
        if (t.value === value) {
          return { ...t, isChecked: false };
        }

        return t;
      });

      setTypes(updatedTypes);
    } else if (type === 'section') {
      const updatedSections = sections.map((s) => {
        if (s.value === value) {
          return { ...s, isChecked: false };
        }
  
        return s;
      });
  
      setSections(updatedSections);
    } else if (type === 'year') {
      const updatedYears = years.map((y) => {
        if (y.year === value) {
          return { ...y, isChecked: false };
        }
  
        return y;
      });
  
      setYears(updatedYears);
    }
  }

  const clearTaggedFilters = (): void => {
    const updatedTypes = types.map((t) => {
      return { ...t, isChecked: false };
    });

    const updatedSections = sections.map((s) => {
      return { ...s, isChecked: false };
    });

    const updatedYears = years.map((y) => {
      return { ...y, isChecked: false };
    });

    setTypes(updatedTypes);
    setSections(updatedSections);
    setYears(updatedYears);
    setTaggedFilters([]);
  }

  useEffect(() => {
    setAllTaggedFilters()
  }, [types])

  return (
    <main className='articles'>
      <Breadcrumb />
      <div className='articles-title'>
        <h1>Articles</h1>
        <div className='articles-title-count'>
          {articles && articles.totalItems > 1 ? (
            <div className='articles-title-count-text'>{articles.totalItems} articles</div>
          ) : (
            <div className='articles-title-count-text'>{articles?.totalItems ?? 0} article</div>
          )}
        </div>
      </div>
      <div className="articles-filters">
        <div className="articles-filters-tags">
          {taggedFilters.map((filter, index) => (
            <Tag key={index} text={filter.label.toString()} onCloseCallback={(): void => onCloseTaggedFilter(filter.type, filter.value)}/>
          ))}
          <div className="articles-filters-tags-clear" onClick={clearTaggedFilters}>Clear all filters</div>
        </div>
      </div>
      <div className='articles-content'>
        <div className='articles-content-results'>
          <ArticlesSidebar types={types} onCheckTypeCallback={onCheckType} sections={sections} onCheckSectionCallback={onCheckSection} years={years} onCheckYearCallback={onCheckYear} />
          {isFetching ? (
            <Loader />
          ) : (
            <div className='articles-content-results-cards'>
              {articles?.data?.filter((article) => article).map((article, index) => (
                <ArticleCard
                  key={index}
                  language={language}
                  article={article}
                />
              ))}
            </div>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          itemsPerPage={ARTICLES_PER_PAGE}
          totalItems={articles?.totalItems}
          onPageChange={handlePageClick}
        />
      </div>
    </main>
  )
}