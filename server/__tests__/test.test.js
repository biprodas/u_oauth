const sum = (a, b) => {
  return a + b;
}

test('testing works', () => {
  expect(sum(1, 2)).toBe(3);
});