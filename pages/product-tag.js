import React from 'react';
import axios from 'axios';
import {
  Card,
  Scrollable,
  FormLayout,
  TextField,
  Button,
  Form,
  Heading,
  Subheading,
  Layout,
  Page,
  DataTable,
  DisplayText,
  FooterHelp,
  Link,
} from '@shopify/polaris';

class ProductTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: '',
      tagList: [],
      finishedTag: '...',
      productNumber: 0,
      productRows: [],
      data: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e, result) {
    //console.log(e);
    this.setState({ tag: e });
  }

  componentDidMount() {
    axios
      .get('http://localhost:5000/api/shopifyProduct/tagList/ineedtags')
      .then((res) => {
        const results = res.data;
        let i;
        for (i = 0; i < results.length; ++i) {
          console.log(results[i]);
          this.setState({
            tagList: this.state.tagList.concat(results[i]),
          });
        }
      });
    console.log(this.state.tagList);
  }

  handleSubmit(event) {
    console.log(this.state.tag);
    axios
      .get('http://localhost:5000/api/shopifyProduct/tagList/' + this.state.tag)
      .then((res) => {
        const results = res.data;
        console.log(results);
        let i;
        for (i = 0; i < results.length; ++i) {
          console.log(results[i]);
          let newProductRow = [
            results[i].title,
            results[i].id,
            results[i].vendor,
            results[i].tags,
          ];
          this.setState({
            // data: this.state.data.concat(results[i]),
            // @Preston, I think the spread operator ( ... ) is a more common notation of doing the same thing as concat
            data: [...this.state.data, results[i]],
            productRows: [...this.state.productRows, newProductRow],
          });
        }
        this.setState({
          productNumber: this.state.data.length,
        });
        console.log(this.state.data);
      });
    this.setState({ finishedTag: this.state.tag });
    this.setState({ tag: '' });
  }
  render() {
    return (
      <Page>
        <DisplayText size='large'>Search Products By Tag</DisplayText>
        <Layout>
          <Layout.Section>
            <Card title='List of Tags' sectioned>
              <Scrollable shadow style={{ height: '200px' }}>
                <p>
                  {this.state.tagList.map((value, index) => {
                    return <li key={index}>{value}</li>;
                  })}
                </p>
              </Scrollable>
            </Card>
          </Layout.Section>
          <Layout.Section secondary>
            <Card sectioned>
              <Form noValidate onSubmit={this.handleSubmit}>
                <FormLayout>
                  <TextField
                    value={this.state.tag}
                    onChange={this.handleChange}
                    label='Chosen Tag'
                    type='tag'
                  />
                  <Button submit>Submit</Button>
                </FormLayout>
              </Form>
            </Card>
          </Layout.Section>
          {/* </Layout> */}
          <Layout.Section>
            <Heading>Product Results</Heading>
            <Subheading size='medium'>
              We retrieved {this.state.productNumber} products with the{' '}
              {this.state.finishedTag} tag
            </Subheading>

            <Card>
              <Scrollable shadow style={{ height: '400px' }}>
                <DataTable
                  columnContentTypes={['text', 'numeric', 'text', 'text']}
                  headings={['Product Name', 'Product ID', 'Vendor', 'Tags']}
                  rows={this.state.productRows}
                />
              </Scrollable>
            </Card>
            <FooterHelp>
              Ethic Score's{' '}
              <Link
                url='https://github.com/garrett-ethic/scoringproject'
                external
              >
                Project Repository
              </Link>
            </FooterHelp>
          </Layout.Section>
        </Layout>
      </Page>
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

export default ProductTag;
