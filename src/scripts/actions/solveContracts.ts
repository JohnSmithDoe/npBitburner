import {NPProcess} from 'scripts/model/npProcess';
import {scanNetwork} from 'scripts/utils/npCheapUtils';
import {CNPServicePortGame, CNPServicePortPlayer} from 'scripts/utils/npConsts';
import {NS} from '../../@types/NetscriptDefinitions';
import {INPBaseContract} from '../../@types/npTypes';

/**
 * Cost should be:
 * 10GB ns.codingcontract.attempt
 * 5GB  ns.codingcontract.getData
 * 5GB  ns.codingcontract.getContractType
 * .2GB ns.ls
 * from cheap utils
 * .2GB ns.scan
 *
 */

type TDirection = 'left' | 'right' | 'up' | 'down';

/**
 * Create a buy/sell matrix and accumulate all the profit that can be made with x time trades.
 * Running mulitiple times over the transactions and pushing the max onward until we reach the end with the
 * expected result
 * @see https://gist.github.com/OrangeDrangon/8a08d2d7d425fddd2558e1c0c5fae78b
 */
function solveAlgorithmicStockTrader(trades: number, values: number[]) {
  let i, j, k;
  let matrix = new Array(trades);
  for (let i = 0; i < matrix.length; i++) {
    matrix[i] = new Array(values.length + 1).fill(0);
  }
  for (i = 0; i < trades; i++) {
    for (j = 0; j < values.length; j++) { // Buy / Start
      for (k = j; k < values.length; k++) { // Sell / End
        if (i > 0 && j > 0 && k > 0) {
          matrix[i][k] = Math.max(matrix[i][k], matrix[i - 1][k], matrix[i][k - 1], matrix[i - 1][j - 1] + values[k] - values[j]);
        } else if (i > 0 && j > 0) {
          matrix[i][k] = Math.max(matrix[i][k], matrix[i - 1][k], matrix[i - 1][j - 1] + values[k] - values[j]);
        } else if (i > 0 && k > 0) {
          matrix[i][k] = Math.max(matrix[i][k], matrix[i - 1][k], matrix[i][k - 1], values[k] - values[j]);
        } else if (j > 0 && k > 0) {
          matrix[i][k] = Math.max(matrix[i][k], matrix[i][k - 1], values[k] - values[j]);
        } else {
          matrix[i][k] = Math.max(matrix[i][k], values[k] - values[j]);
        }
      }
    }
  }
  return matrix[trades - 1][values.length - 1];
}

/**
 * Description: You are given the following array of stock prices (which are numbers) where the i-th element represents the stock price on day i:
 * 159,51,136,194,181,141,106,176,135,185,121,32
 * Determine the maximum possible profit you can earn using at most one transaction (i.e. you can only buy and sell the stock once).
 * If no profit can be made then the answer should be 0. Note that you have to buy the stock before you can sell it
 *
 * Type: Algorithmic Stock Trader I               *
 * Data: [159,51,136,194,181,141,106,176,135,185,121,32]
 */
function solveAlgorithmicStockTraderI(data: number[]) {
  return solveAlgorithmicStockTrader(1, data);
}

/**
 * Description: You are given the following array of stock prices (which are numbers) where the i-th element represents the stock price on day i:
 * Determine the maximum possible profit you can earn using as many transactions as you'd like. A transaction is defined as buying and then selling one share of the stock. Note that you cannot engage in multiple transactions at once. In other words, you must sell the stock before you buy it again.
 * If no profit can be made, then the answer should be 0

 * Type: Algorithmic Stock Trader II              *
 * Data: [61,143,174,82,188,47,27,121,59,146,138,137,99,43,165,25,86,143,175,158,176,98,169,18,49,25,164,191,170,169,181,188,192,61,6,70,81,58,198,35,103,35,125,65,18,162,130]
 */
function solveAlgorithmicStockTraderII(data: number[]) {
  return solveAlgorithmicStockTrader(Math.ceil(data.length / 2), data);
}

