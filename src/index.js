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
  return (
    <button
      className={"square " + (props.isLast ? "isLast" : "")}
      onClick={props.onClick ?? ""}
    >
      {props.value}
    </button>
  );
}

function Label(props) {
  return <button className="label">{props.value}</button>;
}

class Board extends React.Component {
  renderSquare(i) {
    console.log(this.props.winLine);
    return (
      <Square
        value={this.props.squares[i]}
        isLast={this.props.winLine?.includes(i)}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderLabel(l) {
    return <Label value={l} />;
  }

  renderBorderRow(i) {
    const squareNum = i * 3;
    return (
      <div className="board-row" key={i}>
        {this.renderLabel(i)}
        {this.renderSquare(squareNum)}
        {this.renderSquare(squareNum + 1)}
        {this.renderSquare(squareNum + 2)}
      </div>
    );
  }

  render() {
    const borderRows = [];
    for (let i = 0; i < 3; i++) {
      borderRows.push(this.renderBorderRow(i));
    }

    return (
      <div>
        <div className="board-row">
          {this.renderLabel("Y\\X")}
          {this.renderLabel(0)}
          {this.renderLabel(1)}
          {this.renderLabel(2)}
        </div>
        {borderRows}
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
          stepNumber: 0,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      order: true, // true: asc, false: desc
    };
  }

  handleClick(i) {
    const history = this.state.history.slice();
    const stepNumber = this.state.stepNumber;
    const current =
      history[this.state.order ? stepNumber : history.length - 1 - stepNumber];

    const squares = current.squares.slice();

    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";

    const x = i % 3;
    const y = parseInt(i / 3);

    const new_item = {
      squares,
      coordinate: { x, y },
      stepNumber: history.length,
    };

    this.setState({
      history: this.state.order
        ? [...history, new_item]
        : [new_item, ...history],
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

  handleToggle() {
    const history = this.state.history.slice();
    this.setState({
      history: history.reverse(),
      order: !this.state.order,
    });
  }

  render() {
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const current =
      history[this.state.order ? stepNumber : history.length - 1 - stepNumber];
    const { winner, winLine } = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const { x, y } = step.coordinate;
      const stepNumber_ = step.stepNumber;
      const xy = stepNumber_ ? `(${x}, ${y}) clicked!` : "";
      return (
        <li key={stepNumber_}>
          <button onClick={() => this.jumpTo(stepNumber_)}>
            Go to move #{stepNumber_}
          </button>
          {xy}
          {stepNumber_ === stepNumber ? "✅" : ""}
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winLine={winLine}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>
            {winner
              ? `Winner: ${winner}`
              : `Next player: ${this.state.xIsNext ? "X" : "O"}`}
          </div>
          <button onClick={() => this.handleToggle()}>순서 바꾸기</button>
          <div>Order: {this.state.order ? "ASC" : "DESC"}</div>
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
      return { winner: squares[a], winLine: lines[i] };
    }
  }
  return { winner: null, winLine: null };
}
