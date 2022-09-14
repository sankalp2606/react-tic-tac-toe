import React from 'react';
import './style.css';
import axios from 'axios';

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

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

/*
A: {a: 1, b: 2, c: 3}

=> A.a = 3

A: {a: 3, b: 2, c: 3}

B: {...A}

B.a = 3

A <-> B

old: [X, X, X, X, X, X, X, X, X]

new: [O, X, X, X, X, X, X, X, X]

old <-> new

So that react can decide which square to rerender
*/

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = { squares: Array(9).fill(null), xIsNext: true };
    this.handleClick = (i) => {
      this.state.squares[i] = 'X';
      this.setState({
        squares: [
          ...this.state.squares.slice(0, i),
          this.state.xIsNext ? 'X' : 'O',
          ...this.state.squares.slice(i + 1, this.state.squares.length),
        ],
        xIsNext: !this.state.xIsNext,
      });
    };
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    let status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    if (calculateWinner(this.state.squares)) {
      status = `Winner: ${this.state.xIsNext ? 'O' : 'X'}`;
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {[0, 1, 2].map((value) => this.renderSquare(value))}
        </div>
        <div className="board-row">
          {[3, 4, 5].map((value) => this.renderSquare(value))}
        </div>
        <div className="board-row">
          {[6, 7, 8].map((value) => this.renderSquare(value))}
        </div>
      </div>
    );
  }
}

class UserDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  render() {
    if (!this.props.user) return null;
    return (
      <div style={{ border: '0.5px solid black', borderRadius: 5 }}>
        <div
          onClick={() => this.setState({ expanded: !this.state.expanded })}
          style={{ cursor: 'pointer', padding: '5px 5px 5px 5px' }}
        >
          {this.props.user.name}
        </div>
        {this.state.expanded && (
          <div style={{ borderTop: '0.5px solid black' }}>
            <div style={{ padding: '5px 5px 5px 5px' }}>
              <div>Username: {this.props.user.username}</div>
              <div>
                Email:
                {this.props.user.email}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { users: [] };
  }

  componentDidMount() {
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then((response) => this.setState({ users: response.data }))
      .catch((err) => err);
  }

  render() {
    return (
      <>
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
        </div>
        <div className="game-info">
          <h4>All available users</h4>
          {this.state.users.map((user) => (
            <div style={{ marginBottom: 5 }}>
              <UserDetails user={user} />
            </div>
          ))}
        </div>
      </>
    );
  }
}

export default function App() {
  return <Game />;
}
