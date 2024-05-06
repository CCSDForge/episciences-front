interface IButtonProps {
  text: string;
  type?: 'submit' | 'reset' | 'button';
  onClickCallback?: () => void
}

export default function Button({ text, type, onClickCallback }: IButtonProps): JSX.Element {
  return (
    <button type={type} onClick={onClickCallback}>{text}</button>
  )
}