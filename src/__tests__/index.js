import { Machine } from "xstate";
import reduxstate from "../";

const starWarsMachine = Machine({
  key: "starWars",
  initial: "idle",
  states: {
    idle: {
      on: {
        REQUEST: {
          pending: {
            actions: ["alertStartingFirstRequest"]
          }
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

const { machineActionCreator, reducerEnhancer } = reduxstate(starWarsMachine);

test("enhanced reducer return the initial state", () => {
  const reducer = reducerEnhancer(extReducer);
  expect(reducer(undefined, {})).toEqual({
    finite: { starWars: "idle" },
    infinite: 0
  });
});

test("enhanced reducer update infinite state", () => {
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
  const reducer = reducerEnhancer(extReducer);
  const currentState = {
    finite: { starWars: "idle" },
    infinite: 0
  };

  const { finite, infinite } = reducer(
    currentState,
    machineActionCreator("REQUEST")
  );
  expect(infinite).toEqual(0);
  expect(finite["starWars"].value).toBe("pending");
  expect(finite["starWars"].actions).toContain("alertStartingFirstRequest");
});

test("create an action from machineActionCreator", () => {
  const machineActionType = `@MST/${starWarsMachine.key}`;
  expect(machineActionCreator("REQUEST")).toEqual({
    type: machineActionType,
    machineEvent: "REQUEST"
  });
});
