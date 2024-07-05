import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement } from '@/stores/modules/counterSlice'

const About = () => {
  const counter = useSelector((state: any) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div className='about-container'>
      <h3>About</h3>
      <p>counter:{counter}</p>
      <button onClick={() => dispatch(increment())}>increment</button>
      <button onClick={() => dispatch(decrement())}>decrement</button>
    </div>
  )
}

export default About
