import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
    const wordClass=props.class? "square winner-word": "square";
    return (
      <button className={wordClass} onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square
          class={this.props.word[i]}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      return (
        <div>
          {
            [0, 3, 6].map(index => {
                return <div className="board-row">
                    {this.renderSquare(index)}
                    {this.renderSquare(index+1)}
                    {this.renderSquare(index+2)}
                </div>
            })
          }
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null)
          }
        ],
        stepNumber: 0,
        xIsNext: true,
        isActionAsc: true, // true is asc, false is desc
        actionIndex: -1,
        word: Array(9).fill(false)
      };
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const winner = calculateWinner(squares);
      if (winner || squares[i]) {
        let arr = Array(9).fill(false)
        arr[winner[0]] = true
        arr[winner[1]] = true
        arr[winner[2]] = true
        this.setState({
          word: arr,
        })
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([
          {
            squares: squares,
            description: `Put ${squares[i]} in (${(i % 3) + 1}, ${Math.floor(i / 3) + 1})`,        
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        actionIndex: -1,
        word: Array(9).fill(false),
      });
    }
  
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
        actionIndex: step,
      });
    }
  
    reverseAction() {
        this.setState({
            isActionAsc: !this.state.isActionAsc,
        });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const moves = history.map((step, move) => {
        const actionClass = this.state.stepNumber === move? 'action-button-clicked': '';
        const desc = move === 0 ?
        'Go to game start': 
        `Go to move #${move} => ${step.description}`;
        return (
          <li key={move}>
            <button className={actionClass} onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
      
      if (!this.state.isActionAsc) {
        moves.reverse()
      }

      let status;
      if (winner) {
        status = "Winner: " + current.squares[winner[0]];
      } else if(winner === null && history.length === 10) {
        status = "This game ended in a tie."
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              word={this.state.word}
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div className="description">{status}</div><button className="button-single" onClick={() => this.reverseAction()}>Reverse</button>
            <ol style={{ marginTop: '15px'}}>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(<Game />, document.getElementById("root"));
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [a, b, c];
      }
    }
    return null;
  }
  