import React from 'react';
import axios from 'axios';
import {FormLayout, TextField, Button, Form} from '@shopify/polaris';

export default class EmbeddedForm extends React.Component {
  state = {
    data: [],
  };

  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };
  componentDidMount() {
    /*
    axios.get('http://localhost:5000/api/shopifyProduct/4328112848961')
      .then(res => {
        const results = res.data
        this.setState({
          data: this.state.data.concat(results)
        })
        console.log(this.state.data);
      })*/
  };

  handleChange(e, result) {
    //console.log(e);
    this.setState({value: e});
  };
  
  handleSubmit(event) {
    console.log(this.state.value);
    this.setState({value: ''});
  };
  render() {
    return (
      //<div>
        <Form noValidate onSubmit={this.handleSubmit}>
          <FormLayout>
            <TextField
              value={this.state.value}
              onChange={this.handleChange}
              label="Chosen Tag"
              type="tag"
            />
            <Button submit>Submit</Button>
          </FormLayout>
        </Form>
      /*
      <ul>
        {this.state.data.map(d => <div>{d.id}</div>)}
        {this.state.data.map(d => <div>{d.title}</div>)}
        {this.state.data.map(d => <div>{d.vendor}</div>)}
        {this.state.data.map(d => <div>{d.product_type}</div>)}
      </ul>*/
      //</div>

    );
  }
}
