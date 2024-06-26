import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('State', function (hooks) {
  setupTest(hooks);

  let state;

  hooks.beforeEach(function () {
    state = this.owner.lookup('service:state');
    state.createBoard(5, 5);
  });

  test('with no seed, is stable', function (assert) {
    assert.strictEqual(state.previous, undefined);

    state.passTime();

    assert.notEqual(state.previous, undefined);
    assert.strictEqual(state.history.length, 1);
    assert.deepEqual(state.previous, state.board.toJSON());

    state.passTime();

    assert.notEqual(state.previous, undefined);
    assert.strictEqual(state.history.length, 2);
    assert.deepEqual(state.previous, state.board.toJSON());
    assert.deepEqual(state.history[0], state.board.toJSON());
    assert.deepEqual(state.history[1], state.board.toJSON());
  });

  test('triomino 1', function (assert) {
    state.board.addShape({
      shape: [
        [0, 1],
        [1, 0],
        [1, 0],
      ],
      at: { x: 0, y: 0 },
    });

    assert.deepEqual(state.board.shapeAt({ at: { x: 0, y: 0 }, width: 2, height: 3 }), [
      [0, 1],
      [1, 0],
      [1, 0],
    ]);

    state.passTime();

    assert.deepEqual(state.board.shapeAt({ at: { x: 0, y: 0 }, width: 2, height: 3 }), [
      [0, 0],
      [1, 1],
      [0, 0],
    ]);
  });
});
