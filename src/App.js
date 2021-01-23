import React, { Component } from 'react'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      isLoading: false,
      isError: false
    }
  }

  async componentDidMount() {
    this.setState({ isLoading: true })
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    if (response.ok) {
      const users = await response.json()
      this.setState({ users, isLoading: false })
    } else {
      this.setState({ isError: true, isLoading: false })
    }
  }

  handlChangeCourse =event => {
    this.setState({course :  event.target.value});
  };

  Table1 = () => {
    return Object.keys(this.state.users[0]).map(attr => <th key={attr}>{attr.toUpperCase()}</th>)
  }
 Table2 = () => {
    return this.state.users.map(user => {
      return (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.name}</td>
          <td>{user.username}</td>
          <td>{user.email}</td>
          <td>{`${user.address.street}, ${user.address.city}`}</td>
          <td>{user.phone}</td>
          <td>{user.website}</td>
          <td>{user.company.name}</td>
        </tr>
      )
    })
  }

  render() {
    const { users, isLoading, isError } = this.state

    if (isLoading) {
      return <div>Loading...</div>
    }

    if (isError) {
      return <div>Error</div>
    }

    return users.length > 0
      ? (
        
        <div className='todo-app'>
          <label>
            Chose:<select value={this.state.users} onChange={this.handlChangeCourse}>
              {users.map(name => (
                <option key={name.id} value={name.company.name}>
                  {name.company.name}
                </option>
              ) )}
            </select>
          </label>
          <input type="submit" value="submit"/>
        <table>
          <thead>
            <tr>
              {this.Table1()}
            </tr>
          </thead>
          <tbody>
            {this.Table2()}
          </tbody>
        </table>
        </div>
      ) : (
        <div>
          No users.
      </div>
      )
  }
}
export default App;