/**
 * Description: You are given the following array of stock prices (which are numbers) where the i-th element represents the stock price on day i:
 * Determine the maximum possible profit you can earn using at most two transactions. A transaction is defined as buying and then selling one share of the stock. Note that you cannot engage in multiple transactions at once. In other words, you must sell the stock before you buy it again.
 * If no profit can be made, then the answer should be 0
 *
 * Type: Algorithmic Stock Trader III             *
 * Data: [60,166,73,160,126,59,170,140,74,189,105,84,8,179,83,85,120,94,10,19,54,80,85,108,13,99,185]           *
 */
function solveAlgorithmicStockTraderIII(data: number[]) {
  return solveAlgorithmicStockTrader(2, data);
}

/**
 * Description: You are given the following array with two elements:
 * The first element is an integer k. The second element is an array of stock prices (which are numbers) where the i-th element represents the stock price on day i.
 * Determine the maximum possible profit you can earn using at most k transactions. A transaction is defined as buying and then selling one share of the stock. Note that you cannot engage in multiple transactions at once. In other words, you must sell the stock before you can buy it again.
 * If no profit can be made, then the answer should be 0.
 *
 * Type: Algorithmic Stock Trader IV              *
 * Data: [4,[1,145,100,147,3,122,70,180,48,15,113,158,80,84,68,13,96,186,54,147,197,123,158,76,24,123,192,93,137,119,192,146,122,29,94,115,80,128,25,133,104,111,147,154,28,47,73,39,2,30]]
 */
function solveAlgorithmicStockTraderIV(data: [number, number[]]) {
  return solveAlgorithmicStockTrader(data[0], data[1]);
}


/**
 * Description: Each element in the array represents your MAXIMUM jump length at that position.
 * This means that if you are at position i and your maximum jump length is n,
 * you can jump to any position from i to i+n.
 * Assuming you are initially positioned at the start of the array,
 * determine whether you are able to reach the last index.
 * Your answer should be submitted as 1 or 0, representing true and false respectively
 * 0,0,9,0,10,5,9,2,0,0,1,0,0,5,8,7 => 0
 * TODO: this is not working does it???
 */
function solveArrayJumpingGame(data: number[]) {
  if (!data.length) return 0;
  if (data[0] === 0) return 0;
  if (data[0] >= data.length) return 1;
  return solveArrayJumpingGame(data.slice(data[0]));
}

// export function solveJump(ns, data) {
//   // ns.tprint(JSON.stringify(data))
//   for(let i=data[0]-1;i>-1;i--) {
//     if (i+1 >= data.length) return true;
//
//     return solveJump(data.slice(i+1))
//   }
//
//   return false;
// }
/**
 * Description: You are in a grid with 3 rows and 13 columns,
 * and you are positioned in the top-left corner of that grid.
 * You are trying to reach the bottom-right corner of the grid,
 * but you can only move down or right on each step.
 * Determine how many unique paths there are from start to finish.
 *
 *  NOTE: The data returned for this contract is an array with the number of rows and columns:
 *  [3, 13]
 *
 * Type: Unique Paths in a Grid I                 *
 * Data: [3,13]
 */
function solveUniquePathsInAGridI(rows: number, cols: number) {
  if ((rows <= 1) || (cols <= 1)) return 1;
  return solveUniquePathsInAGridI(rows - 1, cols) + solveUniquePathsInAGridI(rows, cols - 1);
}

