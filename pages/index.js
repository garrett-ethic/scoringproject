import React from 'react';
import axios from 'axios';


export default class PersonList extends React.Component {
  state = {
    data: []
  }

  componentDidMount() {
    axios.get('http://localhost:5000/api/shopifyProduct/4328112848961')
      .then(res => {
        const results = res.data
        this.setState({
          data: this.state.data.concat(results)
        })
        console.log(this.state.data);
      })
  }

  render() {
    return (
      <ul>
        {this.state.data.map(d => <div>{d.id}</div>)}
        {this.state.data.map(d => <div>{d.title}</div>)}
        {this.state.data.map(d => <div>{d.vendor}</div>)}
        {this.state.data.map(d => <div>{d.product_type}</div>)}
      </ul>
    )
  }
}

