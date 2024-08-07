import { StrictMode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { HelmetProvider } from 'react-helmet-async'
import { MathJaxContext } from 'better-react-mathjax'

import Loader from './app/components/Loader/Loader'
import store, { persistedStore } from './store'
import router from './config/router'
import { mathJaxConfig, mathJaxSrc } from './config/mathjax'
import './config/i18n'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<Loader />}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistedStore}>
          <HelmetProvider>
            <MathJaxContext config={mathJaxConfig} src={mathJaxSrc} version={2}>
              <RouterProvider router={router}/>
            </MathJaxContext>
          </HelmetProvider>
        </PersistGate>
      </Provider>
    </Suspense>
  </StrictMode>,
)
