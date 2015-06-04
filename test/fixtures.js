/* @flow */



// Stores

export var storeCounter = {
  initial(): number {return 0},
  reducers: {
    add(cur: number, x: number): number {return cur + x},
    subtract(cur: number, x: number): number {return cur - x}
  }
}

export var storeCounter2 = {
  initial(): number {return 0},
  reducers: {
    add(cur: number, x: number): number {return cur - x},
    multiply(cur: number, x: number): number {return cur * x}
  }
}
