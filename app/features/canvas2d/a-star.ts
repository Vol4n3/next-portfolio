class GridNode {
  parent: GridNode | null = null;
  f: number = 0;
  g: number = 0;
  h: number = 0;
  visited: boolean = false;
  closed: boolean = false;

  constructor(public x: number, public y: number, public weight: number) {}

  getCost(fromNeighbor: GridNode) {
    // Take diagonal weight into consideration.
    if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
      return this.weight * 1.41421;
    }
    return this.weight;
  }

  isWall() {
    return this.weight === 0;
  }
}

type GridPosition = {
  x: number;
  y: number;
  height?: number;
};

function pathTo(node: GridNode) {
  let curr = node;
  const path = [];
  while (curr.parent) {
    path.unshift(curr);
    curr = curr.parent;
  }
  return path;
}

function getHeap() {
  return new BinaryHeap(function (node) {
    return node.f;
  });
}

class BinaryHeap {
  content: GridNode[] = [];

  constructor(private scoreFunction: (node: GridNode) => number) {}

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
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
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
    const elemScore = this.scoreFunction(element);

    while (true) {
      const child2N = (n + 1) << 1;
      const child1N = child2N - 1;

      let swap = null;
      let child1Score;

      if (child1N < length) {
        const child1 = this.content[child1N];
        child1Score = this.scoreFunction(child1);

        if (child1Score < elemScore) {
          swap = child1N;
        }
      }

      if (child2N < length) {
        const child2 = this.content[child2N];
        const child2Score = this.scoreFunction(child2);
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
  grid: GridPosition[],
  from: GridPosition,
  dest: GridPosition,
  options: {
    closest?: boolean;
    heuristic?: (a: GridNode, b: GridNode) => number;
    diagonal?: boolean;
  } = {}
) {
  const graph = new Graph(grid, { diagonal: options.diagonal });
  console.log(graph);
  debugger;
  const heuristic = options.heuristic || heuristics.manhattan;
  const closest = options.closest || false;

  const openHeap = getHeap();
  const start: GridNode = graph.getNode(from.x, from.y);
  const end: GridNode = graph.getNode(dest.x, dest.y);
  let closestNode = start;

  start.h = heuristic(start, end);
  graph.markDirty(start);

  openHeap.push(start);

  while (openHeap.size() > 0) {
    const currentNode = openHeap.pop();
    if (currentNode === end) {
      return pathTo(currentNode);
    }

    currentNode.closed = true;
    const neighbors: GridNode[] = graph.neighbors(currentNode);
    const il = neighbors.length;
    for (let i = 0; i < il; ++i) {
      const neighbor = neighbors[i];

      if (neighbor.closed || neighbor.isWall()) {
        continue;
      }
      const gScore = currentNode.g + neighbor.getCost(currentNode);
      const beenVisited = neighbor.visited;

      if (!beenVisited || gScore < neighbor.g) {
        neighbor.visited = true;
        neighbor.parent = currentNode;
        neighbor.h = neighbor.h || heuristic(neighbor, end);
        neighbor.g = gScore;
        neighbor.f = neighbor.g + neighbor.h;
        graph.markDirty(neighbor);
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

// See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
export const heuristics = {
  manhattan: function (pos0: GridNode, pos1: GridNode) {
    const d1 = Math.abs(pos1.x - pos0.x);
    const d2 = Math.abs(pos1.y - pos0.y);
    return d1 + d2;
  },
  diagonal: function (pos0: GridNode, pos1: GridNode) {
    const D = 1;
    const D2 = Math.sqrt(2);
    const d1 = Math.abs(pos1.x - pos0.x);
    const d2 = Math.abs(pos1.y - pos0.y);
    return D * (d1 + d2) + (D2 - 2 * D) * Math.min(d1, d2);
  },
};
const getPositionInGrid = <T extends GridPosition>(
  x: number,
  y: number,
  grid: T[]
): T | undefined => {
  return grid.find((p) => p.x === x && p.y === y);
};

class Graph {
  public nodes: GridNode[] = [];
  public diagonal: boolean;
  public grid: GridNode[][] = [];
  public dirtyNodes: GridNode[] = [];

  constructor(gridIn: GridPosition[], options: { diagonal?: boolean } = {}) {
    this.diagonal = !!options.diagonal;
    const maxX = Math.max(...gridIn.map((g) => g.x));
    const maxY = Math.max(...gridIn.map((g) => g.y));
    for (let x = 0; x < maxX; x++) {
      this.grid[x] = [];
      for (let y = 0; y < maxY; y++) {
        const find = getPositionInGrid(x, y, gridIn);
        const node = new GridNode(
          x,
          y,
          typeof find?.height === "undefined" ? 0 : find.height
        );
        this.grid[x][y] = node;
        this.nodes.push(node);
      }
    }
  }

  getNode(x: number, y: number): GridNode {
    if (this.grid[x]) {
      return this.grid[x][y] || new GridNode(x, y, 0);
    }
    return new GridNode(x, y, 0);
  }

  markDirty(node: GridNode) {
    this.dirtyNodes.push(node);
  }

  neighbors(node: GridNode) {
    const ret = [];
    const x = node.x;
    const y = node.y;
    const grid = this.grid;

    // West
    if (grid[x - 1] && grid[x - 1][y]) {
      ret.push(grid[x - 1][y]);
    }

    // East
    if (grid[x + 1] && grid[x + 1][y]) {
      ret.push(grid[x + 1][y]);
    }

    // South
    if (grid[x] && grid[x][y - 1]) {
      ret.push(grid[x][y - 1]);
    }

    // North
    if (grid[x] && grid[x][y + 1]) {
      ret.push(grid[x][y + 1]);
    }

    if (this.diagonal) {
      // Southwest
      if (grid[x - 1] && grid[x - 1][y - 1]) {
        ret.push(grid[x - 1][y - 1]);
      }

      // Southeast
      if (grid[x + 1] && grid[x + 1][y - 1]) {
        ret.push(grid[x + 1][y - 1]);
      }

      // Northwest
      if (grid[x - 1] && grid[x - 1][y + 1]) {
        ret.push(grid[x - 1][y + 1]);
      }

      // Northeast
      if (grid[x + 1] && grid[x + 1][y + 1]) {
        ret.push(grid[x + 1][y + 1]);
      }
    }

    return ret;
  }
}
