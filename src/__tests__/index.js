import { Machine } from "xstate";
import RS, { confirmMachineIDs, createFiniteState } from "../";

const promiseMachine = Machine({
  id: "promise",
  initial: "pending",
  states: {
    pending: {
      on: {
        RESOLVE: "resolved",
        REJECT: "rejected"
      }
    },
    resolved: {
      type: "final"
    },
    rejected: {
      type: "final"
    }
  }
});

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

test("The identifiers of machine arguments could not be duplicate and undefined.", () => {});

test("Create an action from machineActionCreator.", () => {
  const { machineActionCreator } = RS([starWarsMachine]);
  const machineActionType = `@MST`;
  expect(machineActionCreator("starWars", "REQUEST")).toEqual({
    type: machineActionType,
    payload: {
      machineEvent: "REQUEST",
      machineID: "starWars"
    }
  });
});

test("Create finite state from instances of machines", () => {
  expect(createFiniteState([promiseMachine, starWarsMachine])).toEqual({
    promiseMach: "pending",
    starWarsMach: "idle"
  });
});

test("enhanced reducer return the initial state", () => {
  const { machineActionCreator, reducerEnhancer } = RS([starWarsMachine]);
  const reducer = reducerEnhancer(extReducer, { counter: 0 });
  expect(reducer(undefined, {})).toEqual({
    starWarsMach: "idle",
    counter: 0
  });
});

test("enhanced reducer update infinite state", () => {
  const { machineActionCreator, reducerEnhancer } = RS([starWarsMachine]);
  const reducer = reducerEnhancer(extReducer, { counter: 0 });
  const currentState = {
    starWarsMach: "idle",
    counter: 0
  };
  expect(
    reducer(currentState, {
      type: "INCREMENT"
    })
  ).toEqual({
    starWarsMach: "idle",
    counter: 1
  });
});

test("enhanced reducer update finite state", () => {
  const { machineActionCreator, reducerEnhancer } = RS([
    starWarsMachine,
    promiseMachine
  ]);
  const reducer = reducerEnhancer(extReducer, { counter: 0 });

  const { counter, starWarsMach, promiseMach } = reducer(
    undefined,
    machineActionCreator("starWars", "REQUEST")
  );

  expect(counter).toEqual(0);
  expect(starWarsMach.value).toBe("pending");
  expect(promiseMach).toBe("pending");
  expect(starWarsMach.actions).toContainEqual({
    type: "alertStartingFirstRequest"
  });

  expect(
    reducer(undefined, {
      type: "INCREMENT"
    })
  ).toHaveProperty("counter", 1)
});
