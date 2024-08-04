const Header = ({ course }) => {
  return (
    <h2>{course}</h2>
  )
}

const Total = ({ total }) => {
  const sum = total.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <p>
      <b>total of {sum} exercises</b>
    </p>
  )
}

const Part = ({ part, exercises }) => {
  return (
    <p>
      {part} {exercises}
    </p>
  )
}

const Content = ({ content }) => {
  return (
    <div>
      {content.map(part =>
        <Part key={part.id} part={part.name} exercises={part.exercises} />
      )}
    </div>
  )
}

const Course = ({ courses }) => {
  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map(course => (
        <div key={course.id}>
          <Header course={course.name} />
          <Content content={course.parts} />
          <Total total={course.parts} />
        </div>
      ))}
    </div>
  )
}

export default Course