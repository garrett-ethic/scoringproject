import React from 'react';
import axios from 'axios';

import Co_im from '../metric-weights/co_im.json';
import Eco_f from '../metric-weights/eco_f.json';
import All_n from '../metric-weights/all_n.json';
import An_ri from '../metric-weights/an_ri.json';
import Labor from '../metric-weights/labor.json';

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
  Banner,
} from '@shopify/polaris';

// let copy1 = JSON.parse(JSON.stringify(Co_im));

class MetricWeights extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      co_im: Co_im,
      eco_f: Eco_f,
      all_n: All_n,
      an_ri: An_ri,
      labor: Labor,
    };

    this.handleChangeCoIm = this.handleChangeCoIm.bind(this);
    this.handleChangeEcoF = this.handleChangeEcoF.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // ---- This doesn't work :/ ---
  // componentDidMount() {
  //   axios.get('https://axial-paratext-278418.uc.r.appspot.com/api/metricDetails/co_im').then((res) => {
  //     this.setState({
  //       co_im: res.data,
  //     });
  //   });
  // }

  // have to implement a handleChange function and figure out how to
  // efficiently write to the json file
  handleSubmit = (cat) => {
    axios
      .put('https://axial-paratext-278418.uc.r.appspot.com/api/metricDetails/' + cat, this.state[cat])
      .then((res) => {
        console.log('success');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleChangeCoIm = (value, id) => {
    var co_im = { ...this.state.co_im };
    co_im[id] = value;
    this.setState({ co_im });
  };

  handleChangeEcoF = (value, id) => {
    var eco_f = { ...this.state.eco_f };
    eco_f[id] = value;
    this.setState({ eco_f });
  };

  handleChangeAllN = (value, id) => {
    var all_n = { ...this.state.all_n };
    all_n[id] = value;
    this.setState({ all_n });
  };

  handleChangeAnRi = (value, id) => {
    var an_ri = { ...this.state.an_ri };
    an_ri[id] = value;
    this.setState({ an_ri });
  };

  handleChangeLabor = (value, id) => {
    var labor = { ...this.state.labor };
    labor[id] = value;
    this.setState({ labor });
  };

  render() {
    return (
      <Page title='Update Metric Weights and Descriptions'>
        <Layout>
          <Layout.Section>
            <Banner title='Keep in Mind...' status='info'>
              <p>All changes made are live-updates</p>
            </Banner>
          </Layout.Section>
          <Layout.AnnotatedSection
            title='Community Impact'
            description='How a company or product contributes on a local level'
          >
            <Form implicitSubmit={false} onSubmit={this.handleSubmit('co_im')}>
              <FormLayout>
                <FormLayout.Group condensed>
                  <TextField
                    label='Made in the USA'
                    id='USA_made'
                    value={this.state.co_im.USA_made}
                    onChange={this.handleChangeCoIm}
                    type='number'
                  />
                  <TextField
                    label='Local business'
                    id='local_business'
                    value={this.state.co_im.local_business}
                    onChange={this.handleChangeCoIm}
                    type='number'
                  />
                  <TextField
                    label='Community activism'
                    id='community_activism'
                    value={this.state.co_im.community_activism}
                    onChange={this.handleChangeCoIm}
                    type='number'
                  />
                  <TextField
                    label='Business size'
                    id='business_size'
                    value={this.state.co_im.business_size}
                    onChange={this.handleChangeCoIm}
                    type='number'
                  />
                  <TextField
                    label='Donates locally'
                    id='donates_locally'
                    value={this.state.co_im.donates_locally}
                    onChange={this.handleChangeCoIm}
                    type='number'
                  />
                  <TextField
                    label='1% for the planet'
                    id='1%_for_the_planet'
                    value={this.state.co_im['1%_for_the_planet']}
                    onChange={this.handleChangeCoIm}
                    type='number'
                  />
                  <TextField
                    label='Political donations'
                    id='political_donations'
                    value={this.state.co_im.political_donations}
                    onChange={this.handleChangeCoIm}
                    type='number'
                  />
                  <TextField
                    label='Donates to oppressed'
                    id='donate_to_oppressed'
                    value={this.state.co_im.donate_to_oppressed}
                    onChange={this.handleChangeCoIm}
                    type='number'
                  />
                  <TextField
                    label='BCorp'
                    id='bcorp'
                    value={this.state.co_im.bcorp}
                    onChange={this.handleChangeCoIm}
                    type='number'
                  />
                  <TextField
                    label='Local by ZIP'
                    id='local_zip'
                    value={this.state.co_im.local_zip}
                    onChange={this.handleChangeCoIm}
                    type='number'
                  />
                </FormLayout.Group>
                <Button submit>Submit</Button>
              </FormLayout>
            </Form>
          </Layout.AnnotatedSection>

          <Layout.AnnotatedSection
            title='Eco-Friendly'
            description='How economically friendly is the product?'
          >
            <Form implicitSubmit={false} onSubmit={this.handleSubmit('eco_f')}>
              <FormLayout>
                <FormLayout.Group condensed>
                  {Object.keys(this.state.eco_f).map((metric) => (
                    <TextField
                      label={metric}
                      key={metric}
                      id={metric}
                      value={this.state.eco_f[metric]}
                      onChange={this.handleChangeEcoF}
                      type='number'
                    />
                  ))}
                </FormLayout.Group>
                <Button submit>Submit</Button>
              </FormLayout>
            </Form>
          </Layout.AnnotatedSection>

          <Layout.AnnotatedSection
            title='All Natural & Nontoxic'
            description='Focuses on the material used to create the product'
          >
            <Form implicitSubmit={false} onSubmit={this.handleSubmit('all_n')}>
              <FormLayout>
                <FormLayout.Group condensed>
                  {Object.keys(this.state.all_n).map((metric) => (
                    <TextField
                      label={metric}
                      key={metric}
                      id={metric}
                      value={this.state.all_n[metric]}
                      onChange={this.handleChangeAllN}
                      type='number'
                    />
                  ))}
                </FormLayout.Group>
                <Button submit>Submit</Button>
              </FormLayout>
            </Form>
          </Layout.AnnotatedSection>

          <Layout.AnnotatedSection
            title='Animal Rights'
            description='Focuses on the material used to create the product'
          >
            <Form implicitSubmit={false} onSubmit={this.handleSubmit('an_ri')}>
              <FormLayout>
                <FormLayout.Group condensed>
                  {Object.keys(this.state.an_ri).map((metric) => (
                    <TextField
                      label={metric}
                      key={metric}
                      id={metric}
                      value={this.state.an_ri[metric]}
                      onChange={this.handleChangeAnRi}
                      type='number'
                    />
                  ))}
                </FormLayout.Group>
                <Button submit>Submit</Button>
              </FormLayout>
            </Form>
          </Layout.AnnotatedSection>

          <Layout.AnnotatedSection
            title='Labor'
            description='How does the company treat their employees?'
          >
            <Form implicitSubmit={false} onSubmit={this.handleSubmit('labor')}>
              <FormLayout>
                <FormLayout.Group condensed>
                  {Object.keys(this.state.labor).map((metric) => (
                    <TextField
                      label={metric}
                      key={metric}
                      id={metric}
                      value={this.state.labor[metric]}
                      onChange={this.handleChangeLabor}
                      type='number'
                    />
                  ))}
                </FormLayout.Group>
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

export default MetricWeights;
