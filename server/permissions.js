Piece.allow({
  update: function(userId, oldEntity, fieldNames, mods) {
    var newEntity = EJSON.clone(oldEntity);
    LocalCollection._modify(newEntity, mods);

    // 1. Can only move your own piece
    if (userId != oldEntity.ownerId) return false;

    // 2. you can't change your name or icon, only your position
    var changable_fieldnames = ['position'];
    if (_.difference(fieldNames, changable_fieldnames).length) return false;

    // 3. can't go out of bounds
    if (newEntity.position.x < 0
     || newEntity.position.y < 0
     || newEntity.position.x >= BOARDSIZE.x
     || newEntity.position.y >= BOARDSIZE.y) return false;

    // 4. can't move by more than one
    var diff = Math.abs(newEntity.position.x - oldEntity.position.x) +
               Math.abs(newEntity.position.y - oldEntity.position.y);
    if (diff > 1) return false;

    return true;
  }
});
