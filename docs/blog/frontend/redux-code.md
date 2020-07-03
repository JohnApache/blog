# Redux 源码编写

## CreateStore

`Store` 本质上就是内部维护着一个全局变量`state`， 由 `reducer` 管理 `action` 和 `state`, `dispatch` 用来触发 `reducer` 的执行， 还提供了 `subscribe` 监听数据的变化执行回调;

1. 首先实现一个方法 `createStore`

   返回值`Store`应该至少包含 4 个方法 ,`getState`, `dispatch`, `subscribe`, `replaceReducer`;

   ```js
   const createStore = (reducer, preloadedData, enhancer) => {
     const getState = () => {};
     const dispatch = action => {};
     const subscribe = listener => {};
     const replaceReducer = reducer => {};
     const store = {
       getState,
       dispatch,
       subscribe,
       replaceReducer,
     };
     return store;
   };
   ```

2. 添加参数校验

   它接收 3 个参数 `reducer`, `preloadedData`, `enhancer`, 且后两个参数可以省略;

   ```js
   const createStore = (reducer, preloadedData, enhancer) => {
     // 参数基本校验,
     if (typeof reducer !== 'function') {
       throw new Error('invalid params');
     }

     if (typeof preloadedData === 'function') {
       // preloadedData 已经被省略
       enhancer = preloadedData;
       preloadedData = undefined;
     }

     if (enhancer) {
       // enhancer 是store 的中间件，用来增强 store 的 dispatch 功能
       return enhancer(createStore)(reducer, preloadedData);
     }
     // ... 省略其他内容
   };
   ```

3. 实现 `getState` 方法

   该方法返回当前最新状态

   ```js
   const createStore = (reducer, preloadedData, enhancer) => {
     // 初始化最新状态
     let currentState = preloadedData;
     // getState 只需要返回最新的状态即可
     const getState = () => currentState;
     // ... 省略其他内容
   };
   ```

4. 实现 `subscribe` 方法

   该方法接收一个监听器函数，并返回对应的卸载函数，注册的监听器函数能在每次 `dispatch` 时触发

   ```js
   import { isPlainObject } from './utils';

   const createStore = (reducer, preloadedData, enhancer) => {
     // 初始化最新状态
     let currentState = preloadedData;
     // 这里方便后续可以动态替换 reducer
     let currentReducer = reducer;
     // 监听器
     let listeners = [];
     const subscribe = listener => {
       if (typeof listener !== 'function') {
         throw new TypeError('Actions must be plain objects');
       }
       listeners.push(listener);
       const unsubscribe = () => {
         listeners.splice(listeners.indexOf(listener), 1);
       };
       return unsubscribe;
     };
     // ... 省略其他内容
   };
   ```

5. 实现 `dispatch` 方法

   该方法接收一个 `action`, 并返回 当前 `action`, `redux` 希望 `action` 是一个纯净的对象，最好是字面量，它不应该继承其他对象, 所以先实现一个方法`isPlainObje`用来检测 `action`， `dispatch` 也会触发当前的 所有`subscribe` 注册的监听器函数

   ```js
   // utils/index.js
   export const isPlainObject = obj => {
     if (typeof obj !== 'object' || obj === null) return false;
     let proto = obj;
     while (Object.getPrototypeOf(proto) !== null) {
       proto = Object.getPrototypeOf(proto);
     }

     return Object.getPrototypeOf(obj) === proto;
   };
   ```

   创建 `Init Action` key

   ```js
   // actionTypes.js
   const randomString = () =>
     Math.random()
       .toString(36)
       .substring(7)
       .split('')
       .join('.');
   export const INIT_ACTION = `@@redux/INIT${randomString()}`;
   ```

   然后实现 `dispatch`, 并初始化

   ```js
   import { isPlainObject } from './utils';
   import { INIT_ACTION } from './actionTypes';

   const createStore = (reducer, preloadedData, enhancer) => {
     // 初始化最新状态
     let currentState = preloadedData;
     // 这里方便后续可以动态替换 reducer
     let currentReducer = reducer;
     // 监听器
     let listeners = [];
     const dispatch = action => {
       if (!isPlainObject(action)) {
         throw new TypeError('Action need a plain object');
       }
       currentState = currentReducer(currentState, action);
       listeners.forEach(listener => listener());
       return action;
     };
     // 初始化 state 数据
     dispatch({ type: INIT_ACTION });
     // ... 省略其他内容
   };
   ```

