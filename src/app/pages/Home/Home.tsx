import { useNavigate } from 'react-router-dom';

import Button from "../../components/Button/Button";

export default function Home(): JSX.Element {
  const navigate = useNavigate();

  return (
    <>
      <h1>HOME</h1>
      <Button text='PROFILE' onClickCallback={(): void => navigate('/profile')}/>
    </>
  )
}