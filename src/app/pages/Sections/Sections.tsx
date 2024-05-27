import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

import './Sections.scss';

export default function Sections(): JSX.Element {
  return (
    <main className='sections'>
      <Breadcrumb />
      <h1 className='sections-title'>Sections</h1>
    </main>
  )
}