6. 实现 `replaceReducer` 方法, 用来动态更新`reducer`, 一般热更新用的比较多

创建 `Replace Action` key

```js
// actionTypes.js
const randomString = () =>
  Math.random()
    .toString(36)
    .substring(7)
    .split('')
    .join('.');
export const REPLACE_ACTION = `@@redux/REPLACE${randomString()}`;
```

具体实现 `replaceReducer`方法

```js
import { REPLACE_ACTION } from './actionTypes';
const createStore = (reducer, preloadedData, enhancer) => {
    const replaceReducer = (newReducer) => {
        currentReducer = newReducer;
        dispatch({ type: REPLACE_ACTION });
        return store;
    }
    // ... 省略其他内容

    const store = {
        //... 省略其他内容
        replaceReducer
    }
    return store;
})
```

综上完成了 `createStore` 的基本实现, 完整代码如下, 这里没有 接收 `enhancer` 放在后续实现细节

```js
import { isPlainObject } from './utils';
import { REPLACE_ACTION, INIT_ACTION } from './actionTypes';
const createStore = (reducer, preloadedData, enhancer) => {
  // 参数基本校验,
  if (typeof reducer !== 'function') {
    throw new Error('invalid params');
  }

  if (typeof preloadedData === 'function') {
    // preloadedData 已经被省略
    enhancer = preloadedData;
    preloadedData = undefined;
  }

  if (enhancer) {
    // enhancer 是store 的中间件，用来增强 store 的 dispatch 功能
    return enhancer(createStore)(reducer, preloadedData);
  }

  // 初始化最新状态
  let currentState = preloadedData;
  // getState 只需要返回最新的状态即可
  let currentReducer = reducer;
  // 监听器
  let listeners = [];

  const getState = () => currentState;

  const subscribe = listener => {
    if (typeof listener !== 'function') {
      throw new TypeError('Actions must be plain objects');
    }
    listeners.push(listener);
    const unsubscribe = () => {
      listeners.splice(listeners.indexOf(listener), 1);
    };
    return unsubscribe;
  };

  const dispatch = action => {
    if (!isPlainObject(action)) {
      throw new TypeError('Actions must be plain objects');
    }
    try {
      currentState = currentReducer(currentState, action);
    } catch (error) {
      console.log(error);
    }
    listeners.forEach(listener => listener());
    return action;
  };

  const replaceReducer = newReducer => {
    currentReducer = newReducer;
    dispatch({ type: REPLACE_ACTION });
    return store;
  };

  dispatch({ type: INIT_ACTION });

  const store = {
    getState,
    dispatch,
    subscribe,
    replaceReducer,
  };
  return store;
};

export default createStore;
```

## ApplyMiddleware

`applyMiddleware`就是上文中提到第三个参数`enhancer`，在实现`ApplyMiddleware`之前先介绍一下, 什么是 `middleware`,

`middleware` 本质上就是为了包装 `dispatch` 方法，在执行 `dispatch` 时可以做很多额外的事情，它接收一个 包含 `getState` 和 最终 `dispatch`，并返回一个函数，从上游中间件包裹增强的 `dispatch`函数，该函数本身业会返回一个 增强的 `dispatch`函数

例如看一个最简单的 `LoggerMiddleware` 中间件 和 `ThunkMiddleware`

```js
const LoggerMiddleware = ({ getState }) => {
  return next => action => {
    console.log('prev state', getState());
    const result = next(action);
    console.log('next state', getState());
    return result;
  };
};

const ThunkMiddleware = ({ dispatch, getState }) => {
  return next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    return next(action);
  };
};
```

以上面两个`middleware`为例子，实现`enhancer`方法

```js
// 这里的createStore 从外部传入，用来包装store
const Enhancer = createStore => {
  const store = createStore();
  let dispatch = () => {
    throw new Error(
      'Dispatching while constructing your middleware is not allowed.',
    );
  };
  const middlewareParams = {
    getState: store.getState,
    dispatch: (...args) => dispatch(...args),
  };

  const logger = LoggerMiddleware(middlewareParams);
  const thunk = ThunkMiddleware(middlewareParams);
  dispatch = logger(thunk(store.dispatch));
  return {
    ...store,
    dispatch,
  };
};
```

这样的 `enhancer` 已经可以作为 `createStore` 的第三个参数传入了 但是有一个问题， 当 `middleware` 很多的时候，`dispatch` 的包装会写成类似 `a(b(c(d())))` 这种深度嵌套的写法， 可阅读性比较差，为此，可以提供一个函数来解决这个问题

