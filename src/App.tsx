import { useState } from 'react';
import useRequest from '@/hooks/useRequest';
import normalImg from '@/assets/test.jpg';

interface IState {
  name: string;
  age: number;
}

function changeUsername(
  username: string
): Promise<{ success: boolean; username: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, username });
    }, 1000);
  });
}

function App() {
  const [authorInfo, setAuthorInfo] = useState<IState>({ name: '', age: 26 });

  const {
    loading,
    run,
    data: result,
  } = useRequest(changeUsername, {
    manual: true,
    onSuccess: (result) => {
      if (result.success) {
        setAuthorInfo({ ...authorInfo, name: result.username });
      }
    },
  });

  return (
    <div className='app'>
      <h3>webpack5 + react18 + typescript4.x </h3>
      <p>author：{authorInfo.name}</p>
      <p>age：{authorInfo.age}</p>
      <img src={normalImg} style={{ width: 240 }} alt='正常图片' />

      <div>
        <input
          onChange={(e) =>
            setAuthorInfo({ ...authorInfo, name: e.target.value })
          }
          value={authorInfo.name}
          placeholder='Please enter username'
          style={{ width: 240, marginRight: 16 }}
        />
        <button
          disabled={loading}
          type='button'
          onClick={() => run(authorInfo.name)}
        >
          {loading ? 'Loading' : 'Edit'}
        </button>
        {JSON.stringify(result)}
      </div>
    </div>
  );
}

export default App;
