# React-Hooks 编写 React 组件

## 简介

Hook 是 React `v16.8.0` 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性.

## API 介绍

### useState()

`useState()` 是 React 提供的一个 `State Hook`，它提供了函数组件提供添加内部状态`state`的能力.

**示例**：

```jsx
import React, { useState } from 'react';
const StateComponent = () => {
  const [count, setCount] = useState(1);
  return (
    <div>
      <button onClick={() => setCount(count - 1)}>-</button>
      <span style={{ margin: '0 10px' }}>{count}</span>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
};
export default StateComponent;
```

**特性**：

- `useState()` 返回一个数组，数组的 第一个值表示创建的状态, 如示例中的 `count`，第二个值是一个函数, 如示例中的`setCount`， 用来更新第一个状态值，并触发组件更新，类似 class 组件的 `setState()`, 不同的是 它不会把 `old state` 合并到 `new state` 中, 总是替换原始状态，而不是合并状态.

  > Tips: 为什么返回数组，为了名字可以自己定义，变量名 一般规范为 `const [state, setState] = useState()`

- `useState()` 可以接收一个参数，用来初始化 创建的状态值，如示例中 传入的 数字 1， 此时 `count` 的初始值为 1, 在后续的重新渲染中，`useState` 返回的第一个值将始终是更新后最新的 state。

  > Tips: React 会确保 `setState` 函数的标识是稳定的，并且不会在组件重新渲染时发生变化。这就是为什么可以安全地从 `useEffect` 或 `useCallback` 的依赖列表中省略 `setState`。

**函数式更新**：

如果新的 `state` 需要通过使用先前的 `state` 计算得出，那么可以将函数传递给 `setState`。该函数将接收先前的 state，并返回一个更新后的值.

`setState()` 更新状态函数除了可以传入普通的`state` 变量， 还可以传入一个函数，该函数接受一个尚未更新的 `state`， 函数的返回值将会作为 此次更新后的值.

> Tips: 经实践 `setState()` 每次都会创建一个函数，并执行返回结果，感觉并不实用

**惰性初始化 state**：  
`useState()` 初始化的 `initialState` 也可以接受一个函数，返回值作为 初始化的 state, 且该函数只会执行一次

示例：

```jsx
import React, { useState } from 'react';

const StateComponent = () => {
  const [count, setCount] = useState(() => {
    // 只执行一次
    return Math.floor(Math.random() * 10);
  });
  return (
    <div>
      <button onClick={() => setCount(state => state - 1)}>-</button>
      <span style={{ margin: '0 10px' }}>{count}</span>
      <button onClick={() => setCount(state => state + 1)}>+</button>
    </div>
  );
};
export default StateComponent;
```

**多个 `useState()` 的情况下，使用规范** ：

当我们使用多个 `useState` 的时候，那 react 是如何识别那个是哪个呢，其实很简单，它是靠第一次执行的顺序来记录的，就相当于每个组件存放 `useState` 的地方是一个数组，每使用一个新的 `useState`，就向数组中 `push` 一个 `useState`.

当我们在运行时改变 useState 的顺序，数据会混乱，增加 useState, 程序会报错，

> Tips: 不要在循环，条件或嵌套函数中调用 `Hook`， 确保总是在你的 React 函数的最顶层调用他们。遵守这条规则，你就能确保 `Hook` 在每一次渲染中都按照同样的顺序被调用。这让 React 能够在多次的 `useState` 和 `useEffect` 调用之间保持 `hook` 状态的正确, 同时推荐使用 `eslint-plugin-react-hooks` 插件来规范代码编写，针对这种情况进行校验

**state 更新检查**

当`setState()` 传入的是 符合 [Object.is()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) 比较规范的值时， 如果和 之前 `state` 相等，React 将跳过子组件的渲染及 effect 的执行

### useEffect()

`useEffect` 是 React 提供的 一个 `Effect Hook`，它给函数组件增加了操作副作用的能力，类似于 class 组件中的 `componentDidMount`,`componentDidUpdate`, `componentWillUnmount`, 具有相同的用途，只不过这里被合并成了一个 API.

**示例：**

```jsx
import React, { useState, useEffect } from 'react';
const EffectComponent = () => {
  const [title, setTitle] = useState('JohnApache 的前端日志');
  useEffect(() => {
    document.title = title;
  }, [title]);
  return (
    <button onClick={() => setTitle(`${Math.random()}`)}>
      点击切换页面title
    </button>
  );
};

export default EffectComponent;
```

