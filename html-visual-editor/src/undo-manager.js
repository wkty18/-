// ===== 撤销/重做管理器 =====
class UndoManager {
  constructor(maxSteps = 50) {
    this.undoStack = [];
    this.redoStack = [];
    this.maxSteps = maxSteps;
  }

  // 保存当前状态快照
  push(state) {
    this.undoStack.push(state);
    if (this.undoStack.length > this.maxSteps) {
      this.undoStack.shift();
    }
    // 新操作清空重做栈
    this.redoStack = [];
  }

  // 撤销
  undo(currentState) {
    if (this.undoStack.length === 0) return null;
    this.redoStack.push(currentState);
    return this.undoStack.pop();
  }

  // 重做
  redo(currentState) {
    if (this.redoStack.length === 0) return null;
    this.undoStack.push(currentState);
    return this.redoStack.pop();
  }

  // 是否有可撤销的操作
  canUndo() {
    return this.undoStack.length > 0;
  }

  // 是否有可重做的操作
  canRedo() {
    return this.redoStack.length > 0;
  }

  // 清空历史
  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }
}
