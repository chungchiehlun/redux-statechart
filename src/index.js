import shortid from "shortid";

export default machine => {
  const machineId = machine.id ? machine.id : shortid.generate();
  // MST is the abbreviation of Machine State Transition.
  const machineActionType = `@MST/${machineId}`;
  return {
    machineActionCreator: machineEvent => {
      return {
        type: machineActionType,
        machineEvent
      };
    },
    reducerEnhancer: (extReducer, extInitialState) => {
      const initialState = {
        infinite: extInitialState,
        finite: {
          [machineId]: machine.initialState.value
        }
      };

      return (state = initialState, action) => {
        switch (action.type) {
          case machineActionType:
            return {
              ...state,
              finite: {
                [machineId]: machine.transition(
                  state["finite"][machineId],
                  action.machineEvent,
                  state
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
