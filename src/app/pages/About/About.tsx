import ReactMarkdown from 'react-markdown'

import { useAppSelector } from "../../../hooks/store";
import { useFetchAboutPageQuery } from "../../../store/features/about/about.query";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import './About.scss';

export default function About(): JSX.Element {
  const language = useAppSelector(state => state.i18nReducer.language)

  const { data: aboutPage } = useFetchAboutPageQuery(null)

  if (!aboutPage) {
    return (
      <main className='about'>
        <Breadcrumb />
        <h1 className='about-title'>The journal</h1>
      </main>
    )
  }

  const content = aboutPage.content[language as keyof typeof aboutPage.content]

  return (
    <main className='about'>
      <Breadcrumb />
      <h1 className='about-title'>The journal</h1>
      <div className='about-content'>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </main>
  )
}