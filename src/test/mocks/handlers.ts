import { http, HttpResponse } from 'msw'

export const handlers = [
    http.get('*/api/papers', () => {
        return HttpResponse.json({
            'hydra:member': [
                {
                    paperid: 123,
                    title: 'Test Article',
                    doi: '10.1000/test',
                },
            ],
            'hydra:totalItems': 1,
            'hydra:range': {
                publicationYears: [2024],
            },
        })
    }),

    http.get('*/api/papers/:id', ({ params }) => {
        const { id } = params
        return HttpResponse.json({
            '@id': `article-${id}`,
            document: {
                journal: {
                    journal_article: {
                        title: `Test Article ${id}`,
                        abstract: { value: 'Test abstract' },
                        doi: `10.1000/test-${id}`,
                    },
                },
                database: { current: {} },
                conference: {},
            },
        })
    }),

    http.get('*/api/browse/authors', () => {
        return HttpResponse.json({
            'hydra:member': [
                {
                    '@id': 'author-1',
                    values: {
                        name: 'John Doe',
                        count: 5,
                    },
                },
            ],
            'hydra:totalItems': 1,
        })
    }),
]
