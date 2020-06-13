# React-Redux 使用 Hooks

React `v16.8` 正式提供 `Hooks Api`, 来创建 能够管理本地状态的函数组件 , 并能执行 对应副作用的功能。 `React-Redux` 在 `v7.1.0` 也正式提供支持 Hooks Api 来使用 `Redux` 控制数据流。  
React-Redux 提供了一系列 符合 Hooks 风格的 `use api`，来替代现有 `connect` api。

## 快速搭建 redux 环境

1. 创建 `react app`

   ```bash
   create-react-app redux-app
   ```

2. 安装相关依赖

   ```bash
   yarn add react-redux redux
   ```

   > Tips: 确保 `react-redux` 版本 在 `v7.1.0` 以上

3. 启用 redux

   ```js
   import React from 'react';
   import ReactDOM from 'react-dom';
   import App from './App';
   import store from './app/store';
   import { Provider } from 'react-redux';

   ReactDOM.render(
     <React.StrictMode>
       <Provider store={store}>
         <App />
       </Provider>
     </React.StrictMode>,
     document.getElementById('root'),
   );
   ```

   > Tips: 具体使用文档参考 [redux 教程](https://redux.js.org/introduction/getting-started)

## 在 React Redux 应用程序中使用 Hooks Api

### useSelector()

- 功能 :  
   允许传入一个选择器函数从 redux state 中取需要的状态数据并返回。示例：

  ```typescript
  const data: any = useSelector(selector: Selector, eqaulityFn?: Function)
  ```

  该 api 功能类似传统 `connect api` 传入的 `mapStateToProps`， 但是表现形式还是有些许差别

  - 选择器 `Selector` 函数可以返回任意类型的数据，而不仅限于 对象
  - 当 `dispathc` 一个 `action` 的时候，`useSelector()` 函数将对 `Selector` 选择器函数的返回值和上一个状态的返回值进行比较，如果 不同就会强制渲染组件，相同则不会
  - `Selector`选择器 没有 接收 `ownProps` 属性
  - `useSelector` 默认比较更新 方式 为 `===`, 如果需要浅层比较可以传入 第二个参数 `equalityFn`

  > Tips: 不要在 `Selector` 选择器函数中 使用 `props` 属性, 否则可能会导致错误， 原因如下
  >
  > 1. 选择器函数依赖 `props` 的 某个数据
  > 2. `dispatch action`会导致父组件重新渲染，并传递新的 `props`
  > 3. 子组件渲染时，选择器函数的执行时机会在 新 props 传入之前先执行，此时就会可能导致选择器函数返回错误数据，甚至报错
  >    `Zombile Child` 是另一种 旧 `props` 导致异常的情况, 具体可以查看 [常用警告](https://react-redux.js.org/api/hooks#usage-warnings)

- 选择器相等比较与更新  
   当函数组件呈现时，将调用提供的选择器函数，其结果将从 useSelector（）钩子返回。（如果缓存的结果与组件的上一次呈现中的函数引用相同，此时相当于检测到 返回的是同一个对象，则钩子可以不重新运行选择器而返回该结果。）  
   `useSelector()`仅当选择器结果与上一个结果不同时才强制重新渲染。默认比较方式是 `===`, `connect` 则是浅层比较，如果 useSelector() 返回一个新的对象 将导致每次都会重新渲染。  
   因此当你希望从 `redux store` 中取多个数据时，和以前不同，需要额外的一些操作方法

  - 可以执行多次 `useSelector()`
  - 使用类似 `Reselect` 的库 创建一个 记忆选择器 `Memoized Selector`, 该选择器可以在一个对象中 返回多个值，但是只当某个值发生变化时才会返回新对象
  - 使用 `react-redux` 的`shallowEqual` 作为 `useSelector` 的 `eaqulityFn` 参数，例如
    ```js
    import { shallowEqual, useSelector } from 'react-redux';
    const selectedData = useSelector(selectorReturningObject, shallowEqual);
    ```
    当然也可以自定义 equalityFn，类似 Lodash `_.isEqual()`

- 使用 `Memoized Selector` 记忆选择器
  示例：

  ```js
  import React from 'react';
  import { useSelector } from 'react-redux';
  import { createSelector } from 'reselect';

  const selectNumOfDoneTodos = createSelector(
    state => state.todos,
    todos => todos.filter(todo => todo.isDone).length,
  );

  export const DoneTodosCounter = () => {
    const NumOfDoneTodos = useSelector(selectNumOfDoneTodos);
    return <div>{NumOfDoneTodos}</div>;
  };

  export const App = () => {
    return (
      <>
        <span>Number of done todos:</span>
        <DoneTodosCounter />
      </>
    );
  };
  ```

  > Tips: 当选择器在多个组件实例中使用并且取决于组件的道具时，您需要确保每个组件实例都有其自己的选择器实例

  > 原因：使用创建的选择器 createSelector 的缓存大小为 1，并且仅在其参数集与之前的参数集相同时才返回缓存的值，如果共享同一个选择器，不同的组件实例 传入的参数也不同 会导致缓存失效，选择器将始终重新计算而不是返回缓存的值。 [查看更多细节原因](https://github.com/reduxjs/reselect#accessing-react-props-in-selectors)

  这里使用 `useMemo` 为每个组件示例创建私有的选择器，就不会互相产生影响了

  示例:

  ```js
  import React, { useMemo } from 'react';
  import { useSelector } from 'react-redux';
  import { createSelector } from 'reselect';

  const makeNumOfTodosWithIsDoneSelector = () =>
    createSelector(
      state => state.todos,
      (_, isDone) => isDone,
      (todos, isDone) => todos.filter(todo => todo.isDone === isDone).length,
    );

  export const TodoCounterForIsDoneValue = ({ isDone }) => {
    const selectNumOfTodosWithIsDone = useMemo(
      makeNumOfTodosWithIsDoneSelector,
      [],
    );

    const numOfTodosWithIsDoneValue = useSelector(state =>
      selectNumOfTodosWithIsDone(state, isDone),
    );

    return <div>{numOfTodosWithIsDoneValue}</div>;
  };

  export const App = () => {
    return (
      <>
        <span>Number of done todos:</span>
        <TodoCounterForIsDoneValue isDone={true} />
        <span>Number of unfinished todos:</span>
        <TodoCounterForIsDoneValue isDone={false} />
      </>
    );
  };
  ```

### useActions() 已经删除

### useDispatch()

该 Api 可以返回一个 `dispatch` 函数， 可以直接使用 `dispatch` 操作 `actions`

> Tips: 将回调`dispatch`函数传递给子组件时，建议使用 `useCallback` 传递 否则由于更改了引用，子组件可能会有不必要地呈现。
> 示例：

```js
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export const CounterComponent = ({ value }) => {
  const dispatch = useDispatch();
  const incrementCounter = useCallback(
    () => dispatch({ type: 'increment-counter' }),
    [dispatch],
  );

  return (
    <div>
      <span>{value}</span>
      <MyIncrementButton onIncrement={incrementCounter} />
    </div>
  );
};

export const MyIncrementButton = React.memo(({ onIncrement }) => (
  <button onClick={onIncrement}>Increment counter</button>
));
```

### useStore()

该 api 返回一个传递给 `Provider` 组件相同的 `redux store`

> Tips： 大多数情况用不到这个 api， 取数据使用 `useSelector()` 代替

示例：

```js
import React from 'react';
import { useStore } from 'react-redux';

export const CounterComponent = ({ value }) => {
  const store = useStore();

  // EXAMPLE ONLY! Do not do this in a real app.
  // The component will not automatically update if the store state changes
  return <div>{store.getState()}</div>;
};
```

### createContext() 自定义上下文

`Provider` 组件允许 使用 `context` 指定 备用上下文属性， 如果在构建复杂的可重用组件时，不希望这些组件状态和常规业务代码的 `redux store` 完全不冲突，那么这个 api 会非常有用

示例：

```js
import React from 'react';
import { rootReducers } from './reducers';
import {
  Provider,
  createStoreHook,
  createDispatchHook,
  createSelectorHook,
} from 'react-redux';

const store = createStore(rootReducers); // 常规业务 store

const PrivateContext = React.createContext(null); // 私有上下文
const usePrivateStore = createStoreHook(PrivateContext);
const usePrivateDispatch = createDispatchHook(PrivateContext);
const usePrivateSelector = createDispatchHook(PrivateContext);

const App = ({ children }) => {
  return (
    <Provider context={PrivateContext} store={store}>
      {children}
    </Provider>
  );
};

export { usePrivateStore, usePrivateDispatch, usePrivateSelector };

export default App;
```

### 使用警告

主要就是 `Old Props` 和 `Zombie Child` 问题 具体可以参考 [这里](https://react-redux.js.org/api/hooks#usage-warnings)

### 性能

默认情况下, `useSelector()` 根据选择器函数返回比较相等性, 并仅到比较的结果不同时，才会重新渲染组件，而且同 `connect` 不同， `useSelector()` 不会由于父级重新渲染而阻止组件的重新渲染，甚至组件的 props 没有发生更改也不会影响。（其他地方导致 state 发生变化，依旧可以渲染）

如果需要更进一步的优化可以使用 `React.memo` 包装函数组件

示例：

```js
const CounterComponent = ({ name }) => {
  const counter = useSelector(state => state.counter);
  return (
    <div>
      {name}: {counter}
    </div>
  );
};

export const MemoizedCounterComponent = React.memo(CounterComponent);
```

### bindActionsCreator() 自定义创建 useActions

`useActions()` api 已经在 `v7.1.0-alpha.4` 根据[Dan Abramov 的建议](https://github.com/reduxjs/react-redux/issues/1252#issuecomment-488160930)已删除 , 该建议基于“绑定动作创建者”在基于钩子的用例中不那么有用，并且会导致过多的概念开销和语法复杂性

但是 可以 根据 `bindActionsCreator()` 方法实现一个自己的 `useActions`  
示例：

```js
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';

export function useActions(actions, deps) {
  const dispatch = useDispatch();
  return useMemo(
    () => {
      if (Array.isArray(actions)) {
        return actions.map(a => bindActionCreators(a, dispatch));
      }
      return bindActionCreators(actions, dispatch);
    },
    deps ? [dispatch, ...deps] : [dispatch],
  );
}
```

### shallowEqual 自定义创建 浅层比较选择器

示例：

```js
import { useSelector, shallowEqual } from 'react-redux';

export function useShallowEqualSelector(selector) {
  return useSelector(selector, shallowEqual);
}
```

### 注意事项

在决定是否使用挂钩时，需要考虑一些架构上的折衷。马克·埃里克森（Mark Erikson）在他的两篇博客文章[《关于 React Hooks，Redux 以及关注点与钩子分离，HOC 和权衡的思考》](https://blog.isquaredsoftware.com/2019/09/presentation-hooks-hocs-tradeoffs/)中很好地总结了这些内容。
