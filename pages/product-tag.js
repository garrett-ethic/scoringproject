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


class ProductTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deselectedOptions: [],
      selectedOptions: [],
      inputValue: '',
      options: [],
      operator: ["OR"],
      finishedTags: ['...'],

      vendorDeselectedOptions: [],
      vendorSelectedOptions: [],
      vendorInputValue: '',
      vendorOptions: [],
      vendorOperator: ["AND"],
      finishedVendors: ['...'],

      allProducts: [],
      productNumber: 0,
      productRows: [],
      idList: [],
      selected: [],
      selectedAll: false,
      
      //design decision not to make a metrics object and store metrics in it
      // https://stackoverflow.com/a/51136076
      metric1: -1,
      metric2: -1,
      metric3: -1,
      metric4: -1,
      certs: [],
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
    this.vendorHandleOperatorChange = this.vendorHandleOperatorChange.bind(this);
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdateChange = this.handleUpdateChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
    this.handleMetricSubmit = this.handleMetricSubmit.bind(this);
  }

  setSelectedOptions(value) {
    this.setState({
      selectedOptions: value
    });
  }  
  vendorSetSelectedOptions(value) {
    this.setState({
      vendorSelectedOptions: value
    });
  }

  setInputValue(value) {
    this.setState({
      inputValue: value
    });
  }
  vendorSetInputValue(value) {
    this.setState({
      vendorInputValue: value
    });
  }

  setOptions(value) {
    this.setState({ 
      options: value
    });
  }
  vendorSetOptions(value) {
    this.setState({
      vendorOptions: value
    });
  }

  handleOperatorChange(value) {
    this.setState({
      operator: value
    });
  }
  vendorHandleOperatorChange(value) {
    this.setState({
      vendorOperator: value
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
      option.label.match(filterRegex),
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
      option.label.match(filterRegex),
    );
    this.vendorSetOptions(resultOptions);
  }

  handleUpdateChange(value, id) {
    this.setState({
      [id]: value
    });
  }
  
  handleSelectChange(value) {
    this.setState({
      selectedAll: value
    });
    if (value) {
      this.setState({
        selected: this.state.idList
      });
    } else {
      this.setState({
        selected: []
      });
    }
  }
  
  handleProductChange(value) {
    this.setState({
      selected: value
    });
  }

  componentDidMount() {
    axios
      .post('http://localhost:5000/api/shopifyProduct/allProducts')
      .then((res) => {
        const results = res.data;
        const tagResults = results.tags;
        const vendors = results.vendors;
        this.setState({
          allProducts: results.products
        });
        let i;
        for (i = 0; i < tagResults.length; ++i) {
          let tagItem = {value: tagResults[i], label: tagResults[i]};
          this.setState({
            deselectedOptions: [...this.state.deselectedOptions, tagItem] 
          });
        }
        for (i = 0; i < vendors.length; ++i) {
          let vendorItem = {value: vendors[i], label: vendors[i]};
          this.setState({
            vendorDeselectedOptions: [...this.state.vendorDeselectedOptions, vendorItem]
          });
        }
    });
  }

  handleSubmit(event) {
    this.setState({
      idList: [],
      productRows: [],
      selected: [],
      selectedAll: false,
      finishedTags: this.state.selectedOptions,
      finishedVendors: this.state.vendorSelectedOptions,
    }, () => {
    
        const allProducts = this.state.allProducts;
        const selectedTags = this.state.selectedOptions;
        const selectedVendors = this.state.vendorSelectedOptions;
        //console.log(selected);
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
          if (this.state.vendorOperator[0] === "OR") {
            if (selectedVendors.includes(allProducts[i].vendor)) {
                this.state.productRows.push(newProductRow);
                this.state.idList.push(allProducts[i].id);
            } else if (this.state.operator[0] === "OR") {
              if (hasCommon(productTags, selectedTags)) {
                this.state.productRows.push(newProductRow);
                this.state.idList.push(allProducts[i].id);
              } 
            } else if (this.state.operator[0] === "AND") {
              if (isSuperset(productTags, selectedTags)) {
                this.state.productRows.push(newProductRow);
                this.state.idList.push(allProducts[i].id);
              }
            }
          } else if (selectedVendors.includes(allProducts[i].vendor)) {
            if (this.state.operator[0] === "OR") {
              if (hasCommon(productTags, selectedTags)) {
                this.state.productRows.push(newProductRow);
                this.state.idList.push(allProducts[i].id);
              }
            } else if (this.state.operator[0] === "AND") {
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

    });
  }

  handleMetricSubmit(event) {
    let data = JSON.stringify({
      idList: this.state.idList,
      certs: this.state.certs
    })
    axios
      .post('http://localhost:5000/api/shopifyProduct/updateProducts', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then((res) => {
        const results = res.data;
        console.log(results);
    });
    console.log(this.state.metric1);
    console.log(this.state.metric2);
    console.log(this.state.metric3);
    console.log(this.state.metric4);
    console.log(this.state.idList);
  }

  render() {
    //console.log(this.state);
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
                          label="Tags"
                          value={this.state.inputValue}
                          placeholder="B-Corp, Plastic Free"
                        />
                      }
                      onSelect={this.setSelectedOptions}
                      listTitle="Suggested Tags"
                    >
                    </Autocomplete>
                      Chosen Tags
                      {this.state.selectedOptions.map((tag) =>
                         <li>{tag}</li>
                      )}
                      <ChoiceList
                        title='Logical Operator'
                        choices={[
                          {label: "OR", value: "OR"},
                          {label: "AND", value: "AND"},
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
                          label="Vendors"
                          value={this.state.vendorInputValue}
                          placeholder="Jetty, XACTLY"
                        />
                      }
                      onSelect={this.vendorSetSelectedOptions}
                      listTitle="Suggested Vendors"
                    >
                    </Autocomplete>
                    Chosen Vendors
                    {this.state.vendorSelectedOptions.map((vendor) =>
                       <li>{vendor}</li>
                    )}
                    <ChoiceList
                      title='Logical Operator'
                      choices={[
                        {label: "OR", value: "OR"},
                        {label: "AND", value: "AND"},
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
              {this.state.finishedTags.map((tag) => <li>{tag}</li>)}
              {this.state.finishedVendors.map((vendor) => <li>{vendor}</li>)}
            </Subheading>

            <Card>
              <Checkbox
                label="Select all products"
                checked={this.state.selectedAll}
                onChange={this.handleSelectChange}
              />
              <Scrollable shadow style={{ height: '400px' }}>
                <ChoiceList
                  allowMultiple
                  title=""
                  choices={this.state.productRows.map((value, index) => {
                      return {label: value[0],
                              value: value[1],
                              helpText: value[1] + '\t' + value[2] + '\t' + value[3]}
                    })}
                  selected={this.state.selected}
                  onChange={this.handleProductChange}
                />
              </Scrollable>
            </Card>
            <Card sectioned title = "Move the slider to -1 to leave the metric alone">
              <Form onSubmit={this.handleMetricSubmit}>
                <FormLayout>
                  <RangeSlider
                    min={-1}
                    max={10}
                    label="Metric 1"
                    value={this.state.metric1}
                    onChange={this.handleUpdateChange}
                    id='metric1'
                    output
                  />
                  <RangeSlider
                    min={-1}
                    max={10}
                    label="Metric 2"
                    value={this.state.metric2}
                    onChange={this.handleUpdateChange}
                    id='metric2'
                    output
                  />
                  <RangeSlider
                    min={-1}
                    max={10}
                    label="Metric 3"
                    value={this.state.metric3}
                    onChange={this.handleUpdateChange}
                    id='metric3'
                    output
                  />
                  <RangeSlider
                    min={-1}
                    max={10}
                    label="Metric 4"
                    value={this.state.metric4}
                    onChange={this.handleUpdateChange}
                    id='metric4'
                    output
                  />
                <Button submit>Submit</Button>
                </FormLayout>
              </Form>
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
    );
  }
}

export default ProductTag;
