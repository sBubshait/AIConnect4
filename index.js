/**
 * AIConnect4
 *
 * Connect 4 game against AI (Minimax) using p5.js.
 *
 * @link   https://github.com/sBubshait/AIConnect4
 * @file   This file is the main file which contains almost all the code.
 * @author Saleh Bubshait.
 * @since  1.0.0
 */


// Constants:
const length = 600; // length of the square representing the canvas.
const segment = length / 7; // a segment is one seventh of the length, declared as this will be repeatedly used in this file.
const PLAYERS = {
    "HUMAN": 1, // human player will be playing the red discs, which is reperesnted as 1 in this program.
    "AI": 2 // human player will be playing yellow discs, which is reperesnted as 2 in this program.
};
const AI_DEPTH = 5;

// Variables:
var currentBoard = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

var currentPlayer = PLAYERS.HUMAN; // Change to PLAYERS.AI if you want AI player to go first (will always play in the centre).
var displayedText = `${currentPlayer == PLAYERS.HUMAN ? "Human" : "AI"} Player: Click on any circle one column to insert in that column.`;


/**
 * Setup function for initanting the canvas (p5.js). (use period)
 */
function setup() {
  createCanvas(length, length);
  if (currentPlayer == PLAYERS.AI) {
  var bestMove = Minimax(currentBoard, true, -10000, 10000, 0);
  insertAt(currentBoard, bestMove, PLAYERS.AI);
  displayedText = `Human Player: Click on any circle one column to insert in that column.`;

  }
}

/**
 * Main drawing method for p5.js. Will be only drawing the board on the screen.
 */
function draw() {
  background(220);
  fill(255);
  for (var i=0; i < 7; i++) {
    for (var j=1; j < 7; j++) {
      currentBoard[j-1][i] == PLAYERS.HUMAN ? fill(255,0,0) : (currentBoard[j-1][i] == PLAYERS.AI ? fill(255,255,0) : fill(255)); 
      circle(i * segment + 40, j * segment, 60);
    }
  }
  textSize(16);
  fill(0);
  textAlign(CENTER);
  text(displayedText, 7/2 * segment, 6 * segment + 65);
}

/**
 * Stimulating inserting a disc at the desired column of the board.
 * 
 * @param {Array} board 2D Array representing the board. The size is expected to be 6x7
 * @param {integer} column  index of the column number (expected to be 0-6).
 * @param {integer} player  expected to either be PLAYERS.AI or PLAYERS.HUMAN
 * 
 * @returns {integer} returns the row index if the insertation was successful, otherwise -1.
 */
function insertAt(board, column, player) {
  for (var i=board.length - 1; i >= 0; i--) {
    if (board[i][column] != 0)
      continue;
    board[i][column] = player;
    return i;
  }
  return -1;
}


/**
 * Determines the index of the column in which the mouse is currently hovering over.
 * 
 * @return  {integer}  The column which the mouse hovering over currently, from 0 to 6.
 */
function getHoveredColumn() {
  return Math.floor(mouseX / segment);
}

/**
 * When the mouse is pressed
 */
function mousePressed() {
  
  // if the game has already ended, start a new game.
  if (isGameOver(currentBoard).status) {
    displayedText = `${currentPlayer == PLAYERS.HUMAN ? "Human" : "AI"} Player: Click on any circle one column to insert in that column.`;
    return currentBoard = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];
  }
    // Otherwise it is the human player's turn, so try inserting at the clicked column.
    var tryInsert = insertAt(currentBoard, getHoveredColumn(), PLAYERS.HUMAN);
    // If the insertation was unsuccessful (the column is full), then just ignore the click.
    if (tryInsert == -1)
      return false;
    // Game over will be checked twice here. The first will be after the human player plays and the second is after the AI's. This is because another click would reinitiate the board.
    displayedText = !isGameOver(currentBoard).status ? `${currentPlayer == 1 ? "Human" : "AI"} Player: Click on any circle one column to insert in that column.` : isGameOver(currentBoard).text + ' Click anywhere to start a new game';

    // AI plays
    var bestMove = Minimax(currentBoard, true, -10000, 10000, 0);
    var inserted = insertAt(currentBoard, bestMove, PLAYERS.AI);
    displayedText = !isGameOver(currentBoard).status ? `${currentPlayer == 1 ? "Human" : "AI"} Player: Click on any circle one column to insert in that column.` : isGameOver(currentBoard).text + ' Click anywhere to start a new game';
}

/**
 * Checks if the game is over (either win or tie).
 * Check the status of the game. Returns an object with status (of boolean value). If status is true then the game is over and the object returned includes a key, message, which explains why the game is over and a key, winner, which retuns the winner or 0 if it's a tie.
 * 
 * @param {Array} board the current board to check if the game is over at.
 * 
 * @returns {object}  An object containing a boolean status key, which will be true if the game is over.
 */