```js
// compose.js;
const compose = (...fns) => {
  if (fns.some(fn => typeof fn !== 'function')) {
    throw new Error('invalid params');
  }
  return fns.reduce((a, b) => (...args) => a(b(...args)));
};
export default compose;
```

这样的写法可以将之前`a(b(c(d())))` 替换为 `compose(a,b,c,d)`, 再将 `middlewares` 作为参数传入，由此可以封装出 `applyMiddleware`

```js
import compose from './compose';
const applyMiddleware = (...middlewares) => {
  return createStore => {
    const store = createStore();
    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed.',
      );
    };
    const middlewareParams = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args),
    };
    const chains = middlewares.map(middleware => middleware(middlewareParams));
    // 包装 dispatch
    dispatch = compose(...chains)(store.dispatch);
    return {
      ...store,
      dispatch,
    };
  };
};
export default applyMiddleware;
```

至此已经可以实现 `redux` 的基本功能，使用方法如下

```js
import createStore from './createStore';
import applyMiddlware from './applyMiddleware';
import { LoggerMiddleware, ThunkMiddleware } from './middlewares';
import CountReducer from './countReducer';
// 因为 Thunk可以解析函数，尽量放右边优先先执行
const store = createStore(
  CountReducer,
  applyMiddlware(LoggerMiddleware, ThunkMiddleware),
);
store.dispatch({ type: 'ADD', count: 3 });
```

## combineReducers

上面的功能已经将 `redux` 基础功能完成了， 该方法只是一层`reducer` 封装，为了将多个 `reducer` 合并到一个 `reducer` 下，在业务上，一般会将同一类型的`reducer` 放一起，如果所有的 reducer 都挂载到根节点，键容易冲突而且也不容易管理，为此需要实现这个`combineReducers`方法

```js
import { isPlainObject } from './utils';
const combineReducers = reducersMap => {
  if (!isPlainObject(reducersMap)) {
    throw new TypeError('invalid reducers map');
  }

  const reducerKeys = Object.keys(reducersMap);

  if (reducerKeys.length <= 0) {
    throw new TypeError('reducers map can not empty');
  }
  // 前置参数合法判断
  if (reducerKeys.some(key => typeof reducersMap[key] !== 'function')) {
    throw new TypeError('invalid reducers map');
  }

  return (state = {}, action) => {
    const nextState = {};
    // 标记状态有没有发生改变
    let hasChanged = false;
    reducerKeys.forEach(key => {
      const previousStateForKey = state[key];
      const nextStateForKey = reducersMap[key](previousStateForKey);
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || previousStateForKey !== nextStateForKey;
    });
    // 如果状态值发生变化，就使用新的state
    return hasChanged ? nextState : state;
  };
};
```

## bindActionCreators

把一个 value 为不同 `action creator` 的对象，转成拥有同名 `key` 的对象。同时使用 `dispatch` 对每个 `action creator` 进行包装，以便可以直接调用它们。

唯一会使用到 `bindActionCreators` 的场景是当你需要把 `action creator` 往下传到一个组件上，却不想让这个组件觉察到 `Redux` 的存在，而且不希望把 `dispatch` 或 `Redux store` 传给它。

实现方法很简单

```js
const bindActionCreator = (actionCreator, dispatch) => {
  if (typeof actionCreator !== 'function' || typeof dispatch !== 'function') {
    throw new Error('invalid params');
  }
  // 不用箭头函数方便绑定this
  return function(...args) {
    return dispatch(actionCreator.apply(this, args));
  };
};

const bindActionCreators = (actionCreators, dispatch) => {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }
  if (
    Object.prototype.toString.call(actionCreators) !== '[object Object]' ||
    typeof dispatch !== 'function'
  ) {
    throw new TypeError('invalid params');
  }

  const boundActionCreators = {};
  Object.keys(actionCreators).forEach(key => {
    if (actionCreators.hasOwnProperty(key)) {
      boundActionCreators[key] = bindActionCreator(
        actionCreators[key],
        dispatch,
      );
    }
  });
  return boundActionCreators;
};

export default bindActionCreators;
```

## 总结

综上`redux`基本所有功能都完成了， 本代码和 `redux` 源码并不相同，但是原理一致，参数判断比较随便，代码仅供参考, 可以直接配合 `react-redux` 一起使用
