import { useState } from 'react'

import lessStyles from './global.less';
import normalImg from '@/assets/test.jpg'

interface IState {
  name: string;
  age: number;
}

function App() {

  const [authorInfo] = useState<IState>({name: 'ly', age: 26});
  console.log(lessStyles);
  
  return (
    <div className='app'>
      <h3>webpack5 + react18 + typescript4.x </h3>
      <p>author：{authorInfo.name}</p>
      <p>age：{authorInfo.age}</p>
      <img src={normalImg} alt='正常图片'/>
    </div>
  );
}

export default App;
