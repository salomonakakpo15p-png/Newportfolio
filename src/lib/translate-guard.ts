// Google Translate (and Edge's built-in translator / text-rewriting extensions)
// wrap text nodes in <font> elements, silently re-parenting nodes that React
// still references. The next reconciliation then throws
//   NotFoundError: Failed to execute 'insertBefore'/'removeChild' on 'Node'
// which unmounts the whole tree (caught by our ErrorBoundary as a blank page).
// https://github.com/facebook/react/issues/11538
//
// Fail-soft the two operations React uses: if the reference/child node was
// re-parented by a translator, degrade gracefully instead of throwing.

export function installTranslateGuard() {
  if (typeof Node === 'undefined' || (Node.prototype as { __tg?: boolean }).__tg) return

  const originalRemoveChild = Node.prototype.removeChild
  const originalInsertBefore = Node.prototype.insertBefore

  Node.prototype.removeChild = function removeChild<T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      // Translator moved the node elsewhere — remove it from where it lives.
      child.parentNode?.removeChild(child)
      return child
    }
    return originalRemoveChild.call(this, child) as T
  }

  Node.prototype.insertBefore = function insertBefore<T extends Node>(
    newNode: T,
    referenceNode: Node | null,
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      // Reference node was re-parented by a translator — append instead.
      return originalInsertBefore.call(this, newNode, null) as T
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T
  }

  ;(Node.prototype as { __tg?: boolean }).__tg = true
}
