export const confirmMachineIDs = machines => {};

export const createFiniteState = machines => {
  return machines.reduce((result, machine) => {
    result[machine.id] = machine.initial;
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
    reducerEnhancer: (extReducer, extInitialState) => {
      const initialState = {
        infinite: extInitialState,
        finite: createFiniteState(machines)
      };

      return (state = initialState, action) => {
        switch (action.type) {
          case `@MST`:
            const { machineID, machineEvent } = action.payload;
            return {
              ...state,
              finite: {
                ...state.finite,
                [machineID]: machineMap[machineID].transition(
                  state["finite"][machineID],
                  machineEvent
                )
              }
            };
          default:
            return {
              ...state,
              infinite: extReducer(state.infinite, action)
            };
        }
      };
    }
  };
};
