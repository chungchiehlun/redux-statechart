# Reduxstate

redux + xstate =  awesome !



**Redux** is a predicatable state container for JavaScript apps. One of the [redux principles](https://redux.js.org/introduction/threeprinciples) is that your app state is stored in a single tree. Accordingly, UI variables (*isLoading*, *isVisible*) and side effects (data fetching response) are all **states**. When the operation of your app get complicated (it's usually happens quickly),  the state always become upredictable. 

**Xstate** is functional, stateless JavaScript [finite state machines](https://en.wikipedia.org/wiki/Finite-state_machine) (FSM) and [statecharts](http://www.inf.ed.ac.uk/teaching/courses/seoc/2005_2006/resources/statecharts.pdf). An FSM is defined by a list of its states, its initial state, and the conditions for each transition. A statechart is a state machine where each state in the state machine may define its own *subordinate* state machines, called *substates*.  Those states can again define substates. These are useful for declaratively describing the *behavior* of your app, from the individual components to the overall app logic.

Deterministic state not only reduce time fixing unpredictable and exploded state but also provide a common language for designers & developers. On the other hand, uncertain or extended state are regular when handling side effect in the real world app. Generally speaking, both infinite and finite states are necessary. 

Redux do not strictly limit state shape but xstate have to define a [machine configuration](http://davidkpiano.github.io/xstate/docs/#/api/config?id=machine-configuration). **Reduxstate is a tiny library make redux state possessed with both finite and infinite states in the underlying redux pattern.** 



## Usage Example

A reducer in redux alone could not reveal all the possible states and transitions but the [higher-order reducer](https://redux.js.org/recipes/structuringreducers/reusingreducerlogic#customizing-behavior-with-higher-order-reducers) does. Reduxstate create a HOR and an action creator to handle finite state logic.