/**
 * Description: You are located in the top-left corner of the following grid:
 *
 * 0,0,0,0,1,0,0,0,0,
 * 0,0,0,1,0,0,0,0,0,
 * 0,0,0,0,0,1,0,0,0,
 * 0,1,0,0,0,0,1,0,0,
 * 0,0,0,0,0,0,0,0,0,
 * 0,1,0,0,0,0,0,0,0,
 * 0,1,0,0,0,0,0,0,1,
 * 0,0,0,1,0,0,1,1,0,
 * 0,0,0,0,1,0,0,0,0,
 * 0,0,0,1,0,0,1,0,0,
 * 0,0,0,0,0,0,1,0,1,
 * 0,0,0,0,0,0,0,0,0,
 *
 *  You are trying reach the bottom-right corner of the grid, but you can only move down or right on each step.
 *  Furthermore, there are obstacles on the grid that you cannot move onto.
 *  These obstacles are denoted by '1', while empty spaces are denoted by 0.
 *
 *  Determine how many unique paths there are from start to finish.
 *  NOTE: The data returned for this contract is an 2D array of numbers representing the grid.
 *
 * Type: Unique Paths in a Grid II                *
 * Data: [[0,0,0,0,1,0,0,0,0],[0,0,0,1,0,0,0,0,0],[0,0,0,0,0,1,0,0,0],
 * [0,1,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,0,0],[0,1,0,0,0,0,0,0,0],[0,1,0,0,0,0,0,0,1],
 * [0,0,0,1,0,0,1,1,0],[0,0,0,0,1,0,0,0,0],[0,0,0,1,0,0,1,0,0],[0,0,0,0,0,0,1,0,1],[0,0,0,0,0,0,0,0,0]]
 */
function solveUniquePathsInAGridII(grid: number[][], row: number, col: number) {
  if (row >= grid.length) return 0;
  if (col >= grid[0].length) return 0;
  if (grid[row][col] === 1) return 0;
  if ((row === (grid.length - 1)) && (col === (grid[0].length - 1))) return 1;
  return solveUniquePathsInAGridII(grid, row + 1, col) + solveUniquePathsInAGridII(grid, row, col + 1);
}

/**
 *  Description: It is possible write four as a sum in exactly four different ways:
 *
 *  3 + 1
 *  2 + 2
 *  2 + 1 + 1
 *  1 + 1 + 1 + 1
 *
 *  How many different ways can the number 46 be written as a sum of at least two positive integers?
 *
 * Type: Total Ways to Sum                        *
 * Data: 46
 * @see https://www.geeksforgeeks.org/ways-to-write-n-as-sum-of-two-or-more-positive-integers/
 */
function solveTotalWaysToSum(value: number) {
  // table[i] will be storing the number of solutions for value i.
  // We need n+1 rows as the table is constructed in bottom up manner using the base case (n = 0)
  let table = new Array(value + 1);
  // Initialize all table values as 0
  for (let i = 0; i < value + 1; i++) {table[i] = 0;}
  // Base case (If given value is 0)
  table[0] = 1;
  // Pick all integer one by one and update the table[] values after the index greater than or equal to n
  for (let i = 1; i < value; i++)
    for (let j = i; j <= value; j++)
      table[j] += table[j - i];
  return table[value];
}

/**
 * Description: A prime factor is a factor that is a prime number.
 * What is the largest prime factor of 234667072?
 * Type: Find Largest Prime Factor
 * Data: 234667072
 */
function solveLargestPrimeFactor(value: number) {
  let div = 2;
  let result = 0;
  while (value !== 0) {
    if ((value % div) !== 0)
      div = div + 1;
    else {
      result = value;
      value = value / div;
      if (value == 1) {
        break;
      }
    }
  }
  return result;
}

/**
 * Description: Given the following array of array of numbers representing a list of intervals,
 * merge all overlapping intervals.
 *
 *  [[18,25],[21,31],[1,5],[7,9],[7,17],[6,11],[12,18],[22,25],[6,11],[1,9],[18,19],[17,26],[7,15],[24,28],[9,17],[9,12]]
 *
 *  Example:
 *  [[1, 3], [8, 10], [2, 6], [10, 16]]
 *  would merge into [[1, 6], [8, 16]].
 *
 * The intervals must be returned in ASCENDING order.
 * You can assume that in an interval, the first number will always be smaller than the second.
 *
 * Type: Merge Overlapping Intervals
 *
 * Data: [[18,25],[21,31],[1,5],[7,9],[7,17],[6,11],[12,18],[22,25],[6,11],[1,9],[18,19],[17,26],[7,15],[24,28],[9,17],[9,12]]
 */
