import { useNavigate } from 'react-router-dom'

export const Home = () => {
  const navigate = useNavigate()
  return (
    <section className="home-page">
      <button onClick={() => navigate('/sign-in')}>Sign in</button>
    </section>
  )
}
