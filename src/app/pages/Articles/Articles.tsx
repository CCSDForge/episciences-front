import { useState } from "react";

import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import ArticleCard, { IArticleCard } from "../../components/Cards/ArticleCard/ArticleCard";
import ArticlesSidebar from "../../components/Sidebars/ArticlesSidebar/ArticlesSidebar";
import Pagination from "../../components/Pagination/Pagination";
import Tag from "../../components/Tag/Tag";
import './Articles.scss';

export default function Articles(): JSX.Element {
  // TODO: remove mocks
  // TODO: type hint filters in src/types ?
  const [filters, setFilters] = useState([
    {
      id: 1,
      title: 'Types of document',
      choices: [
        { id: 1, label: 'Articles', isChecked: false },
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

  const [articles, setArticles] = useState<IArticleCard[]>([
    { 
      id: 1,
      title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000",
      authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.',
      openedAbstract: false,
      abstract: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren.",
      publicationDate: 'Published on Aug. 18th, 2023',
      tag: 'Compte-rendu'
    },
    { 
      id: 2,
      title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000",
      authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.',
      openedAbstract: false,
      abstract: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren.",
      publicationDate: 'Published on Aug. 18th, 2023',
      tag: 'Compte-rendu'
    },
    { 
      id: 3,
      title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000",
      authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.',
      openedAbstract: false,
      abstract: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren.",
      publicationDate: 'Published on Aug. 18th, 2023',
      tag: 'Compte-rendu'
    },
    { 
      id: 4,
      title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000",
      authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.',
      openedAbstract: false,
      abstract: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren.",
      publicationDate: 'Published on Aug. 18th, 2023',
      tag: 'Compte-rendu'
    },
    { 
      id: 5,
      title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000",
      authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.',
      openedAbstract: false,
      abstract: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren.",
      publicationDate: 'Published on Aug. 18th, 2023',
      tag: 'Compte-rendu'
    },
    { 
      id: 6,
      title: "D’un rêve d'universalité fonctionnelle au libéralisme linguistique : standardisation de la langue tchèque moderne et controverse des années 1990 et 2000",
      authors: 'Adrien Martin ; Andrea Opreni ; Alessandra Vizzaccaro et al.',
      openedAbstract: false,
      abstract: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren.",
      publicationDate: 'Published on Aug. 18th, 2023',
      tag: 'Compte-rendu'
    },
  ]);

  // const fetchPaginatedArticles = async (currentPage: number): Promise<PaginatedResults> => {
  //   // TODO : fetch call
    
  //   return {
  //     data: articles,
  //     totalPages: 20
  //   }
  // }

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

  const toggleAbstract = (articleId: number): void => {
    const updatedArticles = articles.map((article) => {
      if (article.id === articleId) {
        return { ...article, openedAbstract: !article.openedAbstract };
      }

      return article;
    });

    setArticles(updatedArticles);
  }

  const openAllAbstracts = (): void => {
    const updatedArticles = articles.map((article) => {
      return { ...article, openedAbstract: true };
    });

    setArticles(updatedArticles);
  }

  return (
    <main className='articles'>
      <Breadcrumb />
      <div className='articles-title'>
        <h1>Articles</h1>
        <div className='articles-title-count'>1550 articles</div>
      </div>
      <div className="articles-filters">
        <div className="articles-filters-tags">
          {getActiveFiltersChoices().map((choice, index) => (
            <Tag key={index} text={choice.label} onCloseCallback={(): void => onCheckFilterChoice(choice.filterId, choice.id)}/>
          ))}
          <div className="articles-filters-tags-clear" onClick={clearActiveFiltersChoices}>Clear all filters</div>
        </div>
        <div className="articles-filters-abstracts" onClick={openAllAbstracts}>Show all abstracts</div>
      </div>
      <div className='articles-content'>
        <div className='articles-content-results'>
          <ArticlesSidebar filters={filters} onCheckFilterChoiceCallback={onCheckFilterChoice} />
          <div className='articles-content-results-cards'>
            {/* {paginatedItems.map((article, index) => (
              <ArticleCard key={index} {...article as IArticleCard} toggleAbstractCallback={(): void => toggleAbstract(article.id)} />
            ))} */}
          </div>
        </div>
        {/* <Pagination pageCount={pageCount} onPageChange={handlePageClick} /> */}
      </div>
    </main>
  )
}