function solveMergeOverlappingIntervals(data: number[][]) {
  function solve(values: number[][]) {
    const result: number[][] = [];
    for (let i = 0; i < values.length; i++) {
      const current = values[i];
      let merged = false;
      for (let j = 0; j < values.length; j++) {
        const next = values[j];
        if (i === j) continue;
        if (
          (current[0] >= next[0]) && (current[0] <= next[1]) ||
          (current[1] >= next[0]) && (current[1] <= next[1])
        ) {
          const newInterval = [Math.min(current[0], next[0]), Math.max(current[1], next[1])];
          result.push(newInterval);
          merged = true;
          break;
        }
      }
      if (!merged) result.push(current);
    }
    let noDup: number[][] = [];
    result.forEach((value, index) => {
      let count = 0;
      noDup.forEach(item => {
        if ((item[0] === value[0]) && (item[1] === value[1])) count++;
      });
      if (count === 0) noDup.push(value);
    });
    return noDup.sort((a, b) => a[0] - b[0]);
  }

  let r = solve(data);
  let last = 0;
  while (r.length !== last) {
    last = r.length;
    r = solve(r);
  }
  return r;
}

/**
 * Description: Given the following array of arrays of numbers representing a 2D matrix, return the elements of the matrix as an array in spiral order:
 *
 * [
 * [43,23,22, 2,50,12,27,14,29,42,24]
 * [37,24,42,42, 4,24, 2,38,50,42,17]
 * [39,41,20,45,21,45,47,21,43, 3,18]
 * [36,45,27,32,27,17,31, 7,43,19,45]
 * [ 8,48,25,33,11,48,35,19,21,37,50]
 * [47,16,46,38,35,14,12,42,30,41,43]
 * ]
 *
 * Here is an example of what spiral order should be:
 *
 *  [
 *  [1, 2, 3]
 *  [4, 5, 6]
 *  [7, 8, 9]
 *  ]
 *
 *  Answer: [1, 2, 3, 6, 9, 8 ,7, 4, 5]
 *
 *  Note that the matrix will not always be square:
 *
 *  [
 *  [1,2,3,4]
 *  [5,6,7,8]
 *  [9,10,11,12]
 *  ]
 *
 *  Answer: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
 *
 * Type: Spiralize Matrix                         *
 *
 * Data: [[43,23,22,2,50,12,27,14,29,42,24],[37,24,42,42,4,24,2,38,50,42,17],[39,41,20,45,21,45,47,21,43,3,18],[36,45,27,32,27,17,31,7,43,19,45],[8,48,25,33,11,48,35,19,21,37,50],[47,16,46,38,35,14,12,42,30,41,43]]
 * Probably not the fastes way - recursion??!
 */
function solveSpiralizedMatrix(data: string[][]): string[] {
  const result: string[] = [];
  let dir: TDirection = 'right';
  let endY = data.length - 1;
  let endX = data[0].length - 1;
  let startX = 0;
  let startY = 0;
  let x = 0;
  let y = 0;

  for (let i = 0; i < (data.length * data[0].length); i++) {
    result.push(data[y][x]);
    switch (dir) {
      case 'right':
        if (x >= endX) {
          startY++;
          dir = 'down';
          y++;
        } else { x++; }
        break;
      case 'left':
        if (x <= startX) {
          endY--;
          dir = 'up';
          y--;
        } else { x--; }
        break;
      case 'down':
        if (y >= endY) {
          endX--;
          dir = 'left';
          x--;
        } else { y++; }
        break;
      case 'up':
        if (y <= startY) {
          startX++;
          dir = 'right';
          x++;
        } else { y--; }
        break;
    }

  }
  return result;
}

/**
 * Description: Given the following string containing only digits, return an array with all possible valid IP address combinations
 * that can be created from the string:178109151229
 * Note that an octet cannot begin with a '0' unless the number itself is actually 0. For example, '192.168.010.1' is not a valid IP.
 *
 * Examples:
 * 25525511135 -> [255.255.11.135, 255.255.111.35]
 * 1938718066 -> [193.87.180.66]
 *
 * Type: Generate IP Addresses                    *
 * Data: 178109151229
 */
