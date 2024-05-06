import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';

import { useLoginMutation } from '../../../store/features/auth/auth.query';
import { ILoginPayload } from '../../../store/features/auth/auth.type';
import Button from "../../components/Button/Button"
import Input from "../../components/Input/Input"

export default function Login(): JSX.Element {
  const navigate = useNavigate();
  
  const [login, { isLoading, error }] = useLoginMutation()

  const { register, formState: { errors }, handleSubmit } = useForm<ILoginPayload>();

  const onSubmit: SubmitHandler<ILoginPayload> = async (loginPayload): Promise<void> => {
		await login(loginPayload).unwrap();

    navigate('/');
	}

  return (
    <>
      <h1>LOGIN</h1>
      {isLoading && <div>LOADING ...</div>}
      {error && <div>{error as string}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <Input
          type='email'
          {...register("email", { required: true })}
          required
        />
        {errors.email?.type === "required" && (
          <div>Email is required</div>
        )}

        <label>Password</label>
        <Input
          type='password'
          {...register("password", { required: true })}
          required
        />
        {errors.password?.type === "required" && (
          <div>Password is required</div>
        )}

        <Button text='LOGIN' type='submit' />
      </form>
    </>
  )
}