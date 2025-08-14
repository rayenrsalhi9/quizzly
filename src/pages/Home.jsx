import iconPath from '../images/icon.png'

export default function Home({ setIsHome }) {
  return (
   <section className="home">
        <h1>Quizzly</h1>
        <p>A game or activity where participants answer questions on various topics to test their knowledge, often played for fun or competition in social or entertainment settings.</p>
        <button onClick={() => setIsHome(prev => !prev)}>Start quiz</button>
        <img src={iconPath} alt="quiz icon" />
   </section>
  )
}