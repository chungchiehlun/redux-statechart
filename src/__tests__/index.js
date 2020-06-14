import { Machine } from "xstate";
import RS, { createMachine } from "../";
import createFiniteState from "../createFiniteState";
import { machineActionType } from "../constants";

const starWarsMachine = Machine({
  id: "starWars",
  initial: "idle",
  states: {
    idle: {
      on: {
        REQUEST: {
          target: "pending",
          actions: ["alertStartingFirstRequest"],
        },
      },
      onExit: "alertMayTheForceBeWithYou",
    },
    pending: {
      on: {
        SUCCESS: "fulfilled",
        FAILURE: "rejected",
      },
      onEntry: "fetchPerson",
      onExit: "alertRequestFinished",
    },
  },
});

test("Create finites states using createFiniteState.", () => {
  const toggleMachine = Machine({
    id: "toggle",
    initial: "inactive",
    states: {
      inactive: { on: { TOGGLE: "active" } },
      active: { on: { TOGGLE: "inactive" } },
    },
  });

  expect(createFiniteState([toggleMachine, starWarsMachine])).toEqual({
    toggleMach: "inactive",
    starWarsMach: "idle",
  });
});

test("Create machine action using machineActionCreator.", () => {
  const { machineActionCreator } = RS([starWarsMachine]);
  expect(machineActionCreator("starWars", "REQUEST")).toEqual({
    type: machineActionType,
    payload: {
      machineEvent: "REQUEST",
      machineID: "starWars",
    },
  });
});

const createEnhancedReducer = (machine) => {
  const { machineActionCreator, reducerEnhancer } = RS([machine]);
  return {
    machineActionCreator,
    reducer: reducerEnhancer(
      (state, action) => {
        switch (action.type) {
          case "INCREMENT":
            return { ...state, counter: state.counter + 1 };
          default:
            return state;
        }
      },
      { counter: 0 }
    ),
  };
};

test("Initialize finite and inifinite states.", () => {
  const { reducer } = createEnhancedReducer(starWarsMachine);
  expect(reducer(undefined, {})).toEqual({
    starWarsMach: "idle",
    counter: 0,
  });
});

test("Update infinite state after dispatching action", () => {
  const { reducer } = createEnhancedReducer(starWarsMachine);
  expect(
    reducer(
      {
        starWarsMach: "idle",
        counter: 0,
      },
      {
        type: "INCREMENT",
      }
    )
  ).toEqual({
    starWarsMach: "idle",
    counter: 1,
  });
});

test("Update finite state after dispatching machine action", () => {
  const { reducer, machineActionCreator } = createEnhancedReducer(
    starWarsMachine
  );
  const machAction = machineActionCreator("starWars", "REQUEST");

  const { starWarsMach, counter } = reducer(undefined, machAction);

  expect(starWarsMach.value).toEqual("pending");
  expect(starWarsMach.actions).toContainEqual({
    type: "alertStartingFirstRequest",
  });
});