function solveIPAddress(data: string) {
  const regEx = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/;
  const result: string[] = [];
  for (let i = 1; i <= 3; i++) {
    const part = data.substring(0, i);
    for (let j = i + 1; j <= i + 3; j++) {
      const part2 = data.substring(i, j);
      for (let k = j + 1; k <= j + 3; k++) {
        const part3 = data.substring(j, k);
        for (let l = k + 1; l <= k + 3; l++) {
          const part4 = data.substring(k, l);
          const ip = part + '.' + part2 + '.' + part3 + '.' + part4;
          if (ip.length === data.length + 3 && regEx.test(ip) && result.indexOf(ip) < 0) result.push(ip);
        }
      }
    }
  }
  return result.join(',');
}

/**
 * Description: Given a triangle, find the minimum path sum from top to bottom.
 * In each step of the path, you may only move to adjacent numbers in the row below.
 * The triangle is represented as a 2D array of numbers:
 *
 *  [
 * [6],
 * [6,1],
 * [4,4,1],
 * [4,6,3,3],
 * [4,4,7,3,6]
 * ]
 *
 *  Example: If you are given the following triangle:
 *
 * [
 *  [2],
 *  [3,4],
 *  [6,5,7],
 *  [4,1,8,3]
 *  ]
 *
 *  The minimum path sum is 11 (2 -> 3 -> 5 -> 1).
 *
 * Type: Minimum Path Sum in a Triangle           *
 * Data: [[6],[6,1],[4,4,1],[4,6,3,3],[4,4,7,3,6]]
 */
function solveMinimumPathSumTriangle(data: number[][], row: number, col: number): number {
  if (row === (data.length - 1)) return data[row][col];
  const result = data[row][col];
  let left = solveMinimumPathSumTriangle(data, row + 1, col + 1);
  let right = solveMinimumPathSumTriangle(data, row + 1, col);
  return Math.min(result + left, result + right);
}

type TNPEvalNode = { factor: string, sign: string, children: TNPEvalNode[] }

/**
 * Description: You are given the following string which contains only digits between 0 and 9: 482220535780
 * You are also given a target number of 20.
 * Return all possible ways you can add the +, -, and * operators to the string such that it evaluates to the target number.
 * The provided answer should be an array of strings containing the valid expressions.
 * The data provided by this problem is an array with two elements.
 * The first element is the string of digits, while the second element is the target number: ["482220535780", 20]
 *
 * NOTE: Numbers in the expression cannot have leading 0's. In other words, "1+01" is not a valid expression Examples:
 *
 * Input: digits = "123", target = 6
 * Output: [1+2+3, 1*2*3]
 * Input: digits = "105", target = 5
 * Output: [1*0+5, 10-5]
 *
 * Type: Find All Valid Math Expressions          *
 * Data: ["482220535780",20]
 *
 * This works but takes waaaaaaaaay too long...
 *
 */
function solveFindAllValidMathExpressions(data: [string, number]) {
  const values = data[0].split('');
  const expectedResult = data[1];
  const numbers: string[][] = [];
  let count = Math.pow(2, data.length);
  if (count > .25e6) return undefined; // This just takes toooooo long
  for (let i = 0; i < values.length; i++)
    numbers.push([]);
  for (let i = 1; i < values.length + 1; i++)
    for (let j = 0; j <= values.length - i; j++)
      numbers[j].push(values.slice(j, j + i).join(''));

  //iterate all possible starts
  function toFactorials(current: string[], possibles: string[], candidates: string[][]) {
    if (!possibles) return current ? [current] : [];
    let result: string[][] = [];
    for (let j = 0; j < possibles.length; j++) {
      const part = possibles[j];
      const newTerm = [...current, part];
      const nextPossibleIdx = newTerm.join('').length;
      result.push(newTerm);
      if (candidates[nextPossibleIdx]) {
        result.push(...toFactorials(newTerm, candidates[nextPossibleIdx], candidates));
      }
    }
    return result;
  }

  const allCombinations: string[][] = [];
  for (let i = 0; i < numbers[0].length; i++) {
    const start = numbers[0][i];
    const next = start.length;
    const possibles = numbers[next];
    toFactorials([start], possibles, numbers)
      .filter(data => data.join('').length === values.length)
      .forEach(data => allCombinations.push(data))
    ;
  }

  function toEvalTree(factors) {
    if (!factors.length) return [];
    const factor = factors[0];
    let terms;
    if (factors.length > 1) {
      terms = ['+', '-', '*'].map(sign => { return {factor, sign, children: toEvalTree(factors.slice(1))};});
    } else {
      terms = [{factor, sign: '', children: []}];
    }
    return terms;
  }

  function toEvalString(node: TNPEvalNode) {
    let value = node.factor + node.sign;
    const result: string[] = [];
    for (const child of node.children) {
      const childTerms = toEvalString(child);
      for (const childTerm of childTerms)
        result.push(value + childTerm);
    }
    if (!result.length) result.push(node.factor);

    return result;

  }


  const allTerms: string[] = [];
  for (let i = 0; i < allCombinations.length; i++) {
    const evalTrees = toEvalTree(allCombinations[i]);
    for (const tree of evalTrees) {
      const all = toEvalString(tree);
      for (let one of all) {
        allTerms.push(one);
      }
    }
  }

  return allTerms
    .filter(term => !(/.*([+*\-]0[0-9]).*/).test(term))
    .filter(term => eval(term) === expectedResult);

}

