import { findNeighbors, createBoard } from 'life/util/helpers';
import { module, test } from 'qunit';

module('findNeighbors()', function () {
  const neighbors = (x, y, X, Y) =>
    findNeighbors({
      x,
      y,
      maxX: X,
      maxY: Y,
      board: createBoard({ width: X, height: Y }),
    });

  test('middle', function (assert) {
    assert.strictEqual(neighbors(5, 5, 10, 10).length, 8);
  });

  test('top-left', function (assert) {
    assert.strictEqual(neighbors(0, 0, 10, 10).length, 3);
  });

  test('top-right', function (assert) {
    assert.strictEqual(neighbors(9, 0, 10, 10).length, 3);
  });

  test('bottom-left', function (assert) {
    assert.strictEqual(neighbors(0, 9, 10, 10).length, 3);
  });

  test('bottom-right', function (assert) {
    assert.strictEqual(neighbors(9, 9, 10, 10).length, 3);
  });

  test('left-edge-middle', function (assert) {
    assert.strictEqual(neighbors(0, 5, 10, 10).length, 5);
  });

  test('right-edge-middle', function (assert) {
    assert.strictEqual(neighbors(9, 5, 10, 10).length, 5);
  });

  test('top-edge-middle', function (assert) {
    assert.strictEqual(neighbors(5, 0, 10, 10).length, 5);
  });

  test('bottom-edge-middle', function (assert) {
    assert.strictEqual(neighbors(5, 9, 10, 10).length, 5);
  });
});
