import { useFetchProfileQuery } from "../../../store/features/user/user.query"

export default function Profile(): JSX.Element {
  const { data, isLoading } = useFetchProfileQuery(null)

  return (
    <>
      <h1>PROFILE</h1>
      {isLoading && <div>LOADING ...</div>}
      {data && (
        <>
          <div>ID : {data.id}</div>
          <div>FIRST NAME : {data.firstName}</div>
          <div>LAST NAME : {data.lastName}</div>
          <div>EMAIL : {data.email}</div>
        </>
      )}
    </>
  )
}