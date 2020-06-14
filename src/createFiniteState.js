const createFiniteState = (machines) => {
  return machines.reduce((result, machine) => {
    result[`${machine.id}Mach`] = machine.initial;
    return result;
  }, {});
};

export default createFiniteState;