**effect 的执行时机**  
`useEffect()` 第一个参数为副作用函数, 会在组件`第一次加载和每次更新重新渲染后`时执行副作用函数， 与 `componentDidMount` 和 `componentDidUpdate` 不同的是，在浏览器完成布局与绘制之后，传给 `useEffect` 的函数会`延迟调用`。这使得它适用于许多常见的副作用场景，比如设置订阅和事件处理等情况，因此不应在函数中执行阻塞浏览器更新屏幕的操作。

如果有需要同步执行的副作用函数，例如测量布局, 在浏览器执行下一次绘制前，用户可见的 DOM 变更就必须同步执行，这样用户才不会感觉到视觉上的不一致， 此时可以使用 `useLayoutEffect()` 代替。

虽然 `useEffect` 会在浏览器绘制后延迟执行，但会保证在任何新的渲染前执行。React 将在组件更新前刷新上一轮渲染的 `effect`.

**effect 的条件执行**
`useEffect()` 第二个参数为可选参数，参数类型为需要监听变化的值数组， 当忽略该参数时，`effect` 会在每轮组件渲染完成后执行

只有当值数组中的 值发生变化后， `effect`才会被重新创建并执行副作用函数。

当传入的值数组为 `[]`, 此时 `effect` 只会在第一次组件加载时执行副作用函数，效果类似于 `componentDidMount`

**清除 effect**
`useEffect()` 创建的副作用函数，可能会绑定一些事件，或计时器 Id 等操作，如果在组件卸载时，或者页面状态更新 导致 `effect` 重新创建时，如果不卸载这些订阅，可能会导致页面报错，或者重复绑定等情况.

要实现这一点， `effect` 副作用函数返回值 ，可以返回一个清除函数， 该清除函数，会在 `effect` 重新创建前，或者在组件卸载前时执行清除函数

### useContext()

```js
const value = useContext(MyContext);
```

接收一个 `context` 对象（`React.createContext` 的返回值）并返回该 `context` 的当前值。当前的 `context` 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 `value` prop 决定。

当组件上层最近的 `<MyContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用最新 `context` 传递给 `<MyContext.Provider>` 的 `value` prop 值。即使祖先使用 `React.memo` 或 `shouldComponentUpdate`，也会在当前组件本身使用 `useContext` 时重新渲染。

**示例**

```jsx
import React, { useContext, useState } from 'react';
const themes = {
  light: {
    color: '#000',
    height: '100px',
    backgroundColor: '#ddd',
  },
  dark: {
    color: '#fff',
    height: '100px',
    backgroundColor: '#000',
  },
};

const ThemesContext = React.createContext(themes.light);

const App = () => {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  return (
    <div>
      <ThemesContext.Provider value={themes[theme]}>
        <ThemeButton />
      </ThemesContext.Provider>
      <br />
      <br />
      <button onClick={toggleTheme}>切换主题</button>
    </div>
  );
};

const ThemeButton = () => {
  const theme = useContext(ThemesContext);
  return <div style={theme}>主题按钮</div>;
};

export default App;
```

### useReducer()

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

`useReducer()` 是 `useState()`的一种替代方案，它接收一个形如 `(state, action) => newState` 的 `reducer`，并返回当前的 `state` 以及与其配套的 `dispatch` 方法， 同 `redux` 相同的管理模式

**参数介绍：**

- `reducers`： 必传参数，接收一个行如 `(state, action) => newState` 的 `reducer` 函数
- `initialArg`: 可选参数， 初始化`reducer`返回的`state`，当第三个参数没有选择时， `state = initialArg`
  > Tips: `React` 不直接使用 `state = initialState` 这一由 `Redux` 推广开来的参数约定。有时候初始值依赖于 `props`，因此需要在调用 `Hook` 时指定。如果你特别喜欢上述的参数约定，可以通过调用 `useReducer(reducer, undefined, reducer)` 来模拟 Redux 的行为，但我们不鼓励你这么做。
- `init`: 可选参数, 当该参数存在时，会使用 `initialArg` 作为初始化参数 执行当前 `init` 函数，并将 `init` 函数的返回值，作为初始化 `state` 的值
  > Tips: 这么做可以将用于计算 state 的逻辑提取到 reducer 外部，这也为将来对重置 state 的 action 做处理提供了便利

**示例**

```jsx
import React, { useReducer } from 'react';
const CounterReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        count: state.count + action.payload,
      };
    case 'REDUCE':
      return {
        ...state,
        count: state.count - action.payload,
      };
    default:
      return state;
  }
};

const InitReducer = count => {
  return { count };
};

