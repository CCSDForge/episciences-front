import { rest } from 'msw'

export const handlers = [
  // Mock API endpoints
  rest.get('*/api/papers', (req, res, ctx) => {
    return res(
      ctx.json({
        'hydra:member': [
          {
            paperid: 123,
            title: 'Test Article',
            doi: '10.1000/test'
          }
        ],
        'hydra:totalItems': 1,
        'hydra:range': {
          publicationYears: [2024]
        }
      })
    )
  }),

  rest.get('*/api/papers/:id', (req, res, ctx) => {
    const { id } = req.params
    return res(
      ctx.json({
        '@id': `article-${id}`,
        document: {
          journal: {
            journal_article: {
              title: `Test Article ${id}`,
              abstract: { value: 'Test abstract' },
              doi: `10.1000/test-${id}`
            }
          },
          database: { current: {} },
          conference: {}
        }
      })
    )
  }),

  rest.get('*/api/browse/authors', (req, res, ctx) => {
    return res(
      ctx.json({
        'hydra:member': [
          {
            '@id': 'author-1',
            values: {
              name: 'John Doe',
              count: 5
            }
          }
        ],
        'hydra:totalItems': 1
      })
    )
  })
]