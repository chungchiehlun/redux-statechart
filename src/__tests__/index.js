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

const extReducer = (state = 0, action) => {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
};

test("The identifiers of machine arguments could not be duplicate and undefined", () => {});

test("create an action from machineActionCreator", () => {
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
    promise: "pending",
    starWars: "idle"
  });
});

test("enhanced reducer return the initial state", () => {
  const { machineActionCreator, reducerEnhancer } = RS([starWarsMachine]);
  const reducer = reducerEnhancer(extReducer);
  expect(reducer(undefined, {})).toEqual({
    finite: { starWars: "idle" },
    infinite: 0
  });
});

test("enhanced reducer update infinite state", () => {
  const { machineActionCreator, reducerEnhancer } = RS([starWarsMachine]);
  const reducer = reducerEnhancer(extReducer);
  const currentState = {
    finite: { starWars: "idle" },
    infinite: 0
  };
  expect(
    reducer(currentState, {
      type: "INCREMENT"
    })
  ).toEqual({
    finite: { starWars: "idle" },
    infinite: 1
  });
});

test("enhanced reducer update finite state", () => {
  const { machineActionCreator, reducerEnhancer } = RS([
    starWarsMachine,
    promiseMachine
  ]);
  const reducer = reducerEnhancer(extReducer, 0);

  const { finite, infinite } = reducer(
    undefined,
    machineActionCreator("starWars", "REQUEST")
  );

  expect(infinite).toEqual(0);
  expect(finite["starWars"].value).toBe("pending");
  expect(finite["promise"]).toBe("pending");
  expect(finite["starWars"].actions).toContainEqual({
    type: "alertStartingFirstRequest"
  });
});
