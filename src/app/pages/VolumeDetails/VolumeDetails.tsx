import { useParams } from "react-router-dom";

import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

import './VolumeDetails.scss';

export default function VolumeDetails(): JSX.Element {
  const params = useParams();
  const { id } = params

  return (
    <main className='volumeDetails'>
      <Breadcrumb />
      <h1 className='volumeDetails-title'>Volume {id}</h1>
    </main>
  )
}