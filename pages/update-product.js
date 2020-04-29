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
  RangeSlider,
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
      metric1: {
        metricID: '',
        value: -1,
      },
      metric2: {
        metricID: '',
        value: -1,
      },
      metric3: {
        metricID: '',
        value: -1,
      },
      metric4: {
        metricID: '',
        value: -1,
      },
      // metric1: -1,
      // metric1ID: '',
      // metric2: -1,
      // metric2ID: '',
      // metric3: -1,
      // metric3ID: '',
      // metric4: -1,
      // metric4ID: '',
    };
    this.handleChange = this.handleChange.bind(this);
    // this.handleUpdateChange = this.handleUpdateChange.bind(this);
    this.handleMetric1Change = this.handleMetric1Change.bind(this);
    this.handleMetric2Change = this.handleMetric2Change.bind(this);
    this.handleMetric3Change = this.handleMetric3Change.bind(this);
    this.handleMetric4Change = this.handleMetric4Change.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleMetricSubmit = this.handleMetricSubmit.bind(this);
  }

  handleChange = (field) => {
    return (value) => this.setState({ [field]: value });
  };

  // handleUpdateChange(value, id) {
  //   this.setState({
  //     [id]: value
  //   });
  // }

  handleMetric1Change(value) {
    this.setState((prevState) => {
      let metric1 = Object.assign({}, prevState.metric1);
      metric1.value = value;
      return { metric1 };
    });
  }

  handleMetric2Change(value) {
    this.setState((prevState) => {
      let metric2 = Object.assign({}, prevState.metric2);
      metric2.value = value;
      return { metric2 };
    });
  }

  handleMetric3Change(value) {
    this.setState((prevState) => {
      let metric3 = Object.assign({}, prevState.metric3);
      metric3.value = value;
      return { metric3 };
    });
  }

  handleMetric4Change(value) {
    this.setState((prevState) => {
      let metric4 = Object.assign({}, prevState.metric4);
      metric4.value = value;
      return { metric4 };
    });
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
        const prodMetrics = res.data.metafields;
        for (let i = 0; i < prodMetrics.length; i++) {
          this.setState({
            [prodMetrics[i].key]: {
              metricID: prodMetrics[i].id,
              value: prodMetrics[i].value,
            },
          });
        }

        console.log(prodMetrics);
        this.setState({
          productMetrics: prodMetrics,
        });
      });
  };

  handleMetricSubmit() {
    console.log(this.state.metric1);
    console.log(this.state.metric2);
    console.log(this.state.metric3);
    console.log(this.state.metric4);

    const newMetric1 = {
      metafield: {
        id: this.state.metric1.metricID,
        value: this.state.metric1.value,
        value_type: 'integer',
      },
    };

    console.log(JSON.stringify(newMetric1));

    if (this.state.metric1.id != '') {
      axios.put(
        'http://localhost:5000/api/shopifyProduct/metrics/' +
          this.state.productID +
          '/' +
          this.state.metric1.metricID,
        {
          metafield: {
            id: this.state.metric1.metricID,
            value: this.state.metric1.value,
            value_type: 'integer',
          },
        }
      );
    }

    if (this.state.metric2.id != '') {
      axios.put(
        'http://localhost:5000/api/shopifyProduct/metrics/' +
          this.state.productID +
          '/' +
          this.state.metric2.metricID,
        {
          metafield: {
            id: this.state.metric2.metricID,
            value: this.state.metric2.value,
            value_type: 'integer',
          },
        }
      );
    }

    if (this.state.metric3.id != '') {
      axios.put(
        'http://localhost:5000/api/shopifyProduct/metrics/' +
          this.state.productID +
          '/' +
          this.state.metric3.metricID,
        {
          metafield: {
            id: this.state.metric3.metricID,
            value: this.state.metric3.value,
            value_type: 'integer',
          },
        }
      );
    }

    if (this.state.metric4.id != '') {
      axios.put(
        'http://localhost:5000/api/shopifyProduct/metrics/' +
          this.state.productID +
          '/' +
          this.state.metric4.metricID,
        {
          metafield: {
            id: this.state.metric4.metricID,
            value: this.state.metric4.value,
            value_type: 'integer',
          },
        }
      );
    }
  }

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
                    id='productID'
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
          <Layout.AnnotatedSection
            title='Update Product Metrics'
            description='Update values for each metric'
          >
            <Form onSubmit={this.handleMetricSubmit}>
              <FormLayout>
                <RangeSlider
                  min={-1}
                  max={10}
                  label='Metric 1'
                  value={this.state.metric1.value}
                  onChange={this.handleMetric1Change}
                  id='metric1'
                  output
                />
                <RangeSlider
                  min={-1}
                  max={10}
                  label='Metric 2'
                  value={this.state.metric2.value}
                  onChange={this.handleMetric2Change}
                  id='metric2'
                  output
                />
                <RangeSlider
                  min={-1}
                  max={10}
                  label='Metric 3'
                  value={this.state.metric3.value}
                  onChange={this.handleMetric3Change}
                  id='metric3'
                  output
                />
                <RangeSlider
                  min={-1}
                  max={10}
                  label='Metric 4'
                  value={this.state.metric4.value}
                  onChange={this.handleMetric4Change}
                  id='metric4'
                  output
                />
                <Button submit>Submit</Button>
              </FormLayout>
            </Form>
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
