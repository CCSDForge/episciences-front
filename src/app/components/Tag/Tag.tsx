import logo from '/logo.svg';
import './Tag.scss'

interface ITagProps {
  text: string;
  onCloseCallback: () => void;
}

export default function Tag({ text, onCloseCallback }: ITagProps): JSX.Element {
  return (
    <div className="tag">
      <span className="tag-text">{text}</span>
      <img className="tag-close" src={logo} alt='Close icon' onClick={onCloseCallback} />
    </div>
  )
}