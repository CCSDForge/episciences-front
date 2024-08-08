import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

import { PATHS } from "../../../config/paths";
import { useAppSelector } from "../../../hooks/store";
import { useFetchSearchResultsQuery } from '../../../store/features/search/search.query';
import { FetchedArticle, articleTypes } from '../../../utils/article';
import { AvailableLanguage } from "../../../utils/i18n";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from '../../components/Loader/Loader';
import SearchResultCard, { ISearchResultCard } from "../../components/Cards/SearchResultCard/SearchResultCard";
import SearchResultsSidebar, { ISearchResultTypeSelection, ISearchResultYearSelection, ISearchResultVolumeSelection, ISearchResultSectionSelection } from "../../components/Sidebars/SearchResultsSidebar/SearchResultsSidebar";
import Pagination from "../../components/Pagination/Pagination";
import Tag from "../../components/Tag/Tag";
import './Search.scss';

type SearchResultTypeFilter = 'type' | 'year' | 'volume' | 'section';

interface ISearchResultFilter {
  type: SearchResultTypeFilter;
  value: string | number;
  label?: number;
  labelPath?: string;
  translatedLabel?: string;
}

type EnhancedSearchResult = FetchedArticle & {
  openedAbstract: boolean;
}

export default function Search(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const SEARCH_RESULTS_PER_PAGE = 10;

  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)
  const search = useAppSelector(state => state.searchReducer.search);

  const [currentPage, setCurrentPage] = useState(1);
  const [enhancedSearchResults, setEnhancedSearchResults] = useState<EnhancedSearchResult[]>([])
  const [types, setTypes] = useState<ISearchResultTypeSelection[]>([])
  const [years, setYears] = useState<ISearchResultYearSelection[]>([]);
  const [volumes, setVolumes] = useState<Record<AvailableLanguage, ISearchResultVolumeSelection[]>>({
    en: [],
    fr: []
  });
  const [sections, setSections] = useState<Record<AvailableLanguage, ISearchResultSectionSelection[]>>({
    en: [],
    fr: []
  });
  const [taggedFilters, setTaggedFilters] = useState<ISearchResultFilter[]>([]);
  const [showAllAbstracts, setShowAllAbstracts] = useState(false)

  const getSelectedTypes = (): string[] => types.filter(t => t.isChecked).map(t => t.value);
  const getSelectedYears = (): number[] => years.filter(y => y.isChecked).map(y => y.year);
  const getSelectedVolumes = (): number[] => volumes[language].filter(v => v.isChecked).map(v => v.id);
  const getSelectedSections = (): number[] => sections[language].filter(s => s.isChecked).map(s => s.id);

  useEffect(() => {
    if (!search) {
      navigate(PATHS.home);
    }
  }, [search, navigate])

  const { data: searchResults, isFetching: isFetchingSearchResults } = useFetchSearchResultsQuery({ terms: search ?? '', rvcode: rvcode!, page: currentPage, itemsPerPage: SEARCH_RESULTS_PER_PAGE, types: getSelectedTypes(), years: getSelectedYears(), volumes: getSelectedVolumes(), sections: getSelectedSections() }, { skip: !search || !rvcode, refetchOnMountOrArgChange: true })

  useEffect(() => {
    if (searchResults?.range && searchResults.range.types && types.length === 0) {
      const initTypes = searchResults.range.types
        .filter((t) => articleTypes.find((at) => at.value === t))
        .map((t) => {
        const matchingType = articleTypes.find((at) => at.value === t)

        return {
          labelPath: matchingType!.labelPath,
          value: matchingType!.value,
          isChecked: false
        }
      })

      setTypes(initTypes)
    }
  }, [searchResults?.range, searchResults?.range?.types, types])

  useEffect(() => {
    if (searchResults?.range && searchResults.range.years && years.length === 0) {
      const initYears = searchResults.range.years.map((y) => ({
        year: y,
        isChecked: false
      }))

      setYears(initYears)
    }
  }, [searchResults?.range, searchResults?.range?.years, years])

  useEffect(() => {
    if (searchResults?.range && searchResults.range.volumes && volumes.en.length === 0 && volumes.fr.length === 0) {
      const initVolumes = Object.keys(searchResults.range.volumes).reduce((acc, lang) => {
        acc[lang as AvailableLanguage] = searchResults.range!.volumes![lang as AvailableLanguage].map((v) => {
          const id = parseInt(Object.keys(v)[0]);
          const label = v[id];

          return {
            id,
            label,
            isChecked: false
          }
        })
        return acc;
      }, {} as Record<AvailableLanguage, ISearchResultVolumeSelection[]>)

      setVolumes(initVolumes);
    }
  }, [searchResults?.range, searchResults?.range?.volumes, volumes])

  useEffect(() => {
    if (searchResults?.range && searchResults.range.sections && sections.en.length === 0 && sections.fr.length === 0) {
      const initSections = Object.keys(searchResults.range.sections).reduce((acc, lang) => {
        acc[lang as AvailableLanguage] = searchResults.range!.sections![lang as AvailableLanguage].map((s) => {
          const id = parseInt(Object.keys(s)[0]);
          const label = s[id];

          return {
            id,
            label,
            isChecked: false
          }
        })
        return acc;
      }, {} as Record<AvailableLanguage, ISearchResultSectionSelection[]>)

      setSections(initSections);
    }
  }, [searchResults?.range, searchResults?.range?.sections, sections])

  const handlePageClick = (selectedItem: { selected: number }): void => {
    setEnhancedSearchResults([]);
    setCurrentPage(selectedItem.selected + 1);
  };

  const onCheckType = (value: string): void => {
    const updatedTypes = types.map((t) => {
      if (t.value === value) {
        return { ...t, isChecked: !t.isChecked };
      }

      return { ...t };
    });

    setTypes(updatedTypes);
  }

  const onCheckYear = (year: number): void => {
    const updatedYears = years.map((y) => {
      if (y.year === year) {
        return { ...y, isChecked: !y.isChecked };
      }

      return { ...y };
    });

    setYears(updatedYears);
  }

  const onCheckVolume = (id: number): void => {
    const updatedVolumes = {
      ...volumes,
      [language]: volumes[language].map((v) => {
        if (v.id === id) {
          return { ...v, isChecked: !v.isChecked };
        }

        return { ...v };
      })
    };

    setVolumes(updatedVolumes);
  }

  const onCheckSection = (id: number): void => {
    const updatedSections = {
      ...sections,
      [language]: sections[language].map((s) => {
        if (s.id === id) {
          return { ...s, isChecked: !s.isChecked };
        }

        return { ...s };
      })
    };

    setSections(updatedSections);
  }

  const setAllTaggedFilters = (): void => {
    const initFilters: ISearchResultFilter[] = []

    types.filter((t) => t.isChecked).forEach((t) => {
      initFilters.push({
        type: 'type',
        value: t.value,
        labelPath: t.labelPath
      })
    })

    years.filter((y) => y.isChecked).forEach((y) => {
      initFilters.push({
        type: 'year',
        value: y.year,
        label: y.year
      })
    })

    volumes[language].filter((v) => v.isChecked).forEach((v) => {
      initFilters.push({
        type: 'volume',
        value: v.id,
        translatedLabel: v.label
      })
    })

    sections[language].filter((s) => s.isChecked).forEach((s) => {
      initFilters.push({
        type: 'section',
        value: s.id,
        translatedLabel: s.label
      })
    })

    setTaggedFilters(initFilters)
  }

  const onCloseTaggedFilter = (type: SearchResultTypeFilter, value: string | number) => {
    // TODO: volume
    // TODO: section
    if (type === 'type') {
      const updatedTypes = types.map((t) => {
        if (t.value === value) {
          return { ...t, isChecked: false };
        }

        return t;
      });

      setTypes(updatedTypes);
    } else if (type === 'year') {
      const updatedYears = years.map((y) => {
        if (y.year === value) {
          return { ...y, isChecked: false };
        }
  
        return y;
      });
  
      setYears(updatedYears);
    } else if (type === 'volume') {
      const updatedVolumes = {
        ...volumes,
        [language]: volumes[language].map((v) => {
          if (v.id === value) {
            return { ...v, isChecked: false };
          }
    
          return v;
        })
      };

      setVolumes(updatedVolumes);
    } else if (type === 'section') {
      const updatedSections = {
        ...sections,
        [language]: sections[language].map((s) => {
          if (s.id === value) {
            return { ...s, isChecked: false };
          }
    
          return s;
        })
      };

      setSections(updatedSections);
    }
  }

  const clearTaggedFilters = (): void => {
    const updatedTypes = types.map((t) => {
      return { ...t, isChecked: false };
    });

    const updatedYears = years.map((y) => {
      return { ...y, isChecked: false };
    });

    const updatedVolumes = {
      ...volumes,
      [language]: volumes[language].map((v) => {
        return { ...v, isChecked: false };
      })
    };

    const updatedSections = {
      ...sections,
      [language]: sections[language].map((s) => {
        return { ...s, isChecked: false };
      })
    };

    setTypes(updatedTypes);
    setYears(updatedYears);
    setVolumes(updatedVolumes);
    setSections(updatedSections);
    setTaggedFilters([]);
  }

  useEffect(() => {
    setAllTaggedFilters()
  }, [types, years, volumes, sections])

  useEffect(() => {
    if (searchResults) {
      const displayedSearchResults = searchResults?.data.filter((searchResult) => searchResult?.title).map((searchResult) => {
        return { ...searchResult, openedAbstract: false };
      });

      setEnhancedSearchResults(displayedSearchResults as EnhancedSearchResult[])
    }

  }, [searchResults, searchResults?.data])

  const toggleAbstract = (searchResultId?: number): void => {
    if (!searchResultId) return

    const updatedSearchResults = enhancedSearchResults.map((searchResult) => {
      if (searchResult?.id === searchResultId) {
        return {
          ...searchResult,
          openedAbstract: !searchResult.openedAbstract
        }
      }

      return { ...searchResult };
    });

    setEnhancedSearchResults(updatedSearchResults)
  }

  const toggleAllAbstracts = (): void => {
    const isShown = !showAllAbstracts

    const updatedSearchResults = enhancedSearchResults.map((searchResult) => ({
      ...searchResult,
      openedAbstract: isShown
    }));

    setEnhancedSearchResults(updatedSearchResults)
    setShowAllAbstracts(isShown)
  }

  return (
    <main className='search'>
      <Breadcrumb parents={[
        { path: 'home', label: `${t('pages.home.title')} > ${t('common.content')} >` }
      ]} crumbLabel={t('pages.search.title')} />
      <div className='search-title'>
        <h1 className='search-title-text'>{t('pages.search.title')}</h1>
        <div className='search-title-count'>
          {searchResults && searchResults.totalItems > 1 ? (
            <div className='search-title-count'>{searchResults.totalItems} {t('common.resultsFor')} "{search}"</div>
          ) : (
            <div className='search-title-count'>{searchResults?.totalItems ?? 0} {t('common.resultFor')} "{search}"</div>
        )}
        </div>
      </div>
      <div className="search-filters">
        <div className="search-filters-tags">
          {taggedFilters.map((filter, index) => (
            <Tag key={index} text={filter.labelPath ? t(filter.labelPath) : filter.translatedLabel ? filter.translatedLabel : filter.label!.toString()} onCloseCallback={(): void => onCloseTaggedFilter(filter.type, filter.value)}/>
          ))}
          {taggedFilters.length > 0 ? (
            <div className="search-filters-tags-clear" onClick={clearTaggedFilters}>{t('common.filters.clearAll')}</div>
          ) : (
            <div className="search-filters-tags-clear"></div>
          )}
        </div>
        <div className="search-filters-abstracts" onClick={toggleAllAbstracts}>
          {`${showAllAbstracts ? t('common.toggleAbstracts.hideAll') : t('common.toggleAbstracts.showAll')}`}
        </div>
      </div>
      <div className='search-content'>
        <div className='search-content-results'>
          <SearchResultsSidebar
            language={language}
            t={t}
            types={types}
            onCheckTypeCallback={onCheckType}
            years={years}
            onCheckYearCallback={onCheckYear}
            volumes={volumes}
            onCheckVolumeCallback={onCheckVolume}
            sections={sections}
            onCheckSectionCallback={onCheckSection}
          />
          {isFetchingSearchResults ? (
            <Loader />
          ) : (
            <div className='search-content-results-cards'>
              {enhancedSearchResults.map((searchResult, index) => (
                <SearchResultCard
                  key={index}
                  language={language}
                  t={t}
                  searchResult={searchResult as ISearchResultCard}
                  toggleAbstractCallback={(): void => toggleAbstract(searchResult?.id)}
                />
              ))}
            </div>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          itemsPerPage={SEARCH_RESULTS_PER_PAGE}
          totalItems={searchResults?.totalItems}
          onPageChange={handlePageClick}
        />
      </div>
    </main>
  )
}