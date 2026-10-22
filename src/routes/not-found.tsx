import { Link } from 'react-router'
import { PageHeader } from '../components/PageHeader'

export default function NotFoundPage() {
  return (
    <>
      <title>Page not found · Wrenmoor Orders</title>
      <PageHeader title="Page not found" />
      <p>
        That page doesn’t exist. <Link to="/">Go to the dashboard</Link>
      </p>
    </>
  )
}
