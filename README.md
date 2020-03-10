# redux-statechart

redux + xstate = awesome !

**Redux** is a predictable state container for JavaScript apps. One of the [redux principles](https://redux.js.org/introduction/threeprinciples) is that your app state is stored in a single tree. Accordingly, UI variables (_isLoading_, _isVisible_) and side effects (data fetching response) are all **states**. When the operation of your app get complicated (it's usually happens quickly), the state always become unpredictable.

**Xstate** is functional, stateless JavaScript [finite state machines](https://en.wikipedia.org/wiki/Finite-state_machine) (FSM) and [statecharts](http://www.inf.ed.ac.uk/teaching/courses/seoc/2005_2006/resources/statecharts.pdf). An FSM is defined by a list of its states, its initial state, and the conditions for each transition. A statechart is a state machine where each state in the state machine may define its own _subordinate_ state machines, called _substates_. Those states can again define substates. These are useful for declaratively describing the _behavior_ of your app, from the individual components to the overall app logic.

Deterministic state not only reduce time fixing unpredictable and exploded state but also provide a common language for designers & developers. On the other hand, uncertain or extended state are regular when handling side effect in the real world app. Generally speaking, both infinite and finite states are necessary.

Redux do not strictly limit state shape but xstate have to define a [machine configuration](https://xstate.js.org/docs/guides/machines.html#configuration). **Redux-statechart is a tiny library make redux state possessed with both finite and infinite states in the underlying redux pattern.**

## Usage Example

First, create a [statechart machine](https://xstate.js.org/docs/guides/machines.html). Please note that `xstate` must be _version 4.x_.

```js
const starWarsMachine = Machine({
  id: "starWars",
  initial: "idle",
  states: {
    idle: {
      on: {
        REQUEST: {
          target: "pending",
          actions: ["alertStartingFirstRequest"]
        }
      },
      onExit: "alertMayTheForceBeWithYou"
    },
    pending: {
      on: {
        SUCCESS: "fulfilled",
        FAILURE: "rejected"
      },
      onEntry: "fetchPerson",
      onExit: "alertRequestFinished"
    }
  }
});
```

**Redux-statechart** take array of [statechart machines](http://davidkpiano.github.io/xstate/docs/#/api/machine?id=machine)s as the only argument and return a _higher order reducer (HOR)_ and an _action creator_. HOR takes a regular reducer as the first argument and an optional initial state as the second. _Note the initial state must be object._

```javascript
import RS from "redux-statechart";

// reducerEnhancer is a Higher Order Reducer.
const { machineActionCreator, reducerEnhancer } = RS([starWarsMachine]);

const extReducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, counter: state.counter + 1 };
    case "DECREMENT":
      return { ...state, counter: state.counter - 1 };
    default:
      return state;
  }
};
const enhancedReducer = reducerEnhancer(extReducer, { counter: 0 });

const store = createStore(enhancedReducer);
```

> The principle of reducer do not restrict the shape of state. A reducer is hard to distinguish between finite and infinite state.

In the convention of **redux-statechart**, the _finite_ state are appended with `Mach`.

Finally, whether finite or infinite state, call dispatch to update the state. For convenience, `redux-statechart` contains another returned value, `machineActionCreator`. It takes **machine id** and **machine event** as required arguments and return an action you could dispatch it.

```js
store.dispatch(machineActionCreator("starWars", "REQUEST"));
// => State{ counter: 0, starWarsMach: { value: "pending", ... }}

store.dispatch({ type: "INCREMENT" });
// => State{ counter: 1, starWarsMach: { value: "pending", ... }}
```

## Issues

Feel free to submit issues and enhancement requests.

## License

MIT
