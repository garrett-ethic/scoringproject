import React from 'react';
import axios from 'axios';
import {Card, Scrollable, FormLayout, TextField, Button, Form} from '@shopify/polaris';

export default class EmbeddedForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: '', 
      tagList: [],
      finishedTag: '...',
      productNumber: 0,
      data: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };
  
  handleChange(e, result) {
    //console.log(e);
    this.setState({tag: e});
  };
  
  componentDidMount() {
    axios.get('http://localhost:5000/api/shopifyProduct/tagList/ineedtags')
      .then(res => {
        const results = res.data;
        let i;
        for (i = 0; i < results.length; ++i ) {
          console.log(results[i]);
          this.setState({
            tagList: this.state.tagList.concat(results[i])
          });
        }
    });
    console.log(this.state.tagList);
  }

  handleSubmit(event) {
    console.log(this.state.tag);
    axios.get('http://localhost:5000/api/shopifyProduct/tagList/' + this.state.tag)
      .then(res => {
        const results = res.data;
        console.log(results);
        let i;
        for (i = 0; i < results.length; ++i ) {
          console.log(results[i]);
          this.setState({
            data: this.state.data.concat(results[i])
          });
        }
        this.setState({
          productNumber: this.state.data.length});
        console.log(this.state.data);
    });
    this.setState({finishedTag: this.state.tag});
    this.setState({tag: ''});
  };
  render() {
    return (
      <div>
        <Form noValidate onSubmit={this.handleSubmit}>
          <FormLayout>
            <TextField
              value={this.state.tag}
              onChange={this.handleChange}
              label="Chosen Tag"
              type="tag"
            />
            <Button submit>Submit</Button>
          </FormLayout>
        </Form>
        <h2>
          <br/>
          We retrieved {this.state.productNumber} products with the {this.state.finishedTag} tag
          <br/>
          <Card title="List of Tags" sectioned>
            <Scrollable shadow style={{height: '400px'}}>
              <p>
                {this.state.tagList.map((value, index) => {
                  return <li key={index}>{value}</li>
                })}
              </p>
            </Scrollable>
          </Card>
          <br/>
        </h2>
    </div>
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
