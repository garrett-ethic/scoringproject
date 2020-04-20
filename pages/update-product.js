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
} from '@shopify/polaris';

class UpdateProduct extends React.Component {
  state = {
    product: '',
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
              <Form onSubmit={this.handleSubmit}>
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
            title='Price updates'
            description='Temporarily disable all Sample App price updates'
          >
            {/* <SettingToggle
              action={{
                content: contentStatus,
                onAction: this.handleToggle,
              }}
              enabled={enabled}
            > */}
            This setting is <TextStyle variation='strong'>Hi</TextStyle>.
            {/* </SettingToggle> */}
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

  handleSubmit = () => {
    this.setState({
      discount: this.state.discount,
    });
    console.log('submission', this.state);
  };

  handleChange = (field) => {
    return (value) => this.setState({ [field]: value });
  };
}

export default UpdateProduct;
