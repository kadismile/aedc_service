const validStates = ['Abuja', 'Nassarawa', 'Kogi', 'Niger'];

export const normalizeState = (state: string): string => {
  return state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();
};

export const isValidState = (state: string): boolean => {
  const normalizedState = normalizeState(state);
  return validStates.includes(normalizedState);
};