function isGameOver(board) {

  // Case 1: Horizontal win
  for (var i=0; i < board.length; i++) {
    var consecutives = 0, player = 0;
    for (var j=0; j < board[i].length; j++) {
        if (board[i][j] == 0) {
          player = 0;
          consecutives = 0;
        }else if (board[i][j] != player) {
          player = board[i][j];
          consecutives = 1;
        }else {
          consecutives += 1;
        }
        if (consecutives >= 4) {
          return {status: true, winner: player, text: `${player == PLAYERS.HUMAN ? "Human" : "AI"} Wins by a horizontal line.`}
        }
    }
  }
// Case 2: Vertical Win
  for (var j=0; j < board[0].length; j++) {
    var consecutives = 0, player = 0;
    for (var i=0; i < board.length; i++) {
      if (board[i][j] == 0) {
        player = 0;
        consecutives = 0;
      }else if (board[i][j] != player) {
        player = board[i][j];
        consecutives = 1;
      }else {
        consecutives += 1;
      }
      if (consecutives >= 4) {
        return {status: true, winner: player, text: `${player == PLAYERS.HUMAN ? "Human" : "AI"} Wins by a vertical line.`}
      }
    }
  }

  // Case 3: Major Diagonal win
  for (var i=0; i <= 6; i++) {
    var majors = [[0, i]];
    if (i < 3 && i != 0)
      majors.push([i,0]);
    for (var major of majors) {
      var consecutives = 0, player = 0;
      while(major[0] <= 5 && major[1] <= 6) {
        if (board[major[0]][major[1]] == 0) {
          player = 0;
          consecutives = 0;
        }else if (board[major[0]][major[1]] != player) {
          player = board[major[0]][major[1]];
          consecutives = 1;
        }else {
          consecutives += 1;
        }
        if (consecutives >= 4) {
          return {status: true, winner: player, text: `${player == PLAYERS.HUMAN ? "Human" : "AI"} Wins by a major diagonal line.`}
        }
        major[0] += 1;
        major[1] += 1;
      }
    }
  }

  // Case 4: Minor Diagonal win
  for (var i=3; i <= 6; i++) {
    var minors = [[0, i]];
    if (i % 3 == 0)
    minors.push([i / 3, 6]);
    for (var minor of minors) {
      var consecutives = 0, player = 0;
      while(minor[0] <= 5 && minor[1] >= 0) {
        if (board[minor[0]][minor[1]] == 0) {
          player = 0;
          consecutives = 0;
        }else if (board[minor[0]][minor[1]] != player) {
          player = board[minor[0]][minor[1]];
          consecutives = 1;
        }else {
          consecutives += 1;
        }
        if (consecutives >= 4) {
          return {status: true, winner: player, text: `${player == PLAYERS.HUMAN ? "Human" : "AI"} Wins by a minor diagonal line.`}
        }
        minor[0] += 1;
        minor[1] -= 1;
      }
    }
  }
  
  if(isFull(board)) // If no spaces are available and no winner, then the game is a tie.
    return {status: true, text: "Tie!"};
  return {status: false} // Game in progress.
}


/**
 * Minimax method to find the best move for the AI player to play in a given Connect4 board, board.
 * A recusrive method used to find the best move for the AI player by evaluting all possible moves in the current board within AI_DEPTH steps/depth, taking into account the steps needed to reach the 'game-over' state. Without maximising, basic Minimax calculations may take very long time (hours), so Alpha–beta pruning and depth were used.
 * 
 * @param {Array} board 2D array of integers representing the board (expected to be of size 6x7)
 * @param {boolean} isMaxPlayer is it the AI player's (the one we want to maximise or find the best move for) turn? This is for recursive calls only (Should be passed as true).
 * @param {integer} alpha the max score of the maximising player. Should be passed as a small value (<100)
 * @param {integer} beta  the min score of the minimsing player. Should be passed as a big value (>100)
 * @param {integer} steps the steps taken so far. This is for recursive calls only (Should be passed as 0).
 * @returns {integer} returns the square represnting the best move. (In recursive calls, it will return evaluation/score for each possible play)
 */

