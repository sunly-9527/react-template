### React HOC

- 是一种复用逻辑，接收一个 react 组件作为入参，并返回一个新的 react 组件；用于封装组件，复用逻辑

```js
// 定义一个高阶组件
const withFoo = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      return <WrappedComponent {...this.props} foo='foo' />;
    }
  };
};
```
