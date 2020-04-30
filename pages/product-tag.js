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



class ProductTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deselectedOptions: [],
      selectedOptions: [],
      inputValue: '',
      options: [],
      textField: null,

      tagList: [],
      finishedTags: ['...'],
      productNumber: 0,
      productRows: [],
      data: [],
      idList: [],
      selected: [],
      selectedAll: false,
      operator: 'OR',
      //design decision not to make a metrics object and store metrics in it
      // https://stackoverflow.com/a/51136076
      metric1: -1,
      metric2: -1,
      metric3: -1,
      metric4: -1,
    };

    this.setSelectedOptions = this.setSelectedOptions.bind(this);
    this.setInputValue = this.setInputValue.bind(this);
    this.setOptions = this.setOptions.bind(this);
    this.updateText = this.updateText.bind(this);
    
    this.handleOperatorChange = this.handleOperatorChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdateChange = this.handleUpdateChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
    this.handleMetricSubmit = this.handleMetricSubmit.bind(this);

    this.setState({
      textField:
        <div>
          <Autocomplete.TextField
            onChange={this.updateText}
            label="Tags"
            value={this.state.inputValue}
            placeholder="B-Corp, Plastic Free"
          />
        </div>
    });
  }

  setSelectedOptions(value) {
    this.setState({
      selectedOptions: value
    });
  }
  setInputValue(value) {
    this.setState({
      inputValue: value
    });
  }
  setOptions(value) {
    this.setState({ 
      options: value
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

  handleOperatorChange(value) {
    this.setState({
      operator: value
    });
  }

  componentDidMount() {
    axios
      .post('http://localhost:5000/api/shopifyProduct/chosenTags')
      .then((res) => {
        const results = res.data;
        let i;
        let tagItem;
        for (i = 0; i < results.length; ++i) {
          //console.log(results[i]);
          tagItem = {value: results[i], label: results[i]};
          this.setState({
            tagList: [...this.state.tagList, results[i]],
            deselectedOptions: [...this.state.deselectedOptions, tagItem] 
          });
        }
      });
    //console.log(this.state.tagList);
  }

  handleSubmit(event) {
    let data = JSON.stringify({
      operator: this.state.operator,
      tagList: this.state.selectedOptions
    })
    axios
      .post('http://localhost:5000/api/shopifyProduct/chosenTags', data, {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then((res) => {
        this.setState({
          data: [],
          idList: [],
          productRows: [],
          selected: []
        });
        const results = res.data;
        //console.log(results);
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
            data: [...this.state.data, results[i]],
            productRows: [...this.state.productRows, newProductRow],
            idList: [...this.state.idList, results[i].id]
          });
        }
        this.setState({
          productNumber: this.state.data.length,
        });
        console.log(this.state.data);
      });
    console.log(this.state.selectedOptions);
    this.setState({ finishedTags: this.state.selectedOptions});
    this.setState({ selectedAll: false});
  }

  handleMetricSubmit(event) {
    console.log(this.state.metric1);
    console.log(this.state.metric2);
    console.log(this.state.metric3);
    console.log(this.state.metric4);
  }

  handleTagSubmit(event) {
    
  }

  render() {
    console.log(this.state);
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
                  </div>
                  Chosen Tags
                  {this.state.selectedOptions.map((tag) =>
                     <li>{tag}</li>
                  )}
                  <ChoiceList
                    title='Logical Operator'
                    choices={[
                      {label: 'OR', value: 'OR'},
                      {label: 'AND', value: 'AND'},
                    ]}
                    selected={this.state.operator}
                    onChange={this.handleOperatorChange}
                  />
                  <Button submit>Search</Button>
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
                /*
                <DataTable
                  columnContentTypes={['text', 'numeric', 'text', 'text']}
                  headings={['Product Name', 'Product ID', 'Vendor', 'Tags']}
                  rows={this.state.productRows}
                />
                */

/*
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

                    </Autocomplete>
                    <Autocomplete
                      allowMultiple
                      options={this.state.options}
                      selected={this.state.selectedOptions}
                      textField={this.state.textField}
                      onSelect={this.setSelectedOptions}
                      listTitle="Suggested Tags"
                    >
                    </Autocomplete>



*/
export default ProductTag;
