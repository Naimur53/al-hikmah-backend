export const nameToCorrectString = (name: string) => {
  return name.includes('-') ? name.split('-').join(' ') : name;
};
