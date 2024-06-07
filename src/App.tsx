import '@/App.css';
import useReactive from './hooks/useReactive';
import { useState } from 'react';
import { Button, Tooltip } from 'antd';
import lessStyles from './global.less';
interface IState {
  name: string;
  age: number;
}

function App() {
  const state: IState = useReactive({
    name: 'east_white',
    age: 20,
  });

  const [data] = useState([
    { id: 1, title: '111' },
    { id: 2, title: '222' },
  ]);

  return (
    <div className={lessStyles['lessBox']}>
      <h2>Hello East_White!</h2>
      <p>{state.name}</p>
      <p>{state.age}</p>
      <button onClick={() => state.age++}>add age</button>
      <button onClick={() => (state.name = 'east_white_2')}>change name</button>

      {data.map((item) => {
        return <ListItem id={item.id}>{item.title}</ListItem>;
      })}
    </div>
  );
}

function ListItem({ children, id }: any) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      key={id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isHovered && (
        <Tooltip title='提示信息' trigger='click'>
          <Button style={{ marginLeft: 10 }}>点击</Button>
        </Tooltip>
      )}
    </div>
  );
}

export default App;
