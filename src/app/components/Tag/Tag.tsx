import close from '/icons/close-black.svg';
import './Tag.scss';

interface ITagProps {
  text: string;
  onCloseCallback: () => void;
}

export default function Tag({ text, onCloseCallback }: ITagProps): JSX.Element {
  return (
    <div className="tag">
      <span className="tag-text">{text}</span>
      <img
        className="tag-close"
        src={close}
        alt="Close icon"
        onClick={onCloseCallback}
      />
    </div>
  );
}
