import { TailSpin } from "react-loader-spinner"

import './Loader.scss'

export default function Loader(): JSX.Element {
  return (
    <div className="loader">
      <TailSpin
        color="#7A020D"
        width={60}
      />
    </div>
  )
}