import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// 클래스 컴포넌트
// Board 컴포넌트에 의해 제어되는 컴포넌트
// 자체 state를 가지지 않음.
// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

// 함수 컴포넌트로의 전환 👉 state없이 render함수만 가짐, 코드가 간단해짐.
function Square(props) {
  if ("onClick" in props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  } else {
    return <button className="label">{props.value}</button>;
  }
}

class Board extends React.Component {
  renderSquare(i) {
    if (typeof i === "number") {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    } else {
      return <Square value={i} />;
    }
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare("Y\\X")}
          {this.renderSquare("0")}
          {this.renderSquare("1")}
          {this.renderSquare("2")}
        </div>
        <div className="board-row">
          {this.renderSquare("0")}
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare("1")}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare("2")}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
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
          squares: Array(9).fill(null),
          coordinate: { x: null, y: null },
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";

    const x = i % 3;
    const y = parseInt(i / 3);

    this.setState({
      history: history.concat([
        {
          squares,
          coordinate: { x, y },
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const { x, y } = step.coordinate;
      const xy = move ? `(${x}, ${y}) clicked!` : "";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>Go to move #{move}</button>
          {xy}
          {move === stepNumber ? "✅" : ""}
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