const ReducerComponent = () => {
  const [state, dispatch] = useReducer(CounterReducer, 0, InitReducer);
  const handleClick = (type, count) => () => dispatch({ type, payload: count });
  return (
    <div>
      <button onClick={handleClick('REDUCE', 4)}>-4</button>
      <button onClick={handleClick('REDUCE', 2)}>-2</button>
      <span style={{ margin: '0 20px' }}>{state.count}</span>
      <button onClick={handleClick('ADD', 2)}>+2</button>
      <button onClick={handleClick('ADD', 4)}>+4</button>
    </div>
  );
};

export default ReducerComponent;
```

### useMemo()

返回一个 [memoized ](https://en.wikipedia.org/wiki/Memoization) 值。

该 Hooks 函数，把“创建”函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 `memoized` 值。这种优化有助于避免在每次渲染时都进行高开销的计算。  
记住，传入 `useMemo` 的函数会在渲染期间执行。请不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于 useEffect 的适用范畴，而不是 `useMemo`.  
如果没有提供依赖项数组，`useMemo` 在每次渲染时都会计算新的值

> Tips: 依赖项数组不会作为参数传给“创建”函数。虽然从概念上来说它表现为：所有“创建”函数中引用的值都应该出现在依赖项数组中。未来编译器会更加智能，届时自动创建数组将成为可能。

**示例：**

```jsx
import React, { useMemo, useState } from 'react';

let count = 0;
const MemoComponent = () => {
  const [v1, setV1] = useState(0);
  const [v2, setV2] = useState(0);

  const momorizedV1 = useMemo(() => {
    console.log(`执行了 ${++count} 次`);
    // 当v1不发生变化是不会执行函数, 直接返回缓存结果
    return Math.floor(v1 * 10);
  }, [v1]);

  return (
    <div>
      <span>{`memorizedV1: ${momorizedV1}`}</span> <br />
      <br />
      <span>{`v1: ${v1}`}</span> <br />
      <br />
      <span>{`v2: ${v2}`}</span> <br />
      <br />
      <button onClick={() => setV1(Math.random())}>更新v1</button>
      <button onClick={() => setV2(Math.random())}>更新v2</button>
    </div>
  );
};
export default MemoComponent;
```

### useCallback()

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

返回一个 [memoized ](https://en.wikipedia.org/wiki/Memoization) 回调函数。

该 Hooks 函数本质上就是 `useMemo()`的一个特例实现. `useCallback(fn, deps) === useMemo(() => fn, deps)`;

把内联回调函数及依赖项数组作为参数传入 `useCallback`，它将返回该回调函数的 `memoized` 版本，该回调函数仅在某个依赖项改变时才会更新。当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 `shouldComponentUpdate`）的子组件时，它将非常有用。

**示例：**

```jsx
import React, { useCallback, useState } from 'react';

const UseCallbackComponent = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    alert(count);
    console.log(count);
  }, [count]);

  return (
    <div>
      <span>{`count: ${count}`}</span> <br />
      <br />
      <button onClick={handleClick}>alert count</button> <br />
      <br />
      <button onClick={() => setCount(Math.random())}>更新count</button>
    </div>
  );
};
export default UseCallbackComponent;
```

### useRef()

```js
const refContainer = useRef(initialValue);
```

`useRef` 返回一个可变的 `ref` 对象，其 `.current` 属性被初始化为传入的参数（`initialValue`）。返回的 `ref` 对象在组件的整个生命周期内保持不变。

本质上，`useRef` 就像是可以在其 `.current` 属性中保存一个可变值的“盒子”。

> Tips: 请记住，当 `ref` 对象内容发生变化时，`useRef` 并不会通知你。变更 `.current` 属性不会引发组件重新渲染。如果想要在 React 绑定或解绑 DOM 节点的 `ref` 时运行某些代码，则需要使用[回调 ref](https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node)来实现。

**示例：**

```jsx
import React, { useCallback, useState, useRef } from 'react';

