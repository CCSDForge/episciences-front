import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import './About.scss';

export default function About(): JSX.Element {
  return (
    <main className='about'>
      <Breadcrumb />
      <h1 className='articles-title'>The journal</h1>
    </main>
  )
}