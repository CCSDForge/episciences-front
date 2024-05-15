import './Button.scss'

interface IButtonProps {
  text: string;
  onClickCallback: () => void;
}

export default function Button({ text, onClickCallback }: IButtonProps): JSX.Element {
  return (
    <button className='button' onClick={onClickCallback}>{text}</button>
  )
}