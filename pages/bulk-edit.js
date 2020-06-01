import React from 'react';
import axios from 'axios';
import {
  Autocomplete,
  TextContainer,
  Card,
  Checkbox,
  ChoiceList,
  Scrollable,
  FormLayout,
  TextField,
  Button,
  Form,
  Heading,
  RangeSlider,
  Subheading,
  Layout,
  Page,
  DataTable,
  DisplayText,
  FooterHelp,
  Link,
  Select,
} from '@shopify/polaris';

function isSuperset(list, sublist) {
  for (let elem of sublist) {
    if (!list.includes(elem)) {
      return false;
    }
  }
  return true;
}

function hasCommon(list, other) {
  for (let elem of list) {
    for (let inner of other) {
      if (elem === inner) {
        return true;
      }
    }
  }
  return false;
}

class BulkEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deselectedOptions: [],
      selectedOptions: [],
      inputValue: '',
      options: [],
      operator: ['OR'],
      finishedTags: ['...'],
      backendSent: '',

      vendorDeselectedOptions: [],
      vendorSelectedOptions: [],
      vendorInputValue: '',
      vendorOptions: [],
      vendorOperator: ['AND'],
      finishedVendors: ['...'],

      allProducts: [],
      productNumber: 0,
      productRows: [],
      idList: [],
      selected: [],
      selectedAll: false,

      co_im: {
        USA_made: '',
        employs_locally: '',
        community_activism: '',
        business_size: '',
        donates_locally: '',
        one_percent_for_the_planet: '',
        political_donations: '',
        donate_to_oppressed: '',
        zip_code: '',
      },
      eco_f: {
        sustainable_packaging: '',
        sustainable_materials: '',
        plastic_free: '',
        compostable: '',
        zeroCarbon_shipping: '',
        zeroCarbon_manufacturing: '',
        manufacturing_impact: '',
        fsc: '',
        rainforest_alliance: '',
        cradle_to_cradle: '',
        donate_to_environment: '',
      },
      all_n: {
        certified_organic: '',
        organic_practices: '',
        allNatural_ingredients: '',
        reef_safe: '',
        ewg: '',
        madeSafe: '',
        consumerLabs: '',
        transparency: '',
      },
      an_ri: {
        vegan: '',
        donate_to_animalRights: '',
        leaping_bunny: '',
        peta: '',
      },
      labor: {
        childcare: '',
        gym_recreation: '',
        educational_ops: '',
        healthcare: '',
        mobility: '',
        can_unionize: '',
        living_wage: '',
        safe_work_conditions: '',
        no_child_labor: '',
        empower_oppressed: '',
        co_op: '',
        ethical_materials_sourcing: '',
        bcorp: '',
        fair_trade: '',
      },
    };

    this.setSelectedOptions = this.setSelectedOptions.bind(this);
    this.setInputValue = this.setInputValue.bind(this);
    this.setOptions = this.setOptions.bind(this);
    this.updateText = this.updateText.bind(this);
    this.handleOperatorChange = this.handleOperatorChange.bind(this);

    this.vendorSetSelectedOptions = this.vendorSetSelectedOptions.bind(this);
    this.vendorSetInputValue = this.vendorSetInputValue.bind(this);
    this.vendorSetOptions = this.vendorSetOptions.bind(this);
    this.vendorUpdateText = this.vendorUpdateText.bind(this);
    this.vendorHandleOperatorChange = this.vendorHandleOperatorChange.bind(
      this
    );

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdateChange = this.handleUpdateChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
    this.handleMetricSubmit = this.handleMetricSubmit.bind(this);

    this.handleChangeCoIm = this.handleChangeCoIm.bind(this);
    this.handleChangeEcoF = this.handleChangeEcoF.bind(this);
    this.handleChangeAllN = this.handleChangeAllN.bind(this);
    this.handleChangeAnRi = this.handleChangeAnRi.bind(this);
    this.handleChangeLabor = this.handleChangeLabor.bind(this);
  }

  metricOptions = [
    { label: 'Yes', value: 'y' },
    { label: 'No', value: 'n' },
    { label: 'N/A', value: 'n/a' },
    { label: '', value: '' },
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
    plastic_free: 'Plastic Free',
    compostable: 'Compostable',
    zeroCarbon_shipping: 'Zero Carbon Footprint - Shipping',
    zeroCarbon_manufacturing: 'Zero Carbon Footprint - Manufacturing',
    manufacturing_impact: 'Manufacturing Impact',
    fsc: 'FSC',
    rainforest_alliance: 'Rainforest Alliance',
    cradle_to_cradle: 'Cradle to Cradle',
    donate_to_environment: 'Donates to Environmental Causes',
  };

  all_n_labels = {
    certified_organic: 'Certified Organic',
    organic_practices: 'Organic Practices',
    allNatural_ingredients: 'All Natural Ingredients',
    reef_safe: 'Reef Safe',
    madeSafe: 'MadeSafe',
  };

  an_ri_labels = {
    vegan: 'Vegan',
    donate_to_animalRights: 'Donates to Animal Rights Causes',
    leaping_bunny: 'Leaping Bunny',
    peta: 'PETA',
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

  setSelectedOptions(value) {
    this.setState({
      selectedOptions: value,
    });
  }
  vendorSetSelectedOptions(value) {
    this.setState({
      vendorSelectedOptions: value,
    });
  }

  setInputValue(value) {
    this.setState({
      inputValue: value,
    });
  }
  vendorSetInputValue(value) {
    this.setState({
      vendorInputValue: value,
    });
  }

  setOptions(value) {
    this.setState({
      options: value,
    });
  }
  vendorSetOptions(value) {
    this.setState({
      vendorOptions: value,
    });
  }

  handleOperatorChange(value) {
    this.setState({
      operator: value,
    });
  }
  vendorHandleOperatorChange(value) {
    this.setState({
      vendorOperator: value,
    });
  }

  updateText(value) {
    this.setInputValue(value);
    if (value === '') {
      this.setOptions(this.state.deselectedOptions);
      return;
    }

    const filterRegex = new RegExp(value, 'i');
    const resultOptions = this.state.deselectedOptions.filter((option) =>
      option.label.match(filterRegex)
    );
    this.setOptions(resultOptions);
  }
  vendorUpdateText(value) {
    this.vendorSetInputValue(value);
    if (value === '') {
      this.vendorSetOptions(this.state.vendorDeselectedOptions);
      return;
    }

    const filterRegex = new RegExp(value, 'i');
    const resultOptions = this.state.vendorDeselectedOptions.filter((option) =>
      option.label.match(filterRegex)
    );
    this.vendorSetOptions(resultOptions);
  }

  handleUpdateChange(value, id) {
    this.setState({
      [id]: value,
    });
  }

  handleSelectChange(value) {
    this.setState({
      selectedAll: value,
    });
    if (value) {
      this.setState({
        selected: this.state.idList,
      });
    } else {
      this.setState({
        selected: [],
      });
    }
  }

  handleProductChange(value) {
    this.setState({
      selected: value,
    });
  }

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

  componentDidMount() {
    axios
      .post('http://localhost:5000/api/shopifyProduct/allProducts')
      .then((res) => {
        const results = res.data;
        const tagResults = results.tags;
        const vendors = results.vendors;
        this.setState({
          allProducts: results.products,
        });
        let i;
        for (i = 0; i < tagResults.length; ++i) {
          let tagItem = { value: tagResults[i], label: tagResults[i] };
          this.setState({
            deselectedOptions: [...this.state.deselectedOptions, tagItem],
          });
        }
        for (i = 0; i < vendors.length; ++i) {
          let vendorItem = { value: vendors[i], label: vendors[i] };
          this.setState({
            vendorDeselectedOptions: [
              ...this.state.vendorDeselectedOptions,
              vendorItem,
            ],
          });
        }
      });
  }

  handleSubmit(event) {
    this.setState(
      {
        idList: [],
        productRows: [],
        selected: [],
        selectedAll: false,
        finishedTags: this.state.selectedOptions,
        finishedVendors: this.state.vendorSelectedOptions,
      },
      () => {
        const allProducts = this.state.allProducts;
        const selectedTags = this.state.selectedOptions;
        const selectedVendors = this.state.vendorSelectedOptions;
        let results = [];
        let i;
        for (i = 0; i < allProducts.length; ++i) {
          let productTags = allProducts[i].tags.split(', ');
          let newProductRow = [
            allProducts[i].title,
            allProducts[i].id,
            allProducts[i].vendor,
            allProducts[i].tags,
          ];

          // Looks complicated, but I'll break it down
          // if vendor is OR, then either the tag matches
          // OR the vendor matches
          // if vendor is AND, then both the tags
          // AND the vendor needs to match
          // this logic sequence prioritizes vendors
          if (this.state.vendorOperator[0] === 'OR') {
            if (selectedVendors.includes(allProducts[i].vendor)) {
              this.state.productRows.push(newProductRow);
              this.state.idList.push(allProducts[i].id);
            } else if (this.state.operator[0] === 'OR') {
              if (hasCommon(productTags, selectedTags)) {
                this.state.productRows.push(newProductRow);
                this.state.idList.push(allProducts[i].id);
              }
            } else if (this.state.operator[0] === 'AND') {
              if (isSuperset(productTags, selectedTags)) {
                this.state.productRows.push(newProductRow);
                this.state.idList.push(allProducts[i].id);
              }
            }
          } else if (selectedVendors.includes(allProducts[i].vendor)) {
            if (this.state.operator[0] === 'OR') {
              if (hasCommon(productTags, selectedTags)) {
                this.state.productRows.push(newProductRow);
                this.state.idList.push(allProducts[i].id);
              }
            } else if (this.state.operator[0] === 'AND') {
              if (isSuperset(productTags, selectedTags)) {
                this.state.productRows.push(newProductRow);
                this.state.idList.push(allProducts[i].id);
              }
            }
          }
        }
        this.setState({
          productNumber: this.state.productRows.length,
          selectedOptions: [],
          vendorSelectedOptions: [],
        });
      }
    );
  }

  handleMetricSubmit(event) {
    let data = JSON.stringify({
      idList: this.state.selected,
      an_ri: this.state.an_ri,
      all_n: this.state.all_n,
      co_im: this.state.co_im,
      eco_f: this.state.eco_f,
      labor: this.state.labor,
    });
    console.log(data);
    axios
      .post('http://localhost:5000/api/shopifyProduct/updateProducts', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        const results = res.data;
        console.log(results);
        this.setState({
          backendSent: 'Bulk updated ' + this.state.idList.length + ' products',
        });
      });
  }

  render() {
    return (
      <Page>
        <DisplayText size='large'>Search Products By Tag</DisplayText>
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <Form noValidate onSubmit={this.handleSubmit}>
                <FormLayout>
                  <div>
                    <Autocomplete
                      allowMultiple
                      options={this.state.options}
                      selected={this.state.selectedOptions}
                      textField={
                        <Autocomplete.TextField
                          onChange={this.updateText}
                          label='Tags'
                          value={this.state.inputValue}
                          placeholder='B-Corp, Plastic Free'
                        />
                      }
                      onSelect={this.setSelectedOptions}
                      listTitle='Suggested Tags'
                    ></Autocomplete>
                    Chosen Tags
                    {this.state.selectedOptions.map((tag) => (
                      <li>{tag}</li>
                    ))}
                    <ChoiceList
                      title='Logical Operator'
                      choices={[
                        { label: 'OR', value: 'OR' },
                        { label: 'AND', value: 'AND' },
                      ]}
                      selected={this.state.operator}
                      onChange={this.handleOperatorChange}
                    />
                  </div>

                  <div>
                    <Autocomplete
                      allowMultiple
                      options={this.state.vendorOptions}
                      selected={this.state.vendorSelectedOptions}
                      textField={
                        <Autocomplete.TextField
                          onChange={this.vendorUpdateText}
                          label='Vendors'
                          value={this.state.vendorInputValue}
                          placeholder='Jetty, XACTLY'
                        />
                      }
                      onSelect={this.vendorSetSelectedOptions}
                      listTitle='Suggested Vendors'
                    ></Autocomplete>
                    Chosen Vendors
                    {this.state.vendorSelectedOptions.map((vendor) => (
                      <li>{vendor}</li>
                    ))}
                    <ChoiceList
                      title='Logical Operator'
                      choices={[
                        { label: 'OR', value: 'OR' },
                        { label: 'AND', value: 'AND' },
                      ]}
                      selected={this.state.vendorOperator}
                      onChange={this.vendorHandleOperatorChange}
                    />
                  </div>
                  <Button submit>Search</Button>
                </FormLayout>
              </Form>
            </Card>
          </Layout.Section>
          {/* </Layout> */}
          <Layout.Section>
            <Heading>Product Results</Heading>
            <Subheading size='medium'>
              We retrieved {this.state.productNumber} products for
              {this.state.finishedTags.map((tag) => (
                <li>{tag}</li>
              ))}
              {this.state.finishedVendors.map((vendor) => (
                <li>{vendor}</li>
              ))}
            </Subheading>

            <Card>
              <Checkbox
                label='Select all products'
                checked={this.state.selectedAll}
                onChange={this.handleSelectChange}
              />
              <Scrollable shadow style={{ height: '400px' }}>
                <ChoiceList
                  allowMultiple
                  title=''
                  choices={this.state.productRows.map((value, index) => {
                    return {
                      label: value[0],
                      value: value[1],
                      helpText: value[1] + '\t' + value[2] + '\t' + value[3],
                    };
                  })}
                  selected={this.state.selected}
                  onChange={this.handleProductChange}
                />
              </Scrollable>
            </Card>

            <Form onSubmit={this.handleMetricSubmit}>
              <Layout.AnnotatedSection
                title='Community Impact'
                description='We believe that businesses should be forces for good in the communities they operate in. 
              Criteria in this category center around nurturing community, helping marginalized groups, 
              and ensuring people are not left behind.'
              >
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
                        {
                          label: 'Medium: Less Than 500 Employees',
                          value: 'm',
                        },
                        { label: 'Large: More than 500 Employees', value: 'l' },
                        { label: 'N/A', value: 'n/a' },
                        { label: '', value: '' },
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
                </FormLayout>
              </Layout.AnnotatedSection>

              <Layout.AnnotatedSection
                title='Economically Friendly'
                description='Our planet is suffering due to human impact. 
              Criteria in this category centers on improving our ecosystems, low carbon emissions, and sustainable materials.'
              >
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
                </FormLayout>
              </Layout.AnnotatedSection>
              <Layout.AnnotatedSection
                title='All Natural/Non-Toxic'
                description='You wouldn’t want to put bad chemicals into your body or into the planet, would you? This category focuses on what goes into each product, and the criteria reflects a more natural, chemical-free approach to everyday products.'
              >
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
                    <Select
                      label='Transparency'
                      options={[
                        { label: 'High', value: 'h' },
                        { label: 'Medium', value: 'm' },
                        { label: 'Low', value: 'l' },
                        { label: 'N/A', value: 'n/a' },
                        { label: '', value: '' },
                      ]}
                      id='transparency'
                      value={this.state.all_n.transparency}
                      onChange={this.handleChangeAllN}
                    />
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
                  </FormLayout.Group>
                </FormLayout>
              </Layout.AnnotatedSection>
              <Layout.AnnotatedSection
                title='Animal Rights'
                description='Animals matter, too! Unfortunately, many of them are abused or exploited to make consumer goods. The criteria in this category focuses on companies that are cruelty free or are helping animals thrive'
              >
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
                </FormLayout>
              </Layout.AnnotatedSection>
              <Layout.AnnotatedSection
                title='Labor'
                description='Sweatshops and underpaid labor should be a thing of the past, and workers in the United States should be paid a living wage. Criteria under this category focuses on how laborers are treated, what working conditions they operate in, and what benefits their employers provide. '
              >
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
                </FormLayout>
              </Layout.AnnotatedSection>
              <br />
              <DisplayText element='p' size='medium'>
                {' '}
                {this.state.backendSent}
              </DisplayText>
              <br />
              <Button submit>Submit</Button>
            </Form>
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

export default BulkEdit;
