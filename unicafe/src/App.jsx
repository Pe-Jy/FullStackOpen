import { useState } from 'react'

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if (props.total === 0) {
    return (
      <div>No feedback given</div>
    )
  }
  return (
    <table>
      <tbody>
        <StatisticLine text="GOOD:" value={props.good} />
        <StatisticLine text="NEUTRAL:" value={props.neutral} />
        <StatisticLine text="BAD:" value={props.bad} />
        <StatisticLine text="ALL:" value={props.total} />
        <StatisticLine text="AVERAGE:" value={props.mean} />
        <StatisticLine text="POSITIVE:" value={props.positive + ' %'} />
      </tbody>
    </table>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)

  const handleGoodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    setTotal(updatedGood + neutral + bad)
  }

  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    setTotal(good + updatedNeutral + bad)
  }

  const handleBadClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
    setTotal(good + neutral + updatedBad)
  }

  const mean = (good - bad) / total
  const positive = good / total * 100

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={handleGoodClick} text='GOOD' />
      <Button handleClick={handleNeutralClick} text='NEUTRAL' />
      <Button handleClick={handleBadClick} text='BAD' />
      <h1>Stats:</h1>
      <Statistics good={good} neutral={neutral} bad={bad} total={total} mean={mean} positive={positive} />
    </div>
  )
}

export default App
