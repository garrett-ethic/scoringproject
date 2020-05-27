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
  TextContainer,
  FooterHelp,
  ProgressBar,
  Link,
  RangeSlider,
  ChoiceList,
  Select,
  DisplayText,
  Banner,
  Badge,
} from '@shopify/polaris';

class UpdateProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productID: '',
      productName: '',
      productVendor: '',
      productTags: '',
      loadFailure: false,
      metricProgress: 0,
      co_im_metricId: '',
      co_im_exists: false,
      co_im: {
        USA_made: 'n/a',
        employs_locally: 'n/a',
        community_activism: 'n/a',
        business_size: 'n/a',
        donates_locally: 'n/a',
        one_percent_for_the_planet: 'n/a',
        political_donations: 'n/a',
        donate_to_oppressed: 'n/a',
        zip_code: 'n/a',
      },
      eco_f_metricId: '',
      eco_f_exists: false,
      eco_f: {
        sustainable_packaging: 'n/a',
        sustainable_materials: 'n/a',
        zeroCarbon_shipping: 'n/a',
        zeroCarbon_manufacturing: 'n/a',
        manufacturing_impact: 'n/a',
        fsc: 'n/a',
        rainforest_alliance: 'n/a',
        cradle_to_cradle: 'n/a',
        donate_to_environment: 'n/a',
        bcorp: 'n/a',
      },
      all_n_metricId: '',
      all_n_exists: false,
      all_n: {
        certified_organic: 'n/a',
        organic_practices: 'n/a',
        allNatural_ingredients: 'n/a',
        reef_safe: 'n/a',
        ewg: 'n/a',
        madeSafe: 'n/a',
        consumerLabs: 'n/a',
        transparency: 'n/a',
        bcorp: 'n/a',
      },
      an_ri_metricId: '',
      an_ri_exists: false,
      an_ri: {
        vegan: 'n/a',
        donate_to_animalRights: 'n/a',
        cruelty_free: 'n/a',
      },
      labor_metricId: '',
      labor_exists: false,
      labor: {
        childcare: 'n/a',
        gym_recreation: 'n/a',
        educational_ops: 'n/a',
        healthcare: 'n/a',
        mobility: 'n/a',
        can_unionize: 'n/a',
        living_wage: 'n/a',
        safe_work_conditions: 'n/a',
        no_child_labor: 'n/a',
        empower_oppressed: 'n/a',
        co_op: 'n/a',
        ethical_materials_sourcing: 'n/a',
        bcorp: 'n/a',
        fair_trade: 'n/a',
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCoIm = this.handleChangeCoIm.bind(this);
    this.handleChangeEcoF = this.handleChangeEcoF.bind(this);
    this.handleChangeAllN = this.handleChangeAllN.bind(this);
    this.handleChangeAnRi = this.handleChangeAnRi.bind(this);
    this.handleChangeLabor = this.handleChangeLabor.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  metricOptions = [
    { label: 'Yes', value: 'y' },
    { label: 'No', value: 'n' },
    { label: 'N/A', value: 'n/a' },
  ];

  // The following label objects only includes labels for metrics that have yes, no, and n/a options

  co_im_labels = {
    USA_made: 'Made in the USA',
    employs_locally: 'Employs to Local Residents/Businesses',
    community_activism: 'Community Activism',
    donates_locally: 'Donates to Surrounding Community',
    one_percent_for_the_planet: '1% for the Planet',
    political_donations: 'Politial Donations',
    donate_to_oppressed: 'Donates to Oppressed Communities',
  };

  eco_f_labels = {
    sustainable_packaging: 'Sustainable Packaging',
    sustainable_materials: 'Sustainable Materials',
    zeroCarbon_shipping: 'Zero Carbon Footprint - Shipping',
    zeroCarbon_manufacturing: 'Zero Carbon Footprint - Manufacturing',
    manufacturing_impact: 'Manufacturing Impact',
    fsc: 'FSC',
    rainforest_alliance: 'Rainforest Alliance',
    cradle_to_cradle: 'Cradle to Cradle',
    donate_to_environment: 'Donates to Environmental Causes',
    bcorp: 'Bcorp',
  };

  all_n_labels = {
    certified_organic: 'Certified Organic',
    organic_practices: 'Organic Practices',
    allNatural_ingredients: 'All Natural Ingredients',
    reef_safe: 'Reef Safe',
    madeSafe: 'MadeSafe',
    transparency: 'Transparency',
    bcorp: 'Bcorp',
  };

  an_ri_labels = {
    vegan: 'Vegan',
    donate_to_animalRights: 'Donates to Animal Rights Causes',
    cruelty_free: 'Cruelty Free (Leaping Bunny/PETA)',
  };

  labor_labels = {
    childcare: 'Childcare',
    gym_recreation: 'Gym/Recreation',
    educational_ops: 'Educational Opportunities',
    healthcare: 'Healthcare',
    mobility: 'Mobility in Company',
    can_unionize: 'Allows Workers to Unionize',
    living_wage: 'Living Wage',
    safe_work_conditions: 'Safe Working Conditions',
    no_child_labor: 'No Child Labor/Trafficking',
    empower_oppressed: 'Empowers a Disenfranchised Community',
    co_op: 'Co-op',
    ethical_materials_sourcing: 'Ethical Materials Sourcing',
    bcorp: 'Bcorp',
    fair_trade: 'Fair Trade',
  };

  handleChange = (field) => {
    return (value) => this.setState({ [field]: value });
  };

  handleChangeCoIm = (value, id) => {
    var co_im = { ...this.state.co_im };
    co_im[id] = value;
    this.setState({ co_im }, () => {
      console.log(this.state.co_im);
    });
  };

  handleChangeEcoF = (value, id) => {
    var eco_f = { ...this.state.eco_f };
    eco_f[id] = value;
    this.setState({ eco_f }, () => {
      console.log(this.state.eco_f);
    });
  };

  handleChangeAllN = (value, id) => {
    var all_n = { ...this.state.all_n };
    all_n[id] = value;
    this.setState({ all_n }, () => {
      console.log(this.state.all_n);
    });
  };

  handleChangeAnRi = (value, id) => {
    var an_ri = { ...this.state.an_ri };
    an_ri[id] = value;
    this.setState({ an_ri }, () => {
      console.log(this.state.an_ri);
    });
  };

  handleChangeLabor = (value, id) => {
    var labor = { ...this.state.labor };
    labor[id] = value;
    this.setState({ labor }, () => {
      console.log(this.state.labor);
    });
  };

  handleSearchSubmit = () => {
    this.setState({
      metricProgress: 0,
    });

    axios
      .get('https://axial-paratext-278418.uc.r.appspot.com/api/shopifyProduct/' + this.state.productID)
      .then((res) => {
        const prodInfo = res.data;

        console.log(JSON.stringify(this.state.co_im));
        this.setState({
          productName: prodInfo.title,
          productVendor: prodInfo.vendor,
          productTags: prodInfo.tags,
        });
      });
    axios
      .get(
        'https://axial-paratext-278418.uc.r.appspot.com/api/shopifyProduct/metrics/' +
          this.state.productID
      )
      .then((res) => {
        const prodMetrics = res.data.metafields;
        let metricProgress = 0;
        for (let i = 0; i < prodMetrics.length; i++) {
          let currentMetrics = prodMetrics[i];
          if (currentMetrics.namespace == 'ethic-metric') {
            metricProgress += 20;
          }

          if (currentMetrics.key == 'co_im') {
            this.state.co_im_metricId = currentMetrics.id;
            this.state.co_im_exists = true;

            let co_im = JSON.parse(currentMetrics.value);
            this.setState({ co_im });
          }
          if (currentMetrics.key == 'eco_f') {
            this.state.eco_f_metricId = currentMetrics.id;
            this.state.eco_f_exists = true;

            let eco_f = JSON.parse(currentMetrics.value);
            this.setState({ eco_f });
          }
          if (currentMetrics.key == 'all_n') {
            this.state.all_n_metricId = currentMetrics.id;
            this.state.all_n_exists = true;

            let all_n = JSON.parse(currentMetrics.value);
            this.setState({ all_n });
          }
          if (currentMetrics.key == 'an_ri') {
            this.state.an_ri_metricId = currentMetrics.id;
            this.state.an_ri_exists = true;

            let an_ri = JSON.parse(currentMetrics.value);
            this.setState({ an_ri });
          }
          if (currentMetrics.key == 'labor') {
            this.state.labor_metricId = currentMetrics.id;
            this.state.labor_exists = true;

            let labor = JSON.parse(currentMetrics.value);
            this.setState({ labor });
          }
        }
        this.setState({
          metricProgress: metricProgress,
          loadFailure: false,
        });
      })
      .catch((error) => {
        // handle error
        this.setState({
          loadFailure: true,
        });
        console.log(error);
      });
  };

  // Since it's a Form Submit Handler function, We have to wrap our code
  // like so in order to pass in the category argument
  // https://stackoverflow.com/questions/38648257/how-to-pass-in-a-second-argument-on-reactjs-onsubmit-function-call
  handleSubmit = (category) => {
    return (event) => {
      event.preventDefault();
      if (this.state[category + '_exists'] == true) {
        axios.put(
          'https://axial-paratext-278418.uc.r.appspot.com/api/shopifyProduct/metrics/' +
            this.state.productID +
            '/' +
            this.state[category + '_metricId'],
          {
            metafield: {
              id: this.state[category + '_metricId'],
              value: JSON.stringify(this.state[category]),
              value_type: 'string',
            },
          }
        );

        // Creating a metafield for the first time.
      } else {
        axios
          .put(
            'https://axial-paratext-278418.uc.r.appspot.com/api/shopifyProduct/metrics/' +
              this.state.productID,
            {
              product: {
                id: this.state.productID,
                metafields: [
                  {
                    namespace: 'ethic-metric',
                    key: category,
                    value: JSON.stringify(this.state[category]),
                    value_type: 'string',
                  },
                ],
              },
            }
          )
          // Finds the newly created metafield Id and assign it to state
          .then((res) => {
            axios
              .get(
                'https://axial-paratext-278418.uc.r.appspot.com/api/shopifyProduct/metrics/' +
                  this.state.productID
              )
              .then((res) => {
                const prodMetrics = res.data.metafields;
                for (let i = 0; i < prodMetrics.length; i++) {
                  let currentMetrics = prodMetrics[i];
                  if (currentMetrics.key == category) {
                    if (currentMetrics.key == 'co_im') {
                      this.state.co_im_metricId = currentMetrics.id;
                      this.state.co_im_exists = true;
                    }
                    if (currentMetrics.key == 'eco_f') {
                      this.state.eco_f_metricId = currentMetrics.id;
                      this.state.eco_f_exists = true;
                    }
                    if (currentMetrics.key == 'all_n') {
                      this.state.all_n_metricId = currentMetrics.id;
                      this.state.all_n_exists = true;
                    }
                    if (currentMetrics.key == 'an_ri') {
                      this.state.an_ri_metricId = currentMetrics.id;
                      this.state.an_ri_exists = true;
                    }
                    if (currentMetrics.key == 'labor') {
                      this.state.labor_metricId = currentMetrics.id;
                      this.state.labor_exists = true;
                    }
                  }
                }
                this.setState({
                  metricProgress: this.state.metricProgress + 20,
                });
              });
          });
      }
    };
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
            <TextContainer spacing='tight'>
              {this.state.loadFailure && (
                <Banner title='Failed to Load Product' status='critical'>
                  <p>Please enter a valid product id</p>
                </Banner>
              )}
              <DisplayText element='h6' size='small'>
                <TextStyle variation='strong'>Product Name: </TextStyle>
                {this.state.productName}
              </DisplayText>
              <h3>
                <TextStyle variation='strong'>Vendor: </TextStyle>
                {this.state.productVendor}
              </h3>
              <h3>
                <TextStyle variation='strong'>Tags: </TextStyle>
                {this.state.productTags}
              </h3>

              <DisplayText
                style={{ marginTop: '5px' }}
                element='h6'
                size='small'
              >
                <TextStyle variation='strong'>
                  Current Metric Progress
                </TextStyle>
              </DisplayText>
              <ProgressBar progress={this.state.metricProgress} size='small' />

              <Stack style={{ marginTop: '10px' }}>
                {this.state.co_im_exists && (
                  <Badge status='info'>Community Impact</Badge>
                )}
                {this.state.eco_f_exists && (
                  <Badge status='success'>Eco Friendly</Badge>
                )}
                {this.state.all_n_exists && (
                  <Badge status='attention'>All Natural/Non-Toxic</Badge>
                )}
                {this.state.an_ri_exists && (
                  <Badge status='warning'>Animal Rights</Badge>
                )}
                {this.state.labor_exists && <Badge>Labor</Badge>}
              </Stack>
            </TextContainer>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title='Community Impact'
            description='We believe that businesses should be forces for good in the communities they operate in. 
            Criteria in this category center around nurturing community, helping marginalized groups, 
            and ensuring people are not left behind.'
          >
            <Form onSubmit={this.handleSubmit('co_im')}>
              <FormLayout>
                <FormLayout.Group>
                  {Object.keys(this.co_im_labels).map((metric) => (
                    <Select
                      label={this.co_im_labels[metric]}
                      key={metric}
                      id={metric}
                      options={this.metricOptions}
                      value={this.state.co_im[metric]}
                      onChange={this.handleChangeCoIm}
                    />
                  ))}
                  <Select
                    label='Business Size'
                    options={[
                      { label: 'Small: Less Than 50 Employees', value: 's' },
                      { label: 'Medium: Less Than 500 Employees', value: 'm' },
                      { label: 'Large: More than 500 Employees', value: 'l' },
                      { label: 'N/A', value: 'n/a' },
                    ]}
                    id='business_size'
                    value={this.state.co_im.business_size}
                    onChange={this.handleChangeCoIm}
                  />
                  <TextField
                    label='Zip Code'
                    id='zip_code'
                    value={this.state.co_im.zip_code}
                    onChange={this.handleChangeCoIm}
                  />
                </FormLayout.Group>
                <Button submit>Submit</Button>
              </FormLayout>
            </Form>
          </Layout.AnnotatedSection>

          <Layout.AnnotatedSection
            title='Economically Friendly'
            description='Our planet is suffering due to human impact. 
            Criteria in this category centers on improving our ecosystems, low carbon emissions, and sustainable materials.'
          >
            <Form onSubmit={this.handleSubmit('eco_f')}>
              <FormLayout>
                <FormLayout.Group>
                  {Object.keys(this.state.eco_f).map((metric) => (
                    <Select
                      label={this.eco_f_labels[metric]}
                      key={metric}
                      id={metric}
                      options={this.metricOptions}
                      value={this.state.eco_f[metric]}
                      onChange={this.handleChangeEcoF}
                    />
                  ))}
                </FormLayout.Group>
                <Button submit>Submit</Button>
              </FormLayout>
            </Form>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title='All Natural/Non-Toxic'
            description='You wouldn’t want to put bad chemicals into your body or into the planet, would you? This category focuses on what goes into each product, and the criteria reflects a more natural, chemical-free approach to everyday products.'
          >
            <Form onSubmit={this.handleSubmit('all_n')}>
              <FormLayout>
                <FormLayout.Group>
                  {Object.keys(this.all_n_labels).map((metric) => (
                    <Select
                      label={this.all_n_labels[metric]}
                      key={metric}
                      id={metric}
                      options={this.metricOptions}
                      value={this.state.all_n[metric]}
                      onChange={this.handleChangeAllN}
                    />
                  ))}
                </FormLayout.Group>
                {/* <FormLayout.Group> */}
                <RangeSlider
                  label='EWG Rating'
                  id='ewg'
                  value={this.state.all_n.ewg}
                  onChange={this.handleChangeAllN}
                  max='10'
                  min='0'
                  output
                />
                <RangeSlider
                  label='Consumer Labs'
                  id='consumerLabs'
                  value={this.state.all_n.consumerLabs}
                  onChange={this.handleChangeAllN}
                  max='10'
                  min='0'
                  output
                />
                {/* </FormLayout.Group> */}
                <Button submit>Submit</Button>
              </FormLayout>
            </Form>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title='Animal Rights'
            description='Animals matter, too! Unfortunately, many of them are abused or exploited to make consumer goods. The criteria in this category focuses on companies that are cruelty free or are helping animals thrive'
          >
            <Form onSubmit={this.handleSubmit('an_ri')}>
              <FormLayout>
                <FormLayout.Group>
                  {Object.keys(this.state.an_ri).map((metric) => (
                    <Select
                      label={this.an_ri_labels[metric]}
                      key={metric}
                      id={metric}
                      options={this.metricOptions}
                      value={this.state.an_ri[metric]}
                      onChange={this.handleChangeAnRi}
                    />
                  ))}
                </FormLayout.Group>
                <Button submit>Submit</Button>
              </FormLayout>
            </Form>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title='Labor'
            description='Sweatshops and underpaid labor should be a thing of the past, and workers in the United States should be paid a living wage. Criteria under this category focuses on how laborers are treated, what working conditions they operate in, and what benefits their employers provide. '
          >
            <Form onSubmit={this.handleSubmit('labor')}>
              <FormLayout>
                <FormLayout.Group>
                  {Object.keys(this.state.labor).map((metric) => (
                    <Select
                      label={this.labor_labels[metric]}
                      key={metric}
                      id={metric}
                      options={this.metricOptions}
                      value={this.state.labor[metric]}
                      onChange={this.handleChangeLabor}
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

export default UpdateProduct;
