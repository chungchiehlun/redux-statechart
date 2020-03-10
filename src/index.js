import { isPlainObject } from "lodash";

const createFiniteState = machines => {
  return machines.reduce((result, machine) => {
    result[`${machine.id}Mach`] = machine.initial;
    return result;
  }, {});
};

export default machines => {
  const machineMap = machines.reduce((result, machine) => {
    result[machine.id] = machine;
    return result;
  }, {});

  return {
    machineActionCreator: (machineID, machineEvent) => {
      // MST is the abbreviation of Machine State Transition.
      return {
        type: `@MST`,
        payload: {
          machineID,
          machineEvent
        }
      };
    },
    reducerEnhancer: (extReducer, extInitialState = {}) => {
      if (!isPlainObject(extInitialState)) {
        throw "initial state must be object.";
      }

      const initialState = {
        ...extInitialState,
        ...createFiniteState(machines)
      };

      return (state = initialState, action) => {
        switch (action.type) {
          case `@MST`:
            const { machineID, machineEvent } = action.payload;
            return {
              ...state,
              [`${machineID}Mach`]: machineMap[machineID].transition(
                state[`${machineID}Mach`],
                machineEvent
              )
            };
          default:
            return {
              ...state,
              ...extReducer(state, action)
            };
        }
      };
    }
  };
};