const UseRefComponent = () => {
  const [value, setValue] = useState(0);
  const input = useRef(null);

  const handleClick = useCallback(() => {
    // 没有任何依赖值，该函数只创建一次，
    alert(value); // 没有把 value 作为依赖值，只会打印初始化的旧值
    input.current && alert(input.current.value); // 打印最新值
  }, []);

  const handleChange = useCallback(e => {
    setValue(e.target.value);
  }, []);

  return (
    <div>
      <span>{value}</span> <br />
      <br />
      <input
        type="text"
        ref={input}
        value={value}
        onChange={handleChange}
      />{' '}
      <br />
      <br />
      <button onClick={handleClick}>alert value</button>
    </div>
  );
};
export default UseRefComponent;
```

### useImperativeHandle()

```js
useImperativeHandle(ref, createHandle, [deps]);
```

`useImperativeHandle` 可以让你在使用 `ref` 时自定义暴露给父组件的实例值。在大多数情况下，应当避免使用 `ref` 这样的命令式代码。`useImperativeHandle` 应当与 [`forwardRef`](https://react.docschina.org/docs/react-api.html#reactforwardref) 一起

**示例：**

```jsx
import React, {
  useRef,
  useImperativeHandle,
  useCallback,
  useState,
} from 'react';

const ParentComponent = () => {
  const child = useRef(null);

  const handleClickAlert = useCallback(() => {
    console.log(child);
    child.current && child.current.alertValue();
  }, []);

  const handleClickFocus = useCallback(() => {
    child.current && child.current.focus();
  }, []);

  return (
    <div>
      <ChildComponent ref={child} />
      <button onClick={handleClickAlert}> 点击alert子组件value </button>
      <button onClick={handleClickFocus}> 点击focus子组件的input </button>
    </div>
  );
};

const ChildComponent = React.forwardRef((props, ref) => {
  const [value, setValue] = useState(0);
  const input = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        input.current && input.current.focus();
      },
      alertValue: () => {
        alert(value);
      },
    }),
    [value],
  );

  const handleChange = useCallback(e => {
    setValue(e.target.value);
  }, []);

  return (
    <div>
      <input type="text" ref={input} value={value} onChange={handleChange} />
    </div>
  );
});

export default ParentComponent;
```

### useLayoutEffect()

其函数签名与 `useEffect` 相同，但它会在所有的 DOM 变更之后`同步调用 effect`。可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，`useLayoutEffect`内部的更新计划将被同步刷新。

> Tips: 需要注意 `useLayoutEffect` 与 `componentDidMount、componentDidUpdate` 的调用阶段是一样的, 尽可能使用标准的 `useEffect` 以避免阻塞视觉更新。一开始先用 useEffect，只有当它出问题的时候再尝试使用 `useLayoutEffect`.
> 如果你使用服务端渲染，请记住，无论 `useLayoutEffect` 还是 `useEffect` 都无法在 Javascript 代码加载完成之前执行。

**示例：**

```jsx
import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react';

const MAX = 400;
const MIN = 1;

const UseLayoutComponent = () => {
  const box1 = useRef(null);
  const box2 = useRef(null);
  const [value, setValue] = useState(100);
  const handleSmall = () => {
    if (value - 20 >= MIN) {
      setValue(value - 20);
    }
  };

  const handleBig = () => {
    if (value + 20 <= MAX) {
      setValue(value + 20);
    }
  };

  useLayoutEffect(() => {
    if (!box1.current) return;
    box1.current.style.height = `${value}px`;
    box1.current.style.width = `${value}px`;
  }, [value]);

  useEffect(() => {
    if (!box2.current) return;
    box2.current.style.height = `${value}px`;
    box2.current.style.width = `${value}px`;
  }, [value]);

  // useEffect稍微慢一点点，肉眼很难体验出区别

  return (
    <div>
      <div
        ref={box1}
        style={{ border: '1px solid #000', transition: 'all .5s' }}
      >
        UseLayoutEffect box
      </div>{' '}
      <br />
      <br />
      <div
        ref={box2}
        style={{ border: '1px solid #000', transition: 'all .5s' }}
      >
        UseEffect box
      </div>{' '}
      <br />
      <br />
      <button onClick={handleSmall}>变小</button>
      <button onClick={handleBig}>变大</button>
    </div>
  );
};

export default UseLayoutComponent;
```

### useDebugValue()

```js
useDebugValue(value);
```

`useDebugValue` 可用于在 React 开发者工具中显示自定义 `hook` 的标签。

> Tips: 不推荐向每个自定义 `Hook` 添加 `debug` 值。当它作为共享库的一部分时才最有价值。

**示例：**

```jsx
import React, { useDebugValue, useState } from 'react';
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(false);
  useDebugValue(isOnline ? 'online' : 'offline');
  return [isOnline, setIsOnline];
};

const DebugComponent = () => {
  const [isOnline, setIsOnline] = useOnlineStatus();
  return (
    <div>
      <span>{isOnline ? 'online' : 'offline'}</span>
      <br />
      <br />
      <button onClick={() => setIsOnline(!isOnline)}>switch online</button>
    </div>
  );
};
export default DebugComponent;
```