/**
 * Description: Given the following integer array,
 * find the contiguous subarray (containing at least one number)
 * which has the largest sum and return that sum.
 * 'Sum' refers to the sum of all the numbers in the subarray.
 *
 * Type: Subarray with Maximum Sum                *
 * Data: [5,-2,9,-7,-6,8,-7,-10,2,-7,-7,8,1,-8,-6,-7,0,-8,-6,9,-10,6,-5,5,-6,2,-3,4,-4,9,1]
 */
function solveSubarrayWithMaximumSum(data: number[]) {
  let max = 0;
  for (let i = 1; i < data.length + 1; i++) {
    for (let j = 0; j <= data.length - i; j++) {
      let sub = data.slice(j, j + i);
      max = Math.max(max, sub.reduce((prev, curr) => prev + curr, 0));
    }
  }
  return max;
}

/**
 * Description: Given the following string:
 * (a)a(())()((
 * remove the minimum number of invalid parentheses in order to validate the string.
 * If there are multiple minimal ways to validate the string, provide all of the possible results.
 * The answer should be provided as an array of strings.
 * If it is impossible to validate the string the result should be an array with only an empty string.
 *
 * IMPORTANT: The string may contain letters, not just parentheses. Examples:
 * "()())()" -> [()()(), (())()]
 * "(a)())()" -> [(a)()(), (a())()]
 * ")( -> [""]
 *
 * Type: Sanitize Parentheses in Expression       *
 * Data: (a)a(())()((
 * Data: )()))(a()()a(()()
 * TODO: check this only removes outer stuff and then trys to remove one parentheses and checks again....
 */
function solveSanatizeParenthesesInExpression(data: string) {
  function wellFormed(txt: string) {
    let openCnt = 0;
    for (let i = 0; i < txt.length; i++) {
      const char = txt[i];
      if (char === '(') openCnt++;
      if (char === ')') openCnt--;
      if (openCnt < 0) break;
    }
    return openCnt === 0;
  }

  function sanatizeOuter(txt: string) {
    let front = '', result = '';
    for (let i = 0; i < txt.length; i++) {
      const char = txt[i];
      if (char !== ')') front += char;
      if (char === '(') {
        front += txt.substring(i);
        break;
      }
    }
    for (let i = front.length - 1; i > 0; i--) {
      const char = front[i];
      if (char !== '(') result = char + result;
      if (char === ')') {
        result = front.substring(0, i - 1) + result;
        break;
      }
    }
    return result;
  }

  let result: string[] = [];
  let isValid = wellFormed(data);
  if (isValid) return [data];
  data = sanatizeOuter(data);
  if (isValid) return [data];
  // remove one and check if that works
  for (let i = 0; i < data.length; i++) {
    isValid = false;
    if (data[i] === '(' || data[i] === ')') {
      const without = data.substring(0, i) + data.substring(i + 1);
      isValid = wellFormed(without);
      if (isValid) {
        result.push(without);
      }
    }
  }
  if (!result.length) {
    return undefined; // cannt solve yet... TODO
  }

  const noDups: string[] = []; // get rid of duplicates
  result.forEach(data => noDups.indexOf(data) < 0 ? noDups.push(data) : false);
  return noDups;
}

