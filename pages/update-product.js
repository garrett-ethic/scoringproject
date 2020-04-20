import React from 'react';
import axios from 'axios';
import {
  Button,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  Stack,
  TextField,
  TextStyle,
  FooterHelp,
  Link,
  Heading,
  Subheading,
} from '@shopify/polaris';

class UpdateProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productID: '',
      productName: '',
      productVendor: '',
      productTags: '',
      productMetrics: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  handleSearchSubmit = () => {
    console.log(
      'http://localhost:5000/api/shopifyProduct/' + this.state.productID
    );
    axios
      .get('http://localhost:5000/api/shopifyProduct/' + this.state.productID)
      .then((res) => {
        const prodInfo = res.data;
        console.log(prodInfo);
        this.setState({
          productName: prodInfo.title,
          productVendor: prodInfo.vendor,
          productTags: prodInfo.tags,
        });
      });
    axios
      .get(
        'http://localhost:5000/api/shopifyProduct/metrics/' +
          this.state.productID
      )
      .then((res) => {
        const prodMetrics = res.data;
        console.log(prodMetrics);
        this.setState({
          productMetrics: prodMetrics.metafields,
        });
      });
  };

  handleChange = (field) => {
    return (value) => this.setState({ [field]: value });
  };

  render() {
    const { productID } = this.state;

    return (
      <Page>
        <Layout>
          <Layout.AnnotatedSection
            title='Search for Product'
            description='Search for a product by entering a product ID.'
          >
            <Card sectioned>
              <Form onSubmit={this.handleSearchSubmit}>
                <FormLayout>
                  <TextField
                    value={productID}
                    onChange={this.handleChange('productID')}
                    label='Product ID'
                    type='productID'
                  />
                  <Stack distribution='trailing'>
                    <Button primary submit>
                      Search
                    </Button>
                  </Stack>
                </FormLayout>
              </Form>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title='Product Information'
            description='Information and Current Product Metrics'
          >
            <Card>
              <Heading>Product Name:</Heading>
              <Subheading>{this.state.productName}</Subheading>
              <Heading>Vendor:</Heading>
              <Subheading>{this.state.productVendor}</Subheading>
              <Heading>Tags:</Heading>
              <Subheading>{this.state.productTags}</Subheading>
              <Heading>Ethical Metrics:</Heading>
              <p>
                {this.state.productMetrics.map((metric) => {
                  return (
                    <li key={metric.key}>
                      {metric.key}":" {metric.value}
                    </li>
                  );
                })}
              </p>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.Section>
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
    );
  }
}

export default UpdateProduct;
