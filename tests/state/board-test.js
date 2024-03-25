import { module, test } from 'qunit';
import { Board } from 'polaris-starter/services/board';

module('Board', function () {
  test('shapeAt works', function (assert) {
    let board = new Board(5, 5);

    board.addShape({
      shape: [
        [0, 1],
        [1, 0],
        [1, 0],
      ],
      at: { x: 0, y: 0 },
    });

    assert.deepEqual(board.shapeAt({ at: { x: 0, y: 0 }, width: 2, height: 3 }), [
      [0, 1],
      [1, 0],
      [1, 0],
    ]);
  });

  test('hasShape works', function (assert) {
    let board = new Board(5, 5);

    board.addShape({
      shape: [
        [0, 1],
        [1, 0],
        [1, 0],
      ],
      at: { x: 0, y: 0 },
    });

    assert.ok(
      board.hasShape({
        shape: [
          [0, 1],
          [1, 0],
          [1, 0],
        ],
        at: { x: 0, y: 0 },
      })
    );
  });
});