function solveContract(service: NPProcess, contract: INPBaseContract) {
  let answer;
  const {ns, log, args} = service;
  log.info('Solving ', contract.type, ' on ', contract.host);
  log.debug(contract.data);
  switch (contract.type) {
    case 'Spiralize Matrix':
      answer = solveSpiralizedMatrix(contract.data);
      break;
    case 'Unique Paths in a Grid I':
      answer = solveUniquePathsInAGridI(contract.data[0], contract.data[1]);
      break;
    case 'Unique Paths in a Grid II':
      answer = solveUniquePathsInAGridII(contract.data, 0, 0);
      break;
    case 'Find Largest Prime Factor':
      answer = solveLargestPrimeFactor(contract.data);
      break;
    case 'Total Ways to Sum':
      answer = solveTotalWaysToSum(contract.data);
      break;
    case 'Generate IP Addresses':
      answer = solveIPAddress(contract.data);
      break;
    case 'Merge Overlapping Intervals':
      answer = solveMergeOverlappingIntervals(contract.data);
      break;
    case 'Minimum Path Sum in a Triangle':
      answer = solveMinimumPathSumTriangle(contract.data, 0, 0);
      break;
    case 'Algorithmic Stock Trader I':
      answer = solveAlgorithmicStockTraderI(contract.data);
      break;
    case 'Algorithmic Stock Trader II':
      answer = solveAlgorithmicStockTraderII(contract.data);
      break;
    case 'Algorithmic Stock Trader III':
      answer = solveAlgorithmicStockTraderIII(contract.data);
      break;
    case 'Algorithmic Stock Trader IV':
      answer = solveAlgorithmicStockTraderIV(contract.data);
      break;
    case 'Subarray with Maximum Sum':
      answer = solveSubarrayWithMaximumSum(contract.data);
      break;
    case 'Sanitize Parentheses in Expression':
      answer = solveSanatizeParenthesesInExpression(contract.data);
      break;
    case 'Array Jumping Game':
      answer = solveArrayJumpingGame(contract.data);
      break;
    case 'Find All Valid Math Expressions':
      answer = solveFindAllValidMathExpressions(contract.data);
      break;
    default:
      log.fail('Cant Solve: ', contract.host, ' - ', contract.type);
      return;
  }
  log.debug('Answer: ', answer);
  if (answer && !args.hasArgument('debug')) {
    const reward: string = ns.codingcontract.attempt(answer, contract.filename, contract.host, {returnReward: true}) as string;
    if (!reward.length) {
      log.toast('ERROR', 'Solved it wrong: ', contract.type);
    } else {
      log.toast('SUCCESS', 'Solved and got reward: ', reward);
    }
  }
}

async function getContractsList(ns: NS) {
  const contracts: { host: string, filename: string, type: string, data: any }[] = [];
  await scanNetwork(ns, async (host, path) => {
    let systemContracts = ns.ls(host, '.cct');
    for (const contract of systemContracts) {
      contracts.push(
        {
          host,
          filename: contract,
          type:     ns.codingcontract.getContractType(contract, host),
          data:     ns.codingcontract.getData(contract, host),
        });
    }
  });
  return contracts;
}

/**
 * Solve all open contracts
 */
export async function main(ns: NS) {
  const service = new NPProcess(
    ns, 'Contracts-Solver',
    [{name: 'debug', comment: 'Show result but do not solve.'}],
    {feedbackPort: CNPServicePortGame}
  );
  await service.run(async () => {
    const contracts = await getContractsList(ns);
    if (contracts.length) {
      service.log.warn('Found new Contracts (', contracts.length, ')');
      for (const contract of contracts) {
        solveContract(service, contract);
      }
    }
  });
}
