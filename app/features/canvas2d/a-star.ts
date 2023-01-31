type Pos2 = {
  x: number;
  y: number;
};

interface GridPosition extends Pos2 {
  weight?: number;
}

class GridNode implements Pos2 {
  parent: GridNode | null = null;
  score: number = 0;
  g: number = 0;
  h: number = 0;
  visited: boolean = false;
  closed: boolean = false;

  constructor(public x: number, public y: number, public weight: number) {}

  getCost(fromNeighbor: GridNode) {
    if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
      return this.weight * 1.41421;
    }
    return this.weight;
  }
}

function pathTo(node: GridNode): GridNode[] {
  let curr = node;
  const path = [];
  while (curr.parent) {
    path.unshift(curr);
    curr = curr.parent;
  }
  return path;
}

class BinaryHeap {
  content: GridNode[] = [];

  constructor() {}

  push(element: GridNode) {
    this.content.push(element);
    this.sinkDown(this.content.length - 1);
  }

  pop() {
    const result = this.content[0];
    const end = this.content.pop();

    if (this.content.length > 0 && end) {
      this.content[0] = end;
      this.bubbleUp(0);
    }
    return result;
  }

  size() {
    return this.content.length;
  }

  rescoreElement(node: GridNode) {
    this.sinkDown(this.content.indexOf(node));
  }

  sinkDown(n: number) {
    const element = this.content[n];

    while (n > 0) {
      const parentN = ((n + 1) >> 1) - 1;
      const parent = this.content[parentN];
      if (element.score < parent.score) {
        this.content[parentN] = element;
        this.content[n] = parent;
        n = parentN;
      } else {
        break;
      }
    }
  }

  bubbleUp(n: number) {
    const length = this.content.length;
    const element = this.content[n];
    const elemScore = element.score;

    while (true) {
      const child2N = (n + 1) << 1;
      const child1N = child2N - 1;

      let swap = null;
      let child1Score;

      if (child1N < length) {
        const child1 = this.content[child1N];
        child1Score = child1.score;

        if (child1Score < elemScore) {
          swap = child1N;
        }
      }

      if (child2N < length) {
        const child2 = this.content[child2N];
        const child2Score = child2.score;
        if (
          child1Score &&
          child2Score < (swap === null ? elemScore : child1Score)
        ) {
          swap = child2N;
        }
      }

      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      } else {
        break;
      }
    }
  }
}

export function SearchAStar(
  gridIn: GridPosition[],
  from: GridPosition,
  dest: GridPosition,
  options: {
    closest?: boolean;
    diagonal?: boolean;
  } = {}
) {
  const grid = gridIn.map((pos) => new GridNode(pos.x, pos.y, pos.weight || 1));
  const heuristic = options.diagonal
    ? heuristics.diagonal
    : heuristics.manhattan;
  const closest = options.closest || false;
  const openHeap = new BinaryHeap();
  const start = getNode(grid, from.x, from.y);
  const end = getNode(grid, dest.x, dest.y);
  if (!start || !end) throw new Error("Start or End not in grid");
  let closestNode = start;
  start.h = heuristic(start, end);

  openHeap.push(start);

  while (openHeap.size() > 0) {
    const currentNode = openHeap.pop();
    if (currentNode === end) {
      return pathTo(currentNode);
    }
    currentNode.closed = true;
    const neighbors: GridNode[] = getNeighbors(
      grid,
      currentNode,
      options.diagonal
    );
    const il = neighbors.length;
    for (let i = 0; i < il; ++i) {
      const neighbor = neighbors[i];
      if (neighbor.closed || neighbor.weight === 0) {
        continue;
      }
      const gScore = currentNode.g + neighbor.getCost(currentNode);
      const beenVisited = neighbor.visited;

      if (!beenVisited || gScore < neighbor.g) {
        neighbor.visited = true;
        neighbor.parent = currentNode;
        neighbor.h = neighbor.h || heuristic(neighbor, end);
        neighbor.g = gScore;
        neighbor.score = neighbor.g + neighbor.h;
        if (closest) {
          if (
            neighbor.h < closestNode.h ||
            (neighbor.h === closestNode.h && neighbor.g < closestNode.g)
          ) {
            closestNode = neighbor;
          }
        }

        if (!beenVisited) {
          openHeap.push(neighbor);
        } else {
          openHeap.rescoreElement(neighbor);
        }
      }
    }
  }

  if (closest) {
    return pathTo(closestNode);
  }
  return [];
}

const heuristics = {
  manhattan: function (pos0: Pos2, pos1: Pos2): number {
    const d1 = Math.abs(pos1.x - pos0.x);
    const d2 = Math.abs(pos1.y - pos0.y);
    return d1 + d2;
  },
  diagonal: function (pos0: Pos2, pos1: Pos2): number {
    const D = 1;
    const D2 = Math.sqrt(2);
    const d1 = Math.abs(pos1.x - pos0.x);
    const d2 = Math.abs(pos1.y - pos0.y);
    return D * (d1 + d2) + (D2 - 2 * D) * Math.min(d1, d2);
  },
};

function getNode<T extends Pos2>(
  grid: T[],
  x: number,
  y: number
): T | undefined {
  return grid.find((f) => f.x === x && f.y === y);
}

function getNeighbors<T extends Pos2>(
  nodes: T[],
  { x, y }: T,
  diagonal?: boolean
): T[] {
  const directions = [
    getNode(nodes, x - 1, y),
    getNode(nodes, x + 1, y),
    getNode(nodes, x, y - 1),
    getNode(nodes, x, y + 1),
  ].filter((f) => !!f) as T[];
  if (!diagonal) {
    return directions;
  }
  const diagonals = [
    getNode(nodes, x - 1, y - 1),
    getNode(nodes, x + 1, y - 1),
    getNode(nodes, x - 1, y + 1),
    getNode(nodes, x + 1, y + 1),
  ].filter((f) => !!f) as T[];
  return [...directions, ...diagonals];
}
