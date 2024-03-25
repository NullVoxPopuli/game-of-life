import { createBoard } from 'polaris-starter/services/helpers';
import QUnit, { module, test } from 'qunit';

function assertDimensions(board, width, height) {
  QUnit.assert.strictEqual(board.length, height, `height of ${height}`);

  let i = 0;
  for (let row of board) {
    QUnit.assert.strictEqual(row.length, width, `row ${i}: width of ${width}`);
    i++;
  }
}

module('createBoard()', function () {
  const square = (x) => assertDimensions(createBoard({ width: x, height: x }), x, x);
  const rect = (x, y) => assertDimensions(createBoard({ width: x, height: y }), x, y);

  test('square has correct dimensions', function () {
    square(4);
    square(10);
    square(1);
    square(2);
  });

  test('rectangle has correct dimensions', function () {
    rect(1, 4);
    rect(4, 1);
    rect(8, 2);
  });
});
