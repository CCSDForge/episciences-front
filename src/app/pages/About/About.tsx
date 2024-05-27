import ReactMarkdown from 'react-markdown'

import { useAppSelector } from "../../../hooks/store";
import { useFetchAboutPageQuery } from "../../../store/features/about/about.query";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Loader from '../../components/Loader/Loader';
import './About.scss';

export default function About(): JSX.Element {
  const language = useAppSelector(state => state.i18nReducer.language)
  const rvcode = useAppSelector(state => state.journalReducer.currentJournal?.code)

  const { data: aboutPage, isFetching } = useFetchAboutPageQuery(rvcode!, { skip: !rvcode })

  const getContent = (): string | undefined => {
    const rawContent = aboutPage?.content[language];

    return rawContent;
  }

  return (
    <main className='about'>
      <Breadcrumb />
      <h1 className='about-title'>The journal</h1>
      {isFetching ? (
        <Loader />
      ) : (
        <div className='about-content'>
          <ReactMarkdown>{getContent()}</ReactMarkdown>
        </div>
      )}
    </main>
  )
}