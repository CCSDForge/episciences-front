import { forwardRef } from 'react'

interface IInputProps {
  type?: string;
  required?: boolean
}

const Input = forwardRef<HTMLInputElement, IInputProps>(({ type, required, ...field }, ref): JSX.Element => {
  return (
    <input
      ref={ref}
      type={type}
      required={required}
      {...field}
    />
  )
})

export default Input