function Minimax(board, isMaxPlayer, alpha, beta, steps) {
  // Base cases:
  // If the board is empty (i.e. the AI player is to start the game) then return the middle column (going in the centre maximises the probability of winning)
  if (isEmpty(board)) {
    return 3;
  }

  // If the game is over at the current board, then evaluate it from the AI player's perspective. If AI wins, then its +100, if it loses, then its -100, and if it is a tie then its a 0 (neutral), taking into account the steps needed.
  var isGameOverObj = isGameOver(board);
  if (isGameOverObj.status)
    return isGameOverObj.winner == PLAYERS.AI ? 100 - steps : (isGameOverObj.winner == PLAYERS.HUMAN ? steps-100 : 0);

  // if this is the 5th step, then that is already too much calculations, so just evaluate the current position (is AI at better position at this step?). LOOK scorePosition function for details.
  if (steps == AI_DEPTH)
    return scorePosition(board, PLAYERS.AI);

  if (isMaxPlayer) { // if AI turn
      var maxScore = -1000; // negative (that is < -100) so there will be always a bestMove
      var bestMove;
      // evaluating each possibility of dropping the disc in every column 
      for (var column=0; column < 7; column++) {
          var inserted = insertAt(board, column, PLAYERS.AI)
          if (inserted == -1)
            continue;
          var eval = Minimax(board, false, alpha, beta, steps+1);
          if (eval > maxScore) { // if this move would yield a higher score than best so far, then it is the best move so far.
              maxScore = eval;
              bestMove = column;
          }
          board[inserted][column] = 0;
          alpha = max(alpha, eval); // Beause it is the maximising player, alpha would be the max. This will be passed higher in the tree.
          if (alpha >= beta) // This means that this is already a better position for the maximising player, so no need to consider other positions.
            break;
          // Notice this is a fail-soft implementation.
      }
      
      // if it is the main calls, then return the best move, otherwise return the maxScore to be used in parent nodes.
      if (steps == 0)    
          return bestMove;
      
      return maxScore;

  }else { // if it is the human turn

      var minScore = 1000; // positive (& greater than 100), so there will always be a best move for the human player.
      for (var column=0; column < 7; column++) {
        var inserted = insertAt(board, column, PLAYERS.HUMAN)
        if (inserted == -1)
          continue;
        var eval = Minimax(board, true, alpha, beta, steps+1);
        minScore = min(eval, minScore); 
        board[inserted][column] = 0;
        beta = min(beta, eval);
        if (beta <= alpha) // if beta is already less than alpha in this position, then this is definitely better position, so need to calculate any other position.
          break;
    }
      // return the minimum score to be used in parent nodes. No need to check if its the first step (i.e. steps == 0) since it will never be.
      return minScore;
  }

}

/**
 * Evaluates the current position of the board for a given player. 
 * This function gives a score of the position for the given player by considering all four-in-a-row combinations (horizontally, vertically, and diagonally). The evaluation of each combination is done by the function scoreQuad.
 * 
 * @param {Array} board the current board (2D array of size 6x7).
 * @param {integer} player  the player to evaluate the board from their perspective. Should only be PLAYERS.AI or PLAYERS.HUMAN.
 * 
 * @returns {integer}  Score of the current position for the player.
 */
function scorePosition(board, player) {
  var score = 0;
  // Scoring Horizontally:
  for (var i=0; i < board.length; i++) {
    for (var j=0; j < board[i].length - 3; j++) {
       score += scoreQuad([board[i][j], board[i][j + 1], board[i][j + 2], board[i][j + 3]], player)
    }
  }

  // Scoring vertically:
  for (var j=0; j < board[0].length; j++) {
    for (var i=0; i < board.length - 3; i++) {
       score += j == 3 ? 3 * scoreQuad([board[i][j], board[i + 1][j], board[i + 2][j], board[i + 3][j]], player) : scoreQuad([board[i][j], board[i + 1][j], board[i + 2][j], board[i + 3][j]], player);
    }
  }
  // Scoring diagonally (major diagonal):
  for (var i=0; i < board.length - 3; i++) {
    for (var j=0; j < board[i].length - 3; j++) {
       score += scoreQuad([board[i][j], board[i + 1][j + 1], board[i + 2][j + 2], board[i + 3][j + 3]], player)
    }
  }

  // Scoring diagonally (major diagonal):
  for (var i=0; i < board.length - 3; i++) {
    for (var j=3; j < board[i].length; j++) {
       score += scoreQuad([board[i][j], board[i + 1][j - 1], board[i + 2][j - 2], board[i + 3][j - 3]], player)
    }
  }

  return score;
}

/**
 * Evaluates one combination of four-in-a-row.
 * 
 * @param {Array} array 1D array representing four discs in a row.
 * @param {integer} player  the player to evaluate the board from their perspective. Should only be PLAYERS.AI or PLAYERS.HUMAN.
 * 
 * @returns {integer}  Score of the current position for the player.
 */
function scoreQuad(array, player) {
  var maximising = array.filter(a => a == player).length;
  var zeros = array.filter(a => a == 0).length;
  var minimising = 4 - maximising - zeros;
 
  if (maximising == 3 && zeros == 1) // This is good as it means maximising has better chances of winning probably at next moves.
    return 6;
  else if (maximising == 2 && zeros == 2)
    return 3;
  else if (minimising == 3 && zeros == 1) // Not very good as it means maximising will either lose for the minimising or block this.
    return -2;
  else
    return 0;
}

/**
 * Checks if the board is empty.
 * @param {*} board 2D array of integers of size 6x7.
 * @returns {boolean} whether the board is completely empty or not.
 */
function isEmpty(board) {
  for (var row of board) {
    for (var slot of row) {
    if (slot != 0)
      return false;
    }
  }
  return true;
}

/**
 * Checks if the board is full.
 * @param {*} board 2D array of integers of size 6x7.
 * @returns {boolean} whether the board is completely full or not.
 */
function isFull(board) {
  for (var row of board) {
    for (var slot of row) {
    if (slot == 0)
      return false;
    }
  }
  return true;
}