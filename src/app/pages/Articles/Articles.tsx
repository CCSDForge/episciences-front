import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

import { useAppSelector } from "../../../hooks/store";
import { useFetchArticlesQuery } from '../../../store/features/article/article.query';
import { FetchedArticle, articleTypes } from '../../../utils/article';
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from '../../components/Loader/Loader';
import ArticleCard, { IArticleCard } from "../../components/Cards/ArticleCard/ArticleCard";
import ArticlesSidebar, { IArticleTypeSelection, IArticleYearSelection } from "../../components/Sidebars/ArticlesSidebar/ArticlesSidebar";
import Pagination from "../../components/Pagination/Pagination";
import Tag from "../../components/Tag/Tag";
import './Articles.scss';

type ArticleTypeFilter = 'type' | 'year';

interface IArticleFilter {
  type: ArticleTypeFilter;
  value: string | number;
  label: string | number;
}

type ArticleWithAbstractToggle = FetchedArticle & {
  openedAbstract: boolean;
}

export default function Articles(): JSX.Element {
  const { t } = useTranslation();

  const ARTICLES_PER_PAGE = 10;

  const translatedArticleTypes = articleTypes();

  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const [currentPage, setCurrentPage] = useState(1);
  const [articlesWithAbstractToggle, setArticlesWithAbstractToggle] = useState<ArticleWithAbstractToggle[]>([])
  const [types, setTypes] = useState<IArticleTypeSelection[]>([])
  const [years, setYears] = useState<IArticleYearSelection[]>([]);
  const [taggedFilters, setTaggedFilters] = useState<IArticleFilter[]>([]);
  const [showAllAbstracts, setShowAllAbstracts] = useState(false)

  const getSelectedTypes = (): string[] => types.filter(t => t.isChecked).map(t => t.value);
  const getSelectedYears = (): number[] => years.filter(y => y.isChecked).map(y => y.year);

  const { data: articles, isFetching: isFetchingArticles } = useFetchArticlesQuery({ rvcode: rvcode!, page: currentPage, itemsPerPage: ARTICLES_PER_PAGE, types: getSelectedTypes(), years: getSelectedYears() }, { skip: !rvcode, refetchOnMountOrArgChange: true })

  useEffect(() => {
    if (articles?.range && articles.range.types && types.length === 0) {
      const initTypes = articles.range.types
        .filter((t) => translatedArticleTypes.find((at) => at.value === t))
        .map((t) => {
        const matchingType = translatedArticleTypes.find((at) => at.value === t)

        return {
          label: matchingType!.label,
          value: matchingType!.value,
          isChecked: false
        }
      })

      setTypes(initTypes)
    }
  }, [articles?.range, articles?.range?.types, types])

  useEffect(() => {
    if (articles?.range && articles.range.years && years.length === 0) {
      const initYears = articles.range.years.map((y) => ({
        year: y,
        isChecked: false
      }))

      setYears(initYears)
    }
  }, [articles?.range, articles?.range?.years, years])

  const handlePageClick = (selectedItem: { selected: number }): void => {
    setArticlesWithAbstractToggle([]);
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

  const setAllTaggedFilters = (): void => {
    const initFilters: IArticleFilter[] = []

    types.filter((t) => t.isChecked).forEach((t) => {
      initFilters.push({
        type: 'type',
        value: t.value,
        label: t.label
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

    const updatedYears = years.map((y) => {
      return { ...y, isChecked: false };
    });

    setTypes(updatedTypes);
    setYears(updatedYears);
    setTaggedFilters([]);
  }

  useEffect(() => {
    setAllTaggedFilters()
  }, [types, years])

  useEffect(() => {
    if (articles?.data && articlesWithAbstractToggle.length === 0) {
      const displayedArticles = articles.data.filter((article) => article?.title).map((article) => {
        return { ...article, openedAbstract: false };
      });

      setArticlesWithAbstractToggle(displayedArticles)
    }

  }, [articles, articles?.data])

  const toggleAbstract = (articleId?: number): void => {
    if (!articleId) return

    const updatedArticles = articlesWithAbstractToggle.map((article) => {
      if (article?.id === articleId) {
        return {
          ...article,
          openedAbstract: !article.openedAbstract
        }
      }

      return { ...article };
    });

    setArticlesWithAbstractToggle(updatedArticles)
  }

  const toggleAllAbstracts = (): void => {
    const isShown = !showAllAbstracts

    const updatedArticles = articlesWithAbstractToggle.map((article) => ({
      ...article,
      openedAbstract: isShown
    }));

    setArticlesWithAbstractToggle(updatedArticles)
    setShowAllAbstracts(isShown)
  }

  return (
    <main className='articles'>
      <Breadcrumb />
      <div className='articles-title'>
        <h1>{t('pages.articles.title')}</h1>
        <div className='articles-title-count'>
          {articles && articles.totalItems > 1 ? (
            <div className='articles-title-count-text'>{articles.totalItems} {t('common.articles')}</div>
          ) : (
            <div className='articles-title-count-text'>{articles?.totalItems ?? 0} {t('common.article')}</div>
          )}
        </div>
      </div>
      <div className="articles-filters">
        <div className="articles-filters-tags">
          {taggedFilters.map((filter, index) => (
            <Tag key={index} text={filter.label.toString()} onCloseCallback={(): void => onCloseTaggedFilter(filter.type, filter.value)}/>
          ))}
          <div className="articles-filters-tags-clear" onClick={clearTaggedFilters}>{t('common.filters.clearAll')}</div>
        </div>
        <div className="articles-filters-abstracts" onClick={toggleAllAbstracts}>
          {`${showAllAbstracts ? t('common.toggleAbstracts.hideAll') : t('common.toggleAbstracts.showAll')}`}
        </div>
      </div>
      <div className='articles-content'>
        <div className='articles-content-results'>
          <ArticlesSidebar types={types} onCheckTypeCallback={onCheckType} years={years} onCheckYearCallback={onCheckYear} />
          {isFetchingArticles ? (
            <Loader />
          ) : (
            <div className='articles-content-results-cards'>
              {articlesWithAbstractToggle.map((article, index) => (
                <ArticleCard
                  key={index}
                  language={language}
                  article={article as IArticleCard}
                  toggleAbstractCallback={(): void => toggleAbstract(article?.id)}
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